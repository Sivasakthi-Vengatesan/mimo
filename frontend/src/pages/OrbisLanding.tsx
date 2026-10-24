import React from 'react';
import { MailIcon, TwitterIcon, GithubIcon } from '../components/SocialIcons';

interface OrbisLandingProps {
  onOpenWorkspace?: (tab?: 'chat' | 'bots' | 'tasks') => void;
  onOpenChatWithBot?: (botId: string) => void;
  onOpenCreateBotModal?: () => void;
}

export const OrbisLanding: React.FC<OrbisLandingProps> = ({
  onOpenWorkspace,
  onOpenChatWithBot,
  onOpenCreateBotModal,
}) => {
  const botsList = [
    {
      id: 'study-buddy',
      name: 'STUDY BUDDY',
      score: '8.7/10',
      videoUrl:
        'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_053923_22c0a6a5-313c-474c-85ff-3b50d25e944a.mp4',
    },
    {
      id: 'daily-planner',
      name: 'DAILY PLANNER',
      score: '9.0/10',
      videoUrl:
        'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_054411_511c1b7a-fb2f-42ef-bf6c-32c0b1a06e79.mp4',
    },
    {
      id: 'coding-pal',
      name: 'CODING PAL',
      score: '8.2/10',
      videoUrl:
        'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_055427_ac7035b5-9f3b-4289-86fc-941b2432317d.mp4',
    },
  ];

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full bg-[#010828] text-cream font-mono overflow-x-hidden">
      {/* TEXTURE OVERLAY: full-screen fixed texture overlay (z-50, pointer-events-none) */}
      <div
        className="fixed inset-0 pointer-events-none z-50 bg-cover bg-center"
        style={{
          backgroundImage: 'url(/texture.png)',
          mixBlendMode: 'lighten',
          opacity: 0.6,
        }}
        aria-hidden="true"
      />

      {/* ========================================================
          SECTION 1: HERO (Full viewport)
          ======================================================== */}
      <section
        id="hero"
        className="relative w-full min-h-screen overflow-hidden rounded-b-[32px] flex flex-col justify-between"
      >
        {/* Full-bleed looping muted autoplaying video covering the entire section */}
        <video
          className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
          autoPlay
          loop
          muted
          playsInline
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_045634_e1c98c76-1265-4f5c-882a-4276f2080894.mp4"
        />

        {/* Container: max-w-[1831px] centered with responsive horizontal padding */}
        <div className="w-full max-w-[1831px] mx-auto px-6 sm:px-10 lg:px-16 pt-8 pb-16 flex flex-col justify-between min-h-screen relative z-10">
          {/* Header Row */}
          <header className="w-full flex items-center justify-between">
            {/* Left: "MIMO.AI" logo text in Anton, 16px, uppercase */}
            <div className="font-grotesk text-[16px] uppercase tracking-wider text-cream select-none">
              MIMO.AI
            </div>

            {/* Center: Navigation bar with liquid-glass effect, rounded-[28px], px-[52px] py-[24px] */}
            <nav className="liquid-glass rounded-[28px] px-[52px] py-[24px] hidden lg:flex items-center gap-10">
              <button
                onClick={() => scrollToSection('hero')}
                className="font-grotesk text-[13px] uppercase tracking-wider text-cream hover:text-neon transition-colors cursor-pointer"
              >
                Homepage
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className="font-grotesk text-[13px] uppercase tracking-wider text-cream hover:text-neon transition-colors cursor-pointer"
              >
                About Mimo
              </button>
              <button
                onClick={() => scrollToSection('collection')}
                className="font-grotesk text-[13px] uppercase tracking-wider text-cream hover:text-neon transition-colors cursor-pointer"
              >
                Mini-Bots
              </button>
              <button
                onClick={() => onOpenWorkspace && onOpenWorkspace('tasks')}
                className="font-grotesk text-[13px] uppercase tracking-wider text-cream hover:text-neon transition-colors cursor-pointer"
              >
                Task Hub
              </button>
              <button
                onClick={() => onOpenWorkspace && onOpenWorkspace('chat')}
                className="font-grotesk text-[13px] uppercase tracking-wider text-cream hover:text-neon transition-colors cursor-pointer"
              >
                Companion
              </button>
            </nav>

            {/* Desktop Top-Right Social Icons: 3 square buttons (56x56px) stacked vertically */}
            <div className="hidden lg:flex flex-col gap-3">
              <a
                href="mailto:hello@mimo.ai"
                aria-label="Email Mimo"
                className="liquid-glass rounded-[1rem] w-[56px] h-[56px] flex items-center justify-center text-cream hover:bg-white/10 hover:text-neon transition-all"
              >
                <MailIcon className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
                className="liquid-glass rounded-[1rem] w-[56px] h-[56px] flex items-center justify-center text-cream hover:bg-white/10 hover:text-neon transition-all"
              >
                <TwitterIcon className="w-5 h-5" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Github"
                className="liquid-glass rounded-[1rem] w-[56px] h-[56px] flex items-center justify-center text-cream hover:bg-white/10 hover:text-neon transition-all"
              >
                <GithubIcon className="w-5 h-5" />
              </a>
            </div>

            {/* Mobile Workspace Trigger */}
            <div className="lg:hidden flex items-center gap-2">
              <button
                onClick={() => onOpenWorkspace && onOpenWorkspace('chat')}
                className="liquid-glass px-4 py-2 rounded-full font-grotesk text-xs uppercase text-neon hover:bg-white/10 cursor-pointer"
              >
                Companion
              </button>
            </div>
          </header>

          {/* Hero Content: Exact layout from screenshot with 3 lines */}
          <div className="my-auto py-12 lg:ml-32 max-w-[780px]">
            <div className="relative inline-block w-full">
              {/* Large heading in Anton font, responsive sizing */}
              <h1 className="font-grotesk uppercase text-[40px] sm:text-[60px] md:text-[75px] lg:text-[90px] text-cream leading-[1.05] md:leading-[1] tracking-tight">
                Beyond earth
                <br />
                and ( its ) familiar
                <br />
                boundaries
              </h1>

              {/* Overlaid cursive accent text in Condiment font, neon green, slightly rotated */}
              <span
                className="absolute right-0 bottom-1 sm:bottom-2 md:bottom-4 font-condiment text-neon text-[24px] sm:text-[32px] md:text-[40px] lg:text-[48px] -rotate-1 opacity-90 pointer-events-none select-none normal-case whitespace-nowrap"
                style={{ mixBlendMode: 'exclusion' }}
              >
                Ai companion
              </span>
            </div>

            {/* Social Icons (Mobile): Same 3 buttons but centered horizontally below the heading, shown only below lg breakpoint */}
            <div className="flex lg:hidden justify-center items-center gap-4 mt-10">
              <a
                href="mailto:hello@mimo.ai"
                aria-label="Email"
                className="liquid-glass rounded-[1rem] w-[56px] h-[56px] flex items-center justify-center text-cream hover:bg-white/10 hover:text-neon transition-all"
              >
                <MailIcon className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
                className="liquid-glass rounded-[1rem] w-[56px] h-[56px] flex items-center justify-center text-cream hover:bg-white/10 hover:text-neon transition-all"
              >
                <TwitterIcon className="w-5 h-5" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Github"
                className="liquid-glass rounded-[1rem] w-[56px] h-[56px] flex items-center justify-center text-cream hover:bg-white/10 hover:text-neon transition-all"
              >
                <GithubIcon className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Spacer */}
          <div className="w-full h-4" />
        </div>
      </section>

      {/* ========================================================
          SECTION 2: ABOUT / INTRO (Full viewport)
          ======================================================== */}
      <section
        id="about"
        className="relative w-full min-h-screen overflow-hidden flex flex-col justify-between"
      >
        {/* Full-bleed looping muted autoplaying video with object-cover */}
        <video
          className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
          autoPlay
          loop
          muted
          playsInline
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_151551_992053d1-3d3e-4b8c-abac-45f22158f411.mp4"
        />

        {/* Container: Same max-w-[1831px] centered, with generous vertical padding (64px-96px responsive) */}
        <div className="w-full max-w-[1831px] mx-auto px-6 sm:px-10 lg:px-16 py-16 sm:py-20 lg:py-24 flex flex-col justify-between min-h-screen relative z-10">
          {/* Top Row (flex row on desktop, column on mobile) */}
          <div className="w-full flex flex-col lg:flex-row lg:items-start justify-between gap-8 pt-6 sm:pt-12">
            {/* Left: Heading in Anton, responsive 32px-60px, uppercase */}
            <div className="relative inline-block">
              <h2 className="font-grotesk uppercase text-[32px] sm:text-[44px] md:text-[52px] lg:text-[60px] text-cream leading-[1.05] tracking-tight">
                Hello!
                <br />
                I'm mimo
              </h2>

              {/* Overlaid "Mimo" in Condiment cursive, neon green, mix-blend-exclusion, 36px-68px responsive, positioned absolute at bottom-right of heading, slightly rotated */}
              <span
                className="absolute right-0 -bottom-3 sm:-bottom-4 md:-bottom-5 lg:-bottom-6 font-condiment text-neon text-[36px] sm:text-[48px] md:text-[58px] lg:text-[68px] -rotate-2 select-none pointer-events-none normal-case"
                style={{ mixBlendMode: 'exclusion' }}
              >
                Mimo
              </span>
            </div>

            {/* Right: Short paragraph in monospace 14px-16px, uppercase, cream color, max-width 266px */}
            <p className="font-mono text-[14px] md:text-[16px] uppercase text-cream max-w-[266px] leading-relaxed tracking-wide">
              A personal AI companion beyond time and place. An exploration of thought, focus, and local autonomy
            </p>
          </div>

          {/* Bottom Row (flex row, space-between) */}
          <div className="w-full flex items-end justify-between pt-24 sm:pt-36 lg:pt-48 gap-8">
            {/* Left Column containing 2 identical paragraphs */}
            <div className="space-y-4 max-w-[340px]">
              <p className="font-mono text-[14px] md:text-[16px] uppercase opacity-10 text-cream leading-relaxed max-lg:text-[#010828]">
                A personal AI companion beyond time and place. An exploration of thought, focus, and local autonomy
              </p>
              <p className="font-mono text-[14px] md:text-[16px] uppercase opacity-10 text-cream leading-relaxed max-lg:text-[#010828]">
                A personal AI companion beyond time and place. An exploration of thought, focus, and local autonomy
              </p>
            </div>

            {/* Right Column containing 2 identical paragraphs. Hidden below lg. */}
            <div className="hidden lg:block space-y-4 max-w-[340px]">
              <p className="font-mono text-[14px] md:text-[16px] uppercase opacity-10 text-cream leading-relaxed">
                A personal AI companion beyond time and place. An exploration of thought, focus, and local autonomy
              </p>
              <p className="font-mono text-[14px] md:text-[16px] uppercase opacity-10 text-cream leading-relaxed">
                A personal AI companion beyond time and place. An exploration of thought, focus, and local autonomy
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 3: NFT COLLECTION GRID -> NEURAL MINI-BOTS
          ======================================================== */}
      <section
        id="collection"
        className="w-full bg-[#010828] py-20 sm:py-28 lg:py-36"
      >
        {/* Container: Same max-w-[1831px] centered */}
        <div className="w-full max-w-[1831px] mx-auto px-6 sm:px-10 lg:px-16">
          {/* Header Row */}
          <div className="w-full flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 sm:mb-16 lg:mb-20">
            {/* Left: Heading in Anton, 32px-60px responsive, uppercase */}
            <div>
              <h2 className="font-grotesk uppercase text-[32px] sm:text-[44px] md:text-[52px] lg:text-[60px] text-cream leading-[1.1] tracking-tight">
                Collection of
              </h2>
              {/* Where "Mimo" is in Condiment cursive neon green, and "BOTS" is in Anton. Indented with ml-12 / ml-24 / ml-32 responsive. */}
              <div className="ml-12 sm:ml-24 lg:ml-32 flex items-baseline gap-3 mt-1 sm:mt-2">
                <span className="font-condiment text-neon text-[34px] sm:text-[48px] md:text-[58px] lg:text-[68px] normal-case leading-none">
                  Mimo
                </span>
                <span className="font-grotesk uppercase text-[32px] sm:text-[44px] md:text-[52px] lg:text-[60px] text-cream leading-none">
                  BOTS
                </span>
              </div>
            </div>

            {/* Right: A "SEE ALL BOTS" button. "SEE" is large (32px-60px), "ALL" and "BOTS" are stacked smaller (20px-36px) next to it. Below the text is a neon green bar. */}
            <div
              onClick={() => {
                if (onOpenCreateBotModal) onOpenCreateBotModal();
                else if (onOpenWorkspace) onOpenWorkspace('bots');
              }}
              className="flex flex-col items-start md:items-end cursor-pointer group select-none"
            >
              <div className="flex items-center gap-3">
                <span className="font-grotesk text-[32px] sm:text-[44px] lg:text-[60px] uppercase text-cream leading-none tracking-tight">
                  SEE
                </span>
                <div className="flex flex-col font-grotesk text-[20px] sm:text-[26px] lg:text-[36px] uppercase leading-none tracking-tight text-cream">
                  <span>ALL</span>
                  <span>BOTS</span>
                </div>
              </div>
              <div className="w-full bg-neon h-[6px] sm:h-[8px] lg:h-[10px] mt-2 group-hover:opacity-90 transition-opacity" />
            </div>
          </div>

          {/* Card Grid: 3-column grid on desktop (lg:grid-cols-3), 2 on tablet, 1 on mobile. Gap 24px. */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {botsList.map((bot) => (
              <div
                key={bot.id}
                className="liquid-glass rounded-[32px] p-[18px] hover:bg-white/10 transition-colors duration-300 flex flex-col justify-between group"
              >
                {/* Inside each card: a square video container (pb-[100%] aspect ratio trick) with rounded-[24px] overflow hidden. Pure video, exact match! */}
                <div className="relative w-full pb-[100%] rounded-[24px] overflow-hidden bg-black/40">
                  <video
                    className="absolute inset-0 w-full h-full object-cover rounded-[24px]"
                    autoPlay
                    loop
                    muted
                    playsInline
                    src={bot.videoUrl}
                  />
                </div>

                {/* Bottom Overlay Bar: liquid-glass bar with rounded-[20px], px-5 py-4 */}
                <div className="liquid-glass rounded-[20px] px-5 py-4 mt-4 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[11px] text-cream/70 font-mono tracking-wider uppercase">
                      INTELLIGENCE SCORE:
                    </span>
                    <span className="text-[16px] text-cream font-grotesk uppercase font-bold tracking-wide mt-0.5">
                      {bot.score}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      if (onOpenChatWithBot) onOpenChatWithBot(bot.id);
                      else if (onOpenWorkspace) onOpenWorkspace('chat');
                    }}
                    aria-label={`Chat with ${bot.name}`}
                    className="w-[48px] h-[48px] rounded-full bg-gradient-to-br from-[#b724ff] to-[#7c3aed] flex items-center justify-center shadow-lg shadow-purple-500/50 hover:scale-110 active:scale-95 transition-all cursor-pointer flex-shrink-0"
                    title={`Open conversation with ${bot.name}`}
                  >
                    <svg
                      className="w-5 h-5 text-white transform transition-transform group-hover:translate-x-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 4: CTA / FINAL SECTION
          ======================================================== */}
      <section
        id="contact"
        className="relative w-full overflow-hidden bg-[#010828]"
      >
        {/* Background: Full-width video (NOT object-cover, instead w-full h-auto block so it displays at native aspect ratio) */}
        <video
          className="w-full h-auto block"
          autoPlay
          loop
          muted
          playsInline
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_055729_72d66327-b59e-4ae9-bb70-de6ccb5ecdb0.mp4"
        />

        {/* Text Content (positioned absolute over the video): Right-aligned block, offset with lg:pr-[20%] lg:pl-[15%] */}
        <div className="absolute inset-y-0 right-0 flex items-center justify-end w-full lg:pr-[20%] lg:pl-[15%] px-6 sm:px-10 pointer-events-none">
          <div className="relative text-right max-w-[900px] pointer-events-auto">
            {/* Small "Go beyond" text in Condiment cursive, neon green, mix-blend-exclusion, positioned absolute at top-left of the heading block. Sizes: 17px-68px responsive. */}
            <span
              className="absolute -top-3 sm:-top-7 md:-top-11 lg:-top-16 -left-3 sm:-left-6 md:-left-10 lg:-left-14 font-condiment text-neon text-[17px] sm:text-[32px] md:text-[48px] lg:text-[68px] normal-case select-none"
              style={{ mixBlendMode: 'exclusion' }}
            >
              Go beyond
            </span>

            {/* Heading in Anton, responsive 16px-60px, uppercase */}
            <h2 className="font-grotesk uppercase text-[16px] sm:text-[28px] md:text-[44px] lg:text-[60px] text-cream leading-[1.08] tracking-tight">
              {/* "JOIN MIMO." has extra bottom margin (mb-4 to mb-12 responsive) before the remaining lines. */}
              <div
                onClick={() => onOpenWorkspace && onOpenWorkspace('chat')}
                className="mb-4 sm:mb-8 lg:mb-12 cursor-pointer hover:text-neon transition-colors"
                title="Launch MIMO Companion"
              >
                JOIN MIMO.
              </div>
              <div>REVEAL WHAT'S HIDDEN.</div>
              <div>DEFINE WHAT'S NEXT.</div>
              <div>RUN 100% LOCALLY.</div>
            </h2>
          </div>
        </div>

        {/* Social Icons (Bottom-left, absolute positioned):
            Positioned at left-[8%], bottom-[12%] to bottom-[20%] with responsive breakpoints.
            A vertical liquid-glass container with rounded-[0.5rem] to rounded-[1.25rem] responsive, containing 3 stacked icon buttons (Mail, Twitter, Github).
            Buttons have responsive widths using viewport units and rem values (e.g., w-[14vw] sm:w-[14.375rem] md:w-[10.78125rem] lg:w-[16.77rem]) and similar responsive heights.
            Buttons are separated by border-b border-white/10 dividers (except the last one). */}
        <div className="absolute left-[8%] bottom-[12%] sm:bottom-[15%] lg:bottom-[20%] z-20">
          <div className="liquid-glass rounded-[0.5rem] sm:rounded-[0.875rem] lg:rounded-[1.25rem] flex flex-col overflow-hidden">
            <a
              href="mailto:hello@mimo.ai"
              aria-label="Email Mimo"
              className="w-[14vw] sm:w-[14.375rem] md:w-[10.78125rem] lg:w-[16.77rem] h-[14vw] sm:h-[4.5rem] md:h-[5rem] lg:h-[5.5rem] flex items-center justify-center text-cream hover:bg-white/10 hover:text-neon transition-colors border-b border-white/10"
            >
              <MailIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </a>

            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Twitter"
              className="w-[14vw] sm:w-[14.375rem] md:w-[10.78125rem] lg:w-[16.77rem] h-[14vw] sm:h-[4.5rem] md:h-[5rem] lg:h-[5.5rem] flex items-center justify-center text-cream hover:bg-white/10 hover:text-neon transition-colors border-b border-white/10"
            >
              <TwitterIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </a>

            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Github"
              className="w-[14vw] sm:w-[14.375rem] md:w-[10.78125rem] lg:w-[16.77rem] h-[14vw] sm:h-[4.5rem] md:h-[5rem] lg:h-[5.5rem] flex items-center justify-center text-cream hover:bg-white/10 hover:text-neon transition-colors"
            >
              <GithubIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
