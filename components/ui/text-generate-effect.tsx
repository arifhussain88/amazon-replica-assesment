"use client";
import { useEffect } from "react";
import { motion, stagger, useAnimate, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export const TextGenerateEffect = ({
  words,
  className,
  duration = 0.2,
}: {
  words: string;
  className?: string;
  /** Kept for call-site compatibility. Flat design never applies a blur. */
  filter?: boolean;
  duration?: number;
}) => {
  const [scope, animate] = useAnimate();
  const reduce = useReducedMotion();
  const wordsArray = words.split(" ");

  useEffect(() => {
    if (reduce) return;
    const animation = animate("span", { opacity: 1 }, { duration, delay: stagger(0.08) });
    return () => animation.stop();
  }, [animate, duration, reduce, words]);

  return (
    <span className={cn("font-sans font-bold text-foreground", className)}>
      <motion.span ref={scope} className="leading-snug tracking-tight">
        {wordsArray.map((word, index) => (
          <motion.span
            key={`${word}-${index}`}
            className={reduce ? "text-foreground opacity-100" : "text-foreground opacity-0"}
          >
            {word}{" "}
          </motion.span>
        ))}
      </motion.span>
    </span>
  );
};
