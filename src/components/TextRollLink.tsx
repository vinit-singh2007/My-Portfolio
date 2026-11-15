'use client';

import React from 'react';

interface TextRollLinkProps {
  label: string;
  isActive?: boolean;
  onClick: () => void;
  onMouseEnter?: () => void;
  onFocus?: () => void;
  className?: string;
}

export default function TextRollLink({
  label,
  isActive = false,
  onClick,
  onMouseEnter,
  onFocus,
  className = '',
}: TextRollLinkProps) {
  return (
    <button
      type="button"
      suppressHydrationWarning
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onFocus={onFocus}
      aria-label={label}
      className={`nav-text-roll text-xs uppercase tracking-[0.2em] font-medium cursor-pointer focus:outline-none ${
        isActive ? 'is-active' : ''
      } ${className}`}
    >
      <span className="text-roll-wrapper">
        <span className="text-roll-stack">
          {/* Original copy (light gray) - rolls up out of view on hover/active */}
          <span className="text-roll-item text-roll-primary">
            {label}
          </span>
          {/* Duplicate copy (orange #FF6A1A) - rolls in from bottom on hover/active */}
          <span aria-hidden="true" className="text-roll-item text-roll-secondary">
            {label}
          </span>
        </span>
      </span>
    </button>
  );
}

