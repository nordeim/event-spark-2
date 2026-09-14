"use client";

import { motion } from "framer-motion";
import { ChartNoAxesColumn, Puzzle } from "lucide-react";
import { integrationLogos, audienceAvatars } from "@/data/integrations";

/**
 * Product mocks rendered inside the feature cards. Each mirrors a
 * miniature UI from the reference site (event page, live chart,
 * integration orbit, attendee grid).
 */

export function EventPageMock() {
  return (
    <div className="relative w-full h-full flex items-center justify-center p-6">
      <div className="w-[85%] bg-white/80 rounded-xl shadow-lg overflow-hidden">
        <img
          src="/events/event-vibe-coding-summit.jpg"
          alt="Event page preview"
          className="w-full h-28 object-cover"
        />
        <div className="p-3 space-y-2.5">
          <h4 className="text-[11px] font-bold text-foreground truncate">
            Vibe coding summit 2026
          </h4>
          <div className="flex items-center gap-2 text-[9px] text-muted-foreground">
            <span aria-hidden="true">📅 Apr 19, 2026</span>
            <span aria-hidden="true">📍 San Francisco</span>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[9px] text-muted-foreground w-12">Name</span>
              <div className="h-5 bg-muted rounded-md flex-1" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] text-muted-foreground w-12">Email</span>
              <div className="h-5 bg-muted rounded-md flex-1" />
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <div className="h-7 rounded-full flex-1 flex items-center justify-center bg-primary">
              <span className="text-[9px] text-white font-semibold">
                Register now
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const CHART_BARS = [40, 65, 30, 55, 80, 45, 70] as const;
const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

export function LiveChartMock() {
  return (
    <div className="relative w-full h-full flex items-center justify-center p-6">
      <div className="w-[85%] bg-white/80 rounded-xl shadow-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <ChartNoAxesColumn
            className="w-4 h-4 text-[#29A38F]"
            aria-hidden="true"
          />
          <span className="text-[10px] font-bold text-[#29A38F]">Live</span>
          <div className="w-1.5 h-1.5 rounded-full animate-pulse bg-[#33CCB2]" />
        </div>
        <div
          className="flex items-end gap-1.5 h-20"
          role="img"
          aria-label="Weekly registration volume, bar chart"
        >
          {CHART_BARS.map((height, index) => (
            <div
              key={index}
              className="flex-1 rounded-t-md bg-[#33CCB2]"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
        <div className="flex justify-between mt-2">
          {WEEK_DAYS.map((day) => (
            <span
              key={day}
              className="text-[7px] text-muted-foreground flex-1 text-center"
            >
              {day}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

const ORBIT_POSITIONS = [
  { left: "calc(50% - 28px)", top: "calc(50% - 113px)" },
  { left: "calc(50% + 45.6px)", top: "calc(50% - 70.5px)" },
  { left: "calc(50% + 45.6px)", top: "calc(50% + 14.5px)" },
  { left: "calc(50% - 28px)", top: "calc(50% + 57px)" },
  { left: "calc(50% - 101.6px)", top: "calc(50% + 14.5px)" },
  { left: "calc(50% - 101.6px)", top: "calc(50% - 70.5px)" },
] as const;

export function IntegrationsOrbitMock() {
  return (
    <div className="relative w-full h-full flex items-center justify-center p-6">
      <div className="relative w-full h-full flex items-center justify-center">
        <motion.div
          className="w-16 h-16 rounded-full flex items-center justify-center z-10 bg-[#CFA11B]"
          animate={{ rotate: 360 }}
          transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
        >
          <Puzzle className="w-8 h-8 text-white" aria-hidden="true" />
        </motion.div>
        {integrationLogos.map((logo, index) => (
          <div
            key={logo.name}
            className="absolute w-14 h-14 rounded-xl bg-white/80 shadow-md flex items-center justify-center"
            style={ORBIT_POSITIONS[index % ORBIT_POSITIONS.length]}
          >
            <img
              src={logo.src}
              alt={`${logo.name} integration`}
              className="w-8 h-8"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function AudienceGridMock() {
  return (
    <div className="relative w-full h-full flex items-center justify-center p-6">
      <div className="grid grid-cols-3 gap-4">
        {audienceAvatars.map((attendee, index) => (
          <motion.div
            key={attendee.name}
            className="w-16 h-16 rounded-full overflow-hidden shadow-md border-[3px] border-[#B8ADEB]"
            animate={{ y: [0, -6, 0] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.3,
            }}
          >
            <img
              src={attendee.src}
              alt={attendee.name}
              className="w-full h-full object-cover"
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
