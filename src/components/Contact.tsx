'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import StepForm, { FormState } from './StepForm';
import ContactInfo from './ContactInfo';

export default function Contact() {
  const [form, setForm] = useState<FormState>({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    setSubmitStatus('idle');

    const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
    if (!accessKey || accessKey === 'YOUR_ACCESS_KEY_HERE') {
      console.error('Web3Forms Access Key is not configured in .env.local');
      setSubmitStatus('error');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
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
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#ffffff', '#d4d4d8', '#a1a1aa'],
        });
      } else {
        console.error('Submission failed:', result);
        setSubmitStatus('error');
      }
    } catch (err) {
      console.error('Network error submitting contact form:', err);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 px-6 max-w-7xl mx-auto scroll-mt-20">
      {/* Cinematic Minimal Header */}
      <div className="text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-5xl font-black mb-4 text-white uppercase tracking-tight"
        >
          Let&apos;s Connect
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-zinc-400 max-w-lg mx-auto font-light text-sm md:text-base"
        >
          Have an exciting project idea, collaborative proposal, or just want to chat? Drop me a message below!
        </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 max-w-5xl mx-auto">
        {/* Info Column */}
        <div className="lg:col-span-2">
          <ContactInfo />
        </div>

        {/* Form Column with Stepped Form UI */}
        <motion.div
          initial={{ opacity: 0, x: 25 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.55 }}
          className="lg:col-span-3"
        >
          <div className="rounded-3xl p-6 sm:p-8 border border-white/[0.08] bg-[#101010]/90 backdrop-blur-xl relative shadow-xl">
            <StepForm
              form={form}
              setForm={setForm}
              isSubmitting={isSubmitting}
              submitStatus={submitStatus}
              onSubmit={handleSubmit}
              onReset={() => {
                setSubmitStatus('idle');
                setForm({ name: '', email: '', subject: '', message: '' });
              }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
