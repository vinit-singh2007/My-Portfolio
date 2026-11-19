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
      suppressHydrationWarning
      onClick={() => toggleSoundMuted()}
      aria-label={muted ? 'Enable sound' : 'Mute sound'}
      title={muted ? 'Enable sound' : 'Mute sound'}
      className="flex items-center justify-center p-2 text-zinc-400 hover:text-white transition-all duration-200 cursor-pointer hover:scale-110 active:scale-90 focus:outline-none focus-visible:ring-1 focus-visible:ring-white/40 rounded-lg"
    >
      {muted ? (
        <VolumeX className="w-5 h-5 stroke-[1.8] text-zinc-400 hover:text-white transition-colors" />
      ) : (
        <Volume2 className="w-5 h-5 stroke-[1.8] text-white" />
      )}
    </button>
  );
}

export default React.memo(SoundToggleComponent);
