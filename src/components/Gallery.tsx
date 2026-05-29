"use client";

import { motion } from "framer-motion";

const projects = [
  { id: 1, title: "Jeep Campaign", type: "Videography", size: "col-span-1 md:col-span-2 row-span-2", img: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=2070&auto=format&fit=crop" },
  { id: 2, title: "Renault Premiere", type: "Photography", size: "col-span-1 row-span-1", img: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=2000&auto=format&fit=crop" },
  { id: 3, title: "Geely Showcase", type: "Video Editing", size: "col-span-1 row-span-1", img: "https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=2000&auto=format&fit=crop" },
  { id: 4, title: "Night Run", type: "Cinematography", size: "col-span-1 row-span-2", img: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=2000&auto=format&fit=crop" },
  { id: 5, title: "Studio Light", type: "Photography", size: "col-span-1 md:col-span-2 row-span-1", img: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=2000&auto=format&fit=crop" },
];

export default function Gallery() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">Selected Works</h2>
        <p className="text-zinc-400 mb-10 max-w-xl">A curated collection of automotive photography and cinematic videography campaigns.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[250px]">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`group relative overflow-hidden rounded-2xl glass ${project.size}`}
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url('${project.img}')` }}
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300" />
              
              <div className="absolute inset-0 p-6 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/80 to-transparent">
                <span className="text-[#00ffcc] text-xs font-bold tracking-widest uppercase mb-1">{project.type}</span>
                <h3 className="text-white text-2xl font-bold">{project.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
