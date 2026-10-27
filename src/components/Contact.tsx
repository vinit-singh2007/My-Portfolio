'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, MapPin, Send, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function Contact() {
  const [form, setForm] = useState<FormState>({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const validate = () => {
    const tempErrors: Partial<FormState> = {};
    if (!form.name.trim()) tempErrors.name = 'Name is required.';
    else if (form.name.trim().length < 2) tempErrors.name = 'Name must be at least 2 characters.';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email) tempErrors.email = 'Email is required.';
    else if (!emailRegex.test(form.email)) tempErrors.email = 'Please enter a valid email address.';

    if (!form.subject.trim()) tempErrors.subject = 'Subject is required.';
    else if (form.subject.trim().length < 3) tempErrors.subject = 'Subject must be at least 3 characters.';

    if (!form.message.trim()) tempErrors.message = 'Message is required.';
    else if (form.message.trim().length < 10) tempErrors.message = 'Message must be at least 10 characters.';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormState]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');

    const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
    if (!accessKey || accessKey === 'YOUR_ACCESS_KEY_HERE') {
      console.error("Web3Forms Access Key is not configured in .env.local");
      setSubmitStatus('error');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          access_key: accessKey,
          name: form.name,
          email: form.email,
          subject: form.subject,
          message: form.message,
          from_name: 'Portfolio Contact Form',
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus('success');
        setForm({ name: '', email: '', subject: '', message: '' });

        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#6366f1', '#06b6d4', '#a5b4fc', '#22d3ee'],
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (err) {
      console.error("Form submission error:", err);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 px-6 max-w-7xl mx-auto scroll-mt-20">
      <div className="text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-5xl font-extrabold mb-4"
        >
          Let&apos;s Connect
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto font-light"
        >
          Have an exciting project idea, collaborative proposal, or just want to chat? Drop me a message below!
        </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 max-w-5xl mx-auto">
        {/* Info Column */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-2 flex flex-col justify-between"
        >
          <div className="space-y-8">
            <h3 className="text-2xl font-bold">Contact Information</h3>
            <p className="text-zinc-600 dark:text-zinc-400 font-light leading-relaxed">
              I am open to discuss interesting freelance roles, remote contract opportunities, or full-time engagements.
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-indigo-500/10 dark:bg-cyan-500/10 text-indigo-600 dark:text-cyan-400">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Email</h4>
                  <a href="mailto:vinitsingh.builds@gmail.com" className="text-sm font-medium hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors">
                    vinitsingh.builds@gmail.com                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-indigo-500/10 dark:bg-cyan-500/10 text-indigo-600 dark:text-cyan-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Location</h4>
                  <span className="text-sm font-medium">Mumbai, India</span>
                </div>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="pt-8 lg:pt-0 flex gap-4">
            <a
              href="https://github.com/vinit-singh2007"
              className="p-3.5 rounded-xl glass glass-hover text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-cyan-400 shadow-sm"
              title="GitHub"
            >
              <GithubIcon className="w-5 h-5" />
            </a>
            <a
              href="https://linkedin.com/in/vinitsi-2043-"
              className="p-3.5 rounded-xl glass glass-hover text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-cyan-400 shadow-sm"
              title="LinkedIn"
            >
              <LinkedinIcon className="w-5 h-5" />
            </a>
          </div>
        </motion.div>

        {/* Form Column */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-3"
        >
          <div className="glass rounded-3xl p-8 border border-zinc-200/20 bg-white/40 dark:bg-zinc-950/40 relative shadow-md">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Name
                </label>
                <input
                  suppressHydrationWarning
                  type="text"
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className={`w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-zinc-900/50 border ${errors.name ? 'border-red-500' : 'border-zinc-200/20 dark:border-zinc-800'
                    } focus:outline-none focus:ring-2 ${errors.name
                      ? 'focus:ring-red-500/20 focus:border-red-500'
                      : 'focus:ring-indigo-500/20 dark:focus:ring-cyan-500/20 focus:border-indigo-500 dark:focus:border-cyan-400'
                    } transition-all duration-300 placeholder-zinc-400 dark:placeholder-zinc-600 text-sm`}
                />
                {errors.name && (
                  <p className="flex items-center gap-1 text-[11px] text-red-500 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Email Address
                </label>
                <input
                  suppressHydrationWarning
                  type="email"
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className={`w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-zinc-900/50 border ${errors.email ? 'border-red-500' : 'border-zinc-200/20 dark:border-zinc-800'
                    } focus:outline-none focus:ring-2 ${errors.email
                      ? 'focus:ring-red-500/20 focus:border-red-500'
                      : 'focus:ring-indigo-500/20 dark:focus:ring-cyan-500/20 focus:border-indigo-500 dark:focus:border-cyan-400'
                    } transition-all duration-300 placeholder-zinc-400 dark:placeholder-zinc-600 text-sm`}
                />
                {errors.email && (
                  <p className="flex items-center gap-1 text-[11px] text-red-500 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Subject */}
              <div className="space-y-2">
                <label htmlFor="subject" className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Subject
                </label>
                <input
                  suppressHydrationWarning
                  type="text"
                  id="subject"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="Project Collaboration"
                  className={`w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-zinc-900/50 border ${errors.subject ? 'border-red-500' : 'border-zinc-200/20 dark:border-zinc-800'
                    } focus:outline-none focus:ring-2 ${errors.subject
                      ? 'focus:ring-red-500/20 focus:border-red-500'
                      : 'focus:ring-indigo-500/20 dark:focus:ring-cyan-500/20 focus:border-indigo-500 dark:focus:border-cyan-400'
                    } transition-all duration-300 placeholder-zinc-400 dark:placeholder-zinc-600 text-sm`}
                />
                {errors.subject && (
                  <p className="flex items-center gap-1 text-[11px] text-red-500 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.subject}
                  </p>
                )}
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label htmlFor="message" className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Message
                </label>
                <textarea
                  suppressHydrationWarning
                  id="message"
                  name="message"
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell me about your project..."
                  className={`w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-zinc-900/50 border ${errors.message ? 'border-red-500' : 'border-zinc-200/20 dark:border-zinc-800'
                    } focus:outline-none focus:ring-2 ${errors.message
                      ? 'focus:ring-red-500/20 focus:border-red-500'
                      : 'focus:ring-indigo-500/20 dark:focus:ring-cyan-500/20 focus:border-indigo-500 dark:focus:border-cyan-400'
                    } transition-all duration-300 placeholder-zinc-400 dark:placeholder-zinc-600 text-sm resize-none`}
                />
                {errors.message && (
                  <p className="flex items-center gap-1 text-[11px] text-red-500 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                suppressHydrationWarning
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl font-bold bg-indigo-600 text-white dark:bg-cyan-400 dark:text-zinc-950 hover:bg-indigo-700 dark:hover:bg-cyan-300 disabled:bg-zinc-300 dark:disabled:bg-zinc-800 transition-colors shadow-lg cursor-pointer flex items-center justify-center gap-2 group text-sm"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4.5 h-4.5 animate-spin" />
                    <span>Sending Message...</span>
                  </>
                ) : (
                  <>
                    <span>Send Message</span>
                    <Send className="w-4.5 h-4.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </>
                )}
              </button>

              {/* Status Banner */}
              <AnimatePresence>
                {submitStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl text-xs"
                  >
                    <CheckCircle2 className="w-4.5 h-4.5" />
                    <span>Thank you! Your message was sent successfully.</span>
                  </motion.div>
                )}
                {submitStatus === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="flex items-center gap-2 text-red-600 dark:text-red-400 bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-xs"
                  >
                    <AlertCircle className="w-4.5 h-4.5" />
                    <span>Oops! Something went wrong. Please try again.</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
