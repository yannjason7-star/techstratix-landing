"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const AnimatedText = ({ text, className }: { text: string; className?: string }) => {
  const words = text.split(" ");
  return (
    <motion.div className={cn("flex flex-wrap gap-x-3", className)}>
      {words.map((word, i) => (
        <motion.span key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1, duration: 0.5 }}>
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};