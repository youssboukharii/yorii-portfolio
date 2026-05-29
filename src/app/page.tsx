"use client";

import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useEffect, useState, ReactNode, useRef } from "react";
import Image from "next/image";
import { Camera, Film, MonitorPlay, Briefcase, Tv, Clapperboard, Newspaper, Sparkles } from "lucide-react";

/* ─────────────────────────────────────────────────────
   TILT CARD — localized 3D physics per card
─────────────────────────────────────────────────────── */
function TiltCard({ children, className }: { children: ReactNode; className?: string }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => { x.set(0); y.set(0); };

  const springX = useSpring(x, { stiffness: 300, damping: 30 });
  const springY = useSpring(y, { stiffness: 300, damping: 30 });
  const rotateX = useTransform(springY, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-8, 8]);

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={`relative ${className}`}
    >
      <div style={{ transform: "translateZ(30px)" }} className="h-full w-full relative z-10">
        {children}
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────
   SKILL PILL — glass pill with hover glow
─────────────────────────────────────────────────────── */
function Pill({ label, color = "white" }: { label: string; color?: string }) {
  const colorMap: Record<string, string> = {
    cyan:    "border-cyan-400/30 text-cyan-300 hover:border-cyan-400/60 hover:text-cyan-200",
    violet:  "border-violet-400/30 text-violet-300 hover:border-violet-400/60 hover:text-violet-200",
    amber:   "border-amber-400/30 text-amber-300 hover:border-amber-400/60 hover:text-amber-200",
    rose:    "border-rose-400/30 text-rose-300 hover:border-rose-400/60 hover:text-rose-200",
    emerald: "border-emerald-400/30 text-emerald-300 hover:border-emerald-400/60 hover:text-emerald-200",
    white:   "border-white/10 text-zinc-300 hover:border-white/25 hover:text-white",
  };
  return (
    <span className={`skill-pill border transition-all duration-200 ${colorMap[color] || colorMap.white}`}>
      {label}
    </span>
  );
}

