"use client";

import { motion } from "framer-motion";
import { Briefcase, Calendar } from "lucide-react";

export default function Experience() {
  const experiences = [
    {
      role: "Videographer, Photographer & Editor",
      company: "wandaloo.com - le comparateur auto",
      period: "Present",
      description: "Directing, shooting, and editing high-end automotive content. Crafting storytelling for top-tier brands including Jeep, Renault, and Geely."
    },
    {
      role: "Freelance Director & Editor",
      company: "Independent",
      period: "8+ Years",
      description: "Delivering end-to-end media production, from conceptualization and cinematography to advanced post-production."
    }
  ];

  return (
    <section className="max-w-4xl mx-auto px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl md:text-5xl font-bold mb-12 text-white text-center">Professional Journey</h2>
        
        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-zinc-800 before:to-transparent">
          {experiences.map((exp, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.5 }}
              className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
            >
              {/* Timeline marker */}
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-zinc-800 bg-[#050505] text-[#00ffcc] shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <Briefcase size={16} />
              </div>
              
              {/* Card */}
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] glass-card p-6 rounded-2xl hover:border-zinc-700 transition-colors">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#00ffcc] uppercase tracking-wider mb-2">
                  <Calendar size={14} />
                  {exp.period}
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{exp.role}</h3>
                <h4 className="text-zinc-400 font-medium mb-4">{exp.company}</h4>
                <p className="text-sm text-zinc-500 leading-relaxed">{exp.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
