"use client";
import React from "react";
import { motion } from "framer-motion";

export default function NavHeader() {
  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-[150] w-[95%] max-w-7xl flex items-center justify-between bg-black/60 backdrop-blur-2xl border border-white/10 px-6 py-2 rounded-2xl shadow-2xl"
    >
      <div className="flex items-center gap-4 group">
        <div className="relative p-[1px] rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-ts-blue via-ts-cyan to-ts-silver animate-spin_slow opacity-70"></div>
          <motion.div layoutId="main-logo" className="relative bg-black rounded-[11px] p-1 w-10 h-10 overflow-hidden flex items-center justify-center">
            <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover rounded-lg scale-110 group-hover:scale-125 transition-transform duration-700" />
          </motion.div>
        </div>
        <div className="flex flex-col">
          <span className="font-bold tracking-tighter text-white leading-none text-sm md:text-base">TECHSTRATIX</span>
          <span className="text-[7px] text-ts-cyan tracking-[0.4em] font-bold uppercase mt-1">Innovation Lab</span>
        </div>
      </div>

      <ul className="hidden md:flex gap-8 text-[10px] uppercase tracking-[0.3em] font-bold text-ts-silver/60">
        <li className="hover:text-white transition-colors cursor-pointer">Vision</li>
        <li className="hover:text-white transition-colors cursor-pointer">Beta</li>
        <li className="hover:text-white transition-colors cursor-pointer">Contact</li>
      </ul>

      <button className="bg-ts-blue/20 border border-ts-blue/50 hover:bg-ts-blue text-white px-5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all">
        S'inscrire
      </button>
    </motion.nav>
  );
}