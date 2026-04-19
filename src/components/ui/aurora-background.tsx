"use client";
import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

export const AuroraBackground = ({ className, children }: { className?: string; children: ReactNode }) => {
  return (
    <main className={cn("relative flex flex-col min-h-screen items-center justify-center bg-ts-black overflow-hidden", className)}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* L'effet Aurora principal */}
        <div className="absolute -inset-[10px] opacity-40 animate-aurora [background-image:linear-gradient(100deg,rgba(0,51,102,0.8)_10%,rgba(0,209,255,0.4)_25%,rgba(142,142,142,0.2)_50%,rgba(0,209,255,0.4)_70%,rgba(0,51,102,0.8)_90%)] [background-size:200%_100%] filter blur-[100px]"></div>
        
        {/* Taches lumineuses flottantes pour enlever le côté "sec" */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-ts-blue/20 rounded-full filter blur-[120px] animate-pulse_slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-ts-cyan/10 rounded-full filter blur-[150px] animate-pulse_slow shadow-glow"></div>
      </div>
      <div className="relative z-10 w-full">{children}</div>
    </main>
  );
};