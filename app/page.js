"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import { BookOpen, MapPin, CalendarDays, Building2 } from "lucide-react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set, update } from "firebase/database";

// ─── Firebase ────────────────────────────────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyC-8dCtOFhNpyCs7EryXMF-dfpkIonfC-w",
  authDomain: "the-best-spring-training-2026.firebaseapp.com",
  databaseURL: "https://the-best-spring-training-2026-default-rtdb.firebaseio.com",
  projectId: "the-best-spring-training-2026",
  storageBucket: "the-best-spring-training-2026.firebasestorage.app",
  messagingSenderId: "501578425419",
  appId: "1:501578425419:web:6df2bf39912c178bebd9ce",
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getDatabase(firebaseApp);

// ─── Constants ───────────────────────────────────────────────────────────────
const PEOPLE = ["Brian", "Nick", "Ted", "Hailey", "Fe"];

const INITIAL_BAE_PLAYERS = [
  { id: 1, number: "4", first: "Francisco", last: "Alvarez" },
  { id: 2, number: "12", first: "Francisco", last: "Lindor" },
  { id: 3, number: "20", first: "Pete", last: "Alonso" },
  { id: 4, number: "22", first: "Juan", last: "Soto" },
  { id: 5, number: "27", first: "Mark", last: "Vientos" },
  { id: 6, number: "7", first: "Brett", last: "Baty" },
  { id: 7, number: "9", first: "Brandon", last: "Nimmo" },
  { id: 8, number: "30", first: "Tyrone", last: "Taylor" },
];

const DEFAULT_TRACKERS = {
  glizzy: { Brian: 6, Nick: 4, Ted: 3, Hailey: 2, Fe: 2 },
  sunCruiser: { Brian: 6, Nick: 4, Ted: 5, Hailey: 3, Fe: 2 },
  rawEgg: { "RAW EGG": 2, ADJACENT: 3 },
  florida: {
    "SHIRTLESS MAN": 4,
    "TRUMP SIGN": 2,
    "LIVE LAUGH LOVE ENERGY": 1,
  },
};

const DEFAULT_BAE_VOTERS = {
  Brian: "4 Francisco Alvarez",
  Nick: "27 Mark Vientos",
  Ted: "22 Juan Soto",
  Hailey: "4 Francisco Alvarez",
  Fe: "27 Mark Vientos",
};

const DEFAULT_RAW_EGG_CATEGORIES = ["RAW EGG", "ADJACENT"];
const DEFAULT_FLORIDA_CATEGORIES = ["SHIRTLESS MAN", "TRUMP SIGN", "LIVE LAUGH LOVE ENERGY"];

const SPRING_TRAINING_GAMES = [
  "Tue Mar 18 — 1:10 PM — @ Cardinals — Roger Dean Chevrolet Stadium",
  "Wed Mar 19 — 1:10 PM — vs Astros — Clover Park",
  "Thu Mar 20 — 1:10 PM — @ Nationals — CACTI Park of the Palm Beaches",
  "Fri Mar 21 — 6:10 PM — vs Cardinals — Clover Park",
  "Sat Mar 22 — 1:10 PM — @ Marlins — Roger Dean Chevrolet Stadium",
  "Sun Mar 23 — 1:10 PM — vs Nationals — Clover Park",
  "Mon Mar 24 — 1:10 PM — vs Astros — Clover Park",
];

const SCORECARD_SECTIONS = [
  {
    title: "FIELDING NUMBERS",
    body: ["1 = Pitcher","2 = Catcher","3 = First Base","4 = Second Base","5 = Third Base","6 = Shortstop","7 = Left Field","8 = Center Field","9 = Right Field"],
    youtube: "https://www.youtube.com/results?search_query=baseball+scorecard+fielding+numbers",
  },
  {
    title: "COMMON HITTING MARKS",
    body: ["1B = Single","2B = Double","3B = Triple","HR = Home Run","BB = Walk","HBP = Hit By Pitch","RBI = Run Batted In","E = Error"],
    youtube: "https://www.youtube.com/results?search_query=how+to+keep+a+baseball+scorecard",
  },
  {
    title: "OUTS AND DEFENSIVE PLAYS",
    body: ["K = Strikeout swinging","ꓘ = Strikeout looking","6-3 = Shortstop to first","F8 = Fly out to center","6-4-3 DP = Double play","FC = Fielder's choice"],
    youtube: "https://www.youtube.com/results?search_query=baseball+scorecard+outs+double+plays",
  },
  {
    title: "RUNNER MOVEMENT",
    body: ["SB2 = Stole second","CS = Caught stealing","WP = Wild pitch","PB = Passed ball","Circle runs so you can total quickly later.","Leave room in a box for weird plays and substitutions."],
    youtube: "https://www.youtube.com/results?search_query=baseball+scorecard+stolen+base+fielder%27s+choice",
  },
  {
    title: "QUICK REFERENCES",
    body: ["Check lineup changes early each inning.","Mark pitching changes immediately.","Use the scoreboard to confirm defensive substitutions.","If you miss a play, leave space and come back.","Put inning totals in one place so you can audit later.","Use a different symbol style for hits, walks, and errors."],
    youtube: "https://www.youtube.com/results?search_query=baseball+scorecard+tips+for+beginners",
  },
];

const METS_TRIVIA = [
  { q: "What year did the Mets begin play?", a: "1962." },
  { q: "What are the Mets' two championship years?", a: "1969 and 1986." },
  { q: "What year did Citi Field open?", a: "2009." },
  { q: "Who is known as 'The Franchise' in Mets history?", a: "Tom Seaver." },
  { q: "Who is the Mets mascot?", a: "Mr. Met." },
  { q: "What colors are the Mets primarily known for?", a: "Blue and orange." },
  { q: "What giant feature appears when the Mets homer at Citi Field?", a: "The Home Run Apple." },
  { q: "Who was the manager of the 1986 Mets?", a: "Davey Johnson." },
  { q: "Which Hall of Fame catcher starred for the Mets in the late 1990s and early 2000s?", a: "Mike Piazza." },
  { q: "What borough do the Mets play in?", a: "Queens." },
  { q: "What station on the 7 line serves Citi Field?", a: "Mets–Willets Point." },
  { q: "Which Mets first baseman is known as 'The Polar Bear'?", a: "Pete Alonso." },
];

const RULES_TRIVIA = [
  { q: "What does K mean on a scorecard?", a: "Strikeout swinging." },
  { q: "What does ꓘ mean on a scorecard?", a: "Strikeout looking." },
  { q: "What does 6-3 mean?", a: "Groundout shortstop to first base." },
  { q: "What does F8 mean?", a: "Fly out to center field." },
  { q: "What does 1B mean?", a: "Single." },
  { q: "What does 2B mean?", a: "Double." },
  { q: "What does BB mean?", a: "Walk." },
  { q: "What does HBP mean?", a: "Hit by pitch." },
  { q: "What does DP mean?", a: "Double play." },
  { q: "What does SF mean?", a: "Sacrifice fly." },
  { q: "What number is the pitcher?", a: "1." },
  { q: "What number is the catcher?", a: "2." },
];

