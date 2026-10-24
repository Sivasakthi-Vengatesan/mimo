import React, { useState } from 'react';
import type { MascotMood } from '../types';

interface MascotProps {
  mood?: MascotMood;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  accentColor?: 'coral' | 'lime' | 'pink' | 'aqua';
  interactive?: boolean;
  onInteract?: (newMood: MascotMood) => void;
  className?: string;
  showDialogue?: boolean;
}

const QUIPS: Record<MascotMood, string[]> = {
  idle: [
    "Ready to brainstorm whenever you are.",
    "Connected to your local Qwen model.",
    "Ready for your next mission."
  ],
  happy: [
    "Great work! Keep that momentum going.",
    "Happy to help with your workflow today.",
    "Everything is running smoothly on-device."
  ],
  thinking: [
    "Consulting local neural core...",
    "Synthesizing your answer...",
    "Analyzing steps for your goal..."
  ],
  curious: [
    "What subject are we exploring next?",
    "Tell me more about what you're working on.",
    "Interesting! Let's break that down."
  ],
  excited: [
    "Task accomplished! Stellar progress!",
    "Milestone achieved! Excellent focus.",
    "Great job crossing that off your list!"
  ],
  sleepy: [
    "Resting systems. Click me anytime to wake.",
    "In low-power standby mode.",
    "Ready when you are."
  ],
};

