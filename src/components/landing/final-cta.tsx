"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollReveal } from "./scroll-reveal";

interface FinalCtaProps {
  onNavigate: (to: string) => void;
}

/** Brand ticket illustration overlapping the dark CTA card. */
function TicketGlyph() {
  return (
    <svg
      width="130"
      height="158"
      viewBox="0 0 130 158"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="10" y="28" width="110" height="120" rx="16" fill="hsl(var(--card))" />
      <rect x="10" y="28" width="110" height="32" rx="16" fill="hsl(var(--primary))" />
      <rect x="10" y="44" width="110" height="16" fill="hsl(var(--primary))" />
      <rect x="38" y="14" width="10" height="28" rx="5" fill="hsl(var(--foreground))" />
      <rect x="82" y="14" width="10" height="28" rx="5" fill="hsl(var(--foreground))" />
      {[21, 40, 59, 78, 97].map((x) =>
        [72, 90, 108, 126].map((y) => (
          <rect
            key={`${x}-${y}`}
            x={x}
            y={y}
            width="12"
            height="10"
            rx="2.5"
            fill="hsl(var(--border))"
          />
        )),
      )}
    </svg>
  );
}

const ctaConfetti = [
  { left: "calc(50% - 160px)", top: "12px", size: 8, color: "#FFD93D", radius: "50%" },
  { left: "calc(50% + 146px)", top: "24px", size: 12, color: "#FFD83D", radius: "50%" },
  { left: "calc(50% - 54px)", top: "58px", size: 6, color: "#6CCB6F", radius: "2px" },
] as const;

export function FinalCta({ onNavigate }: FinalCtaProps) {
  return (
    <section className="pt-10 lg:pt-16 pb-12 lg:pb-16 relative">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="relative pt-20 lg:pt-24">
          <div
            className="absolute inset-x-0 top-0 z-20 flex justify-center pointer-events-none"
            aria-hidden="true"
          >
            <motion.div
              className="drop-shadow-[0_18px_40px_hsl(240_30%_14%_/_0.18)]"
              initial={{ opacity: 0, y: 16, scale: 0.85 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
            >
              <TicketGlyph />
            </motion.div>
          </div>

          <div className="bg-foreground rounded-[2.5rem] relative overflow-hidden px-6 pt-24 pb-20 lg:px-10 lg:pt-32 lg:pb-28 max-w-5xl mx-auto">
            <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
              {ctaConfetti.map((piece, index) => (
                <motion.div
                  key={index}
                  className="absolute"
                  style={{ left: piece.left, top: piece.top }}
                  initial={{ opacity: 0, y: 30, scale: 0 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                >
                  <div
                    style={{
                      width: piece.size,
                      height: piece.size,
                      backgroundColor: piece.color,
                      borderRadius: piece.radius,
                    }}
                  />
                </motion.div>
              ))}
            </div>

            <div className="text-center relative z-10">
              <ScrollReveal>
                <h2 className="text-4xl sm:text-6xl lg:text-7xl font-display mb-6 text-background tracking-[-0.035em] leading-[0.95]">
                  Ready to spark
                  <br />
                  your next event?
                </h2>
                <p className="text-background/70 text-lg lg:text-xl mb-10 max-w-lg mx-auto text-balance">
                  Join thousands of organizers who use eventspark to build
                  better events.
                </p>
                <button
                  type="button"
                  onClick={() => onNavigate("/auth?mode=signup")}
                  className={cn(
                    "inline-flex items-center justify-center gap-2 rounded-full",
                    "text-base font-semibold px-8 h-12",
                    "bg-primary text-primary-foreground hover:bg-primary/90",
                    "transition-[transform,colors,box-shadow] duration-200 ease-out",
                    "hover:-translate-y-[1px] hover:shadow-spark active:scale-[0.97]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  )}
                >
                  Get started for free
                  <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
                </button>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
