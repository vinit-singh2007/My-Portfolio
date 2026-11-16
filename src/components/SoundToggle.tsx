'use client';

import React, { useSyncExternalStore } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import {
  toggleSoundMuted,
  subscribeSoundMuted,
  getSoundMutedSnapshot,
} from '@/lib/navSound';

function SoundToggleComponent() {
  const muted = useSyncExternalStore(
    subscribeSoundMuted,
    getSoundMutedSnapshot,
    () => true
  );

  return (
    <button
      type="button"
      onClick={() => toggleSoundMuted()}
      aria-label={muted ? 'Enable sound' : 'Mute sound'}
      title={muted ? 'Enable sound' : 'Mute sound'}
      className="hidden sm:flex items-center justify-center w-10 h-10 rounded-[13px] bg-[#27272b] hover:bg-[#323238] text-white border border-white/10 shadow-lg shadow-black/40 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
    >
      {muted ? (
        <VolumeX className="w-[18px] h-[18px] stroke-[2] text-zinc-400 group-hover:text-white" />
      ) : (
        <Volume2 className="w-[18px] h-[18px] stroke-[2] text-white" />
      )}
    </button>
  );
}

export default React.memo(SoundToggleComponent);
