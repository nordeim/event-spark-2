"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/shared/logo";
import {
  heroCategoryCards,
  rotatingHeadlineWords,
} from "@/data/events";

interface HeroProps {
  onNavigate: (to: string) => void;
}

interface HeroConfettiShape {
  readonly kind: "circle" | "square" | "triangle" | "pill";
  readonly color: string;
  readonly size: number;
  readonly style: React.CSSProperties;
}

/** Playful geometric accents pinned near the viewport edges. */
const heroConfetti: readonly HeroConfettiShape[] = [
  { kind: "circle", color: "#4D96FF", size: 20, style: { left: "-45px", top: "60px", rotate: "-50deg" } },
  { kind: "square", color: "#4D96FF", size: 20, style: { right: "-40px", bottom: "30px", rotate: "18deg" } },
  { kind: "triangle", color: "#FFD93D", size: 35, style: { right: "230px", bottom: "25px", rotate: "-30deg" } },
  { kind: "circle", color: "#FF6BCB", size: 20, style: { right: "50px", bottom: "200px" } },
  { kind: "pill", color: "#6BCB77", size: 25, style: { right: "240px", bottom: "100px", rotate: "50deg" } },
  { kind: "circle", color: "#FF6B6B", size: 15, style: { right: "20px", bottom: "30px" } },
  { kind: "square", color: "#FF9F43", size: 17.5, style: { right: "-30px", bottom: "160px", rotate: "-40deg" } },
  { kind: "triangle", color: "#4D96FF", size: 25, style: { right: "180px", bottom: "45px", rotate: "25deg" } },
  { kind: "circle", color: "#FFD93D", size: 22.5, style: { right: "-45px", bottom: "90px" } },
  { kind: "circle", color: "#4D96FF", size: 15, style: { left: "-35px", bottom: "140px" } },
  { kind: "square", color: "#FFD93D", size: 14, style: { left: "60px", top: "10px", rotate: "12deg" } },
  { kind: "pill", color: "#FF6BCB", size: 18, style: { left: "90px", bottom: "60px", rotate: "-35deg" } },
] as const;

const CARD_POSITIONS: readonly string[] = [
  "left-[-100px] lg:left-[-40px] top-[20px] rotate-[6deg]",
  "left-[-120px] lg:left-[-60px] bottom-[20px] rotate-[-5deg]",
  "right-[-100px] lg:right-[-40px] top-[20px] rotate-[-6deg]",
  "right-[-120px] lg:right-[-60px] bottom-[20px] rotate-[5deg]",
];

function HeroConfetti() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-x-0 top-0 -z-0 pointer-events-none h-[720px] overflow-hidden"
    >
      {heroConfetti.map((shape, index) => (
        <div key={index} className="absolute opacity-80" style={shape.style}>
          {shape.kind === "triangle" ? (
            <div
              style={{
                width: 0,
                height: 0,
                borderLeft: `${shape.size / 2}px solid transparent`,
                borderRight: `${shape.size / 2}px solid transparent`,
                borderBottom: `${shape.size * 0.85}px solid ${shape.color}`,
              }}
            />
          ) : (
            <div
              style={{
                width: shape.size,
                height: shape.kind === "pill" ? shape.size / 4 : shape.size,
                borderRadius:
                  shape.kind === "circle"
                    ? "50%"
                    : shape.kind === "pill"
                      ? "99px"
                      : "2px",
                backgroundColor: shape.color,
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function FloatingCategoryCards() {
  return (
    <>
      {heroCategoryCards.map((card, index) => (
        <div
          key={card.id}
          className={`hidden md:block absolute w-[200px] lg:w-[260px] ${
            CARD_POSITIONS[index % CARD_POSITIONS.length]
          }`}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 + index * 0.08 }}
          >
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img
                src={card.image.src}
                alt={card.image.alt}
                className="w-full h-[150px] object-cover"
              />
              <div className="bg-card px-3 py-2">
                <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  {card.category}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      ))}
    </>
  );
}

function RotatingWord() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(
      () =>
        setIndex((current) => (current + 1) % rotatingHeadlineWords.length),
      2600,
    );
    return () => window.clearInterval(timer);
  }, []);

  const word = rotatingHeadlineWords[index] ?? rotatingHeadlineWords[0];

  return (
    <span className="inline-block relative">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={word}
          className="text-primary italic inline-block"
          initial={{ y: "60%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-60%", opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          {word}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export function Hero({ onNavigate }: HeroProps) {
  return (
    <section aria-label="Hero" className="relative overflow-hidden">
      <HeroConfetti />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-28 relative">
        <div className="relative min-h-[620px] flex items-center justify-center">
          <FloatingCategoryCards />

          <div className="text-center max-w-3xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center justify-center mb-6"
            >
              <Logo glyphClassName="w-12 h-12" wordmarkClassName="text-2xl" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08 }}
              className="inline-flex items-center gap-2 mb-7 bg-primary/10 text-primary px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-[0.18em] uppercase"
            >
              <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
              </span>
              For organizers everywhere
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.16 }}
              className="text-5xl sm:text-6xl lg:text-[68px] 2xl:text-[80px] font-display tracking-[-0.035em] leading-[0.95] text-foreground mb-7"
            >
              The event platform where ideas become <RotatingWord />
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.24 }}
              className="text-lg lg:text-xl text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed"
            >
              Whatever your event — from workshops to conferences — build
              branded registration pages, track attendees, and grow your
              community. No code required.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.32 }}
            >
              <button
                type="button"
                onClick={() => onNavigate("/auth?mode=signup")}
                className={cn(
                  "inline-flex items-center justify-center gap-2 rounded-full",
                  "text-base font-semibold px-9 h-12",
                  "text-background bg-foreground hover:bg-foreground/90",
                  "transition-[transform,colors,box-shadow] duration-200 ease-out",
                  "hover:-translate-y-[1px] hover:shadow-float active:scale-[0.97]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                )}
              >
                Get started
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