const NYC_TRIVIA = [
  { q: "What is the nickname of New York City?", a: "The Big Apple." },
  { q: "What is the largest borough by area?", a: "Queens." },
  { q: "Which borough is Coney Island in?", a: "Brooklyn." },
  { q: "What is the famous large park in Manhattan called?", a: "Central Park." },
  { q: "What famous square is known for bright lights and Broadway ads?", a: "Times Square." },
  { q: "What borough is JFK Airport in?", a: "Queens." },
  { q: "What island is the Statue of Liberty on?", a: "Liberty Island." },
  { q: "What famous bridge connects Manhattan and Brooklyn?", a: "The Brooklyn Bridge." },
  { q: "What is NYC's most famous elevated park called?", a: "The High Line." },
  { q: "What park is next to Citi Field?", a: "Flushing Meadows–Corona Park." },
  { q: "What giant globe sculpture sits in Flushing Meadows–Corona Park?", a: "The Unisphere." },
  { q: "What borough is Prospect Park in?", a: "Brooklyn." },
];

// ─── Mode Meta ────────────────────────────────────────────────────────────────
const MODE_META = {
  clover: {
    button: "CLOVER PARK",
    emoji: "🌴",
    splashLines: ["PORT ST LUCIE", "SPRING TRAINING"],
    splashClass: "bg-orange-50/95",
    wrapper: "bg-[radial-gradient(circle_at_top,rgba(255,219,172,0.55),transparent_35%),linear-gradient(180deg,rgba(255,170,80,0.05),rgba(0,150,120,0.04))]",
    pinstripes: "repeating-linear-gradient(90deg, rgba(0,120,110,0.05) 0px, rgba(0,120,110,0.05) 1px, transparent 1px, transparent 24px)",
    tile: "bg-[#c9eadf]",
    panel: "bg-white/86",
    accent: "bg-[#008b84] text-white",
    accentColor: "bg-[#008b84]",
    accentHex: "#008b84",
    showerEmojis: [],
  },
  citi: {
    button: "CITI FIELD",
    emoji: "🗽",
    splashLines: ["QUEENS NY", "METROPOLITANS"],
    splashClass: "bg-sky-50/95",
    wrapper: "bg-[linear-gradient(180deg,rgba(0,45,114,0.08),transparent_16%),radial-gradient(circle_at_top,rgba(255,255,255,0.98),rgba(255,255,255,0.92))]",
    pinstripes: "repeating-linear-gradient(90deg, rgba(0,45,114,0.12) 0px, rgba(0,45,114,0.12) 1px, transparent 1px, transparent 20px)",
    tile: "bg-[#dce7f5]",
    panel: "bg-white/92",
    accent: "bg-[#002d72] text-white",
    accentColor: "bg-[#002d72]",
    accentHex: "#002d72",
    showerEmojis: [],
  },
  glizzy: {
    button: "GLIZZY",
    emoji: "🌭",
    splashLines: ["GLIZZY O'CLOCK", ""],
    splashClass: "bg-yellow-50/95",
    wrapper: "bg-[linear-gradient(180deg,rgba(255,210,80,0.22),rgba(255,89,0,0.11))]",
    pinstripes: "repeating-linear-gradient(90deg, rgba(200,60,0,0.05) 0px, rgba(200,60,0,0.05) 1px, transparent 1px, transparent 26px)",
    tile: "bg-[#ffd79c]",
    panel: "bg-[#fff7ea]",
    accent: "bg-[#d84b00] text-white",
    accentColor: "bg-[#d84b00]",
    accentHex: "#d84b00",
    showerEmojis: ["🌭"],
  },
  rawEgg: {
    button: "RAW EGG",
    emoji: "🥚",
    splashLines: ["RAW EGG ALERT", ""],
    splashClass: "bg-amber-50/95",
    wrapper: "bg-[radial-gradient(circle_at_center,rgba(255,243,170,0.74),transparent_35%),radial-gradient(circle_at_50%_42%,rgba(255,205,0,0.46),transparent_10%)]",
    pinstripes: "repeating-linear-gradient(90deg, rgba(190,160,0,0.04) 0px, rgba(190,160,0,0.04) 1px, transparent 1px, transparent 28px)",
    tile: "bg-[#fff1a8]",
    panel: "bg-[#fffbe8]",
    accent: "bg-[#a88700] text-white",
    accentColor: "bg-[#a88700]",
    accentHex: "#a88700",
    showerEmojis: ["🥚"],
  },
  margaritaville: {
    button: "MARGARITAVILLE",
    emoji: "🍹",
    splashLines: ["IT'S FIVE O'CLOCK", "SOMEWHERE"],
    splashClass: "bg-teal-50/95",
    wrapper: "bg-[linear-gradient(180deg,rgba(0,170,160,0.14),rgba(0,120,120,0.05))]",
    pinstripes: "repeating-linear-gradient(90deg, rgba(0,170,160,0.04) 0px, rgba(0,170,160,0.04) 1px, transparent 1px, transparent 28px)",
    tile: "bg-[#c6f0ea]",
    panel: "bg-white/88",
    accent: "bg-[#008b84] text-white",
    accentColor: "bg-[#008b84]",
    accentHex: "#008b84",
    showerEmojis: [],
  },
  lfgbtqm: {
    button: "LFGBTQM",
    emoji: "🌈",
    splashLines: ["SINGLE AND THRIVING", "MARK VIENTOS PLEASE NOTICE ME"],
    splashClass: "bg-pink-50/95",
    wrapper: "lfgbtqm-bg",
    pinstripes: "repeating-linear-gradient(90deg, rgba(180,0,180,0.03) 0px, rgba(180,0,180,0.03) 1px, transparent 1px, transparent 28px)",
    tile: "bg-[#ffd6fb]",
    panel: "bg-white/88",
    accent: "bg-[#a1007e] text-white",
    accentColor: "bg-[#a1007e]",
    accentHex: "#a1007e",
    showerEmojis: ["🌈", "💖", "✨", "🏳️‍🌈", "💅", "🌈", "💖", "🔥"],
  },
};

const GLIZZY_LEVELS = [
  { min: 0, label: "warming up" },
  { min: 3, label: "snack mode" },
  { min: 6, label: "glizzy threat" },
  { min: 10, label: "glizzy legend" },
];

const SUN_CRUISER_LEVELS = [
  { min: 0, label: "dry dock" },
  { min: 3, label: "cruising" },
  { min: 6, label: "sun blasted" },
  { min: 10, label: "captain of the cooler" },
];

