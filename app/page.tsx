"use client"

import React, { useRef, useEffect, useState, useCallback } from "react"
import { IntroAnimation, INTRO_DURATION_MS, HERO_REVEAL_MS } from "@/components/intro-animation"
import { PixelIcon } from "@/components/pixel-icon"
import { LiveAgentFeed } from "@/components/live-agent-feed"
import { RevealText } from "@/components/reveal-text"
import { StackingAgentCards } from "@/components/stacking-agent-cards"
import { MobileNav } from "@/components/mobile-nav"
import { DevExSection } from "@/components/devex-section"

// ─── Intersection Observer hook ──────────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold })
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

// ─── Animated counter ────────────────────────────────────────────────────────
function Counter({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const { ref, inView } = useInView()
  useEffect(() => {
    if (!inView) return
    let start = 0
    const duration = 1800
    const step = 16
    const increment = end / (duration / step)
    const timer = setInterval(() => {
      start += increment
      if (start >= end) { setCount(end); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, step)
    return () => clearInterval(timer)
  }, [inView, end])
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

// ─── Bento card ──────────────────────────────────────────────────────────────
function BentoCard({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, inView } = useInView(0.1)
  return (
    <div
      ref={ref}
      className={`group relative rounded-2xl border border-black/[0.07] bg-white overflow-hidden transition-all duration-700 hover:border-black/[0.15] hover:bg-[#fafaf8] ${className}`}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms, border-color 0.3s ease, background-color 0.3s ease`,
      }}
    >
      {/* Hover glow spot */}
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: "radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(0,0,0,0.03), transparent 60%)" }}
      />
      {children}
    </div>
  )
}

// ─── Pill tag ─────────────────────────────────────────────────────────────────
function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] tracking-widest font-sans text-black/40 bg-black/[0.04]">
      {children}
    </span>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function GlleamPage() {
  const [heroReady, setHeroReady] = useState(false)
  const [videoReady, setVideoReady] = useState(false)
  const handleIntroDone = useCallback(() => {
    setHeroReady(true)
  }, [])

  // Start video zoom slightly before hero content reveals, for seamless overlap
  useEffect(() => {
    const t = setTimeout(() => setVideoReady(true), HERO_REVEAL_MS)
    return () => clearTimeout(t)
  }, [])

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    el.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`)
    el.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`)
  }

  return (
    <div className="bg-[#F5F4F0] text-[#111] min-h-screen font-sans antialiased">

      {/* ── INTRO ANIMATION ───────────────────────────────────────────────── */}
      <IntroAnimation onDone={handleIntroDone} />

      {/* ── STICKY NAV ────────────────────────────────────────────────────── */}
      <MobileNav />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative h-screen overflow-hidden">

        {/* Video background — zooms in once intro is done */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
          src="/images/agentic-hero.mp4"
          style={{
            transform: videoReady ? "scale(1.05)" : "scale(0.85)",
            transition: "transform 2s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />



        {/* Progressive blur + light gradient rising from bottom */}
        <div className="absolute inset-x-0 bottom-0 z-10 pointer-events-none" style={{ height: "65%", background: "linear-gradient(to top, #F5F4F0 0%, #F5F4F0 18%, rgba(245,244,240,0.85) 35%, rgba(245,244,240,0.5) 55%, rgba(245,244,240,0.15) 75%, transparent 100%)" }} />
        {/* Backdrop blur layers — progressively lighter toward top */}
        <div className="absolute inset-x-0 bottom-0 z-10 pointer-events-none" style={{ height: "20%", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", maskImage: "linear-gradient(to top, black 0%, transparent 100%)", WebkitMaskImage: "linear-gradient(to top, black 0%, transparent 100%)" }} />
        <div className="absolute inset-x-0 bottom-0 z-10 pointer-events-none" style={{ height: "38%", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)", maskImage: "linear-gradient(to top, black 0%, transparent 100%)", WebkitMaskImage: "linear-gradient(to top, black 0%, transparent 100%)" }} />
        <div className="absolute inset-x-0 bottom-0 z-10 pointer-events-none" style={{ height: "55%", backdropFilter: "blur(2px)", WebkitBackdropFilter: "blur(2px)", maskImage: "linear-gradient(to top, black 0%, transparent 100%)", WebkitMaskImage: "linear-gradient(to top, black 0%, transparent 100%)" }} />

        {/* Spacer so hero content doesn't sit under the fixed nav */}
        <div className="h-20" />

        {/* Title + principles — anchored to bottom left */}
        <div className="absolute inset-x-0 bottom-0 z-30 flex flex-col px-6 md:px-12 pb-12 max-w-3xl">
          {/* Glass card for title + supporting copy */}
          <div className="rounded-2xl p-6 md:p-8 mb-8" style={{ background: "rgba(255,255,255,0.50)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}>
            <h1
            className="text-5xl sm:text-6xl md:text-7xl font-light text-[#111] leading-[1.0] tracking-tight mb-6"
            style={{
              fontFamily: '"IBM Plex Sans", sans-serif',
              opacity: heroReady ? 1 : 0,
              filter: heroReady ? "blur(0px)" : "blur(24px)",
              transform: heroReady ? "translateY(0px)" : "translateY(32px)",
              transition: "opacity 1s cubic-bezier(0.16,1,0.3,1) 0ms, filter 1s cubic-bezier(0.16,1,0.3,1) 0ms, transform 1s cubic-bezier(0.16,1,0.3,1) 0ms",
            }}
          >
            Discover who AI recommends
          </h1>

          {/* Supporting copy + CTAs */}
          <div
            style={{
              opacity: heroReady ? 1 : 0,
              filter: heroReady ? "blur(0px)" : "blur(16px)",
              transform: heroReady ? "translateY(0px)" : "translateY(20px)",
              transition: "opacity 0.8s cubic-bezier(0.16,1,0.3,1) 120ms, filter 0.8s cubic-bezier(0.16,1,0.3,1) 120ms, transform 0.8s cubic-bezier(0.16,1,0.3,1) 120ms",
            }}
          >
            <p className="text-sm sm:text-base text-black/50 leading-relaxed max-w-md mb-8">
              Buyers are asking AI assistants which products to consider before they visit vendor websites. GLLEAM reveals why competitors enter those recommendations, turns visibility gaps into controlled marketing experiments, and measures whether the changes create qualified pipeline.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 mb-6">
              <a href="/apply" className="px-6 py-3 bg-[#111] text-white text-xs rounded-xl hover:bg-[#333] transition-colors tracking-widest font-medium text-center">
                APPLY FOR A DESIGN-PARTNER PILOT
              </a>
              <a href="#workflow" className="px-6 py-3 border border-black/15 text-black/60 text-xs rounded-xl hover:border-black/30 hover:text-black hover:bg-black/[0.03] transition-all tracking-widest font-medium text-center">
                SEE HOW GLLEAM WORKS
              </a>
            </div>
            <p className="text-xs text-black/35 tracking-wide mb-8">
              Built for growth, SEO, content, product-marketing, and digital-PR teams.
            </p>
          </div>

          </div>

          {/* 3 product principles — staggered after copy */}
          <div className="flex gap-8 sm:gap-12">
            {[
              { value: "REPEATED", label: "Observations" },
              { value: "SOURCE-LEVEL", label: "Diagnosis" },
              { value: "PIPELINE-LINKED", label: "Attribution" },
            ].map((stat, i) => (
              <div
                key={i}
                style={{
                  opacity: heroReady ? 1 : 0,
                  filter: heroReady ? "blur(0px)" : "blur(16px)",
                  transform: heroReady ? "translateY(0px)" : "translateY(20px)",
                  transition: `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${200 + i * 80}ms, filter 0.8s cubic-bezier(0.16,1,0.3,1) ${200 + i * 80}ms, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${200 + i * 80}ms`,
                }}
              >
                <div className="text-base sm:text-lg text-[#111] font-light tracking-tight" style={{ fontFamily: '"IBM Plex Sans", sans-serif' }}>{stat.value}</div>
                <div className="text-xs text-black/40 tracking-widest uppercase mt-1" style={{ fontFamily: '"IBM Plex Sans", sans-serif' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLATFORM OVERVIEW (bento) ──────────────────────────────────────── */}
      <section id="platform" className="py-32 px-6 md:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <PixelIcon type="platform" size={40} />
            <div className="mt-4"><Tag>PRODUCT</Tag></div>
            <RevealText className="mt-5 text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-[1.05]">
              {"Everything you need\nto turn visibility into evidence."}
            </RevealText>
          </div>

          <div className="grid grid-cols-12 grid-rows-auto gap-3" onMouseMove={handleMouse}>
            {/* Big left card — full width now that multi-agent is removed */}
            <BentoCard className="col-span-12 p-8 min-h-[340px] flex flex-col justify-between relative overflow-hidden" delay={0}>
              {/* Arc background image — always fills container, objects pushed to bottom third */}
              <img
                src="/images/arc.webp"
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ objectPosition: "center 70%" }}
              />
              {/* Progressive blur layer — blurs from 45% downward */}
              <div className="absolute inset-0" style={{
                maskImage: "linear-gradient(to bottom, transparent 45%, black 100%)",
                WebkitMaskImage: "linear-gradient(to bottom, transparent 45%, black 100%)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
              }} />
              {/* Fade-to-background gradient — matches site bg color #f5f4f0 */}
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(to bottom, transparent 35%, rgba(245,244,240,0.3) 50%, rgba(245,244,240,0.75) 65%, rgba(245,244,240,0.95) 80%, rgb(245,244,240) 100%)",
                }}
              />
              {/* Content */}
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-xl border border-black/10 bg-white/60 flex items-center justify-center mb-6" style={{ backdropFilter: "blur(8px)" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/><path d="m4.93 4.93 2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12"/></svg>
                </div>
                <h3 className="text-xl font-light mb-3">Observe the buyer journey</h3>
                <p className="text-sm text-black/45 leading-relaxed max-w-sm">
                  Track where your brand is recommended, mentioned, cited, omitted, or misrepresented across commercially important buyer questions.
                </p>
              </div>
            </BentoCard>

            {/* Bottom row */}
            <BentoCard className="col-span-12 md:col-span-4 p-8 min-h-[200px]" delay={120}>
              <div className="w-10 h-10 rounded-xl border border-black/10 flex items-center justify-center mb-5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
              </div>
              <h3 className="text-lg font-light mb-2">Diagnose the evidence gap</h3>
              <p className="text-sm text-black/45 leading-relaxed">Identify the competitor claims, owned pages, third-party sources, comparisons, and documentation influencing AI-generated answers.</p>
            </BentoCard>

            <BentoCard className="col-span-12 md:col-span-4 p-8 min-h-[200px]" delay={160}>
              <div className="w-10 h-10 rounded-xl border border-black/10 flex items-center justify-center mb-5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 10h8M8 14h5"/></svg>
              </div>
              <h3 className="text-lg font-light mb-2">Run controlled experiments</h3>
              <p className="text-sm text-black/45 leading-relaxed">Turn each finding into a measurable hypothesis with a treatment, baseline, target prompt group, control group, and observation period.</p>
            </BentoCard>

            <BentoCard className="col-span-12 md:col-span-4 p-8 min-h-[200px]" delay={200}>
              <div className="w-10 h-10 rounded-xl border border-black/10 flex items-center justify-center mb-5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <h3 className="text-lg font-light mb-2">Attribute commercial impact</h3>
              <p className="text-sm text-black/45 leading-relaxed">Connect changes in AI discovery to qualified traffic, demo requests, assisted conversions, opportunities, and pipeline where data is available.</p>
            </BentoCard>
          </div>
        </div>
      </section>

      {/* ── BUILD YOUR AGENTS (4 cards) ───────────────────────────────────── */}
      <section id="agents" className="py-32 px-6 md:px-12 lg:px-20 border-t border-black/[0.06]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
            <div>
              <PixelIcon type="agents" size={40} />
              <div className="mt-4"><Tag>PRODUCT MODULES</Tag></div>
              <RevealText className="mt-5 text-4xl md:text-5xl font-light tracking-tight leading-[1.05]">
                {"Four connected layers.\nOne evidence loop."}
              </RevealText>
            </div>
            <p className="text-sm text-black/45 leading-relaxed max-w-xs">
              GLLEAM moves beyond monitoring by connecting buyer intent, repeated observations, evidence analysis, and controlled experimentation in one auditable workflow.
            </p>
          </div>

          <StackingAgentCards />
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────────────── */}
      <section id="workflow" className="py-32 px-6 md:px-12 lg:px-20 border-t border-black/[0.06] overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <PixelIcon type="workflow" size={40} />
            <div className="mt-4"><Tag>EVIDENCE LOOP</Tag></div>
            <RevealText className="mt-5 text-4xl md:text-5xl font-light tracking-tight leading-[1.05]">
              {"From buyer question\nto measurable outcome."}
            </RevealText>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3" onMouseMove={handleMouse}>
            {[
              { n: "01", title: "Define the buyer journey",  desc: "Identify the high-value recommendation, comparison, alternative, integration, and category questions that influence customer shortlists.", delay: 0,   img: "/images/define.webp" },
              { n: "02", title: "Observe and diagnose", desc: "Run repeated observations, compare competitors, extract cited sources, and identify the claims or evidence gaps shaping the answer.", delay: 80,  img: "/images/compose.webp" },
              { n: "03", title: "Intervene and experiment",    desc: "Implement a focused treatment such as improving product evidence, updating documentation, correcting a third-party profile, or strengthening a comparison page.", delay: 140, img: "/images/test.webp" },
              { n: "04", title: "Measure business impact",  desc: "Compare the treatment against its baseline and control group, then connect the result to qualified engagement and pipeline where possible.", delay: 200, img: "/images/deploy.webp" },
            ].map((step) => (
              <BentoCard key={step.n} className="relative overflow-hidden flex flex-col min-h-[320px]" delay={step.delay}>
                {/* Image at top — mask fades it out strongly before the bottom edge */}
                <div className="absolute inset-x-0 top-0 h-56 pointer-events-none">
                  <img
                    src={step.img}
                    alt={step.title}
                    className="w-full h-full object-cover object-top"
                    style={{
                      maskImage: "linear-gradient(to bottom, black 0%, black 30%, transparent 80%)",
                      WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 30%, transparent 80%)",
                    }}
                  />
                </div>
                {/* Number top-left */}
                <div className="relative z-10 p-7">
                  <span className="font-pixel text-[11px] text-black/20 tracking-widest block">{step.n}</span>
                </div>
                {/* Text pushed further down */}
                <div className="relative z-10 px-7 pb-7 mt-auto pt-16">
                  <h3 className="text-2xl font-light mb-3">{step.title}</h3>
                  <p className="text-sm text-black/45 leading-relaxed">{step.desc}</p>
                </div>
              </BentoCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── INTEGRATIONS ──────────────────────────────────────────────────── */}
      <section id="integrations" className="py-32 px-6 md:px-12 lg:px-20 border-t border-black/[0.06]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
            <div>
              <PixelIcon type="integrations" size={40} />
              <div className="mt-4"><Tag>EVIDENCE GRAPH</Tag></div>
              <RevealText className="mt-5 text-4xl md:text-5xl font-light tracking-tight leading-[1.05]">
                {"Connect AI recommendations\nto the evidence behind them."}
              </RevealText>
            </div>
            <p className="text-sm text-black/45 leading-relaxed max-w-sm">
              A visibility score can show that a competitor appears more often. It cannot explain what the marketing team should do next. GLLEAM traces recurring recommendations back to specific claims, pages, citations, and third-party sources, then converts the gap into a testable intervention.
            </p>
          </div>

          {/* Full-width image block with glass cards */}
          {/* Mobile: flex-col, image + cards stacked. Desktop: image fills block, cards absolute */}
          <div className="rounded-2xl overflow-hidden border border-black/[0.07] flex flex-col md:block md:relative" onMouseMove={handleMouse}>
            {/* Image */}
            <div className="relative w-full h-[280px] md:h-[560px] shrink-0">
              <img
                src="/images/Org Arc - Upscaled.webp"
                alt="Agent orchestration architecture"
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
            </div>

            {/* Cards — flex row on mobile (equal spacing), absolute on desktop */}
            <div className="flex flex-col gap-3 p-4 md:absolute md:bottom-4 md:right-4 md:p-0 md:w-72">
              <div
                className="rounded-xl border border-white/50 p-6"
                style={{
                  backdropFilter: "blur(24px)",
                  WebkitBackdropFilter: "blur(24px)",
                  background: "rgba(255,255,255,0.60)",
                }}
              >
                <Tag>EVIDENCE MAP</Tag>
                <h3 className="mt-3 text-lg font-light mb-2">Build an auditable source and claim map</h3>
                <p className="text-xs text-black/45 leading-relaxed mb-4">Connect every finding to its buyer question, evidence, competitor claim, treatment, and measurement plan.</p>
                <div className="bg-black/[0.05] rounded-lg border border-black/[0.07] p-3 font-mono text-[10px] text-black/50 leading-relaxed whitespace-pre-wrap">
                  <span className="text-black/25"># illustrative example</span>{"\n"}
                  <span className="text-amber-700/70">buyer_question</span>:{"\n"}
                  {"  "}<span className="text-green-700/70">&quot;Best compliance automation platforms?&quot;</span>{"\n"}
                  <span className="text-amber-700/70">observation</span>:{"\n"}
                  {"  "}<span className="text-blue-600/70">brand_inclusion</span>: <span className="text-green-700/70">&quot;21%&quot;</span>{"\n"}
                  {"  "}<span className="text-blue-600/70">competitor_a</span>: <span className="text-green-700/70">&quot;63%&quot;</span>{"\n"}
                  <span className="text-amber-700/70">recommended_experiment</span>:{"\n"}
                  {"  "}<span className="text-black/35">- update compliance page</span>{"\n"}
                  {"  "}<span className="text-black/35">- add implementation evidence</span>{"\n"}
                  {"  "}<span className="text-black/35">- correct third-party comparison</span>
                </div>
                <p className="mt-3 text-[10px] text-black/30 leading-relaxed">Illustrative example — actual findings depend on the customer, category, sources, and selected AI surfaces.</p>
              </div>


            </div>
          </div>
        </div>
      </section>

      {/* ── SECURITY & OBSERVABILITY ──────────────────────────────────��──── */}
      <section id="security" className="py-32 px-6 md:px-12 lg:px-20 border-t border-black/[0.06]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <PixelIcon type="platform" size={40} />
            <div className="mt-4"><Tag>METHODOLOGY</Tag></div>
            <RevealText className="mt-5 text-4xl md:text-5xl font-light tracking-tight leading-[1.05]">
              {"AI discovery measurement\nwithout false certainty."}
            </RevealText>
          </div>

          {/* Asymmetric grid: left text + title, right interactive audit log */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left side — descriptions */}
            <div className="space-y-6">
              <p className="text-sm text-black/45 leading-relaxed">
                AI answers vary across prompts, models, geography, language, and time. GLLEAM makes that uncertainty visible instead of hiding it behind a single deterministic score.
              </p>

              <div className="space-y-4">
                {[
                  { label: "Repeated observations", desc: "One answer is anecdotal. Repeated runs and prompt paraphrases reveal whether a recommendation pattern is stable or incidental." },
                  { label: "Surface-level transparency", desc: "An API result may not reproduce a consumer-facing application. Every observation records how and where it was collected." },
                  { label: "Treatment and control groups", desc: "Before-and-after movement is not automatically causal. GLLEAM uses baselines and untreated prompt groups where practical." },
                  { label: "Auditable records", desc: "Every conclusion remains connected to its prompt, answer, sources, collection context, experiment treatment, result, and interpretation." },
                ].map((item) => (
                  <div key={item.label} className="flex gap-4">
                    <div className="w-1 bg-black/10 rounded-full shrink-0" />
                    <div>
                      <h3 className="text-sm font-light mb-1">{item.label}</h3>
                      <p className="text-xs text-black/35">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Methodology labels — vertical stack */}
              <div className="pt-4 flex flex-col gap-2">
                {["PROMPT CLUSTERS", "REPEATED RUNS", "CONTROL GROUPS", "CONFIDENCE RANGES"].map((badge) => (
                  <div key={badge} className="flex items-center gap-2 text-xs text-black/25">
                    <span className="w-1 h-1 rounded-full bg-black/25" />
                    {badge}
                  </div>
                ))}
              </div>
            </div>

            {/* Right side — live audit log visualization */}
            <BentoCard className="p-6 lg:row-span-1" delay={0}>
              <div className="text-xs text-black/30 tracking-widest uppercase mb-4">Observation Record</div>
              <div className="space-y-2">
                {[
                  { time: "12:34:21", action: "observation_collected", status: "success" },
                  { time: "12:34:18", action: "citations_extracted", status: "success" },
                  { time: "12:34:15", action: "competitor_claim_mapped", status: "success" },
                  { time: "12:34:12", action: "evidence_gap_identified", status: "success" },
                  { time: "12:34:09", action: "experiment_blueprint_created", status: "success" },
                ].map((log, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-black/[0.02] hover:bg-black/[0.04] transition-colors border border-black/[0.04] group cursor-pointer"
                    style={{
                      animation: `fadeInUp 0.5s cubic-bezier(0.16,1,0.3,1) ${i * 80}ms both`,
                    }}
                  >
                    <span className="text-[10px] text-black/25 font-mono min-w-[60px]">{log.time}</span>
                    <span className="text-[11px] text-black/50 font-light flex-1">{log.action}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500/60 group-hover:bg-green-500 transition-colors" />
                  </div>
                ))}
              </div>
              <style>{`
                @keyframes fadeInUp {
                  from { opacity: 0; transform: translateY(8px); }
                  to { opacity: 1; transform: translateY(0); }
                }
              `}</style>
            </BentoCard>
          </div>
        </div>
      </section>

      {/* ── DEVELOPER EXPERIENCE ──────────────────────────────────────────── */}
      <DevExSection />

      {/* ── MARQUEE CAPABILITIES ──────────────────────────────────────────── */}
      <section className="py-0 border-t border-black/[0.06] overflow-hidden select-none">
        <div className="flex border-b border-black/[0.06]" style={{ animation: "marqueeLeft 28s linear infinite" }}>
          {[...Array(3)].map((_, rep) => (
            <div key={rep} className="flex shrink-0">
              {["Category Recommendations", "Competitor Comparisons", "Narrative Accuracy", "Integration Discovery", "Content Prioritization", "Digital PR Prioritization"].map((cap) => (
                <div key={cap} className="flex items-center gap-6 px-10 py-5 border-r border-black/[0.06] shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-black/20 shrink-0" />
                  <span className="text-sm text-black/45 whitespace-nowrap tracking-wide">{cap}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="flex" style={{ animation: "marqueeRight 22s linear infinite" }}>
          {[...Array(3)].map((_, rep) => (
            <div key={rep} className="flex shrink-0">
              {["Expansion Research", "Commercial Attribution", "Source Influence", "Buyer-Intent Analysis", "Comparison Pages", "Product Positioning"].map((cap) => (
                <div key={cap} className="flex items-center gap-6 px-10 py-5 border-r border-black/[0.06] shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-black/12 shrink-0" />
                  <span className="text-sm text-black/30 whitespace-nowrap tracking-wide">{cap}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ── LIVE AGENTS ��──────────────────────────────────────────────────── */}
      <section id="live" className="py-32 px-6 md:px-12 lg:px-20 border-t border-black/[0.06]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <PixelIcon type="agents" size={40} />
              <div className="mt-4"><Tag>ILLUSTRATIVE ANALYSIS</Tag></div>
              <RevealText className="mt-5 text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-[1.05]">
                {"One buyer question.\nA complete evidence trail."}
              </RevealText>
              <p className="mt-6 text-base text-black/40 leading-relaxed max-w-sm">
                GLLEAM does not stop at reporting whether a brand appeared. It identifies what repeatedly supports the winning recommendation, what is missing, and which intervention can be tested.
              </p>
              <div className="mt-10 flex items-end gap-3">
                <span style={{ fontFamily: "monospace", fontSize: "clamp(3rem, 6vw, 5rem)", fontWeight: 300, color: "rgba(0,0,0,0.85)", lineHeight: 1, letterSpacing: "-0.02em" }}>4</span>
                <span className="text-black/30 text-sm mb-1 tracking-wide">evidence gaps identified</span>
              </div>
              <div className="mt-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] tracking-widest font-sans text-black/40 bg-black/[0.04]">ILLUSTRATIVE EXAMPLE</span>
              </div>
            </div>
            <div className="relative">
              <LiveAgentFeed />
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING ───────────────────────────────────���────������─────────────── */}
      <section id="pricing" className="py-32 px-6 md:px-12 lg:px-20 border-t border-black/[0.06]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8 flex flex-col items-center">
            <PixelIcon type="pricing" size={40} />
            <div className="mt-4"><Tag>DESIGN PARTNERS</Tag></div>
            <RevealText className="mt-5 text-4xl md:text-5xl font-light tracking-tight leading-[1.05]">
              {"A structured pilot for teams\nready to test one meaningful intervention."}
            </RevealText>
          </div>
          <p className="text-sm text-black/45 leading-relaxed max-w-xl mx-auto text-center mb-16">
            GLLEAM is working with a focused group of B2B SaaS marketing teams to validate its observation, diagnosis, experimentation, and attribution workflow.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3" onMouseMove={handleMouse}>
            {[
              {
                name: "Your baseline",
                sub: "Understand the current AI discovery landscape",
                features: ["Customer-specific buyer-intent prompt panel", "Brand and competitor baseline", "Recommendation and citation analysis", "Narrative-accuracy review", "Source and claim mapping"],
                action: "PILOT FOUNDATION",
                cta: false,
                delay: 0,
              },
              {
                name: "Your experiment",
                sub: "Turn one important gap into a measurable test",
                features: ["Prioritized evidence gap", "Proposed treatment", "Target and control prompt groups", "Baseline and measurement period", "Post-intervention observations", "Results interpretation"],
                action: "CORE PILOT",
                cta: false,
                highlight: true,
                delay: 80,
              },
              {
                name: "Your partnership",
                sub: "Help shape the product around real decisions",
                features: ["Direct access to the founding team", "Collaborative experiment review", "Influence over product priorities", "Commercial attribution where data permits", "Optional anonymized research participation"],
                action: "APPLY FOR A PILOT",
                cta: true,
                delay: 140,
              },
            ].map((plan) => (
              <BentoCard
                key={plan.name}
                className={`p-8 flex flex-col ${plan.highlight ? "border-black/20 bg-[#F0EEE8]" : ""}`}
                delay={plan.delay}
              >
                <div className="mb-8">
                  <div className="text-xl font-light mb-2">{plan.name}</div>
                  <p className="text-xs text-black/35 tracking-wide leading-relaxed">{plan.sub}</p>
                </div>
                <ul className="space-y-3 flex-1 mb-8">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-3 text-sm text-black/55">
                      <div className="w-1 h-1 rounded-full bg-black/25 shrink-0 mt-2" />
                      {f}
                    </li>
                  ))}
                </ul>
                {plan.cta ? (
                  <a href="/apply" className="w-full py-3 rounded-xl text-sm tracking-widest transition-all duration-200 text-center bg-[#111] text-white hover:bg-[#333]">
                    {plan.action}
                  </a>
                ) : (
                  <div className={`w-full py-3 rounded-xl text-xs tracking-widest text-center ${plan.highlight ? "bg-black/[0.06] text-black/50" : "border border-black/10 text-black/40"}`}>
                    {plan.action}
                  </div>
                )}
              </BentoCard>
            ))}
          </div>

          <p className="text-xs text-black/35 leading-relaxed max-w-2xl mx-auto text-center mt-10">
            The pilot suits B2B SaaS companies with an established SEO, content, or product-marketing program and the ability to implement one focused intervention. GLLEAM measures and tests observed AI-discovery outcomes — it does not guarantee placement by any third-party AI system.
          </p>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="relative py-32 px-6 md:px-12 lg:px-20 border-t border-black/[0.06] overflow-hidden">
        {/* Glass panels image — anchored to bottom center */}
        <img
          src="/images/footer.webp"
          alt=""
          aria-hidden="true"
          className="absolute bottom-0 left-0 w-full object-cover object-bottom pointer-events-none select-none"
          style={{ opacity: 0.85 }}
        />
        {/* Progressive blur from bottom — blends into site bg */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            maskImage: "linear-gradient(to top, transparent 0%, black 55%)",
            WebkitMaskImage: "linear-gradient(to top, transparent 0%, black 55%)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
          }}
        />
        {/* Colour fade from bottom to site bg #f5f4f0 */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(to top, rgb(245,244,240) 0%, rgba(245,244,240,0.92) 18%, rgba(245,244,240,0.55) 35%, transparent 55%)",
          }}
        />
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <div className="mb-5 flex justify-center"><Tag>FROM VISIBILITY TO EVIDENCE</Tag></div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-[1.05] mb-6">
            Stop guessing what will make<br />AI recommend your brand.
          </h2>
          <p className="text-sm text-black/45 leading-relaxed mb-10 max-w-lg mx-auto">
            Find the recommendation gaps that matter, understand the evidence behind them, and test the interventions most likely to create commercial impact.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <a
              href="/apply"
              className="px-8 py-3 bg-[#111] text-white text-xs rounded-xl hover:bg-[#333] transition-colors tracking-widest font-medium"
            >
              APPLY FOR A DESIGN-PARTNER PILOT
            </a>
            <a
              href="#security"
              className="px-8 py-3 border border-black/15 text-black/60 text-xs rounded-xl hover:border-black/30 hover:text-black hover:bg-black/[0.03] transition-all tracking-widest font-medium"
            >
              VIEW THE METHODOLOGY
            </a>
          </div>
        </div>
      </section>


      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="py-10 px-6 md:px-12 lg:px-20 border-t border-black/[0.06]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <span className="flex items-center gap-2 font-pixel text-xs tracking-[0.25em] text-black/50"><img src="/images/logo.svg" alt="" className="h-4 opacity-50" />GLLEAM</span>

          {/* Product links */}
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
            {[
              { label: "Product",        href: "#platform" },
              { label: "Evidence Loop",  href: "#workflow" },
              { label: "Methodology",    href: "#security" },
              { label: "Design Partners", href: "#pricing" },
            ].map(l => (
              <a key={l.label} href={l.href} className="text-xs text-black/35 hover:text-black/70 transition-colors tracking-widest">{l.label}</a>
            ))}
          </div>

          {/* Legal links */}
          <div className="flex items-center gap-6">
            {[
              { label: "Privacy", href: "#" },
              { label: "Terms",   href: "#" },
            ].map(l => (
              <a key={l.label} href={l.href} className="text-xs text-black/25 hover:text-black/55 transition-colors tracking-widest">{l.label}</a>
            ))}
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-black/[0.04] flex flex-col gap-4">
          <p className="text-xs text-black/40 leading-relaxed max-w-3xl">
            GLLEAM helps B2B marketing teams identify why AI assistants recommend competitors, turn evidence gaps into controlled experiments, and measure the resulting commercial impact.
          </p>
          <p className="text-[11px] text-black/25 leading-relaxed max-w-3xl">
            GLLEAM is an independent platform. It is not affiliated with or endorsed by OpenAI, Google, Anthropic, Perplexity, or other third-party AI providers. Third-party product and company names are trademarks of their respective owners.
          </p>
          <span className="text-xs text-black/20">© {new Date().getFullYear()} GLLEAM. All rights reserved.</span>
        </div>
      </footer>
    </div>
  )
}
