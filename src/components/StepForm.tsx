'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { AlertCircle, Loader2 } from 'lucide-react';

export interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const SUBJECT_CHIPS = [
  'Freelance role',
  'Remote contract',
  'Full-time',
  'Collaboration',
  'Something else',
];

interface StepFormProps {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  botcheck: string;
  setBotcheck: React.Dispatch<React.SetStateAction<string>>;
  cooldown?: number;
  isSubmitting: boolean;
  submitStatus: 'idle' | 'success' | 'error';
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onReset: () => void;
}

export default function StepForm({
  form,
  setForm,
  botcheck,
  setBotcheck,
  cooldown = 0,
  isSubmitting,
  submitStatus,
  onSubmit,
  onReset,
}: StepFormProps) {
  const shouldReduceMotion = useReducedMotion();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [shake, setShake] = useState(false);
  const [selectedChip, setSelectedChip] = useState<string>('');
  const [submittedName, setSubmittedName] = useState<string>('');

  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const customSubjectRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Sync selectedChip with form.subject on mount or if form has value
  useEffect(() => {
    if (form.subject) {
      if (SUBJECT_CHIPS.slice(0, 4).includes(form.subject)) {
        setSelectedChip(form.subject);
      } else {
        setSelectedChip('Something else');
      }
    }
  }, [form.subject]);

  const isFirstMount = useRef(true);

  // Auto-focus when step changes (skip on initial mount so page doesn't scroll to contact!)
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    if (step === 1) {
      nameInputRef.current?.focus({ preventScroll: true });
    } else if (step === 2) {
      emailInputRef.current?.focus({ preventScroll: true });
    } else if (step === 4) {
      messageRef.current?.focus({ preventScroll: true });
    }
  }, [step]);

  // When "Something else" is selected, focus the custom subject input
  useEffect(() => {
    if (step === 3 && selectedChip === 'Something else') {
      customSubjectRef.current?.focus({ preventScroll: true });
    }
  }, [step, selectedChip]);

  const triggerShake = () => {
    if (shouldReduceMotion) return;
    setShake(true);
    setTimeout(() => setShake(false), 320);
  };

  const validateCurrentStep = (): boolean => {
    if (step === 1) {
      if (!form.name.trim()) {
        setErrors({ name: 'Name is required.' });
        triggerShake();
        return false;
      }
      if (form.name.trim().length < 2) {
        setErrors({ name: 'Name must be at least 2 characters.' });
        triggerShake();
        return false;
      }
      if (form.name.trim().length > 80) {
        setErrors({ name: 'Name must not exceed 80 characters.' });
        triggerShake();
        return false;
      }
      setErrors((prev) => ({ ...prev, name: undefined }));
      return true;
    }

    if (step === 2) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!form.email.trim()) {
        setErrors({ email: 'Email is required.' });
        triggerShake();
        return false;
      }
      if (form.email.trim().length > 120) {
        setErrors({ email: 'Email must not exceed 120 characters.' });
        triggerShake();
        return false;
      }
      if (!emailRegex.test(form.email.trim())) {
        setErrors({ email: 'Please enter a valid email address.' });
        triggerShake();
        return false;
      }
      setErrors((prev) => ({ ...prev, email: undefined }));
      return true;
    }

    if (step === 3) {
      if (!form.subject.trim()) {
        setErrors({
          subject:
            selectedChip === 'Something else'
              ? 'Please specify your subject.'
              : 'Please select what this is about.',
        });
        triggerShake();
        return false;
      }
      if (form.subject.trim().length < 3) {
        setErrors({ subject: 'Subject must be at least 3 characters.' });
        triggerShake();
        return false;
      }
      if (form.subject.trim().length > 120) {
        setErrors({ subject: 'Subject must not exceed 120 characters.' });
        triggerShake();
        return false;
      }
      setErrors((prev) => ({ ...prev, subject: undefined }));
      return true;
    }

    if (step === 4) {
      if (!form.message.trim()) {
        setErrors({ message: 'Message is required.' });
        triggerShake();
        return false;
      }
      if (form.message.trim().length < 10) {
        setErrors({ message: 'Message must be at least 10 characters.' });
        triggerShake();
        return false;
      }
      if (form.message.trim().length > 2000) {
        setErrors({ message: 'Message must not exceed 2000 characters.' });
        triggerShake();
        return false;
      }
      setErrors((prev) => ({ ...prev, message: undefined }));
      return true;
    }

    return true;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;
    if (step < 4) {
      setDirection(1);
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setDirection(-1);
      setStep((prev) => prev - 1);
      setErrors({});
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCurrentStep()) return;
    setSubmittedName(form.name.trim());
    await onSubmit(e);
  };

  const handleChipSelect = (chip: string) => {
    setSelectedChip(chip);
    if (chip === 'Something else') {
      setForm((prev) => ({ ...prev, subject: '' }));
    } else {
      setForm((prev) => ({ ...prev, subject: chip }));
      setErrors((prev) => ({ ...prev, subject: undefined }));
    }
  };

  const handleReset = () => {
    setStep(1);
    setDirection(1);
    setErrors({});
    setSelectedChip('');
    setSubmittedName('');
    onReset();
  };

  // Textarea auto-grow
  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors.message) {
      setErrors((prev) => ({ ...prev, message: undefined }));
    }
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(Math.max(e.target.scrollHeight, 76), 200)}px`;
  };

  // Variants for step slide transitions
  const stepVariants = {
    enter: (dir: number) => ({
      x: shouldReduceMotion ? 0 : dir > 0 ? 30 : -30,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: shouldReduceMotion ? 0 : dir > 0 ? -30 : 30,
      opacity: 0,
    }),
  };

  // ── Success Screen ──
  if (submitStatus === 'success') {
    return (
      <div className="py-6 flex flex-col items-center text-center justify-center min-h-[300px]">
        {/* Animated Green Checkmark (Circle + Tick) */}
        <div className="w-16 h-16 mb-5 relative flex items-center justify-center">
          <svg viewBox="0 0 52 52" className="w-full h-full">
            <motion.circle
              cx="26"
              cy="26"
              r="23"
              fill="none"
              stroke="#22c55e"
              strokeWidth="2.5"
              strokeLinecap="round"
              initial={shouldReduceMotion ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
            />
            <motion.path
              fill="none"
              stroke="#22c55e"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 27l7 7 15-15"
              initial={shouldReduceMotion ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: 0.35,
                delay: shouldReduceMotion ? 0 : 0.45,
                ease: 'easeOut',
              }}
            />
          </svg>
        </div>

        <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2.5">
          Thanks{submittedName ? `, ${submittedName}` : ''}!
        </h3>
        <p className="text-zinc-400 font-light text-sm sm:text-base leading-relaxed max-w-sm mb-8">
          Your message is on its way. I&apos;ll get back to you soon.
        </p>

        <button
          type="button"
          suppressHydrationWarning
          onClick={handleReset}
          className="px-6 py-2.5 rounded-full border border-white/20 text-xs font-semibold uppercase tracking-wider text-zinc-300 hover:text-white hover:border-[#f97316] transition-colors cursor-pointer"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleFormSubmit} className="w-full flex flex-col justify-between">
      {/* Honeypot field for bot protection */}
      <input
        type="checkbox"
        name="botcheck"
        tabIndex={-1}
        autoComplete="off"
        checked={Boolean(botcheck)}
        onChange={(e) => setBotcheck(e.target.checked ? 'true' : '')}
        style={{ display: 'none' }}
        className="hidden"
        aria-hidden="true"
      />
      {/* ── Top: 4-Segment Progress Bar + Step Counter ── */}
      <div className="flex items-center justify-between mb-8">
        <div
          className="grid grid-cols-4 gap-2 flex-1 max-w-[240px] mr-4"
          role="progressbar"
          aria-valuenow={step}
          aria-valuemin={1}
          aria-valuemax={4}
        >
          {[1, 2, 3, 4].map((seg) => (
            <div key={seg} className="h-[3px] rounded-full bg-white/10 overflow-hidden relative">
              <motion.div
                className="h-full bg-gradient-to-r from-[#fdba74] to-[#f97316] origin-left"
                initial={false}
                animate={{ scaleX: seg <= step ? 1 : 0 }}
                transition={{ duration: 0.5, ease: [0.7, 0, 0.2, 1] }}
              />
            </div>
          ))}
        </div>
        <span className="text-xs font-mono tracking-widest text-zinc-500 font-medium">
          {step} / 4
        </span>
        <span className="sr-only" aria-live="polite">
          Step {step} of 4
        </span>
      </div>

      {/* ── Main Step Content Area (min-h-[210px] prevents jumping) ── */}
      <div className="min-h-[210px] flex flex-col justify-center mb-8 relative">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              duration: shouldReduceMotion ? 0.15 : 0.5,
              ease: [0.2, 0.8, 0.2, 1],
            }}
            className="w-full"
          >
            {/* Shake Wrapper for Validation Errors */}
            <motion.div
              animate={shake ? { x: [-6, 6, -4, 4, 0] } : { x: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* STEP 1: Name */}
              {step === 1 && (
                <div className="space-y-4">
                  <h3
                    id="step-question-1"
                    className="font-bold text-[clamp(22px,4vw,30px)] tracking-[-0.03em] leading-[1.2] text-white"
                  >
                    Hi, what&apos;s your <span className="text-[#f97316]">name</span>?
                  </h3>
                  <label htmlFor="name" className="sr-only">
                    Your Name
                  </label>
                  <input
                    ref={nameInputRef}
                    suppressHydrationWarning
                    type="text"
                    id="name"
                    name="name"
                    maxLength={80}
                    value={form.name}
                    onChange={(e) => {
                      setForm((prev) => ({ ...prev, name: e.target.value }));
                      if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleNext();
                      }
                    }}
                    placeholder="e.g. John Doe"
                    aria-labelledby="step-question-1"
                    aria-invalid={Boolean(errors.name)}
                    className="w-full bg-transparent border-0 border-b-2 border-white/20 focus:border-[#f97316] text-base sm:text-[20px] font-medium text-white placeholder:text-zinc-600 focus:outline-none transition-colors duration-300 py-3"
                  />
                  {errors.name && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-1.5 text-xs text-[#f97316]"
                    >
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{errors.name}</span>
                    </motion.p>
                  )}
                </div>
              )}

              {/* STEP 2: Email */}
              {step === 2 && (
                <div className="space-y-4">
                  <h3
                    id="step-question-2"
                    className="font-bold text-[clamp(22px,4vw,30px)] tracking-[-0.03em] leading-[1.2] text-white"
                  >
                    Nice to meet you
                    {form.name.trim() ? `, ${form.name.trim()}` : ''}. What&apos;s your{' '}
                    <span className="text-[#f97316]">email</span>?
                  </h3>
                  <label htmlFor="email" className="sr-only">
                    Your Email
                  </label>
                  <input
                    ref={emailInputRef}
                    suppressHydrationWarning
                    type="email"
                    id="email"
                    name="email"
                    maxLength={120}
                    value={form.email}
                    onChange={(e) => {
                      setForm((prev) => ({ ...prev, email: e.target.value }));
                      if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleNext();
                      }
                    }}
                    placeholder="john@example.com"
                    aria-labelledby="step-question-2"
                    aria-invalid={Boolean(errors.email)}
                    className="w-full bg-transparent border-0 border-b-2 border-white/20 focus:border-[#f97316] text-base sm:text-[20px] font-medium text-white placeholder:text-zinc-600 focus:outline-none transition-colors duration-300 py-3"
                  />
                  {errors.email && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-1.5 text-xs text-[#f97316]"
                    >
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{errors.email}</span>
                    </motion.p>
                  )}
                </div>
              )}

              {/* STEP 3: Subject Chips */}
              {step === 3 && (
                <div className="space-y-4">
                  <h3
                    id="step-question-3"
                    className="font-bold text-[clamp(22px,4vw,30px)] tracking-[-0.03em] leading-[1.2] text-white"
                  >
                    What&apos;s this <span className="text-[#f97316]">about</span>?
                  </h3>

                  <div className="flex flex-wrap gap-2.5 pt-1">
                    {SUBJECT_CHIPS.map((chip) => {
                      const isSelected = selectedChip === chip;
                      return (
                        <button
                          key={chip}
                          type="button"
                          suppressHydrationWarning
                          onClick={() => handleChipSelect(chip)}
                          className={`px-4 py-2 rounded-full border text-[13px] font-medium transition-all duration-200 cursor-pointer ${
                            isSelected
                              ? 'bg-[#f97316] text-black font-semibold border-[#f97316] scale-[1.04] shadow-md shadow-[#f97316]/25'
                              : 'bg-transparent text-zinc-300 border-white/[0.18] hover:border-[#f97316]/60 hover:text-white'
                          }`}
                        >
                          {chip}
                        </button>
                      );
                    })}
                  </div>

                  {/* Underline input revealed if "Something else" is selected */}
                  {selectedChip === 'Something else' && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="pt-2"
                    >
                      <label htmlFor="subject" className="sr-only">
                        Custom Subject
                      </label>
                      <input
                        ref={customSubjectRef}
                        suppressHydrationWarning
                        type="text"
                        id="subject"
                        name="subject"
                        maxLength={120}
                        value={form.subject}
                        onChange={(e) => {
                          setForm((prev) => ({ ...prev, subject: e.target.value }));
                          if (errors.subject) setErrors((prev) => ({ ...prev, subject: undefined }));
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleNext();
                          }
                        }}
                        placeholder="Specify topic..."
                        className="w-full bg-transparent border-0 border-b-2 border-white/20 focus:border-[#f97316] text-sm sm:text-base font-medium text-white placeholder:text-zinc-600 focus:outline-none transition-colors duration-300 py-2"
                      />
                    </motion.div>
                  )}

                  {errors.subject && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-1.5 text-xs text-[#f97316]"
                    >
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{errors.subject}</span>
                    </motion.p>
                  )}
                </div>
              )}

              {/* STEP 4: Message */}
              {step === 4 && (
                <div className="space-y-4">
                  <h3
                    id="step-question-4"
                    className="font-bold text-[clamp(22px,4vw,30px)] tracking-[-0.03em] leading-[1.2] text-white"
                  >
                    Tell me about your <span className="text-[#f97316]">project</span>.
                  </h3>
                  <label htmlFor="message" className="sr-only">
                    Your Message
                  </label>
                  <textarea
                    ref={messageRef}
                    suppressHydrationWarning
                    id="message"
                    name="message"
                    maxLength={2000}
                    rows={3}
                    value={form.message}
                    onChange={handleTextareaInput}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                        e.preventDefault();
                        handleFormSubmit(e);
                      }
                    }}
                    placeholder="A few lines is plenty..."
                    aria-labelledby="step-question-4"
                    aria-invalid={Boolean(errors.message)}
                    className="w-full bg-transparent border-0 border-b-2 border-white/20 focus:border-[#f97316] text-base sm:text-[20px] font-medium text-white placeholder:text-zinc-600 focus:outline-none transition-colors duration-300 py-2 resize-none overflow-y-auto leading-relaxed"
                  />
                  <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                    <span>Press Ctrl + Enter to send</span>
                    <span>{form.message.length} chars</span>
                  </div>

                  {errors.message && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-1.5 text-xs text-[#f97316]"
                    >
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{errors.message}</span>
                    </motion.p>
                  )}

                  {submitStatus === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400"
                    >
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>Oops! Something went wrong. Please try again.</span>
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Bottom Navigation: Back on Left, Next / Send on Right ── */}
      <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
        <button
          type="button"
          suppressHydrationWarning
          disabled={step === 1 || isSubmitting}
          onClick={handleBack}
          className="px-5 py-2.5 rounded-full border border-white/20 text-xs font-semibold uppercase tracking-wider text-zinc-300 hover:text-white hover:border-white/40 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
        >
          ← Back
        </button>

        {step < 4 ? (
          <button
            type="button"
            suppressHydrationWarning
            onClick={handleNext}
            className="px-6 py-2.5 rounded-full bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-zinc-200 transition-all cursor-pointer shadow-md"
          >
            Next →
          </button>
        ) : (
          <button
            type="submit"
            suppressHydrationWarning
            disabled={isSubmitting || cooldown > 0}
            className="px-7 py-2.5 rounded-full bg-[#f97316] text-black text-xs font-bold uppercase tracking-wider hover:bg-[#e55a10] disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed transition-all cursor-pointer shadow-md shadow-[#f97316]/25 flex items-center gap-2 overflow-hidden relative"
          >
            <AnimatePresence mode="wait" initial={false}>
              {isSubmitting ? (
                <motion.div
                  key="sending"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-2"
                >
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Sending...</span>
                </motion.div>
              ) : cooldown > 0 ? (
                <motion.div
                  key="cooldown"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-1.5"
                >
                  <span>Wait {cooldown}s</span>
                </motion.div>
              ) : (
                <motion.div
                  key="send"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-1.5"
                >
                  <span>Send ↗</span>
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        )}
      </div>
    </form>
  );
}

