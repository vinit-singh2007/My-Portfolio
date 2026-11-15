'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { toggleSoundMuted, subscribeSoundMuted } from '@/lib/navSound';

export default function SoundToggle() {
  const [muted, setMuted] = useState<boolean>(true);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    const unsubscribe = subscribeSoundMuted((isMuted) => {
      setMuted(isMuted);
    });
    return unsubscribe;
  }, []);

  if (!mounted) return null;

  return (
    <button
      type="button"
      onClick={() => toggleSoundMuted()}
      aria-label={muted ? 'Enable sound' : 'Mute sound'}
      title={muted ? 'Enable sound' : 'Mute sound'}
      className="flex items-center justify-center w-10 h-10 rounded-[13px] bg-[#27272b] hover:bg-[#323238] text-white border border-white/10 shadow-lg shadow-black/40 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
    >
      {muted ? (
        <VolumeX className="w-[18px] h-[18px] stroke-[2] text-zinc-400 group-hover:text-white" />
      ) : (
        <Volume2 className="w-[18px] h-[18px] stroke-[2] text-white" />
      )}
    </button>
  );
}
