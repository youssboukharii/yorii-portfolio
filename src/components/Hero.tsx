"use client";

import { motion } from "framer-motion";
import { Camera, Film, MonitorPlay } from "lucide-react";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-20 pb-10 px-6 overflow-hidden">
      
      {/* Liquid Glass Blobs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 opacity-30 pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-[#00ffcc] rounded-full mix-blend-screen filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-[#8a2be2] rounded-full mix-blend-screen filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-[#ff00cc] rounded-full mix-blend-screen filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="glass-card w-full max-w-5xl p-8 md:p-16 text-center relative z-10 flex flex-col md:flex-row items-center gap-12"
      >
        {/* Cinematic Portrait */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="relative w-64 h-80 md:w-80 md:h-96 rounded-2xl overflow-hidden shrink-0 border border-white/10 shadow-[0_0_50px_rgba(0,255,204,0.15)]"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10"></div>
          <Image 
            src="/yorii.png" 
            alt="YoRii - Videographer & Photographer" 
            fill 
            className="object-cover"
            priority
          />
        </motion.div>

        {/* Text Content */}
        <div className="flex-1 text-left">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6 text-[#00ffcc] text-sm font-semibold tracking-wider uppercase"
          >
            <span className="w-2 h-2 rounded-full bg-[#00ffcc] animate-pulse" />
            Liquid Glass Aesthetic
          </motion.div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-4 text-gradient">
            Youssef Boukhari
          </h1>
          
          <p className="text-lg md:text-xl text-zinc-400 mb-8 leading-relaxed max-w-xl">
            Photographer and director with over 8 years in the industry. Specialized in high-end automotive media for Jeep, Renault, and Geely.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: Film, title: "Videography", desc: "Cinematic production" },
              { icon: Camera, title: "Photography", desc: "Automotive & portrait" }
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1, duration: 0.6 }}
                className="glass p-4 rounded-xl flex items-center gap-4 hover:bg-white/5 transition-colors cursor-default"
              >
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#00ffcc] shrink-0">
                  <item.icon size={20} />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">{item.title}</h3>
                  <p className="text-xs text-zinc-500">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