/* ─────────────────────────────────────────────────────
   PAGE
─────────────────────────────────────────────────────── */
export default function Home() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-black flex flex-col items-center p-4 md:p-10" style={{ perspective: "2000px" }}>

      {/* ── Cinematic B&W Background ── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Image
          src="/bg.png"
          alt="Cinematic Background"
          fill
          sizes="100vw"
          className="object-cover opacity-40 grayscale contrast-125"
          priority
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000_90%)] opacity-85" />
        {/* Subtle color bloom */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_40%_at_50%_0%,rgba(124,58,237,0.08)_0%,transparent_70%)]" />
      </div>

      <div className="relative z-10 w-full max-w-7xl grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-5 auto-rows-fr">

        {/* ══════════════════════════════════════════════
            ROW 1-2 │ HERO
        ══════════════════════════════════════════════ */}

        {/* CARD 1 — Portrait Hero (2×2) */}
        <TiltCard className="md:col-span-2 md:row-span-2 iphone-glass rounded-[2.5rem] relative group cursor-default">
          <div className="absolute inset-0 z-0 transition-transform duration-1000 group-hover:scale-[1.03]">
            <Image
              src="/yorii.png"
              alt="YoRii — Youssef Boukhari"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-center"
              priority
            />
            {/* Bottom fade so text stays readable */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            {/* Left edge fade */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent" />
          </div>

          <div className="absolute bottom-0 left-0 p-8 md:p-12 z-10 w-full">
            {/* Live badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/50 backdrop-blur-xl border border-white/15 text-white text-[11px] font-bold tracking-widest uppercase mb-5 shadow-xl">
              <span className="dot-live" />
              Director of Photography
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-[0.9] mb-3">
              <span className="text-white">Youssef</span>
              <br />
              <span className="text-gradient">Boukhari</span>
            </h1>

            <p className="text-zinc-400 text-sm md:text-base leading-relaxed max-w-xs mt-3">
              8 years. 500K+ monthly readers.{" "}
              <span className="text-violet-300 font-semibold">Cinematic automotive</span>{" "}
              storytelling — Morocco&apos;s #1 auto media platform.
            </p>

            {/* Quick stat pills */}
            <div className="flex gap-2 mt-5 flex-wrap">
              <Pill label="1 800+ Videos" color="cyan" />
              <Pill label="Wandaloo.com" color="violet" />
              <Pill label="AI Creator" color="amber" />
            </div>
          </div>
        </TiltCard>

        {/* CARD 2 — Current Role (2×1) */}
        <TiltCard className="md:col-span-2 md:row-span-1 iphone-glass rounded-[2.5rem] p-8 md:p-10 flex flex-col justify-center relative">
          {/* Color bloom */}
          <div className="absolute right-0 top-0 w-72 h-72 rounded-full blur-3xl pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)" }} />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[11px] font-bold text-zinc-500 tracking-widest uppercase flex items-center gap-2">
                <Briefcase size={13} />
                <span className="text-cyan-400">Current Role</span>
              </h3>
              <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[11px] uppercase tracking-wider text-emerald-400 font-bold">
                Active
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3 tracking-tight">
              Automotive Creative Producer
            </h2>
            <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
              Photo · Video · AI Content @{" "}
              <span className="text-violet-300 font-bold">wandaloo.com</span>
              {" "}— Dec 2017 · Present.{" "}
              Directing high-end commercial content for{" "}
              <span className="text-amber-300 font-semibold">Jeep, Renault, Geely</span>{" "}
              and Morocco&apos;s top mobility brands.
            </p>
          </div>
        </TiltCard>

        {/* CARD 3 — Years (1×1) */}
        <TiltCard className="md:col-span-1 md:row-span-1 iphone-glass rounded-[2.5rem] p-8 flex flex-col justify-between">
          <div className="absolute inset-0 pointer-events-none rounded-[2.5rem]"
            style={{ background: "radial-gradient(ellipse at 80% 20%, rgba(34,211,238,0.12) 0%, transparent 70%)" }} />
          <div className="relative z-10 w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 shadow-inner">
            <Film size={22} className="text-cyan-400" />
          </div>
          <div className="relative z-10">
            <h3 className="text-5xl font-black text-white tracking-tighter mb-1">
              8<span className="text-2xl text-cyan-400">+</span>
            </h3>
            <p className="text-[11px] text-zinc-500 font-semibold uppercase tracking-widest">
              Years Active<br />in Industry
            </p>
          </div>
        </TiltCard>

        {/* CARD 4 — Reach (1×1) */}
        <TiltCard className="md:col-span-1 md:row-span-1 iphone-glass rounded-[2.5rem] p-8 flex flex-col justify-between">
          <div className="absolute inset-0 pointer-events-none rounded-[2.5rem]"
            style={{ background: "radial-gradient(ellipse at 80% 20%, rgba(167,139,250,0.12) 0%, transparent 70%)" }} />
          <div className="relative z-10 w-12 h-12 rounded-2xl bg-violet-500/10 flex items-center justify-center border border-violet-500/20 shadow-inner">
            <Camera size={22} className="text-violet-400" />
          </div>
          <div className="relative z-10">
            <h3 className="text-4xl font-black text-white tracking-tight mb-1">
              500K<span className="text-xl text-violet-400">+</span>
            </h3>
            <p className="text-[11px] text-zinc-500 font-semibold uppercase tracking-widest">
              Monthly Media<br />Reach
            </p>
          </div>
        </TiltCard>

        {/* ══════════════════════════════════════════════
            ROW 3 │ SKILLS RIBBON
        ══════════════════════════════════════════════ */}

        <TiltCard className="md:col-span-4 md:row-span-1 iphone-glass rounded-[2.5rem] p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative group cursor-default">
          <div className="absolute right-0 inset-y-0 w-1/3 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            style={{ background: "linear-gradient(to left, rgba(124,58,237,0.12), transparent)", filter: "blur(30px)" }} />

          <div className="flex-1 z-10 relative w-full">
            <div className="flex items-center justify-between w-full mb-5">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
                <Sparkles size={28} className="text-amber-400" />
                Cinematic Showreel
              </h2>
              <button className="hidden md:flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-full font-bold text-sm hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                <MonitorPlay size={16} /> Play Reel
              </button>
            </div>

            {/* Production skills */}
            <div className="flex flex-wrap gap-2 mb-3">
              {["Videography", "Photography", "Color Grading", "Visual Storytelling", "Concept Development"].map(s => (
                <Pill key={s} label={s} color="cyan" />
              ))}
            </div>
            {/* Software skills */}
            <div className="flex flex-wrap gap-2 mb-3">
              {["DaVinci Resolve", "Adobe Premiere Pro", "After Effects", "Avid Media Composer", "Final Cut Pro", "Photoshop"].map(s => (
                <Pill key={s} label={s} color="violet" />
              ))}
            </div>
            {/* AI / Strategy */}
            <div className="flex flex-wrap gap-2">
              {["AI Prompt Engineering", "Content Strategy", "Cinema 4D", "Automotive Media"].map(s => (
                <Pill key={s} label={s} color="amber" />
              ))}
            </div>
          </div>
        </TiltCard>

        {/* ══════════════════════════════════════════════
            ROW 4 │ EXPERIENCE HISTORY
        ══════════════════════════════════════════════ */}

        {/* CARD — wandaloo.com (2×1) */}
        <TiltCard className="md:col-span-2 md:row-span-1 iphone-glass rounded-[2.5rem] p-8 md:p-10 flex flex-col justify-center relative">
          <div className="absolute inset-0 pointer-events-none rounded-[2.5rem]"
            style={{ background: "radial-gradient(ellipse at 0% 100%, rgba(34,211,238,0.08) 0%, transparent 70%)" }} />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[11px] font-bold text-zinc-500 tracking-widest uppercase flex items-center gap-2">
                <Briefcase size={13} className="text-cyan-400" />
                <span className="text-cyan-400">wandaloo.com</span>
              </h3>
              <span className="px-2 py-1 rounded bg-cyan-500/10 text-[10px] uppercase tracking-wider text-cyan-400 border border-cyan-500/20">
                Dec 2017 – Present
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
              Automotive Creative Producer
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed">
              <span className="text-cyan-300 font-semibold">Photo · Video · AI Content.</span>{" "}
              1,800+ videos produced for Morocco&apos;s #1 auto media platform. Full pipeline ownership — concept, camera, color grade, final cut.
            </p>
          </div>
        </TiltCard>

        {/* CARD — Image Factory (1×1) */}
        <TiltCard className="md:col-span-1 md:row-span-1 iphone-glass rounded-[2.5rem] p-8 flex flex-col justify-between relative">
          <div className="absolute inset-0 pointer-events-none rounded-[2.5rem]"
            style={{ background: "radial-gradient(ellipse at 80% 0%, rgba(251,191,36,0.08) 0%, transparent 70%)" }} />
          <div className="relative z-10">
            <h3 className="text-[11px] font-bold text-zinc-500 tracking-widest uppercase flex items-center gap-2 mb-2">
              <Clapperboard size={13} className="text-amber-400" />
              <span className="text-amber-400">Image Factory</span>
            </h3>
            <span className="px-2 py-1 rounded bg-amber-500/10 text-[10px] uppercase tracking-wider text-amber-400 border border-amber-500/20">
              Nov 2016 – Feb 2017
            </span>
          </div>
          <div className="relative z-10 mt-4">
            <h2 className="text-lg font-bold text-white mb-1">Video Production</h2>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Editor · Cameraman · Sound.<br />Corporate & commercial video production internship.
            </p>
          </div>
        </TiltCard>

        {/* CARD — 2M TV (1×1) */}
        <TiltCard className="md:col-span-1 md:row-span-1 iphone-glass rounded-[2.5rem] p-8 flex flex-col justify-between relative">
          <div className="absolute inset-0 pointer-events-none rounded-[2.5rem]"
            style={{ background: "radial-gradient(ellipse at 80% 0%, rgba(251,113,133,0.08) 0%, transparent 70%)" }} />
          <div className="relative z-10">
            <h3 className="text-[11px] font-bold text-zinc-500 tracking-widest uppercase flex items-center gap-2 mb-2">
              <Tv size={13} className="text-rose-400" />
              <span className="text-rose-400">2M TV</span>
            </h3>
            <span className="px-2 py-1 rounded bg-rose-500/10 text-[10px] uppercase tracking-wider text-rose-400 border border-rose-500/20">
              Oct 2014 – Apr 2015
            </span>
          </div>
          <div className="relative z-10 mt-4">
            <h2 className="text-lg font-bold text-white mb-1">Video Editor</h2>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Broadcast editing on <span className="text-rose-300 font-semibold">Avid Media Composer</span> for national television.
            </p>
          </div>
        </TiltCard>

        {/* CARD — Press24 (2×1) */}
        <TiltCard className="md:col-span-2 md:row-span-1 iphone-glass rounded-[2.5rem] p-8 md:p-10 flex flex-col justify-center relative">
          <div className="absolute inset-0 pointer-events-none rounded-[2.5rem]"
            style={{ background: "radial-gradient(ellipse at 100% 50%, rgba(52,211,153,0.08) 0%, transparent 70%)" }} />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[11px] font-bold text-zinc-500 tracking-widest uppercase flex items-center gap-2">
                <Newspaper size={13} className="text-emerald-400" />
                <span className="text-emerald-400">Press24.mk</span>
              </h3>
              <span className="px-2 py-1 rounded bg-emerald-500/10 text-[10px] uppercase tracking-wider text-emerald-400 border border-emerald-500/20">
                Nov – Dec 2015
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-2">Video Editor Intern</h2>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Digital news editing using{" "}
              <span className="text-emerald-300 font-semibold">Final Cut Pro</span>.
              Foundational broadcast post-production experience.
            </p>
          </div>
        </TiltCard>

        {/* CARD — Education (2×1) */}
        <TiltCard className="md:col-span-2 md:row-span-1 iphone-glass rounded-[2.5rem] p-8 md:p-10 flex flex-col justify-center relative">
          <div className="absolute inset-0 pointer-events-none rounded-[2.5rem]"
            style={{ background: "radial-gradient(ellipse at 0% 50%, rgba(124,58,237,0.1) 0%, transparent 70%)" }} />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[11px] font-bold text-zinc-500 tracking-widest uppercase flex items-center gap-2">
                <Sparkles size={13} className="text-violet-400" />
                <span className="text-violet-400">Education</span>
              </h3>
              <span className="px-2 py-1 rounded bg-violet-500/10 text-[10px] uppercase tracking-wider text-violet-400 border border-violet-500/20">
                2011 – 2013
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-2">Audiovisuel & Caméra</h2>
            <p className="text-zinc-400 text-sm leading-relaxed">
              <span className="text-violet-300 font-semibold">INDH Sidi Moumen</span> — Formation spécialisée en audiovisuel et technique caméra.
            </p>
          </div>
        </TiltCard>

        {/* ══════════════════════════════════════════════
            ROW 5 │ CONTACT
        ══════════════════════════════════════════════ */}

        {/* CARD — Contact (Full Width) */}
        <ContactSection />

      </div>
    </main>
  );
}

