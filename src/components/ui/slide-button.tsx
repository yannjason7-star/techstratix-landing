"use client"
import React, { forwardRef, useState } from "react"
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion"
import { SendHorizontal, Loader2, Check, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export const SlideButton = forwardRef(({ onValidate, onSuccess }: { onValidate: () => boolean, onSuccess: () => void }, ref) => {
  const [status, setStatus] = useState<"idle" | "error" | "success" | "loading">("idle");
  const x = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 400, damping: 40 });
  const width = useTransform(springX, (v) => v + 45);

  const handleDragEnd = () => {
    if (x.get() > 180) { // Seuil de glissement
      const isValid = onValidate(); // On demande au formulaire si c'est OK
      if (isValid) {
        setStatus("loading");
        x.set(200);
        setTimeout(() => {
          setStatus("success");
          onSuccess();
        }, 1500);
      } else {
        // Si erreur : vibration et retour à zéro
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
      "relative w-full h-16 bg-white/5 rounded-2xl border transition-colors duration-300 flex items-center p-1 overflow-hidden",
      status === "error" ? "border-red-500/50 bg-red-500/5" : "border-white/10"
    )}>
      <motion.div style={{ width }} className={cn(
        "absolute inset-y-0 left-0 rounded-2xl",
        status === "success" ? "bg-green-500/20" : "bg-ts-blue/30"
      )} />
      
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
              status === "error" ? "bg-red-600" : "bg-ts-blue"
            )}>
              {status === "error" ? <AlertCircle className="text-white" /> : <SendHorizontal className="text-white" />}
            </div>
          </motion.div>
        ) : (
          <motion.div key="status" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 text-center font-bold">
            {status === "loading" ? <Loader2 className="animate-spin mx-auto text-ts-cyan" /> : <div className="text-green-400 flex items-center justify-center gap-2"><Check /> Inscription validée !</div>}
          </motion.div>
        )}
      </AnimatePresence>
      
      {status === "idle" && (
        <span className="absolute right-6 text-[10px] font-black text-ts-silver/40 uppercase tracking-[0.3em] pointer-events-none">
          Propulsez votre projet
        </span>
      )}
    </div>
  );
});