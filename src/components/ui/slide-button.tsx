"use client"
import React, { forwardRef, useState } from "react"
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion"
import { SendHorizontal, Loader2, Check, AlertCircle, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export const SlideButton = forwardRef(({ onValidate, onSuccess }: { onValidate: () => boolean, onSuccess: () => void }, ref) => {
  const [status, setStatus] = useState<"idle" | "error" | "success" | "loading">("idle");
  const x = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 400, damping: 40 });
  
  // La couleur de remplissage qui suit le bouton
  const width = useTransform(springX, (v) => v + 60);
  // Opacité du texte "Glisser" qui diminue à mesure qu'on avance
  const textOpacity = useTransform(springX, [0, 100], [1, 0]);

  const handleDragEnd = () => {
    if (x.get() > 180) { 
      const isValid = onValidate(); 
      if (isValid) {
        setStatus("loading");
        x.set(200);
        setTimeout(() => {
          setStatus("success");
          onSuccess();
        }, 1500);
      } else {
        setStatus("error");
        x.set(0);
        setTimeout(() => setStatus("idle"), 2000);
      }
    } else {
      x.set(0);
    }
  };

  return (
    <div className={cn(
      "relative w-full h-16 bg-white/5 rounded-2xl border transition-all duration-300 flex items-center p-1 overflow-hidden",
      status === "error" ? "border-red-500/50 bg-red-500/5" : "border-white/10"
    )}>
      
      {/* Barre de progression derrière le bouton */}
      <motion.div style={{ width }} className={cn(
        "absolute inset-y-0 left-0 rounded-2xl",
        status === "success" ? "bg-green-500/20" : "bg-ts-blue/30"
      )} />

      {/* TEXTE D'INDICATION (Le fameux "Glisser") */}
      <AnimatePresence>
        {status === "idle" && (
          <motion.div 
            style={{ opacity: textOpacity }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <span className="text-[11px] font-bold text-white/40 uppercase tracking-[0.3em] flex items-center gap-2">
              Glisser pour s'inscrire
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <ChevronRight size={14} />
              </motion.span>
            </span>
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence mode="wait">
        {status === "idle" || status === "error" ? (
          <motion.div
            key="slider"
            drag="x"
            dragConstraints={{ left: 0, right: 220 }}
            style={{ x }}
            onDragEnd={handleDragEnd}
            className="z-10 cursor-grab active:cursor-grabbing"
          >
            <div className={cn(
              "w-14 h-14 rounded-xl flex items-center justify-center shadow-2xl transition-colors",
              status === "error" ? "bg-red-600" : "bg-ts-blue hover:bg-ts-cyan transition-colors"
            )}>
              {status === "error" ? <AlertCircle className="text-white" /> : <SendHorizontal className="text-white" />}
            </div>
          </motion.div>
        ) : (
          <motion.div key="status" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 text-center font-bold z-10">
            {status === "loading" ? (
              <Loader2 className="animate-spin mx-auto text-ts-cyan" />
            ) : (
              <motion.div 
                initial={{ y: 10 }} animate={{ y: 0 }}
                className="text-green-400 flex items-center justify-center gap-2 uppercase text-xs tracking-widest"
              >
                <Check size={18} /> Inscription réussie
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

SlideButton.displayName = "SlideButton";