// ─── BAE HOTNESS RANKINGS ─────────────────────────────────────────────────────
const BAE_HOTNESS = [
  { number: "22", name: "Juan Soto", note: "The Swagger. Already a top-5 hitter and he KNOWS it." },
  { number: "27", name: "Mark Vientos", note: "Tall. Powerful. Mysteriously compelling." },
  { number: "4", name: "Francisco Alvarez", note: "Baby-faced chaos agent behind the plate." },
  { number: "20", name: "Pete Alonso", note: "The Polar Bear. Thick. Dependable. Beloved." },
  { number: "12", name: "Francisco Lindor", note: "Main character energy. Always smiling. Dangerous." },
  { number: "9", name: "Brandon Nimmo", note: "Sincerely cheerful. The golden retriever of the outfield." },
  { number: "7", name: "Brett Baty", note: "Still figuring it out but doing it very attractively." },
  { number: "30", name: "Tyrone Taylor", note: "Quietly excellent. The dark horse." },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getAchievement(value, levels) {
  let current = levels[0].label;
  for (const level of levels) {
    if (value >= level.min) current = level.label;
  }
  return current;
}

function getBaeVoteCounts(players, voterChoices) {
  const counts = {};
  players.map(formatPlayer).forEach((label) => { counts[label] = 0; });
  Object.values(voterChoices).forEach((choice) => {
    counts[choice] = (counts[choice] || 0) + 1;
  });
  return counts;
}

function formatPlayer(player) {
  return `${player.number || "?"} ${player.first || ""} ${player.last || ""}`.trim();
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function openExternal(url) {
  window.open(url, "_blank", "noopener,noreferrer");
}

function sortRosterBy(list, sortBy) {
  const copy = [...list];
  if (sortBy === "number") copy.sort((a, b) => Number(a.number || 0) - Number(b.number || 0));
  else if (sortBy === "first") copy.sort((a, b) => (a.first || "").localeCompare(b.first || ""));
  else copy.sort((a, b) => (a.last || "").localeCompare(b.last || ""));
  return copy;
}

function sortRowsWithRules(entries) {
  const allZero = entries.every(([, value]) => Number(value) === 0);
  if (allZero) return [...entries].sort((a, b) => a[0].localeCompare(b[0]));
  return [...entries].sort((a, b) => {
    if (b[1] !== a[1]) return b[1] - a[1];
    return a[0].localeCompare(b[0]);
  });
}

function rowsWithProgress(entries) {
  const sorted = sortRowsWithRules(entries);
  const max = Math.max(...sorted.map(([, value]) => Number(value)), 0);
  return sorted.map(([label, value]) => ({
    label,
    value,
    percent: max > 0 ? Math.round((Number(value) / max) * 100) : 0,
  }));
}

// ─── EmojiShower ──────────────────────────────────────────────────────────────
function EmojiShower({ emojis, enabled, modeKey }) {
  if (!enabled || !emojis?.length) return null;
  const count = modeKey === "lfgbtqm" ? 80 : 42;
  const items = Array.from({ length: count }).map((_, i) => {
    const emoji = emojis[i % emojis.length];
    const size = modeKey === "lfgbtqm" ? 20 + ((i * 7) % 50) : 24 + ((i * 9) % 42);
    const left = 4 + ((i * 11) % 92);
    const top = 4 + ((i * 17) % 88);
    const dx = -420 + ((i * 41) % 840);
    const dy = -380 + ((i * 29) % 760);
    const rot = -540 + ((i * 47) % 1080);
    const delay = (i % 20) * 0.12;
    const duration = modeKey === "lfgbtqm" ? 1.8 + (i % 5) * 0.3 : 2.2;
    const iterations = modeKey === "lfgbtqm" ? 999 : 4;
    return { emoji, size, left, top, dx, dy, rot, delay, duration, iterations, id: i };
  });

  return (
    <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden">
      {items.map((item) => (
        <span
          key={`${modeKey}-${item.id}`}
          className="absolute"
          style={{
            left: `${item.left}%`,
            top: `${item.top}%`,
            fontSize: `${item.size}px`,
            animationName: "chaosBurst",
            animationDuration: `${item.duration}s`,
            animationTimingFunction: "ease-in-out",
            animationIterationCount: item.iterations,
            animationDelay: `${item.delay}s`,
            animationFillMode: "both",
            ["--dx"]: `${item.dx}px`,
            ["--dy"]: `${item.dy}px`,
            ["--rot"]: `${item.rot}deg`,
          }}
        >
          {item.emoji}
        </span>
      ))}
    </div>
  );
}

// ─── SyncIndicator ────────────────────────────────────────────────────────────
function SyncIndicator({ synced }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className={`h-2 w-2 rounded-full ${synced ? "bg-green-500" : "bg-yellow-400 animate-pulse"}`} />
      <span className="text-[10px] tracking-widest text-slate-500 uppercase">{synced ? "synced" : "syncing…"}</span>
    </div>
  );
}

// ─── UI Components ────────────────────────────────────────────────────────────
function SectionTitle({ children }) {
  return (
    <div className="mb-4 text-2xl tracking-[0.14em] text-slate-800" style={{ fontFamily: '"Bebas Neue", sans-serif' }}>
      {children}
    </div>
  );
}

function StatTile({ title, icon, onClick, tileClass }) {
  return (
    <button
      onClick={onClick}
      className={`flex min-h-36 flex-col items-center justify-start px-4 py-6 text-center transition-all duration-150 active:scale-[0.97] hover:brightness-105 ${tileClass}`}
    >
      <div className="text-xl tracking-[0.12em] text-slate-900" style={{ fontFamily: '"Bebas Neue", sans-serif' }}>
        {title}
      </div>
      <div className="mt-3 text-5xl">{icon}</div>
    </button>
  );
}

function ProgressRows({ rows, accentHex, achievements }) {
  return (
    <div className="space-y-2.5">
      {rows.map((row, idx) => (
        <div key={row.label} className="overflow-hidden rounded-sm bg-white/70 shadow-sm ring-1 ring-slate-200/80">
          <div className="px-3 pt-2.5 pb-1">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-medium text-slate-700">{row.label}</div>
                {achievements?.[row.label] ? (
                  <div className="text-[10px] uppercase tracking-[0.1em] text-slate-400 mt-0.5">
                    {achievements[row.label]}
                  </div>
                ) : null}
              </div>
              <div
                className="text-2xl tracking-wider text-slate-900 tabular-nums"
                style={{ fontFamily: '"Orbitron", monospace' }}
              >
                {typeof row.value === "number" ? String(row.value).padStart(2, "0") : row.value}
              </div>
            </div>
          </div>
          <div className="h-1.5 w-full bg-slate-100">
            <div
              className="h-1.5 transition-all duration-700 ease-out"
              style={{
                width: `${row.percent}%`,
                background: idx === 0
                  ? `linear-gradient(90deg, ${accentHex}, ${accentHex}dd)`
                  : accentHex,
                opacity: idx === 0 ? 1 : 0.6 + (rows.length - idx) * 0.08,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function TrackerCard({ title, rows, action, onAction, fullWidth = false, tileClass, accentClass, accentHex }) {
  return (
    <div className={`rounded-sm ${tileClass} p-4 shadow-sm ring-1 ring-slate-200/60 ${fullWidth ? "col-span-2" : ""}`}>
      <div className="mb-3 text-lg tracking-[0.12em] text-slate-900" style={{ fontFamily: '"Bebas Neue", sans-serif' }}>
        {title}
      </div>
      <ProgressRows rows={rows} accentHex={accentHex} />
      {action ? (
        <button
          onClick={onAction}
          className={`mt-4 w-full rounded-sm px-4 py-3 text-sm font-medium tracking-widest transition-all active:scale-[0.98] ${accentClass}`}
        >
          {action}
        </button>
      ) : null}
    </div>
  );
}

function UsefulTile({ title, subtitle, icon, onClick, panelClass }) {
  return (
    <button
      onClick={onClick}
      className={`${panelClass} rounded-sm p-4 text-center shadow-sm ring-1 ring-slate-200/60 transition-all active:scale-[0.97] hover:brightness-105`}
    >
      <div className="flex min-h-32 flex-col items-center justify-center gap-2">
        <div className="text-base leading-none tracking-[0.12em] text-slate-900" style={{ fontFamily: '"Bebas Neue", sans-serif' }}>
          {title}
        </div>
        {icon ? <div className="text-3xl text-slate-600">{icon}</div> : null}
        {subtitle ? <div className="text-xs text-slate-500">{subtitle}</div> : null}
      </div>
    </button>
  );
}

function SelectionModal({ dialog, onClose, onSelect, onBaeSortChange, currentBaeSort, accentClass }) {
  if (!dialog) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-sm bg-white p-5 shadow-2xl ring-1 ring-slate-300">
        <div className="mb-4 text-2xl tracking-[0.12em] text-slate-900" style={{ fontFamily: '"Bebas Neue", sans-serif' }}>
          {dialog.title}
        </div>
        {dialog.type === "bae-pick" ? (
          <div className="mb-3 grid grid-cols-3 gap-2 text-xs">
            {["number", "first", "last"].map((s) => (
              <button key={s} className={`rounded-sm px-2 py-2 uppercase tracking-widest ${currentBaeSort === s ? accentClass : "bg-slate-100 text-slate-600"}`} onClick={() => onBaeSortChange(s)}>
                {s}
              </button>
            ))}
          </div>
        ) : null}
        {dialog.type === "schedule" ? (
          <div className="space-y-2">
            {SPRING_TRAINING_GAMES.map((game) => (
              <div key={game} className="rounded-sm bg-slate-100 px-3 py-2 text-sm text-slate-800">{game}</div>
            ))}
            <button onClick={() => openExternal("https://www.mlb.com/mets/schedule")} className="mt-3 flex w-full items-center justify-center rounded-sm bg-slate-100 px-4 py-3">
              <img src="/mets-ny.png" alt="Mets NY" className="h-10 w-auto object-contain" />
            </button>
          </div>
        ) : (
          <div className="max-h-80 space-y-2 overflow-y-auto">
            {(dialog.options || []).map((option) => (
              <button
                key={option}
                onClick={() => onSelect(option)}
                className="w-full rounded-sm bg-slate-100 px-4 py-3 text-left text-slate-900 transition-colors hover:bg-slate-200"
              >
                {option}
              </button>
            ))}
          </div>
        )}
        <button onClick={onClose} className={`mt-4 w-full rounded-sm px-4 py-3 font-medium tracking-widest ${accentClass}`}>
          CLOSE
        </button>
      </div>
    </div>
  );
}

function ModeSplash({ modeKey }) {
  if (!modeKey) return null;
  const mode = MODE_META[modeKey];
  return (
    <div className={`fixed inset-0 z-40 flex items-center justify-center ${mode.splashClass} backdrop-blur-[3px]`}>
      <div className="animate-pulse text-center px-6">
        <div className="text-[8rem]">{mode.emoji}</div>
        <div className="mt-5 text-4xl tracking-[0.12em] text-slate-900" style={{ fontFamily: '"Bebas Neue", sans-serif' }}>
          {mode.splashLines[0]}
        </div>
        {mode.splashLines[1] ? (
          <div className="text-3xl tracking-[0.1em] text-slate-700 mt-2" style={{ fontFamily: '"Bebas Neue", sans-serif' }}>
            {mode.splashLines[1]}
          </div>
        ) : null}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Page() {
  const [screen, setScreen] = useState("home");
  const [mode, setMode] = useState("citi");
  const [modeSplash, setModeSplash] = useState(null);
  const [dialog, setDialog] = useState(null);
  const [generatorOutput, setGeneratorOutput] = useState("");
  const [baeSort, setBaeSort] = useState("number");
  const [triviaQuestion, setTriviaQuestion] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [humidityData, setHumidityData] = useState({ value: null, loading: false });
  const [synced, setSynced] = useState(false);

  // All synced state lives here
  const [baePlayers, setBaePlayers] = useState(INITIAL_BAE_PLAYERS);
  const [rawEggCategories, setRawEggCategories] = useState(DEFAULT_RAW_EGG_CATEGORIES);
  const [floridaCategories, setFloridaCategories] = useState(DEFAULT_FLORIDA_CATEGORIES);
  const [trackers, setTrackers] = useState(DEFAULT_TRACKERS);
  const [baeVoterChoice, setBaeVoterChoice] = useState(DEFAULT_BAE_VOTERS);
  const [customGenerators, setCustomGenerators] = useState({
    chaosSubjects: [], chaosActions: [], chaosContexts: [], chaosOutcomes: [],
    floridaSubjects: [], floridaActions: [], floridaObjects: [],
    prophecyCards: [], prophecyOmens: [], prophecyTimings: [],
  });

  const isWriting = useRef(false);

  // ── Firebase sync ──────────────────────────────────────────────────────────
  useEffect(() => {
    const dbRef = ref(db, "tripData");
    const unsub = onValue(dbRef, (snapshot) => {
      if (isWriting.current) return;
      const data = snapshot.val();
      if (data) {
        if (data.trackers) setTrackers(data.trackers);
        if (data.baeVoterChoice) setBaeVoterChoice(data.baeVoterChoice);
        if (data.baePlayers) setBaePlayers(data.baePlayers);
        if (data.rawEggCategories) setRawEggCategories(data.rawEggCategories);
        if (data.floridaCategories) setFloridaCategories(data.floridaCategories);
        if (data.customGenerators) setCustomGenerators(data.customGenerators);
      }
      setSynced(true);
    });
    return () => unsub();
  }, []);

  const pushToFirebase = (patch) => {
    isWriting.current = true;
    setSynced(false);
    update(ref(db, "tripData"), patch).then(() => {
      isWriting.current = false;
      setSynced(true);
    });
  };

  // ── Derived ────────────────────────────────────────────────────────────────
  const currentMode = MODE_META[mode];
  const sortedRoster = useMemo(() => sortRosterBy(baePlayers, baeSort), [baePlayers, baeSort]);
  const metsBaeCounts = useMemo(() => getBaeVoteCounts(baePlayers, baeVoterChoice), [baePlayers, baeVoterChoice]);

  const bestIndex = useMemo(() => {
    const rows = PEOPLE.map((person) => {
      const score = (trackers.glizzy[person] || 0) * 3 + (trackers.sunCruiser[person] || 0) * 2;
      return [person, score];
    });
    return rowsWithProgress(rows);
  }, [trackers]);

  const glizzyRows = rowsWithProgress(Object.entries(trackers.glizzy));
  const sunCruiserRows = rowsWithProgress(Object.entries(trackers.sunCruiser));
  const rawEggRows = rowsWithProgress(Object.entries(trackers.rawEgg));
  const floridaRows = rowsWithProgress(Object.entries(trackers.florida));
  const metsBaeRows = rowsWithProgress(Object.entries(metsBaeCounts));
  const glizzyAchievements = Object.fromEntries(Object.entries(trackers.glizzy).map(([n, v]) => [n, getAchievement(v, GLIZZY_LEVELS)]));
  const sunCruiserAchievements = Object.fromEntries(Object.entries(trackers.sunCruiser).map(([n, v]) => [n, getAchievement(v, SUN_CRUISER_LEVELS)]));

  const baeVoteSummaryRows = useMemo(() => {
    const tally = Object.entries(baeVoterChoice).reduce((acc, [person, player]) => {
      acc[player] = acc[player] || { votes: 0, people: [] };
      acc[player].votes += 1;
      acc[player].people.push(person);
      return acc;
    }, {});
    return Object.entries(tally).filter(([, info]) => info.votes > 0).sort((a, b) => b[1].votes - a[1].votes || a[0].localeCompare(b[0]));
  }, [baeVoterChoice]);

  // ── Actions ────────────────────────────────────────────────────────────────
  const handleModeChange = (nextMode) => {
    setMode(nextMode);
    setModeSplash(nextMode);
    setTimeout(() => setModeSplash(null), 2200);
  };

  const incrementTracker = (key, rowKey) => {
    const next = { ...trackers, [key]: { ...trackers[key], [rowKey]: (trackers[key][rowKey] || 0) + 1 } };
    setTrackers(next);
    pushToFirebase({ trackers: next });
  };

  const decrementTracker = (key, rowKey) => {
    const next = { ...trackers, [key]: { ...trackers[key], [rowKey]: Math.max(0, (trackers[key][rowKey] || 0) - 1) } };
    setTrackers(next);
    pushToFirebase({ trackers: next });
  };

  const resetAllTrackers = () => {
    if (!window.confirm("Reset all tracker information?")) return;
    setTrackers(DEFAULT_TRACKERS);
    setBaeVoterChoice(DEFAULT_BAE_VOTERS);
    setGeneratorOutput("");
    setTriviaQuestion(null);
    setShowAnswer(false);
    pushToFirebase({ trackers: DEFAULT_TRACKERS, baeVoterChoice: DEFAULT_BAE_VOTERS });
  };

  const openPersonDialog = (trackerKey, title) => {
    setDialog({
      type: "basic",
      title,
      options: PEOPLE,
      onChoose: (option) => incrementTracker(trackerKey, option),
    });
  };

  const openCategoryDialog = (trackerKey, title, categories, setCategories) => {
    const active = categories.filter((x) => typeof trackers[trackerKey][x] !== "undefined");
    setDialog({
      type: "basic",
      title,
      options: [...active, "CREATE CATEGORY"],
      onChoose: (option) => {
        if (option === "CREATE CATEGORY") {
          const newCategory = window.prompt("TYPE A NEW CATEGORY IN ALL CAPS:");
          if (!newCategory) return;
          const normalized = newCategory.toUpperCase();
          const nextCategories = categories.includes(normalized) ? categories : [...categories, normalized];
          setCategories(nextCategories);
          const next = { ...trackers, [trackerKey]: { ...trackers[trackerKey], [normalized]: (trackers[trackerKey][normalized] || 0) + 1 } };
          setTrackers(next);
          pushToFirebase({ trackers: next });
        } else {
          incrementTracker(trackerKey, option);
        }
      },
    });
  };

  const openBaeVoterDialog = () => {
    setDialog({
      type: "basic",
      title: "WHO IS VOTING?",
      options: PEOPLE,
      onChoose: (voter) => {
        setDialog({
          type: "bae-pick",
          title: `${voter.toUpperCase()} PICKS METS BAE`,
          options: sortedRoster.map(formatPlayer),
          onChoose: (choice) => {
            const next = { ...baeVoterChoice, [voter]: choice };
            setBaeVoterChoice(next);
            pushToFirebase({ baeVoterChoice: next });
          },
        });
      },
    });
  };

  const handleDialogSelect = (option) => {
    if (!dialog?.onChoose) return;
    dialog.onChoose(option);
    setDialog(null);
  };

  const handleBaeSortChange = (sortValue) => {
    setBaeSort(sortValue);
    if (dialog?.type === "bae-pick") {
      setDialog((prev) => ({ ...prev, options: sortRosterBy(baePlayers, sortValue).map(formatPlayer) }));
    }
  };

  const addBaePlayer = () => {
    const number = window.prompt("PLAYER NUMBER:");
    if (!number) return;
    const first = window.prompt("FIRST NAME:");
    if (!first) return;
    const last = window.prompt("LAST NAME:");
    if (!last) return;
    const next = [...baePlayers, { id: Date.now(), number, first, last }];
    setBaePlayers(next);
    pushToFirebase({ baePlayers: next });
  };

  const updateHumidity = async () => {
    if (!navigator.geolocation) return;
    setHumidityData({ value: null, loading: true });
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=relative_humidity_2m`;
          const res = await fetch(url);
          const data = await res.json();
          const value = data?.current?.relative_humidity_2m ?? null;
          setHumidityData({ value, loading: false });
        } catch {
          setHumidityData({ value: null, loading: false });
        }
      },
      () => setHumidityData({ value: null, loading: false })
    );
  };

  const openNearbyChainRestaurants = () => {
    if (!navigator.geolocation) { openExternal("https://www.google.com/maps/search/chain+restaurants"); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => { const { latitude, longitude } = pos.coords; openExternal(`https://www.google.com/maps/search/chain+restaurants/@${latitude},${longitude},14z`); },
      () => openExternal("https://www.google.com/maps/search/chain+restaurants")
    );
  };

  const generateChaos = () => {
    const subjects = ["Francisco Alvarez","Mark Vientos","Juan Soto","Brett Baty","Luis Torrens","a random Mets reliever","the Clover Park scoreboard",...customGenerators.chaosSubjects];
    const actions = ["creates avoidable chaos","becomes the main character","starts something weird","triggers a Mets Bae vote",...customGenerators.chaosActions];
    const contexts = ["during brutal humidity","right after a Sun Cruiser is cracked","during the 7th inning","with two outs and weird energy",...customGenerators.chaosContexts];
    const outcomes = ["and the group loses composure.","and nobody can explain what just happened.","and a new inside joke is born.",...customGenerators.chaosOutcomes];
    setGeneratorOutput(`${pick(subjects)} ${pick(actions)} ${pick(contexts)}, ${pick(outcomes)}`);
  };

  const generateFlorida = () => {
    const subjects = ["FLORIDA MAN","PORT ST. LUCIE MAN","SHIRTLESS MAN",...customGenerators.floridaSubjects];
    const actions = ["appears in the parking lot","is spotted arguing with a menu","radiates unbelievable Florida energy",...customGenerators.floridaActions];
    const objects = ["next to a TRUMP sign","outside a Cheesecake Factory","with live laugh love energy",...customGenerators.floridaObjects];
    setGeneratorOutput(`${pick(subjects)} ${pick(actions)} ${pick(objects)}.`);
  };

  const generateProphecy = () => {
    const cards = ["THE TOWER OF PORT ST. LUCIE","THE HIGH PRIESTESS OF HUMIDITY","THE SUN CRUISER","THE GLIZZY MOON",...customGenerators.prophecyCards];
    const omens = ["foretells a dugout disturbance","warns of preventable Mets chaos","points toward a sudden Mets Bae surge",...customGenerators.prophecyOmens];
    const timings = ["before the 5th inning","during a pitching change","while the humidity hits 92%",...customGenerators.prophecyTimings];
    setGeneratorOutput(`CLOVER PARK PROPHECY: ${pick(cards)} ${pick(omens)} ${pick(timings)}.`);
  };

  const getTriviaQuestion = (category) => {
    if (category === "mets") setTriviaQuestion(pick(METS_TRIVIA));
    if (category === "rules") setTriviaQuestion(pick(RULES_TRIVIA));
    if (category === "nyc") setTriviaQuestion(pick(NYC_TRIVIA));
    setShowAnswer(false);
  };

  const addCustomGeneratorValue = (key) => {
    const value = window.prompt(`ADD A NEW ${key.toUpperCase()} OPTION:`);
    if (!value) return;
    const next = { ...customGenerators, [key]: [...customGenerators[key], value] };
    setCustomGenerators(next);
    pushToFirebase({ customGenerators: next });
  };

  const getCurrentHumidityLabel = () => {
    if (humidityData.loading) return "loading…";
    if (humidityData.value === null) return "tap to update";
    return `${humidityData.value}% now`;
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  const isLfgbtqm = mode === "lfgbtqm";

  return (
    <div className={`min-h-screen text-slate-900 ${isLfgbtqm ? "" : currentMode.wrapper}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Bebas+Neue&family=Orbitron:wght@500;700&display=swap');
        * { font-family: Inter, sans-serif; }

        @keyframes chaosBurst {
          0%   { transform: translate(0,0) rotate(0deg) scale(0.2); opacity: 0; }
          10%  { opacity: 1; }
          40%  { transform: translate(calc(var(--dx)*0.5),calc(var(--dy)*0.5)) rotate(calc(var(--rot)*0.4)) scale(1.1); }
          70%  { transform: translate(calc(var(--dx)*-0.1),calc(var(--dy)*0.9)) rotate(calc(var(--rot)*-0.1)) scale(0.95); }
          100% { transform: translate(var(--dx),var(--dy)) rotate(var(--rot)) scale(0.7); opacity: 0; }
        }

        @keyframes rainbowShift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .lfgbtqm-bg {
          background: linear-gradient(270deg,
            #ff0056, #ff6b00, #ffe000, #00c07f, #0088ff, #8800ff, #ff0056
          );
          background-size: 400% 400%;
          animation: rainbowShift 6s ease infinite;
        }

        .lfgbtqm-tile {
          background: rgba(255,255,255,0.25) !important;
          backdrop-filter: blur(4px);
        }

        .lfgbtqm-panel {
          background: rgba(255,255,255,0.35) !important;
          backdrop-filter: blur(8px);
        }
      `}</style>

      <EmojiShower emojis={currentMode.showerEmojis} enabled={currentMode.showerEmojis.length > 0} modeKey={mode} />

      <div className="min-h-screen" style={{ backgroundImage: isLfgbtqm ? "none" : currentMode.pinstripes }}>
        <ModeSplash modeKey={modeSplash} />
        <SelectionModal
          dialog={dialog}
          onClose={() => setDialog(null)}
          onSelect={handleDialogSelect}
          onBaeSortChange={handleBaeSortChange}
          currentBaeSort={baeSort}
          accentClass={currentMode.accent}
        />

        <div className="mx-auto max-w-md px-4 pb-8 pt-6">

          {/* ── HOME ── */}
          {screen === "home" && (
            <>
              <div className="mb-2 flex items-center justify-between">
                <div />
                <SyncIndicator synced={synced} />
              </div>

              <div className="mb-6 flex items-start justify-center">
                <img src="/the-best-logo.png" alt="The Best" className="block w-full object-contain" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <StatTile title="TRACKERS" icon="🌭" onClick={() => setScreen("trackers")} tileClass={isLfgbtqm ? "lfgbtqm-tile rounded-sm" : currentMode.tile} />
                <StatTile title="GENERATORS" icon="🎲" onClick={() => setScreen("generators")} tileClass={isLfgbtqm ? "lfgbtqm-tile rounded-sm" : currentMode.tile} />
                <StatTile title="TRIVIA" icon="🧠" onClick={() => setScreen("trivia")} tileClass={isLfgbtqm ? "lfgbtqm-tile rounded-sm" : currentMode.tile} />
                <StatTile title="USEFUL INFO" icon="📋" onClick={() => setScreen("useful")} tileClass={isLfgbtqm ? "lfgbtqm-tile rounded-sm" : currentMode.tile} />
              </div>

              <div className="mt-5 text-center">
                <div className="text-[7rem]">{currentMode.emoji}</div>
              </div>

              <div className={`mt-4 rounded-sm px-4 py-3 shadow-sm ring-1 ring-slate-200 ${isLfgbtqm ? "lfgbtqm-panel" : currentMode.panel}`}>
                <div className="grid grid-cols-3 gap-2 text-[11px]">
                  {Object.entries(MODE_META).map(([key, value]) => (
                    <button
                      key={key}
                      onClick={() => handleModeChange(key)}
                      className={`rounded-sm px-2 py-2 tracking-[0.1em] transition-all ${mode === key ? currentMode.accent : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
                      style={{ fontFamily: '"Bebas Neue", sans-serif' }}
                    >
                      {value.button}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 items-stretch gap-3">
                <button
                  onClick={() => setScreen("leaderboard")}
                  className={`flex items-center justify-center rounded-sm px-3 py-4 text-center text-xl tracking-[0.12em] text-slate-700 shadow-sm ring-1 ring-slate-200 ${isLfgbtqm ? "lfgbtqm-panel" : currentMode.panel}`}
                  style={{ fontFamily: '"Bebas Neue", sans-serif' }}
                >
                  LEADERBOARD
                </button>

                <div className={`flex flex-col items-center justify-center rounded-sm px-3 py-4 shadow-sm ring-1 ring-slate-200 ${isLfgbtqm ? "lfgbtqm-panel" : currentMode.panel}`}>
                  <button onClick={() => openExternal("https://www.mlb.com/mets")}>
                    <img src="/mets-ny.png" alt="Mets NY" className="mx-auto h-16 w-24 object-contain" />
                  </button>
                  <button onClick={() => openExternal("https://www.gluearch.com")} className="mt-3">
                    <img src="/glue-logo.png" alt="GLUE" className="mx-auto h-6 w-24 object-contain opacity-50" />
                  </button>
                </div>

                <button
                  onClick={() => setScreen("admin")}
                  className={`flex items-center justify-center rounded-sm px-3 py-4 text-center text-xl tracking-[0.12em] text-slate-700 shadow-sm ring-1 ring-slate-200 ${isLfgbtqm ? "lfgbtqm-panel" : currentMode.panel}`}
                  style={{ fontFamily: '"Bebas Neue", sans-serif', lineHeight: "1.05rem" }}
                >
                  <span>STEVE<br />COHEN<br />MODE</span>
                </button>
              </div>
            </>
          )}

          {/* ── TRACKERS ── */}
          {screen === "trackers" && (
            <>
              <button className="mb-4 text-sm text-slate-500 hover:text-slate-800" onClick={() => setScreen("home")}>← Back</button>
              <div className="mb-4 flex items-center justify-between">
                <SectionTitle>TRACKERS</SectionTitle>
                <SyncIndicator synced={synced} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <TrackerCard title="METS BAE" rows={metsBaeRows} action="VOTE BAE" onAction={openBaeVoterDialog} fullWidth tileClass={isLfgbtqm ? "lfgbtqm-tile" : currentMode.tile} accentClass={currentMode.accent} accentHex={currentMode.accentHex} />
                <TrackerCard title="GLIZZY TRACKER" rows={glizzyRows} action="+ ADD" onAction={() => openPersonDialog("glizzy", "WHO GETS THE GLIZZY?")} tileClass={isLfgbtqm ? "lfgbtqm-tile" : currentMode.tile} accentClass={currentMode.accent} accentHex={currentMode.accentHex} />
                <TrackerCard title="SUN CRUISER TRACKER" rows={sunCruiserRows} action="+ ADD" onAction={() => openPersonDialog("sunCruiser", "WHO GETS THE SUN CRUISER?")} tileClass={isLfgbtqm ? "lfgbtqm-tile" : currentMode.tile} accentClass={currentMode.accent} accentHex={currentMode.accentHex} />
                <TrackerCard title="RAW EGG TRACKER" rows={rawEggRows} action="+ ADD" onAction={() => openCategoryDialog("rawEgg", "SELECT RAW EGG CATEGORY", rawEggCategories, setRawEggCategories)} tileClass={isLfgbtqm ? "lfgbtqm-tile" : currentMode.tile} accentClass={currentMode.accent} accentHex={currentMode.accentHex} />
                <TrackerCard title="FLORIDA TRACKER" rows={floridaRows} action="+ ADD" onAction={() => openCategoryDialog("florida", "SELECT FLORIDA CATEGORY", floridaCategories, setFloridaCategories)} tileClass={isLfgbtqm ? "lfgbtqm-tile" : currentMode.tile} accentClass={currentMode.accent} accentHex={currentMode.accentHex} />
              </div>
            </>
          )}

          {/* ── GENERATORS ── */}
          {screen === "generators" && (
            <>
              <button className="mb-4 text-sm text-slate-500 hover:text-slate-800" onClick={() => setScreen("home")}>← Back</button>
              <SectionTitle>GENERATORS</SectionTitle>
              <div className="space-y-3">
                {[["METS CHAOS", generateChaos], ["FLORIDA MAN", generateFlorida], ["CLOVER PARK PROPHECY", generateProphecy]].map(([label, fn]) => (
                  <button key={label} onClick={fn} className={`w-full rounded-sm p-4 text-left shadow-sm ring-1 ring-slate-200 transition-all active:scale-[0.98] ${isLfgbtqm ? "lfgbtqm-panel" : currentMode.panel}`}>
                    <div className="text-lg tracking-[0.12em]" style={{ fontFamily: '"Bebas Neue", sans-serif' }}>{label}</div>
                  </button>
                ))}
                {generatorOutput ? (
                  <div className={`rounded-sm p-4 text-slate-800 shadow-sm ring-1 ring-slate-200 ${isLfgbtqm ? "lfgbtqm-panel" : currentMode.panel}`}>
                    {generatorOutput}
                  </div>
                ) : null}
              </div>
            </>
          )}

          {/* ── TRIVIA ── */}
          {screen === "trivia" && (
            <>
              <button className="mb-4 text-sm text-slate-500 hover:text-slate-800" onClick={() => setScreen("home")}>← Back</button>
              <SectionTitle>TRIVIA</SectionTitle>
              <div className="space-y-3">
                {[["METS TRIVIA", "mets"], ["BASEBALL RULES TRIVIA", "rules"], ["NEW YORK CITY TRIVIA", "nyc"]].map(([label, key]) => (
                  <button key={key} onClick={() => getTriviaQuestion(key)} className={`w-full rounded-sm p-4 text-left shadow-sm ring-1 ring-slate-200 transition-all active:scale-[0.98] ${isLfgbtqm ? "lfgbtqm-panel" : currentMode.panel}`}>
                    <div className="text-lg tracking-[0.12em]" style={{ fontFamily: '"Bebas Neue", sans-serif' }}>{label}</div>
                  </button>
                ))}
                {triviaQuestion ? (
                  <>
                    <div className={`rounded-sm p-4 shadow-sm ring-1 ring-slate-200 ${isLfgbtqm ? "lfgbtqm-panel" : currentMode.panel}`}>{triviaQuestion.q}</div>
                    <button onClick={() => setShowAnswer((v) => !v)} className={`w-full rounded-sm p-4 font-medium tracking-widest ${currentMode.accent}`}>ANSWER</button>
                    {showAnswer ? <div className={`rounded-sm p-4 shadow-sm ring-1 ring-slate-200 ${isLfgbtqm ? "lfgbtqm-panel" : currentMode.panel}`}>{triviaQuestion.a}</div> : null}
                  </>
                ) : null}
              </div>
            </>
          )}

          {/* ── USEFUL INFO ── */}
          {screen === "useful" && (
            <>
              <button className="mb-4 text-sm text-slate-500 hover:text-slate-800" onClick={() => setScreen("home")}>← Back</button>
              <SectionTitle>USEFUL INFORMATION</SectionTitle>
              <div className="grid grid-cols-2 gap-3">
                <UsefulTile title="CURRENT HUMIDITY IN PORT ST LUCIE" subtitle={getCurrentHumidityLabel()} onClick={updateHumidity} panelClass={isLfgbtqm ? "lfgbtqm-panel" : currentMode.panel} />
                <UsefulTile title="GAME DAY FORECAST" subtitle="OPEN WEATHER.COM" onClick={() => openExternal("https://weather.com/weather/today/l/Port+St.+Lucie+FL")} panelClass={isLfgbtqm ? "lfgbtqm-panel" : currentMode.panel} />
                <UsefulTile title="SPRING TRAINING SCHEDULE" subtitle="MAR 18–24" icon={<CalendarDays size={26} />} onClick={() => setDialog({ type: "schedule", title: "SPRING TRAINING SCHEDULE", options: [] })} panelClass={isLfgbtqm ? "lfgbtqm-panel" : currentMode.panel} />
                <UsefulTile title="CLOVER PARK INFO" subtitle="OPEN GUIDE" icon={<MapPin size={26} />} onClick={() => openExternal("https://www.mlb.com/news/featured/visit-clover-park-home-of-the-st-lucie-mets")} panelClass={isLfgbtqm ? "lfgbtqm-panel" : currentMode.panel} />
                <UsefulTile title="SCORECARD GUIDE" subtitle="OPEN GUIDE PAGE" icon={<BookOpen size={26} />} onClick={() => setScreen("scorecard")} panelClass={isLfgbtqm ? "lfgbtqm-panel" : currentMode.panel} />
                <UsefulTile title="NEARBY CHAIN RESTAURANTS" subtitle="USE CURRENT LOCATION" icon={<Building2 size={26} />} onClick={openNearbyChainRestaurants} panelClass={isLfgbtqm ? "lfgbtqm-panel" : currentMode.panel} />
                <UsefulTile title="NEAREST MARGARITAVILLE" subtitle="OPEN NEARBY SEARCH" onClick={() => openExternal("https://www.google.com/maps/search/Margaritaville")} panelClass={isLfgbtqm ? "lfgbtqm-panel" : currentMode.panel} />
                <UsefulTile title="NEAREST CHEESECAKE FACTORY" subtitle="OPEN NEARBY SEARCH" onClick={() => openExternal("https://www.google.com/maps/search/Cheesecake+Factory")} panelClass={isLfgbtqm ? "lfgbtqm-panel" : currentMode.panel} />
              </div>
            </>
          )}

          {/* ── SCORECARD ── */}
          {screen === "scorecard" && (
            <>
              <button className="mb-4 text-sm text-slate-500 hover:text-slate-800" onClick={() => setScreen("useful")}>← Back</button>
              <SectionTitle>SCORECARD GUIDE</SectionTitle>
              <div className={`rounded-sm shadow-sm ${isLfgbtqm ? "lfgbtqm-panel" : currentMode.panel} space-y-4 p-4 ring-1 ring-slate-200`}>
                {SCORECARD_SECTIONS.map((section) => (
                  <div key={section.title} className="border-b border-slate-200 pb-4 last:border-b-0">
                    <div className="mb-2 text-lg tracking-[0.12em] text-slate-900" style={{ fontFamily: '"Bebas Neue", sans-serif' }}>{section.title}</div>
                    <ul className="space-y-1 text-sm text-slate-700">{section.body.map((item) => <li key={item}>• {item}</li>)}</ul>
                    <button onClick={() => openExternal(section.youtube)} className="mt-3 text-xs text-slate-500 underline underline-offset-2">YouTube explanation</button>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ── LFGBTQM SCREEN ── */}
          {screen === "lfgbtqm-bae" && (
            <>
              <button className="mb-4 text-sm text-white/80 hover:text-white" onClick={() => setScreen("home")}>← Back</button>
              <div className="mb-4 text-2xl tracking-[0.14em] text-white drop-shadow" style={{ fontFamily: '"Bebas Neue", sans-serif' }}>
                🏳️‍🌈 METS BAE POWER RANKINGS
              </div>
              <div className="space-y-3">
                {BAE_HOTNESS.map((player, idx) => (
                  <div key={player.number} className="rounded-sm bg-white/30 p-4 backdrop-blur-sm ring-1 ring-white/40 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="text-3xl font-black text-white/60 w-8 shrink-0" style={{ fontFamily: '"Orbitron", monospace' }}>
                        {idx + 1}
                      </div>
                      <div>
                        <div className="text-lg tracking-[0.1em] text-white font-semibold" style={{ fontFamily: '"Bebas Neue", sans-serif' }}>
                          #{player.number} {player.name}
                        </div>
                        <div className="text-sm text-white/80 mt-0.5">{player.note}</div>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="rounded-sm bg-white/20 p-3 text-center text-xs text-white/70 backdrop-blur-sm">
                  Rankings are purely aesthetic and absolutely official. No notes.
                </div>
              </div>
            </>
          )}

          {/* ── ADMIN ── */}
          {screen === "admin" && (
            <>
              <button className="mb-4 text-sm text-slate-500 hover:text-slate-800" onClick={() => setScreen("home")}>← Back</button>
              <div className="mb-4 flex items-center justify-between">
                <SectionTitle>STEVE COHEN MODE</SectionTitle>
                <SyncIndicator synced={synced} />
              </div>

              <div className="space-y-3">
                {[["GLIZZIES", "glizzy"], ["SUN CRUISERS", "sunCruiser"], ["RAW EGG", "rawEgg"], ["FLORIDA", "florida"]].map(([label, key]) => (
                  <div key={key} className={`rounded-sm ${isLfgbtqm ? "lfgbtqm-panel" : currentMode.panel} p-4 shadow-sm ring-1 ring-slate-200`}>
                    <div className="mb-3 text-lg tracking-[0.12em]" style={{ fontFamily: '"Bebas Neue", sans-serif' }}>{label}</div>
                    <div className="space-y-2">
                      {sortRowsWithRules(Object.entries(trackers[key])).map(([name, value]) => (
                        <div key={name} className="flex items-center justify-between rounded-sm bg-slate-50 px-3 py-2">
                          <div className="text-sm">{name}</div>
                          <div className="flex items-center gap-2">
                            <button className={`rounded-sm px-3 py-1 ${currentMode.accent}`} onClick={() => decrementTracker(key, name)}>−</button>
                            <div className="w-10 text-center text-lg" style={{ fontFamily: '"Orbitron", monospace' }}>{value}</div>
                            <button className={`rounded-sm px-3 py-1 ${currentMode.accent}`} onClick={() => incrementTracker(key, name)}>+</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                <div className={`rounded-sm ${isLfgbtqm ? "lfgbtqm-panel" : currentMode.panel} p-4 shadow-sm ring-1 ring-slate-200`}>
                  <div className="mb-3 text-lg tracking-[0.12em]" style={{ fontFamily: '"Bebas Neue", sans-serif' }}>METS BAE PLAYERS</div>
                  <button onClick={addBaePlayer} className={`mb-3 w-full rounded-sm px-4 py-3 font-medium tracking-widest ${currentMode.accent}`}>ADD PLAYER</button>
                  <div className="space-y-2">
                    {sortRosterBy(baePlayers, baeSort).map((player) => {
                      const label = formatPlayer(player);
                      const count = metsBaeCounts[label] || 0;
                      return (
                        <div key={label} className="flex items-center justify-between rounded-sm bg-slate-50 px-3 py-2">
                          <div className="text-sm">{label}</div>
                          <div className="flex items-center gap-2">
                            <button className={`rounded-sm px-3 py-1 ${currentMode.accent}`} onClick={() => {
                              const currentVotes = getBaeVoteCounts(baePlayers, baeVoterChoice);
                              if ((currentVotes[label] || 0) <= 0) return;
                              const voter = Object.keys(baeVoterChoice).find((name) => baeVoterChoice[name] === label);
                              if (!voter) return;
                              const next = { ...baeVoterChoice, [voter]: "" };
                              setBaeVoterChoice(next);
                              pushToFirebase({ baeVoterChoice: next });
                            }}>−</button>
                            <div className="w-10 text-center text-lg" style={{ fontFamily: '"Orbitron", monospace' }}>{count}</div>
                            <button className={`rounded-sm px-3 py-1 ${currentMode.accent}`} onClick={openBaeVoterDialog}>+</button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className={`rounded-sm ${isLfgbtqm ? "lfgbtqm-panel" : currentMode.panel} p-4 shadow-sm ring-1 ring-slate-200`}>
                  <div className="mb-3 text-lg tracking-[0.12em]" style={{ fontFamily: '"Bebas Neue", sans-serif' }}>WHO VOTED FOR WHO</div>
                  <div className="space-y-2">
                    {baeVoteSummaryRows.map(([player, info]) => (
                      <div key={player} className="rounded-sm bg-slate-50 px-3 py-2">
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-slate-900">{player}</div>
                          <div className="text-sm text-slate-500">{info.votes} vote{info.votes !== 1 ? "s" : ""}</div>
                        </div>
                        <div className="mt-1 text-xs text-slate-600">{info.people.join(", ")}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`rounded-sm ${isLfgbtqm ? "lfgbtqm-panel" : currentMode.panel} p-4 shadow-sm ring-1 ring-slate-200`}>
                  <div className="mb-3 text-lg tracking-[0.12em]" style={{ fontFamily: '"Bebas Neue", sans-serif' }}>GENERATOR DEFAULTS</div>
                  <div className="space-y-2">
                    {["chaosSubjects", "chaosActions", "chaosContexts", "chaosOutcomes", "floridaSubjects", "floridaActions", "floridaObjects", "prophecyCards", "prophecyOmens", "prophecyTimings"].map((key) => (
                      <button key={key} onClick={() => addCustomGeneratorValue(key)} className="w-full rounded-sm bg-slate-100 px-4 py-2.5 text-left text-sm hover:bg-slate-200">
                        ADD TO {key.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <button onClick={resetAllTrackers} className="w-full rounded-sm bg-red-600 px-4 py-4 font-medium text-white hover:bg-red-700">
                  TOTAL RESET
                </button>
              </div>
            </>
          )}

          {/* ── LEADERBOARD ── */}
          {screen === "leaderboard" && (
            <>
              <button className="mb-4 text-sm text-slate-500 hover:text-slate-800" onClick={() => setScreen("home")}>← Back</button>
              <SectionTitle>THE BEST LEADERBOARD</SectionTitle>
              <div className="space-y-3">
                {[
                  ["THE BEST INDEX", bestIndex, null],
                  ["METS BAE VOTES", metsBaeRows, null],
                  ["GLIZZIES", glizzyRows, glizzyAchievements],
                  ["SUN CRUISERS", sunCruiserRows, sunCruiserAchievements],
                ].map(([title, rows, achievements]) => (
                  <div key={title} className={`rounded-sm ${isLfgbtqm ? "lfgbtqm-panel" : currentMode.panel} p-4 shadow-sm ring-1 ring-slate-200`}>
                    <div className="mb-3 text-lg tracking-[0.12em]" style={{ fontFamily: '"Bebas Neue", sans-serif' }}>{title}</div>
                    <ProgressRows rows={rows} accentHex={currentMode.accentHex} achievements={achievements} />
                  </div>
                ))}

                {mode === "lfgbtqm" && (
                  <button
                    onClick={() => setScreen("lfgbtqm-bae")}
                    className="w-full rounded-sm bg-white/30 p-4 text-center text-lg tracking-[0.12em] text-white backdrop-blur-sm ring-1 ring-white/40 shadow-sm"
                    style={{ fontFamily: '"Bebas Neue", sans-serif' }}
                  >
                    🏳️‍🌈 METS BAE POWER RANKINGS
                  </button>
                )}
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
