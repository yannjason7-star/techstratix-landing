"use client";
import { cn } from "@/lib/utils";

export const BorderBeam = ({ className, size = 200, duration = 15, delay = 0 }: { className?: string; size?: number; duration?: number; delay?: number }) => {
  return (
    <div
      style={{ "--size": size, "--duration": duration, "--delay": delay } as React.CSSProperties}
      className={cn("pointer-events-none absolute inset-0 rounded-[inherit] [border:calc(var(--size)*1px)_solid_transparent]", "![mask-clip:padding-box,border-box] ![mask-composite:intersect] [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)]", className)}
    >
      <div className="absolute aspect-square w-[calc(var(--size)*1px)] animate-border-beam bg-gradient-to-l from-ts-cyan via-ts-blue to-transparent [offset-anchor:90%_50%] [offset-path:rect(0_auto_auto_0_round_calc(var(--size)*1px))]" />
    </div>
  );
};