/* ─────────────────────────────────────────────────────
   CONTACT SECTION
─────────────────────────────────────────────────────── */
type FormState = "idle" | "sending" | "success" | "error";

function ContactSection() {
  const [state, setState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    setErrorMsg("");

    const fd = new FormData(e.currentTarget);
    const name = fd.get("name") as string;
    const email = fd.get("email") as string;
    const message = fd.get("message") as string;

    try {
      // Try API route first
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      if (res.ok) {
        setState("success");
        formRef.current?.reset();
        return;
      }
      throw new Error("API failed");
    } catch {
      // Fallback: open mailto
      const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
      window.open(`mailto:youss.boukhari@gmail.com?subject=${subject}&body=${body}`, "_blank");
      setState("success");
      formRef.current?.reset();
    }
  }

  return (
    <TiltCard className="md:col-span-4 md:row-span-2 iphone-glass rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden">
      {/* Purple bloom */}
      <div className="absolute right-0 top-0 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-30"
        style={{ background: "radial-gradient(circle, rgba(124,58,237,0.25) 0%, transparent 70%)" }} />
      <div className="absolute left-0 bottom-0 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-20"
        style={{ background: "radial-gradient(circle, rgba(34,211,238,0.2) 0%, transparent 70%)" }} />

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-start">

        {/* Left — CTA copy */}
        <div className="flex flex-col justify-center">
          <h3 className="text-[11px] font-bold text-violet-400 tracking-widest uppercase flex items-center gap-2 mb-4">
            <span className="dot-live" style={{ background: "#a78bfa" }} />
            Let&apos;s Work Together
          </h3>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.05] mb-5">
            Got a project<br />
            <span className="text-gradient">in mind?</span>
          </h2>
          <p className="text-zinc-400 text-sm md:text-base leading-relaxed max-w-sm mb-8">
            Automotive content, cinematic video, AI-driven media pipelines — I&apos;m available for commercial collaborations, brand partnerships, and creative direction.
          </p>
          <div className="flex flex-col gap-3">
            <a href="mailto:youss.boukhari@gmail.com"
              className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
              youss.boukhari@gmail.com
            </a>
            <span className="inline-flex items-center gap-2 text-sm text-zinc-500">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              Casablanca, Morocco · Remote Available
            </span>
          </div>
        </div>

        {/* Right — Form */}
        <div className="w-full">
          {state === "success" ? (
            <div className="flex flex-col items-center justify-center text-center py-16 gap-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">Message Sent!</h3>
              <p className="text-zinc-400 text-sm">I&apos;ll get back to you within 24 hours.</p>
              <button
                onClick={() => setState("idle")}
                className="mt-2 text-sm text-violet-400 hover:text-violet-300 transition-colors"
              >
                Send another message →
              </button>
            </div>
          ) : (
            <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4" id="contact-form">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="contact-name" className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Name</label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    placeholder="Your name"
                    className="w-full bg-white/5 border border-white/10 border-t-white/20 rounded-2xl px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none focus:border-violet-500/50 focus:bg-white/8 transition-all duration-200 backdrop-blur-sm"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="contact-email" className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Email</label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    placeholder="your@email.com"
                    className="w-full bg-white/5 border border-white/10 border-t-white/20 rounded-2xl px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none focus:border-violet-500/50 focus:bg-white/8 transition-all duration-200 backdrop-blur-sm"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="contact-message" className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Message</label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={5}
                  placeholder="Tell me about your project..."
                  className="w-full bg-white/5 border border-white/10 border-t-white/20 rounded-2xl px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none focus:border-violet-500/50 focus:bg-white/8 transition-all duration-200 backdrop-blur-sm resize-none"
                />
              </div>
              {errorMsg && (
                <p className="text-rose-400 text-xs">{errorMsg}</p>
              )}
              <button
                id="contact-submit"
                type="submit"
                disabled={state === "sending"}
                className="w-full py-4 rounded-2xl font-bold text-sm tracking-wider transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: state === "sending"
                    ? "rgba(124,58,237,0.3)"
                    : "linear-gradient(135deg, #7c3aed 0%, #6d28d9 50%, #4c1d95 100%)",
                  boxShadow: state === "sending" ? "none" : "0 0 30px rgba(124,58,237,0.4), 0 0 60px rgba(124,58,237,0.15)",
                  color: "white",
                }}
              >
                {state === "sending" ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  "Send Message →"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </TiltCard>
  );
}