export const Mascot: React.FC<MascotProps> = ({
  mood = 'idle',
  size = 'md',
  accentColor = 'coral',
  interactive = true,
  onInteract,
  className = '',
  showDialogue = false,
}) => {
  const [internalMood, setInternalMood] = useState<MascotMood>(mood);
  const [quipIndex, setQuipIndex] = useState(0);
  const [isWaving, setIsWaving] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const activeMood = mood !== 'idle' ? mood : internalMood;

  // Curated soft-cosmic color tokens
  const palette = {
    coral: { rim: '#B1E5E6', visorGlow: 'rgba(177, 229, 230, 0.25)', detail: '#F29191', blush: '#F7ADAD' },
    lime: { rim: '#D8FF70', visorGlow: 'rgba(216, 255, 112, 0.25)', detail: '#D8FF70', blush: '#F29191' },
    pink: { rim: '#F7ADAD', visorGlow: 'rgba(247, 173, 173, 0.25)', detail: '#F7ADAD', blush: '#F29191' },
    aqua: { rim: '#B1E5E6', visorGlow: 'rgba(177, 229, 230, 0.3)', detail: '#B1E5E6', blush: '#F7ADAD' },
  }[accentColor] || { rim: '#B1E5E6', visorGlow: 'rgba(177, 229, 230, 0.25)', detail: '#F29191', blush: '#F7ADAD' };

  const sizeStyles = {
    sm: 'w-14 h-14',
    md: 'w-24 h-24',
    lg: 'w-36 h-36',
    xl: 'w-48 h-48',
  }[size];

  const handleClick = () => {
    if (!interactive) return;
    setIsWaving(true);
    setTimeout(() => setIsWaving(false), 800);

    const moods: MascotMood[] = ['happy', 'curious', 'excited', 'idle'];
    const nextMood = moods[(clickCount + 1) % moods.length];
    setClickCount((c) => c + 1);
    setInternalMood(nextMood);
    setQuipIndex((q) => (q + 1) % 3);

    if (onInteract) {
      onInteract(nextMood);
    }
  };

  const currentQuip = QUIPS[activeMood][quipIndex % QUIPS[activeMood].length];

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      {/* Astronaut Character Artwork */}
      <div
        onClick={handleClick}
        className={`${sizeStyles} relative cursor-pointer transition-transform duration-300 hover:scale-105 active:scale-95 animate-soft-float`}
        title={interactive ? "Click MIMO to interact" : undefined}
      >
        {/* Soft radial glow behind mascot */}
        <div
          className="absolute inset-1 rounded-full blur-xl opacity-40 transition-opacity duration-300 pointer-events-none"
          style={{ background: palette.visorGlow }}
        />

        <svg
          viewBox="0 0 200 200"
          className="w-full h-full relative z-10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="helmetVisor" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#1E2E4A" stopOpacity="0.9" />
              <stop offset="60%" stopColor="#131D2E" stopOpacity="0.98" />
              <stop offset="100%" stopColor="#0D1422" stopOpacity="1" />
            </radialGradient>
            <linearGradient id="suitGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F5F2ED" />
              <stop offset="100%" stopColor="#CBD5E1" />
            </linearGradient>
          </defs>

          {/* Antenna */}
          <path d="M100 36 L100 18" stroke="#94A3B8" strokeWidth="3.5" strokeLinecap="round" />
          <circle
            cx="100"
            cy="15"
            r="5"
            fill={palette.detail}
            className={activeMood === 'thinking' ? 'animate-pulse' : ''}
          />

          {/* Spacesuit Body */}
          <ellipse cx="100" cy="154" rx="40" ry="30" fill="url(#suitGradient)" stroke="#1E2E4A" strokeWidth="2.5" />
          
          {/* Collar Line */}
          <path d="M74 135 C82 142 118 142 126 135" stroke={palette.rim} strokeWidth="3" strokeLinecap="round" />

          {/* Suit Badge */}
          <circle cx="100" cy="155" r="9" fill="#162235" stroke={palette.detail} strokeWidth="1.5" />
          <polygon points="100,149 102,153 106,153.5 103,157 104,161 100,158.5 96,161 97,157 94,153.5 98,153" fill={palette.detail} />

          {/* Paws */}
          <ellipse
            cx="54"
            cy={isWaving ? "132" : "150"}
            rx="10"
            ry="10"
            fill="#F5F2ED"
            stroke="#1E2E4A"
            strokeWidth="2"
            className={isWaving ? "transition-transform duration-300 origin-bottom -rotate-12" : ""}
          />
          <ellipse cx="146" cy="150" rx="10" ry="10" fill="#F5F2ED" stroke="#1E2E4A" strokeWidth="2" />

          {/* Boots */}
          <ellipse cx="82" cy="182" rx="13" ry="8" fill="#131D2E" stroke="#1E2E4A" strokeWidth="2" />
          <ellipse cx="118" cy="182" rx="13" ry="8" fill="#131D2E" stroke="#1E2E4A" strokeWidth="2" />

          {/* Outer Helmet Shell */}
          <circle cx="100" cy="85" r="52" fill="#F5F2ED" stroke="#1E2E4A" strokeWidth="3" />

          {/* Visor */}
          <circle cx="100" cy="87" r="41" fill="url(#helmetVisor)" stroke={palette.rim} strokeWidth="2.5" />

          {/* Visor Glare Specular */}
          <path d="M74 67 C84 58 114 58 126 67" stroke="#F5F2ED" strokeWidth="3" strokeLinecap="round" opacity="0.45" />

          {/* Expressions */}
          {activeMood === 'idle' && (
            <>
              <circle cx="87" cy="88" r="6.5" fill="#B1E5E6" />
              <circle cx="113" cy="88" r="6.5" fill="#B1E5E6" />
              <circle cx="89" cy="86" r="2.2" fill="#FFFFFF" />
              <circle cx="115" cy="86" r="2.2" fill="#FFFFFF" />
              <path d="M95 98 Q100 102 105 98" stroke="#F5F2ED" strokeWidth="2" strokeLinecap="round" fill="none" />
              <ellipse cx="78" cy="94" rx="4" ry="2" fill={palette.blush} opacity="0.75" />
              <ellipse cx="122" cy="94" rx="4" ry="2" fill={palette.blush} opacity="0.75" />
            </>
          )}

          {activeMood === 'happy' && (
            <>
              <path d="M82 89 Q87 81 92 89" stroke="#B1E5E6" strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d="M108 89 Q113 81 118 89" stroke="#B1E5E6" strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d="M94 97 Q100 104 106 97 Z" fill={palette.blush} stroke="#F5F2ED" strokeWidth="1" />
              <ellipse cx="77" cy="93" rx="4.5" ry="2.5" fill={palette.blush} />
              <ellipse cx="123" cy="93" rx="4.5" ry="2.5" fill={palette.blush} />
            </>
          )}

          {activeMood === 'thinking' && (
            <>
              <circle cx="87" cy="86" r="7" fill="#B1E5E6" />
              <circle cx="89" cy="84" r="2.2" fill="#FFFFFF" />
              <path d="M107 88 L119 88" stroke="#B1E5E6" strokeWidth="2.5" strokeLinecap="round" />
              <ellipse cx="102" cy="98" rx="2.5" ry="1.5" fill={palette.blush} />
              <circle cx="100" cy="72" r="1.8" fill="#D8FF70" className="animate-ping" />
            </>
          )}

          {activeMood === 'curious' && (
            <>
              <circle cx="86" cy="86" r="7.5" fill="#B1E5E6" />
              <circle cx="114" cy="85" r="7.5" fill="#B1E5E6" />
              <circle cx="88" cy="84" r="2.5" fill="#FFFFFF" />
              <circle cx="116" cy="83" r="2.5" fill="#FFFFFF" />
              <circle cx="100" cy="98" r="2.5" fill={palette.blush} />
            </>
          )}

          {activeMood === 'excited' && (
            <>
              <polygon points="87,80 88.5,84 93,85 89.5,88 91,92 87,89 83,92 84.5,88 81,85 85.5,84" fill="#D8FF70" />
              <polygon points="113,80 114.5,84 119,85 115.5,88 117,92 113,89 109,92 110.5,88 107,85 111.5,84" fill="#D8FF70" />
              <path d="M93 98 Q100 106 107 98" stroke="#F5F2ED" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <ellipse cx="76" cy="93" rx="5" ry="3" fill={palette.blush} />
              <ellipse cx="124" cy="93" rx="5" ry="3" fill={palette.blush} />
            </>
          )}

          {activeMood === 'sleepy' && (
            <>
              <path d="M82 89 Q87 93 92 89" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M108 89 Q113 93 118 89" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <text x="122" y="70" fill="#94A3B8" fontSize="10" fontFamily="sans-serif" fontWeight="bold">z</text>
              <text x="130" y="62" fill="#B1E5E6" fontSize="12" fontFamily="sans-serif" fontWeight="bold">Z</text>
            </>
          )}
        </svg>
      </div>

      {/* Subtle compact mood label */}
      <div className="mt-2.5 flex items-center gap-1.5 px-3 py-1 rounded-full bg-space-ink-raised border border-space-ink-border text-xs text-starlight-muted font-medium">
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: palette.rim }}
        />
        <span>MIMO is <strong className="text-starlight font-semibold capitalize">{activeMood}</strong></span>
      </div>

      {/* Attached single dialogue quip (clean, non-overlapping) */}
      {(showDialogue || clickCount > 0) && (
        <p className="mt-2 text-xs text-starlight-muted text-center max-w-xs leading-relaxed animate-in fade-in">
          "{currentQuip}"
        </p>
      )}
    </div>
  );
};
