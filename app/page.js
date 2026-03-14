"use client";

import React, { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, update } from "firebase/database";

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

const CLOVER_PARK_LAT = 27.2935;
const CLOVER_PARK_LNG = -80.3876;

const INITIAL_BAE_PLAYERS = [
  { id: 1, number: "4",  first: "Francisco", last: "Alvarez" },
  { id: 2, number: "12", first: "Francisco", last: "Lindor"  },
  { id: 4, number: "22", first: "Juan",       last: "Soto"    },
  { id: 5, number: "27", first: "Mark",       last: "Vientos" },
  { id: 6, number: "7",  first: "Brett",      last: "Baty"    },
  { id: 8, number: "30", first: "Tyrone",     last: "Taylor"  },
];

const DEFAULT_TRACKERS = {
  glizzy:      { Brian: 0, Nick: 0, Ted: 0, Hailey: 0, Fe: 0 },
  sunCruiser:  { Brian: 0, Nick: 0, Ted: 0, Hailey: 0, Fe: 0 },
  margarita:   { Brian: 0, Nick: 0, Ted: 0, Hailey: 0, Fe: 0 },
  rawEgg:      { "RAW EGG": 0, ADJACENT: 0 },
  florida:     { "SHIRTLESS MAN": 0, "TRUMP SIGN": 0, "LIVE LAUGH LOVE ENERGY": 0 },
};

const DEFAULT_BAE_VOTERS = {
  Brian:  "4 Francisco Alvarez",
  Nick:   "27 Mark Vientos",
  Ted:    "22 Juan Soto",
  Hailey: "4 Francisco Alvarez",
  Fe:     "27 Mark Vientos",
};

const DEFAULT_RAW_EGG_CATEGORIES = ["RAW EGG", "ADJACENT"];
const DEFAULT_FLORIDA_CATEGORIES  = ["SHIRTLESS MAN", "TRUMP SIGN", "LIVE LAUGH LOVE ENERGY"];

const SPRING_TRAINING_GAMES = [
  "Wed Mar 18 — OFF DAY",
  "Thu Mar 19 — 7:10 PM — vs Rays (Spring Breakout) — Clover Park",
  "Fri Mar 20 — 1:10 PM — vs Cardinals — Clover Park",
  "Sat Mar 21 — 1:10 PM — vs Astros (split squad) — Clover Park",
  "Sat Mar 21 — 1:05 PM — @ Nationals (split squad) — CACTI Park",
  "Sun Mar 22 — 1:05 PM — @ Marlins — Roger Dean Chevrolet Stadium",
  "Mon Mar 23 — OFF DAY — Final prep before Opening Day",
  "Tue Mar 24 — OFF DAY — Opening Day: Mar 26 vs Pirates @ Citi Field",
];

const SCORECARD_SECTIONS = [
  { title: "FIELDING NUMBERS", body: ["1 = Pitcher","2 = Catcher","3 = First Base","4 = Second Base","5 = Third Base","6 = Shortstop","7 = Left Field","8 = Center Field","9 = Right Field"], youtube: "https://www.youtube.com/results?search_query=baseball+scorecard+fielding+numbers" },
  { title: "COMMON HITTING MARKS", body: ["1B = Single","2B = Double","3B = Triple","HR = Home Run","BB = Walk","HBP = Hit By Pitch","RBI = Run Batted In","E = Error"], youtube: "https://www.youtube.com/results?search_query=how+to+keep+a+baseball+scorecard" },
  { title: "OUTS AND DEFENSIVE PLAYS", body: ["K = Strikeout swinging","ꓘ = Strikeout looking","6-3 = Shortstop to first","F8 = Fly out to center","6-4-3 DP = Double play","FC = Fielder's choice"], youtube: "https://www.youtube.com/results?search_query=baseball+scorecard+outs+double+plays" },
  { title: "RUNNER MOVEMENT", body: ["SB2 = Stole second","CS = Caught stealing","WP = Wild pitch","PB = Passed ball","Circle runs so you can total quickly later.","Leave room in a box for weird plays and substitutions."], youtube: "https://www.youtube.com/results?search_query=baseball+scorecard+stolen+base+fielder%27s+choice" },
  { title: "MARKING RUNS SCORING", body: ["Each batter box has a small diamond inside it.","Draw a line along the base path as the runner advances — 1B gets the bottom-right line, 2B adds the top-right, 3B adds the top-left, home adds the bottom-left.","When a run scores, fill in or circle the whole diamond.","If a runner is left on base at the end of the inning, leave the diamond open — don't fill it in.","Tally runs in the inning column at the right of each row."], youtube: "https://www.youtube.com/results?search_query=how+to+mark+runs+baseball+scorecard" },
  { title: "PITCH COUNTING BASICS", body: ["In the batter's box, use small tally marks to track pitch count: B for ball, S for strike.","A full count is 3 balls, 2 strikes — write 3-2.","Some scorers use dots for balls and slashes for strikes.","You don't have to track every pitch — focus on the result first, add pitch counts when you're comfortable.","If the pitcher changes, note the total pitches thrown beside the inning."], youtube: "https://www.youtube.com/results?search_query=baseball+scorecard+pitch+count" },
  { title: "PRO TIPS FOR BEGINNERS", body: ["Use a pencil — you will make mistakes, and that's fine.","Write small. Spring training scorecards are compact and you'll need the space.","Check the lineup card before each half-inning for substitutions.","If you miss a play, leave the box blank and ask someone nearby — don't guess.","Mark the last out of each inning with a small circle around it so you can find inning breaks fast.","Don't worry about getting every detail — tracking hits, outs, and runs is plenty for your first game.","The scoreboard is your best friend for confirming plays you weren't sure about."], youtube: "https://www.youtube.com/results?search_query=baseball+scorecard+tips+for+beginners" },
  { title: "QUICK REFERENCES", body: ["Check lineup changes early each inning.","Mark pitching changes immediately.","Use the scoreboard to confirm defensive substitutions.","If you miss a play, leave space and come back.","Put inning totals in one place so you can audit later.","Use a different symbol style for hits, walks, and errors."], youtube: "https://www.youtube.com/results?search_query=baseball+scorecard+tips+for+beginners" },
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
  { q: "What was Shea Stadium's address?", a: "123-01 Roosevelt Ave, Flushing." },
  { q: "What were the Mets' original colors combining their two NL predecessors?", a: "Blue (Dodgers) and orange (Giants)." },
  { q: "Who hit the famous ball through Buckner's legs in Game 6 of the 1986 World Series?", a: "Mookie Wilson." },
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
  { q: "What is the correct pronunciation of Houston Street?", a: "HOW-ston. Not HYOO-ston. Never, ever HYOO-ston." },
  { q: "Which subway line famously skips 91st Street?", a: "The 1 train — it goes directly from 86th to 96th Street." },
  { q: "What neighborhood is sometimes called 'Little Senegal' in Harlem?", a: "The blocks around 116th Street between Lenox and Frederick Douglass." },
  { q: "What street does the High Line begin at on the south end?", a: "Gansevoort Street in the Meatpacking District." },
  { q: "Which borough has the most coastline?", a: "Queens." },
  { q: "What are the two rivers that border Manhattan?", a: "The Hudson (west) and the East River (east) — technically the East River is a tidal strait." },
  { q: "What is the cross street of the Dakota, where John Lennon lived?", a: "72nd Street and Central Park West." },
  { q: "What neighborhood sits between Astoria and Jackson Heights in Queens?", a: "Woodside." },
  { q: "What is the name of the southernmost tip of Manhattan?", a: "The Battery (or Battery Park City area)." },
  { q: "Which subway line is informally called 'the train to the plane'?", a: "The A train — connects to the AirTrain at Howard Beach for JFK." },
  { q: "What is the only remaining elevated rail line in Manhattan?", a: "There isn't one — the last elevated line in Manhattan was torn down. The High Line is a park, not a rail line." },
  { q: "What do locals call the median strips on upper Broadway?", a: "The malls — specifically the Broadway malls on the Upper West Side." },
  { q: "What year did the original Penn Station get demolished?", a: "1963 — its destruction led directly to the creation of the NYC Landmarks Preservation Commission." },
  { q: "What is the deepest subway station in New York City?", a: "191st Street station on the 1 train in Washington Heights." },
];

const MODE_META = {
  clover: {
    button: "CLOVER PARK", emoji: "🌴", splashLines: ["PORT ST LUCIE","SPRING TRAINING"], splashClass: "bg-orange-50/95",
    wrapper: "bg-[radial-gradient(ellipse_at_top,rgba(255,200,80,0.45),transparent_50%),linear-gradient(180deg,rgba(255,160,40,0.18),rgba(0,180,100,0.10))]",
    pinstripes: "repeating-linear-gradient(90deg, rgba(200,120,0,0.07) 0px, rgba(200,120,0,0.07) 1px, transparent 1px, transparent 24px)",
    tile: "bg-[#ffe29a]", panel: "bg-[#fffbef]/92", accent: "bg-[#e07b00] text-white", accentColor: "bg-[#e07b00]", accentHex: "#e07b00",
    showerEmojis: [], tileEmojis: ["🌴","☀️","🌴","☀️"],
  },
  citi: {
    button: "CITI FIELD", emoji: "🗽", splashLines: ["QUEENS NY","METROPOLITANS"], splashClass: "bg-sky-50/95",
    wrapper: "bg-[linear-gradient(180deg,rgba(0,45,114,0.08),transparent_16%),radial-gradient(circle_at_top,rgba(255,255,255,0.98),rgba(255,255,255,0.92))]",
    pinstripes: "repeating-linear-gradient(90deg, rgba(0,45,114,0.12) 0px, rgba(0,45,114,0.12) 1px, transparent 1px, transparent 20px)",
    tile: "bg-[#dce7f5]", panel: "bg-white/92", accent: "bg-[#002d72] text-white", accentColor: "bg-[#002d72]", accentHex: "#002d72",
    showerEmojis: [], tileEmojis: ["🌭","🎲","🧠","📋"],
  },
  glizzy: {
    button: "GLIZZY", emoji: "🌭", splashLines: ["GLIZZY O'CLOCK",""], splashClass: "bg-yellow-50/95",
    wrapper: "bg-[linear-gradient(180deg,rgba(255,210,80,0.22),rgba(255,89,0,0.11))]",
    pinstripes: "repeating-linear-gradient(90deg, rgba(200,60,0,0.05) 0px, rgba(200,60,0,0.05) 1px, transparent 1px, transparent 26px)",
    tile: "bg-[#ffd79c]", panel: "bg-[#fff7ea]", accent: "bg-[#d84b00] text-white", accentColor: "bg-[#d84b00]", accentHex: "#d84b00",
    showerEmojis: ["🌭"], tileEmojis: ["🌭","🌭","🌭","🌭"],
  },
  rawEgg: {
    button: "RAW EGG", emoji: "🥚", splashLines: ["RAW EGG ALERT",""], splashClass: "bg-amber-50/95",
    wrapper: "bg-[radial-gradient(circle_at_center,rgba(255,243,170,0.74),transparent_35%),radial-gradient(circle_at_50%_42%,rgba(255,205,0,0.46),transparent_10%)]",
    pinstripes: "repeating-linear-gradient(90deg, rgba(190,160,0,0.04) 0px, rgba(190,160,0,0.04) 1px, transparent 1px, transparent 28px)",
    tile: "bg-[#fff1a8]", panel: "bg-[#fffbe8]", accent: "bg-[#a88700] text-white", accentColor: "bg-[#a88700]", accentHex: "#a88700",
    showerEmojis: ["🥚"], tileEmojis: ["🥚","🥚","🥚","🥚"],
  },
  margaritaville: {
    button: "MARGARITAVILLE", emoji: "🍹", splashLines: ["IT'S FIVE O'CLOCK","SOMEWHERE"], splashClass: "bg-teal-50/95",
    wrapper: "margaritaville-bg",
    pinstripes: "repeating-linear-gradient(90deg, rgba(0,170,160,0.04) 0px, rgba(0,170,160,0.04) 1px, transparent 1px, transparent 28px)",
    tile: "bg-[#c6f0ea]", panel: "bg-white/88", accent: "bg-[#008b84] text-white", accentColor: "bg-[#008b84]", accentHex: "#008b84",
    showerEmojis: ["🍹","🌺","🦜","🍹","🌴","🍹"], tileEmojis: ["🍹","🍹","🍹","🍹"],
  },
  lfgbtqm: {
    button: "LFGBTQM", emoji: "🌈", splashLines: ["Please love me","Mark Vientos"], splashClass: "bg-pink-50/95",
    wrapper: "lfgbtqm-bg",
    pinstripes: "none",
    tile: "bg-[#c084fc]/60", panel: "bg-white/88", accent: "bg-[#a1007e] text-white", accentColor: "bg-[#a1007e]", accentHex: "#a1007e",
    showerEmojis: ["🌈","💖","✨","🏳️‍🌈","💅","🌈","💖","🔥"],
    tileEmojis: ["🌈","🌈","🌈","🌈"],
  },
};

const GLIZZY_AWARDS = [
  { min:0,  label:"Glizzy Virgin"     },
  { min:1,  label:"Glizzy Curious"    },
  { min:2,  label:"Glizzy Acquainted" },
  { min:3,  label:"Glizzy Enthusiast" },
  { min:4,  label:"Glizzy Committed"  },
  { min:5,  label:"Glizzy Devotee"    },
  { min:6,  label:"Glizzy Goblin"     },
  { min:8,  label:"Glizzy Menace"     },
  { min:10, label:"Glizzy Ascended"   },
];
const SUN_CRUISER_AWARDS = [
  { min:0,  label:"Bone Dry"              },
  { min:1,  label:"Slightly Moist"        },
  { min:2,  label:"Damp Energy"           },
  { min:3,  label:"Cruising"              },
  { min:4,  label:"Sun Damaged"           },
  { min:5,  label:"Deeply Sun Blasted"    },
  { min:6,  label:"One With The Can"      },
  { min:8,  label:"Legally A Beverage"    },
  { min:10, label:"The Sun Cruiser Itself"},
];
const MARGARITA_AWARDS = [
  { min:0,  label:"Sober In Florida (tragic)" },
  { min:1,  label:"Lime Adjacent"             },
  { min:2,  label:"Salt Rim Curious"          },
  { min:3,  label:"Margarita Aware"           },
  { min:4,  label:"Five O'Clock Somewhere"    },
  { min:5,  label:"Tequila's Friend"          },
  { min:6,  label:"Wasted Away Again"         },
  { min:8,  label:"Lost Shaker Of Salt"       },
  { min:10, label:"Jimmy Buffett's Ghost"     },
];
const RAW_EGG_AWARDS = [
  { min:0, label:"Egg Blind"         },
  { min:1, label:"Egg Adjacent"      },
  { min:2, label:"Egg Spotter"       },
  { min:3, label:"Egg Correspondent" },
  { min:5, label:"Egg Journalist"    },
];
const FLORIDA_AWARDS = [
  { min:0, label:"Transplant Energy"            },
  { min:1, label:"Florida Curious"              },
  { min:2, label:"Florida Aware"                },
  { min:3, label:"Florida Man Adjacent"         },
  { min:5, label:"Born In A Publix Parking Lot" },
];

// Keep old level names for tracker card subtitles
const GLIZZY_LEVELS      = GLIZZY_AWARDS;
const SUN_CRUISER_LEVELS = SUN_CRUISER_AWARDS;
const MARGARITA_LEVELS   = MARGARITA_AWARDS;

const JIMMY_BUFFETT_LINES = [
  "Wasted away again in Margaritaville.",
  "Searching for my lost shaker of salt.",
  "Some people claim that there's a woman to blame.",
  "But I know it's nobody's fault.",
  "It's my own damn fault.",
  "Nibblin' on sponge cake, watchin' the sun bake.",
  "All of those tourists covered with oil.",
  "Changes in latitudes, changes in attitudes.",
  "Nothing remains quite the same.",
  "If we weren't all crazy we would go insane.",
  "Son of a son of a sailor.",
  "I blew out my flip flop, stepped on a pop top.",
  "Come Monday, it'll be alright.",
  "A pirate looks at forty.",
  "fins to the left, fins to the right.",
];

const BAE_HOTNESS = [
  { number:"22", name:"Juan Soto",         note:"The Swagger. Already a top-5 hitter and he KNOWS it."   },
  { number:"27", name:"Mark Vientos",      note:"Tall. Powerful. Mysteriously compelling."               },
  { number:"4",  name:"Francisco Alvarez", note:"Baby-faced chaos agent behind the plate."               },
  { number:"12", name:"Francisco Lindor",  note:"Main character energy. Always smiling. Dangerous."      },
  { number:"7",  name:"Brett Baty",        note:"Still figuring it out but doing it very attractively."  },
  { number:"30", name:"Tyrone Taylor",     note:"Quietly excellent. The dark horse."                     },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getAchievement(value, levels) {
  let cur = levels[0].label;
  for (const l of levels) { if (value >= l.min) cur = l.label; }
  return cur;
}
function getBaeVoteCounts(players, voterChoices) {
  const counts = {};
  players.map(formatPlayer).forEach((l) => { counts[l] = 0; });
  Object.values(voterChoices).forEach((c) => {
    if (!c || !c.trim()) return; // skip blank votes
    counts[c] = (counts[c] || 0) + 1;
  });
  return counts;
}
function formatPlayer(p) { return `${p.number||"?"} ${p.first||""} ${p.last||""}`.trim(); }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function openExternal(url) { window.open(url, "_blank", "noopener,noreferrer"); }
function sortRosterBy(list, sortBy) {
  const copy = [...list];
  if (sortBy === "number") copy.sort((a,b) => Number(a.number||0) - Number(b.number||0));
  else if (sortBy === "first") copy.sort((a,b) => (a.first||"").localeCompare(b.first||""));
  else copy.sort((a,b) => (a.last||"").localeCompare(b.last||""));
  return copy;
}
function sortRowsWithRules(entries) {
  const allZero = entries.every(([,v]) => Number(v) === 0);
  if (allZero) return [...entries].sort((a,b) => a[0].localeCompare(b[0]));
  return [...entries].sort((a,b) => { if (b[1]!==a[1]) return b[1]-a[1]; return a[0].localeCompare(b[0]); });
}
function rowsWithProgress(entries) {
  const sorted = sortRowsWithRules(entries);
  const max = Math.max(...sorted.map(([,v]) => Number(v)), 0);
  return sorted.map(([label, value]) => ({ label, value, percent: max > 0 ? Math.round((Number(value)/max)*100) : 0 }));
}
function distanceKm(lat1,lon1,lat2,lon2) {
  const R=6371, dLat=(lat2-lat1)*Math.PI/180, dLon=(lon2-lon1)*Math.PI/180;
  const a=Math.sin(dLat/2)**2+Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
  return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
}
function kmToMiles(km) { return km * 0.621371; }

// ─── EmojiShower ──────────────────────────────────────────────────────────────
function EmojiShower({ emojis, modeKey, triggerKey }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!emojis?.length) return;
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 8000);
    return () => clearTimeout(t);
  }, [triggerKey]);

  if (!visible || !emojis?.length) return null;
  const count = modeKey === "lfgbtqm" ? 80 : 42;
  const items = Array.from({ length: count }).map((_,i) => ({
    emoji: emojis[i % emojis.length],
    size: modeKey === "lfgbtqm" ? 20+((i*7)%50) : 24+((i*9)%42),
    left: 4+((i*11)%92), top: 4+((i*17)%88),
    dx: -420+((i*41)%840), dy: -380+((i*29)%760), rot: -540+((i*47)%1080),
    delay: (i%20)*0.12,
    duration: modeKey === "lfgbtqm" ? 1.8+(i%5)*0.3 : 2.2,
    iterations: modeKey === "lfgbtqm" ? 999 : 4,
    id: i,
  }));
  return (
    <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden">
      {items.map((item) => (
        <span key={`${modeKey}-${item.id}`} className="absolute" style={{
          left:`${item.left}%`, top:`${item.top}%`, fontSize:`${item.size}px`,
          animationName:"chaosBurst", animationDuration:`${item.duration}s`,
          animationTimingFunction:"ease-in-out", animationIterationCount:item.iterations,
          animationDelay:`${item.delay}s`, animationFillMode:"both",
          ["--dx"]:`${item.dx}px`, ["--dy"]:`${item.dy}px`, ["--rot"]:`${item.rot}deg`,
        }}>{item.emoji}</span>
      ))}
    </div>
  );
}

function SyncIndicator({ synced }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className={`h-2 w-2 rounded-full ${synced ? "bg-green-500" : "bg-yellow-400 animate-pulse"}`} />
      <span className="text-[10px] tracking-widest text-slate-500 uppercase">{synced ? "synced" : "syncing…"}</span>
    </div>
  );
}

function SectionTitle({ children }) {
  return <div className="mb-4 text-2xl tracking-[0.14em] text-slate-800" style={{ fontFamily:'"Bebas Neue",sans-serif' }}>{children}</div>;
}

function StatTile({ title, icon, onClick, tileClass }) {
  return (
    <button onClick={onClick} className={`flex min-h-36 flex-col items-center justify-start px-4 py-6 text-center transition-all duration-150 active:scale-[0.97] hover:brightness-105 ${tileClass}`}>
      <div className="text-xl tracking-[0.12em] text-slate-900" style={{ fontFamily:'"Bebas Neue",sans-serif' }}>{title}</div>
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
                {achievements?.[row.label] && <div className="text-[10px] uppercase tracking-[0.1em] text-slate-400 mt-0.5">{achievements[row.label]}</div>}
              </div>
              <div className="text-2xl tracking-wider text-slate-900 tabular-nums" style={{ fontFamily:'"Orbitron",monospace' }}>
                {typeof row.value === "number" ? String(row.value).padStart(2,"0") : row.value}
              </div>
            </div>
          </div>
          <div className="h-1.5 w-full bg-slate-100">
            <div className="h-1.5 transition-all duration-700 ease-out" style={{
              width:`${row.percent}%`,
              background: idx===0 ? `linear-gradient(90deg,${accentHex},${accentHex}dd)` : accentHex,
              opacity: idx===0 ? 1 : 0.6+(rows.length-idx)*0.08,
            }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function TrackerCard({ title, rows, action, onAction, fullWidth=false, tileClass, accentClass, accentHex, achievements }) {
  return (
    <div className={`rounded-sm ${tileClass} p-4 shadow-sm ring-1 ring-slate-200/60 ${fullWidth?"col-span-2":""}`}>
      <div className="mb-3 text-lg tracking-[0.12em] text-slate-900" style={{ fontFamily:'"Bebas Neue",sans-serif' }}>{title}</div>
      <ProgressRows rows={rows} accentHex={accentHex} achievements={achievements} />
      {action && <button onClick={onAction} className={`mt-4 w-full rounded-sm px-4 py-3 text-sm font-medium tracking-widest transition-all active:scale-[0.98] ${accentClass}`}>{action}</button>}
    </div>
  );
}

function DistanceTile({ title, destLat, destLng, mapsQuery, panelClass }) {
  const defaultDist = kmToMiles(distanceKm(CLOVER_PARK_LAT, CLOVER_PARK_LNG, destLat, destLng));
  const [distMiles, setDistMiles] = useState(defaultDist);
  const [usedLive, setUsedLive]   = useState(false);
  const [loading, setLoading]     = useState(false);

  const handleTap = () => {
    openExternal(`https://www.google.com/maps/search/${encodeURIComponent(mapsQuery)}`);
    if (!navigator.geolocation) return;
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const d = kmToMiles(distanceKm(pos.coords.latitude, pos.coords.longitude, destLat, destLng));
        setDistMiles(d);
        setUsedLive(true);
        setLoading(false);
      },
      () => setLoading(false)
    );
  };

  const display  = distMiles.toFixed(1);
  const subtitle = loading ? "locating…" : usedLive ? "mi · from your location" : "mi · from Clover Park";

  return (
    <button onClick={handleTap} className={`${panelClass} rounded-sm p-4 text-center shadow-sm ring-1 ring-slate-200/60 transition-all active:scale-[0.97] hover:brightness-105`}>
      <div className="flex min-h-32 flex-col items-center justify-center gap-1">
        <div className="text-base leading-none tracking-[0.12em] text-slate-900" style={{ fontFamily:'"Bebas Neue",sans-serif' }}>{title}</div>
        <div className="text-5xl tracking-widest text-slate-900 mt-2" style={{ fontFamily:'"Orbitron",monospace' }}>{display}</div>
        <div className="text-xs text-slate-500">{subtitle}</div>
      </div>
    </button>
  );
}

function UsefulTile({ title, subtitle, icon, onClick, panelClass }) {
  return (
    <button onClick={onClick} className={`${panelClass} rounded-sm p-4 text-center shadow-sm ring-1 ring-slate-200/60 transition-all active:scale-[0.97] hover:brightness-105`}>
      <div className="flex min-h-32 flex-col items-center justify-center gap-2">
        <div className="text-base leading-none tracking-[0.12em] text-slate-900" style={{ fontFamily:'"Bebas Neue",sans-serif' }}>{title}</div>
        {icon && <div className="text-3xl text-slate-600">{icon}</div>}
        {subtitle && <div className="text-xs text-slate-500">{subtitle}</div>}
      </div>
    </button>
  );
}

function SelectionModal({ dialog, onClose, onSelect, onBaeSortChange, currentBaeSort, accentClass }) {
  if (!dialog) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-sm bg-white p-5 shadow-2xl ring-1 ring-slate-300">
        <div className="mb-4 text-2xl tracking-[0.12em] text-slate-900" style={{ fontFamily:'"Bebas Neue",sans-serif' }}>{dialog.title}</div>
        {dialog.type === "bae-pick" && (
          <div className="mb-3 grid grid-cols-3 gap-2 text-xs">
            {["number","first","last"].map((s) => (
              <button key={s} className={`rounded-sm px-2 py-2 uppercase tracking-widest ${currentBaeSort===s ? accentClass : "bg-slate-100 text-slate-600"}`} onClick={() => onBaeSortChange(s)}>{s}</button>
            ))}
          </div>
        )}
        {dialog.type === "schedule" ? (
          <div className="space-y-2">
            {SPRING_TRAINING_GAMES.map((game) => <div key={game} className="rounded-sm bg-slate-100 px-3 py-2 text-sm text-slate-800">{game}</div>)}
            <button onClick={() => openExternal("https://www.mlb.com/mets/schedule")} className="mt-3 flex w-full items-center justify-center rounded-sm bg-slate-100 px-4 py-3">
              <img src="/mets-ny.png" alt="Mets NY" className="h-10 w-auto object-contain" />
            </button>
          </div>
        ) : (
          <div className="max-h-80 space-y-2 overflow-y-auto">
            {(dialog.options || []).map((option) => (
              <button key={option} onClick={() => onSelect(option)} className="w-full rounded-sm bg-slate-100 px-4 py-3 text-left text-slate-900 transition-colors hover:bg-slate-200">{option}</button>
            ))}
          </div>
        )}
        <button onClick={onClose} className={`mt-4 w-full rounded-sm px-4 py-3 font-medium tracking-widest ${accentClass}`}>Close</button>
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
        <div className="mt-5 text-4xl tracking-[0.12em] text-slate-900" style={{ fontFamily:'"Bebas Neue",sans-serif' }}>{mode.splashLines[0]}</div>
        {mode.splashLines[1] && <div className="text-4xl tracking-[0.12em] text-slate-900 mt-1" style={{ fontFamily:'"Bebas Neue",sans-serif' }}>{mode.splashLines[1]}</div>}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Page() {
  const [screen, setScreen]                   = useState("home");
  const [mode, setMode]                       = useState("citi");
  const [modeSplash, setModeSplash]           = useState(null);
  const [dialog, setDialog]                   = useState(null);
  const [generatorOutput, setGeneratorOutput] = useState("");
  const [baeSort, setBaeSort]                 = useState("number");
  const [triviaQuestion, setTriviaQuestion]   = useState(null);
  const [showAnswer, setShowAnswer]           = useState(false);
  const [humidityData, setHumidityData]       = useState({ value: null, loading: false });
  const [synced, setSynced]                   = useState(false);

  const [baePlayers, setBaePlayers]               = useState(INITIAL_BAE_PLAYERS);
  const [rawEggCategories, setRawEggCategories]   = useState(DEFAULT_RAW_EGG_CATEGORIES);
  const [floridaCategories, setFloridaCategories] = useState(DEFAULT_FLORIDA_CATEGORIES);
  const [trackers, setTrackers]                   = useState(DEFAULT_TRACKERS);
  const [baeVoterChoice, setBaeVoterChoice]       = useState(DEFAULT_BAE_VOTERS);
  const [customGenerators, setCustomGenerators]   = useState({
    chaosSubjects:[], chaosActions:[], chaosContexts:[], chaosOutcomes:[],
    floridaSubjects:[], floridaActions:[], floridaObjects:[],
    prophecyCards:[], prophecyOmens:[], prophecyTimings:[],
  });

  const isWriting = useRef(false);

  useEffect(() => {
    const dbRef = ref(db, "tripData");
    const unsub = onValue(dbRef, (snapshot) => {
      if (isWriting.current) return;
      const data = snapshot.val();
      if (data) {
        if (data.trackers) {
          // Merge to ensure margarita always has all 5 people
          const merged = { ...DEFAULT_TRACKERS, ...data.trackers };
          merged.margarita = { ...DEFAULT_TRACKERS.margarita, ...(data.trackers.margarita || {}) };
          setTrackers(merged);
        }
        if (data.baeVoterChoice)    setBaeVoterChoice(data.baeVoterChoice);
        if (data.baePlayers)        setBaePlayers(data.baePlayers);
        if (data.rawEggCategories)  setRawEggCategories(data.rawEggCategories);
        if (data.floridaCategories) setFloridaCategories(data.floridaCategories);
        if (data.customGenerators)  setCustomGenerators(data.customGenerators);
      }
      setSynced(true);
    });
    return () => unsub();
  }, []);

  const pushToFirebase = useCallback((patch) => {
    isWriting.current = true;
    setSynced(false);
    update(ref(db, "tripData"), patch).then(() => { isWriting.current = false; setSynced(true); });
  }, []);

  const currentMode  = MODE_META[mode];
  const isLfgbtqm   = mode === "lfgbtqm";
  const tileClass   = isLfgbtqm ? "lfgbtqm-tile rounded-sm" : currentMode.tile;
  const panelClass  = isLfgbtqm ? "lfgbtqm-panel" : currentMode.panel;

  const sortedRoster  = useMemo(() => sortRosterBy(baePlayers, baeSort), [baePlayers, baeSort]);
  const metsBaeCounts = useMemo(() => getBaeVoteCounts(baePlayers, baeVoterChoice), [baePlayers, baeVoterChoice]);
  const bestIndex     = useMemo(() => rowsWithProgress(PEOPLE.map((p) => [p,(trackers.glizzy[p]||0)*3+(trackers.sunCruiser[p]||0)*2])), [trackers]);

  const glizzyRows     = rowsWithProgress(Object.entries(trackers.glizzy));
  const sunCruiserRows = rowsWithProgress(Object.entries(trackers.sunCruiser));
  const margaritaRows  = rowsWithProgress(Object.entries(trackers.margarita || {}));
  const rawEggRows     = rowsWithProgress(Object.entries(trackers.rawEgg));
  const floridaRows    = rowsWithProgress(Object.entries(trackers.florida));
  const metsBaeRows    = rowsWithProgress(Object.entries(metsBaeCounts));
  const glizzyAchievements     = Object.fromEntries(Object.entries(trackers.glizzy).map(([n,v])     => [n, getAchievement(v, GLIZZY_LEVELS)]));
  const sunCruiserAchievements = Object.fromEntries(Object.entries(trackers.sunCruiser).map(([n,v]) => [n, getAchievement(v, SUN_CRUISER_LEVELS)]));
  const margaritaAchievements  = Object.fromEntries(Object.entries(trackers.margarita || {}).map(([n,v]) => [n, getAchievement(v, MARGARITA_LEVELS)]));

  const baeVoteSummaryRows = useMemo(() => {
    const tally = Object.entries(baeVoterChoice).reduce((acc,[person,player]) => {
      if (!player || !player.trim()) return acc; // skip blank votes
      acc[player] = acc[player] || { votes:0, people:[] };
      acc[player].votes++; acc[player].people.push(person); return acc;
    }, {});
    return Object.entries(tally).filter(([,i]) => i.votes>0).sort((a,b) => b[1].votes-a[1].votes || a[0].localeCompare(b[0]));
  }, [baeVoterChoice]);

  const handleModeChange = (nextMode) => { setMode(nextMode); setModeSplash(nextMode); setTimeout(() => setModeSplash(null), 3000); };

  const incrementTracker = (key, rowKey) => {
    const next = { ...trackers, [key]: { ...trackers[key], [rowKey]: (trackers[key][rowKey]||0)+1 } };
    setTrackers(next); pushToFirebase({ trackers: next });
  };
  const decrementTracker = (key, rowKey) => {
    const next = { ...trackers, [key]: { ...trackers[key], [rowKey]: Math.max(0,(trackers[key][rowKey]||0)-1) } };
    setTrackers(next); pushToFirebase({ trackers: next });
  };

  const resetAllTrackers = () => {
    // Selective reset — ask which trackers to zero
    const choices = ["Glizzies","Sun Cruisers","Margaritas","Raw Egg","Florida","Mets Bae votes"];
    const checked = {};
    choices.forEach((c) => { checked[c] = false; });
    const selected = window.prompt(
      `Which trackers should be zeroed?\nType any combo separated by commas:\n\n${choices.join(", ")}\n\n(or type ALL to reset everything)`
    );
    if (!selected) return;
    const input = selected.trim().toLowerCase();
    const all = input === "all";
    const wants = (label) => all || input.includes(label.toLowerCase());

    let nextTrackers = { ...trackers };
    if (wants("glizz"))      nextTrackers.glizzy     = Object.fromEntries(Object.keys(trackers.glizzy).map((k)     => [k,0]));
    if (wants("sun"))        nextTrackers.sunCruiser  = Object.fromEntries(Object.keys(trackers.sunCruiser).map((k) => [k,0]));
    if (wants("margarita"))  nextTrackers.margarita   = Object.fromEntries(Object.keys(trackers.margarita||{}).map((k) => [k,0]));
    if (wants("raw egg"))    nextTrackers.rawEgg      = Object.fromEntries(Object.keys(trackers.rawEgg).map((k)    => [k,0]));
    if (wants("florida"))    nextTrackers.florida     = Object.fromEntries(Object.keys(trackers.florida).map((k)   => [k,0]));

    const patch = { trackers: nextTrackers };
    if (wants("bae") || wants("mets")) {
      const zeroedBae = Object.fromEntries(Object.keys(baeVoterChoice).map((k) => [k,""]));
      setBaeVoterChoice(zeroedBae);
      patch.baeVoterChoice = zeroedBae;
    }
    setTrackers(nextTrackers);
    pushToFirebase(patch);
  };

  const deleteBaePlayer = (playerLabel) => {
    if (!window.confirm(`Remove ${playerLabel} from the roster?`)) return;
    const nextPlayers = baePlayers.filter((p) => formatPlayer(p) !== playerLabel);
    setBaePlayers(nextPlayers);
    // Clear any votes for this player
    const nextVotes = Object.fromEntries(
      Object.entries(baeVoterChoice).map(([voter, choice]) => [voter, choice === playerLabel ? "" : choice])
    );
    setBaeVoterChoice(nextVotes);
    pushToFirebase({ baePlayers: nextPlayers, baeVoterChoice: nextVotes });
  };

  const deleteCategory = (trackerKey, categoryName, setCategories) => {
    if (!window.confirm(`Remove "${categoryName}" category?`)) return;
    const nextTrackers = { ...trackers, [trackerKey]: { ...trackers[trackerKey] } };
    delete nextTrackers[trackerKey][categoryName];
    setTrackers(nextTrackers);
    setCategories((prev) => prev.filter((c) => c !== categoryName));
    pushToFirebase({ trackers: nextTrackers });
  };

  const generateJimmyBuffett = () => {
    setGeneratorOutput(`🦜 Jimmy says: "${pick(JIMMY_BUFFETT_LINES)}"`);
  };

  const openPersonDialog = (trackerKey, title) => {
    setDialog({ type:"basic", title, options: PEOPLE, onChoose: (option) => incrementTracker(trackerKey, option) });
  };

  const openCategoryDialog = (trackerKey, title, categories, setCategories) => {
    const active = categories.filter((x) => typeof trackers[trackerKey][x] !== "undefined");
    setDialog({
      type:"basic", title, options:[...active, "Create new category"],
      onChoose: (option) => {
        if (option === "Create new category") {
          const newCat = window.prompt("Type a new category:");
          if (!newCat) return;
          const norm = newCat.toUpperCase();
          const nextCats = categories.includes(norm) ? categories : [...categories, norm];
          setCategories(nextCats);
          const next = { ...trackers, [trackerKey]: { ...trackers[trackerKey], [norm]: (trackers[trackerKey][norm]||0)+1 } };
          setTrackers(next); pushToFirebase({ trackers: next });
        } else { incrementTracker(trackerKey, option); }
      },
    });
  };

  // ── Fixed two-step Bae voter flow ─────────────────────────────────────────
  const openBaeVoterDialog = useCallback(() => {
    setDialog({
      type: "basic",
      title: "Who is voting?",
      options: PEOPLE,
      onChoose: (voter) => {
        const roster = sortRosterBy(baePlayers, baeSort).map(formatPlayer);
        setDialog({
          type: "bae-pick",
          title: `${voter} picks Mets Bae`,
          options: [...roster, "➕ Add a player"],
          onChoose: (choice) => {
            if (choice === "➕ Add a player") {
              const number = window.prompt("Player number:"); if (!number) return;
              const first  = window.prompt("First name:");    if (!first)  return;
              const last   = window.prompt("Last name:");     if (!last)   return;
              const newPlayer = { id: Date.now(), number, first, last };
              const nextPlayers = [...baePlayers, newPlayer];
              setBaePlayers(nextPlayers);
              pushToFirebase({ baePlayers: nextPlayers });
              const newLabel = formatPlayer(newPlayer);
              const next = { ...baeVoterChoice, [voter]: newLabel };
              setBaeVoterChoice(next);
              pushToFirebase({ baeVoterChoice: next });
              return;
            }
            const next = { ...baeVoterChoice, [voter]: choice };
            setBaeVoterChoice(next);
            pushToFirebase({ baeVoterChoice: next });
          },
        });
      },
    });
  }, [baePlayers, baeSort, baeVoterChoice, pushToFirebase]);

  // Close dialog first, then call handler so second dialog can open cleanly
  const handleDialogSelect = (option) => {
    if (!dialog?.onChoose) return;
    const handler = dialog.onChoose;
    setDialog(null);
    setTimeout(() => handler(option), 0);
  };

  const handleBaeSortChange = (sortValue) => {
    setBaeSort(sortValue);
    if (dialog?.type === "bae-pick") {
      setDialog((prev) => ({ ...prev, options: sortRosterBy(baePlayers, sortValue).map(formatPlayer) }));
    }
  };

  const addBaePlayer = () => {
    const number = window.prompt("Player number:"); if (!number) return;
    const first  = window.prompt("First name:");    if (!first)  return;
    const last   = window.prompt("Last name:");     if (!last)   return;
    const next   = [...baePlayers, { id: Date.now(), number, first, last }];
    setBaePlayers(next); pushToFirebase({ baePlayers: next });
  };

  const updateHumidity = async () => {
    if (!navigator.geolocation) return;
    setHumidityData({ value: null, loading: true });
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res  = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=relative_humidity_2m`);
          const data = await res.json();
          setHumidityData({ value: data?.current?.relative_humidity_2m ?? null, loading: false });
        } catch { setHumidityData({ value: null, loading: false }); }
      },
      () => setHumidityData({ value: null, loading: false })
    );
  };

  const openNearbyChainRestaurants = () => {
    if (!navigator.geolocation) { openExternal("https://www.google.com/maps/search/chain+restaurants"); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => openExternal(`https://www.google.com/maps/search/chain+restaurants/@${pos.coords.latitude},${pos.coords.longitude},14z`),
      () => openExternal("https://www.google.com/maps/search/chain+restaurants")
    );
  };

  const generateChaos = () => {
    const subjects = ["Francisco Alvarez","Mark Vientos","Juan Soto","Brett Baty","Luis Torrens","a random Mets reliever","the Clover Park scoreboard",...customGenerators.chaosSubjects];
    const actions  = ["creates avoidable chaos","becomes the main character","starts something weird","triggers a Mets Bae vote",...customGenerators.chaosActions];
    const contexts = ["during brutal humidity","right after a Sun Cruiser is cracked","during the 7th inning","with two outs and weird energy",...customGenerators.chaosContexts];
    const outcomes = ["and the group loses composure.","and nobody can explain what just happened.","and a new inside joke is born.",...customGenerators.chaosOutcomes];
    setGeneratorOutput(`${pick(subjects)} ${pick(actions)} ${pick(contexts)}, ${pick(outcomes)}`);
  };
  const generateFlorida = () => {
    const subjects = ["Florida Man","Port St. Lucie Man","Shirtless Man",...customGenerators.floridaSubjects];
    const actions  = ["appears in the parking lot","is spotted arguing with a menu","radiates unbelievable Florida energy",...customGenerators.floridaActions];
    const objects  = ["next to a Trump sign","outside a Cheesecake Factory","with live laugh love energy",...customGenerators.floridaObjects];
    setGeneratorOutput(`${pick(subjects)} ${pick(actions)} ${pick(objects)}.`);
  };
  const generateProphecy = () => {
    const cards   = ["THE TOWER OF PORT ST. LUCIE","THE HIGH PRIESTESS OF HUMIDITY","THE SUN CRUISER","THE GLIZZY MOON",...customGenerators.prophecyCards];
    const omens   = ["foretells a dugout disturbance","warns of preventable Mets chaos","points toward a sudden Mets Bae surge",...customGenerators.prophecyOmens];
    const timings = ["before the 5th inning","during a pitching change","while the humidity hits 92%",...customGenerators.prophecyTimings];
    setGeneratorOutput(`CLOVER PARK PROPHECY: ${pick(cards)} ${pick(omens)} ${pick(timings)}.`);
  };

  const getTriviaQuestion = (cat) => {
    if (cat === "mets")  setTriviaQuestion(pick(METS_TRIVIA));
    if (cat === "rules") setTriviaQuestion(pick(RULES_TRIVIA));
    if (cat === "nyc")   setTriviaQuestion(pick(NYC_TRIVIA));
    setShowAnswer(false);
  };

  const addCustomGeneratorValue = (key) => {
    const value = window.prompt(`Add a new ${key} option:`);
    if (!value) return;
    const next = { ...customGenerators, [key]: [...customGenerators[key], value] };
    setCustomGenerators(next); pushToFirebase({ customGenerators: next });
  };

  const humidityDisplay  = humidityData.loading ? "…" : humidityData.value !== null ? `${humidityData.value}` : "—";
  const humiditySubtitle = humidityData.loading ? "loading…" : humidityData.value !== null ? "% humidity · tap to refresh" : "tap to get humidity";

  return (
    <div className={`min-h-screen text-slate-900 ${isLfgbtqm ? "" : currentMode.wrapper}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Bebas+Neue&family=Orbitron:wght@500;700&display=swap');
        * { font-family: Inter, sans-serif; }
        @keyframes chaosBurst {
          0%   { transform:translate(0,0) rotate(0deg) scale(0.2); opacity:0; }
          10%  { opacity:1; }
          40%  { transform:translate(calc(var(--dx)*.5),calc(var(--dy)*.5)) rotate(calc(var(--rot)*.4)) scale(1.1); }
          70%  { transform:translate(calc(var(--dx)*-.1),calc(var(--dy)*.9)) rotate(calc(var(--rot)*-.1)) scale(.95); }
          100% { transform:translate(var(--dx),var(--dy)) rotate(var(--rot)) scale(.7); opacity:0; }
        }
        @keyframes rainbowShift {
          0%,100% { background-position:0% 50%; }
          50%     { background-position:100% 50%; }
        }
        .lfgbtqm-bg {
          background: #fdf4ff;
        }
        .lfgbtqm-glow {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background: radial-gradient(ellipse at 50% 40%,
            rgba(255,0,128,0.18) 0%, rgba(255,100,0,0.12) 18%,
            rgba(255,220,0,0.10) 33%, rgba(0,200,100,0.10) 50%,
            rgba(0,120,255,0.12) 66%, rgba(160,0,255,0.15) 82%,
            transparent 100%
          );
          animation: rainbowPulse 4s ease-in-out infinite;
        }
        @keyframes rainbowPulse {
          0%,100% { opacity: 0.6; transform: scale(1); }
          50%     { opacity: 1;   transform: scale(1.08); }
        }
        .margaritaville-bg {
          background:
            linear-gradient(180deg, #87CEEB 0%, #87CEEB 45%, #f0c87a 45%, #f0c87a 55%, #c8a45a 55%, #c8a45a 62%, #4fc3c3 62%, #3ab5c0 100%);
        }
        .lfgbtqm-tile  { background:rgba(192,132,252,0.55)!important; backdrop-filter:blur(4px); }
        .lfgbtqm-panel { background:rgba(255,255,255,0.70)!important; backdrop-filter:blur(8px); }
      `}</style>

      <EmojiShower emojis={currentMode.showerEmojis} modeKey={mode} triggerKey={mode} />
      {isLfgbtqm && <div className="lfgbtqm-glow" />}

      <div className="min-h-screen relative z-10" style={{ backgroundImage: (isLfgbtqm || mode==="margaritaville") ? "none" : currentMode.pinstripes }}>
        <ModeSplash modeKey={modeSplash} />
        <SelectionModal dialog={dialog} onClose={() => setDialog(null)} onSelect={handleDialogSelect} onBaeSortChange={handleBaeSortChange} currentBaeSort={baeSort} accentClass={currentMode.accent} />

        <div className="mx-auto max-w-md px-4 pb-8 pt-6">

          {/* HOME */}
          {screen === "home" && (
            <>
              <div className="mb-2 flex items-center justify-between">
                <div>{mode === "margaritaville" && <span className="text-2xl">🦜</span>}</div>
                <SyncIndicator synced={synced} />
              </div>
              <div className="mb-6"><img src="/the-best-logo.png" alt="The Best" className="block mx-auto object-contain" style={{width:"80%"}} /></div>
              <div className="grid grid-cols-2 gap-3">
                <StatTile title="TRACKERS"    icon={currentMode.tileEmojis[0]} onClick={() => setScreen("trackers")}  tileClass={tileClass} />
                <StatTile title="GENERATORS"  icon={currentMode.tileEmojis[1]} onClick={() => setScreen("generators")} tileClass={tileClass} />
                <StatTile title="TRIVIA"      icon={currentMode.tileEmojis[2]} onClick={() => setScreen("trivia")}    tileClass={tileClass} />
                <StatTile title="USEFUL INFO" icon={currentMode.tileEmojis[3]} onClick={() => setScreen("useful")}    tileClass={tileClass} />
              </div>
              <div className="mt-5 text-center">
                {mode === "margaritaville"
                  ? <div className="text-[5rem] flex justify-center gap-2">🦜🍹</div>
                  : <div className="text-[7rem]">{currentMode.emoji}</div>
                }
              </div>
              <div className={`mt-4 rounded-sm px-4 py-3 shadow-sm ring-1 ring-slate-200 ${panelClass}`}>
                <div className="grid grid-cols-3 gap-2 text-[11px]">
                  {Object.entries(MODE_META).map(([key, value]) => (
                    <button key={key} onClick={() => handleModeChange(key)}
                      className={`rounded-sm px-2 py-2 tracking-[0.1em] transition-all ${mode===key ? currentMode.accent : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
                      style={{ fontFamily:'"Bebas Neue",sans-serif' }}>
                      {value.button}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-5 grid grid-cols-3 items-stretch gap-3">
                <button onClick={() => setScreen("leaderboard")}
                  className={`flex items-center justify-center rounded-sm px-3 py-4 text-center text-xl tracking-[0.12em] text-slate-700 shadow-sm ring-1 ring-slate-200 ${panelClass}`}
                  style={{ fontFamily:'"Bebas Neue",sans-serif' }}>
                  LEADERBOARD
                </button>
                <div className={`flex flex-col items-center justify-center rounded-sm px-3 py-4 shadow-sm ring-1 ring-slate-200 ${panelClass}`}>
                  <button onClick={() => openExternal("https://www.mlb.com/mets")}>
                    <img src="/mets-ny.png" alt="Mets NY" className="mx-auto h-16 w-24 object-contain" />
                  </button>
                  <button onClick={() => openExternal("https://www.gluearch.com")} className="mt-3">
                    <img src="/glue-logo.png" alt="GLUE" className="mx-auto object-contain opacity-50" style={{height:"14px",width:"54px"}} />
                  </button>
                </div>
                <button onClick={() => setScreen("admin")}
                  className={`flex items-center justify-center rounded-sm px-3 py-4 text-center text-xl tracking-[0.12em] text-slate-700 shadow-sm ring-1 ring-slate-200 ${panelClass}`}
                  style={{ fontFamily:'"Bebas Neue",sans-serif' }}>
                  STEVE COHEN MODE
                </button>
              </div>
            </>
          )}

          {/* TRACKERS */}
          {screen === "trackers" && (
            <>
              <button className="mb-4 text-sm text-slate-500 hover:text-slate-800" onClick={() => setScreen("home")}>← Back</button>
              <div className="mb-4 flex items-center justify-between"><SectionTitle>TRACKERS</SectionTitle><SyncIndicator synced={synced} /></div>
              <div className="grid grid-cols-2 gap-3">
                <TrackerCard title="GLIZZY TRACKER"      rows={glizzyRows}     action="+ Add" onAction={() => openPersonDialog("glizzy",     "Who gets the Glizzy?")}      tileClass={tileClass} accentClass={currentMode.accent} accentHex={currentMode.accentHex} />
                <TrackerCard title="SUN CRUISER TRACKER" rows={sunCruiserRows} action="+ Add" onAction={() => openPersonDialog("sunCruiser", "Who gets the Sun Cruiser?")} tileClass={tileClass} accentClass={currentMode.accent} accentHex={currentMode.accentHex} />
                {mode === "margaritaville" && (
                  <TrackerCard title="🦜 MARGARITA TRACKER" rows={margaritaRows} action="+ Add" onAction={() => openPersonDialog("margarita", "Who's got a margarita? 🍹")} fullWidth tileClass={tileClass} accentClass={currentMode.accent} accentHex={currentMode.accentHex} achievements={margaritaAchievements} />
                )}
                <TrackerCard title="METS BAE" rows={metsBaeRows} action="Vote Bae" onAction={openBaeVoterDialog} fullWidth tileClass={tileClass} accentClass={currentMode.accent} accentHex={currentMode.accentHex} />

                {/* Raw Egg with delete category */}
                <div className={`rounded-sm ${tileClass} p-4 shadow-sm ring-1 ring-slate-200/60`}>
                  <div className="mb-3 text-lg tracking-[0.12em] text-slate-900" style={{ fontFamily:'"Bebas Neue",sans-serif' }}>RAW EGG TRACKER</div>
                  <ProgressRows rows={rawEggRows} accentHex={currentMode.accentHex} />
                  <button onClick={() => openCategoryDialog("rawEgg","Select category",rawEggCategories,setRawEggCategories)} className={`mt-4 w-full rounded-sm px-4 py-3 text-sm font-medium tracking-widest ${currentMode.accent}`}>+ Add</button>
                  <div className="mt-2 space-y-1">
                    {rawEggCategories.map((cat) => (
                      <button key={cat} onClick={() => deleteCategory("rawEgg", cat, setRawEggCategories)} className="w-full rounded-sm bg-slate-100 px-3 py-1.5 text-left text-xs text-slate-500 hover:bg-red-50 hover:text-red-600">
                        ✕ {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Florida with delete category */}
                <div className={`rounded-sm ${tileClass} p-4 shadow-sm ring-1 ring-slate-200/60`}>
                  <div className="mb-3 text-lg tracking-[0.12em] text-slate-900" style={{ fontFamily:'"Bebas Neue",sans-serif' }}>FLORIDA TRACKER</div>
                  <ProgressRows rows={floridaRows} accentHex={currentMode.accentHex} />
                  <button onClick={() => openCategoryDialog("florida","Select category",floridaCategories,setFloridaCategories)} className={`mt-4 w-full rounded-sm px-4 py-3 text-sm font-medium tracking-widest ${currentMode.accent}`}>+ Add</button>
                  <div className="mt-2 space-y-1">
                    {floridaCategories.map((cat) => (
                      <button key={cat} onClick={() => deleteCategory("florida", cat, setFloridaCategories)} className="w-full rounded-sm bg-slate-100 px-3 py-1.5 text-left text-xs text-slate-500 hover:bg-red-50 hover:text-red-600">
                        ✕ {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* GENERATORS */}
          {screen === "generators" && (
            <>
              <button className="mb-4 text-sm text-slate-500 hover:text-slate-800" onClick={() => setScreen("home")}>← Back</button>
              <SectionTitle>GENERATORS</SectionTitle>
              <div className="space-y-3">
                {[["Mets Chaos", generateChaos],["Florida Shit", generateFlorida],["Clover Park Prophecy", generateProphecy]].map(([label, fn]) => (
                  <button key={label} onClick={fn} className={`w-full rounded-sm p-4 text-left shadow-sm ring-1 ring-slate-200 transition-all active:scale-[0.98] ${panelClass}`}>
                    <div className="text-lg tracking-[0.12em]" style={{ fontFamily:'"Bebas Neue",sans-serif' }}>{label}</div>
                  </button>
                ))}
                {mode === "margaritaville" && (
                  <button onClick={generateJimmyBuffett} className={`w-full rounded-sm p-4 text-left shadow-sm ring-1 ring-slate-200 transition-all active:scale-[0.98] ${panelClass}`}>
                    <div className="text-lg tracking-[0.12em]" style={{ fontFamily:'"Bebas Neue",sans-serif' }}>🦜 Jimmy Buffett Says</div>
                  </button>
                )}
                {generatorOutput && (
                  <div className="rounded-sm bg-slate-900 p-4 text-slate-100 shadow-sm ring-1 ring-slate-700 leading-relaxed">
                    {generatorOutput}
                  </div>
                )}
              </div>
            </>
          )}

          {/* TRIVIA */}
          {screen === "trivia" && (
            <>
              <button className="mb-4 text-sm text-slate-500 hover:text-slate-800" onClick={() => setScreen("home")}>← Back</button>
              <SectionTitle>TRIVIA</SectionTitle>
              <div className="space-y-3">
                {[["Mets Trivia","mets"],["Baseball Rules Trivia","rules"],["New York City Trivia","nyc"]].map(([label, key]) => (
                  <button key={key} onClick={() => getTriviaQuestion(key)} className={`w-full rounded-sm p-4 text-left shadow-sm ring-1 ring-slate-200 transition-all active:scale-[0.98] ${panelClass}`}>
                    <div className="text-lg tracking-[0.12em]" style={{ fontFamily:'"Bebas Neue",sans-serif' }}>{label}</div>
                  </button>
                ))}
                {triviaQuestion && (
                  <>
                    <div className={`rounded-sm p-4 shadow-sm ring-1 ring-slate-200 ${panelClass}`}>{triviaQuestion.q}</div>
                    <button onClick={() => setShowAnswer((v) => !v)} className={`w-full rounded-sm p-4 font-medium tracking-widest ${currentMode.accent}`}>Reveal Answer</button>
                    {showAnswer && <div className={`rounded-sm p-4 shadow-sm ring-1 ring-slate-200 ${panelClass}`}>{triviaQuestion.a}</div>}
                  </>
                )}
              </div>
            </>
          )}

          {/* USEFUL INFO */}
          {screen === "useful" && (
            <>
              <button className="mb-4 text-sm text-slate-500 hover:text-slate-800" onClick={() => setScreen("home")}>← Back</button>
              <SectionTitle>USEFUL INFORMATION</SectionTitle>
              <div className="grid grid-cols-2 gap-3">

                {/* Humidity — large Orbitron number */}
                <button onClick={updateHumidity} className={`${panelClass} rounded-sm p-4 text-center shadow-sm ring-1 ring-slate-200/60 transition-all active:scale-[0.97] hover:brightness-105`}>
                  <div className="flex min-h-32 flex-col items-center justify-center gap-1">
                    <div className="text-base leading-none tracking-[0.12em] text-slate-900" style={{ fontFamily:'"Bebas Neue",sans-serif' }}>Current Humidity</div>
                    <div className="text-5xl tracking-widest text-slate-900 mt-2" style={{ fontFamily:'"Orbitron",monospace' }}>{humidityDisplay}</div>
                    <div className="text-xs text-slate-500">{humiditySubtitle}</div>
                  </div>
                </button>

                {/* Game Day Forecast — Port St Lucie zip */}
                <UsefulTile title="Game Day Forecast" onClick={() => openExternal("https://forecast.weather.gov/MapClick.php?CityName=Port+St+Lucie&state=FL&site=MLB&textField1=27.2730&textField2=-80.3582")} panelClass={panelClass} />

                {/* Spring Training Schedule — calendar emoji */}
                <UsefulTile title="Spring Training Schedule" icon={<span className="text-3xl">📅</span>} onClick={() => setDialog({ type:"schedule", title:"Spring Training Schedule", options:[] })} panelClass={panelClass} />

                {/* Clover Park — baseball icon, no subtitle */}
                <UsefulTile title="Clover Park Info" icon={<span className="text-3xl">⚾</span>} onClick={() => openExternal("https://www.mlb.com/news/featured/visit-clover-park-home-of-the-st-lucie-mets")} panelClass={panelClass} />

                {/* Scorecard — notebook with pencil, no subtitle */}
                <UsefulTile title="Scorecard Guide" icon={<span className="text-3xl">📝</span>} onClick={() => setScreen("scorecard")} panelClass={panelClass} />

                {/* Nearby chain restaurants — building emoji */}
                <UsefulTile title="Nearby Chain Restaurants" icon={<span className="text-3xl">🍔</span>} onClick={openNearbyChainRestaurants} panelClass={panelClass} />

                {/* Margaritaville distance — Hollywood Beach FL */}
                <DistanceTile title="Nearest Margaritaville" destLat={26.0112} destLng={-80.1295} mapsQuery="Margaritaville" panelClass={panelClass} />

                {/* Cheesecake Factory distance — Palm Beach Gardens FL */}
                <DistanceTile title="Nearest Cheesecake Factory" destLat={26.8401} destLng={-80.0757} mapsQuery="Cheesecake Factory" panelClass={panelClass} />

              </div>
            </>
          )}

          {/* SCORECARD */}
          {screen === "scorecard" && (
            <>
              <button className="mb-4 text-sm text-slate-500 hover:text-slate-800" onClick={() => setScreen("useful")}>← Back</button>
              <SectionTitle>SCORECARD GUIDE</SectionTitle>
              <div className={`rounded-sm shadow-sm ${panelClass} space-y-4 p-4 ring-1 ring-slate-200`}>
                {SCORECARD_SECTIONS.map((section) => (
                  <div key={section.title} className="border-b border-slate-200 pb-4 last:border-b-0">
                    <div className="mb-2 text-lg tracking-[0.12em] text-slate-900" style={{ fontFamily:'"Bebas Neue",sans-serif' }}>{section.title}</div>
                    <ul className="space-y-1 text-sm text-slate-700">{section.body.map((item) => <li key={item}>• {item}</li>)}</ul>
                    <button onClick={() => openExternal(section.youtube)} className="mt-3 text-xs text-slate-500 underline underline-offset-2">YouTube explanation</button>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* LFGBTQM BAE RANKINGS */}
          {screen === "lfgbtqm-bae" && (
            <>
              <button className="mb-4 text-sm text-white/80 hover:text-white" onClick={() => setScreen("leaderboard")}>← Back</button>
              <div className="mb-4 text-2xl tracking-[0.14em] text-white drop-shadow" style={{ fontFamily:'"Bebas Neue",sans-serif' }}>🏳️‍🌈 Mets Bae Power Rankings</div>
              <div className="space-y-3">
                {BAE_HOTNESS.map((player, idx) => (
                  <div key={player.number} className="rounded-sm bg-white/30 p-4 backdrop-blur-sm ring-1 ring-white/40 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="text-3xl font-black text-white/60 w-8 shrink-0" style={{ fontFamily:'"Orbitron",monospace' }}>{idx+1}</div>
                      <div>
                        <div className="text-lg tracking-[0.1em] text-white font-semibold" style={{ fontFamily:'"Bebas Neue",sans-serif' }}>#{player.number} {player.name}</div>
                        <div className="text-sm text-white/80 mt-0.5">{player.note}</div>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="rounded-sm bg-white/20 p-3 text-center text-xs text-white/70 backdrop-blur-sm">Rankings are purely aesthetic and absolutely official. No notes.</div>
              </div>
            </>
          )}

          {/* ADMIN */}
          {screen === "admin" && (
            <>
              <button className="mb-4 text-sm text-slate-500 hover:text-slate-800" onClick={() => setScreen("home")}>← Back</button>
              <div className="mb-4 flex items-center justify-between"><SectionTitle>STEVE COHEN MODE</SectionTitle><SyncIndicator synced={synced} /></div>
              <div className="space-y-3">
                {[["GLIZZIES","glizzy"],["SUN CRUISERS","sunCruiser"],["MARGARITAS","margarita"],["RAW EGG","rawEgg"],["FLORIDA","florida"]].map(([label,key]) => (
                  <div key={key} className={`rounded-sm ${panelClass} p-4 shadow-sm ring-1 ring-slate-200`}>
                    <div className="mb-3 text-lg tracking-[0.12em]" style={{ fontFamily:'"Bebas Neue",sans-serif' }}>{label}</div>
                    <div className="space-y-2">
                      {sortRowsWithRules(Object.entries(trackers[key] || {})).map(([name, value]) => (
                        <div key={name} className="flex items-center justify-between rounded-sm bg-slate-50 px-3 py-2">
                          <div className="text-sm flex-1">{name}</div>
                          <div className="flex items-center gap-2">
                            <button className={`rounded-sm px-3 py-1 ${currentMode.accent}`} onClick={() => decrementTracker(key, name)}>−</button>
                            <div className="w-10 text-center text-lg" style={{ fontFamily:'"Orbitron",monospace' }}>{value}</div>
                            <button className={`rounded-sm px-3 py-1 ${currentMode.accent}`} onClick={() => incrementTracker(key, name)}>+</button>
                            {(key === "rawEgg" || key === "florida") && (
                              <button className="rounded-sm bg-red-100 px-2 py-1 text-xs text-red-600 hover:bg-red-200" onClick={() => deleteCategory(key, name, key === "rawEgg" ? setRawEggCategories : setFloridaCategories)}>✕</button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                <div className={`rounded-sm ${panelClass} p-4 shadow-sm ring-1 ring-slate-200`}>
                  <div className="mb-3 text-lg tracking-[0.12em]" style={{ fontFamily:'"Bebas Neue",sans-serif' }}>METS BAE PLAYERS</div>
                  <button onClick={addBaePlayer} className={`mb-3 w-full rounded-sm px-4 py-3 font-medium tracking-widest ${currentMode.accent}`}>Add Player</button>
                  <div className="space-y-2">
                    {sortRosterBy(baePlayers, baeSort).map((player) => {
                      const label = formatPlayer(player);
                      const count = metsBaeCounts[label] || 0;
                      return (
                        <div key={label} className="flex items-center justify-between rounded-sm bg-slate-50 px-3 py-2">
                          <div className="text-sm flex-1">{label}</div>
                          <div className="flex items-center gap-2">
                            <button className={`rounded-sm px-3 py-1 ${currentMode.accent}`} onClick={() => {
                              const voter = Object.keys(baeVoterChoice).find((n) => baeVoterChoice[n] === label);
                              if (!voter) return;
                              const next = { ...baeVoterChoice, [voter]: "" };
                              setBaeVoterChoice(next); pushToFirebase({ baeVoterChoice: next });
                            }}>−</button>
                            <div className="w-10 text-center text-lg" style={{ fontFamily:'"Orbitron",monospace' }}>{count}</div>
                            <button className={`rounded-sm px-3 py-1 ${currentMode.accent}`} onClick={openBaeVoterDialog}>+</button>
                            <button className="rounded-sm bg-red-100 px-2 py-1 text-xs text-red-600 hover:bg-red-200" onClick={() => deleteBaePlayer(label)}>✕</button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className={`rounded-sm ${panelClass} p-4 shadow-sm ring-1 ring-slate-200`}>
                  <div className="mb-3 text-lg tracking-[0.12em]" style={{ fontFamily:'"Bebas Neue",sans-serif' }}>WHO VOTED FOR WHO</div>
                  <div className="space-y-2">
                    {baeVoteSummaryRows.map(([player, info]) => (
                      <div key={player} className="rounded-sm bg-slate-50 px-3 py-2">
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-slate-900">{player}</div>
                          <div className="text-sm text-slate-500">{info.votes} vote{info.votes!==1?"s":""}</div>
                        </div>
                        <div className="mt-1 text-xs text-slate-600">{info.people.join(", ")}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`rounded-sm ${panelClass} p-4 shadow-sm ring-1 ring-slate-200`}>
                  <div className="mb-3 text-lg tracking-[0.12em]" style={{ fontFamily:'"Bebas Neue",sans-serif' }}>GENERATOR DEFAULTS</div>
                  <div className="space-y-2">
                    {["chaosSubjects","chaosActions","chaosContexts","chaosOutcomes","floridaSubjects","floridaActions","floridaObjects","prophecyCards","prophecyOmens","prophecyTimings"].map((key) => (
                      <button key={key} onClick={() => addCustomGeneratorValue(key)} className="w-full rounded-sm bg-slate-100 px-4 py-2.5 text-left text-sm hover:bg-slate-200">
                        Add to {key}
                      </button>
                    ))}
                  </div>
                </div>

                <button onClick={resetAllTrackers} className="w-full rounded-sm bg-amber-500 px-4 py-4 font-medium text-white hover:bg-amber-600">
                  Selective Reset (choose which trackers to zero)
                </button>
              </div>
            </>
          )}

          {/* LEADERBOARD */}
          {screen === "leaderboard" && (
            <>
              <button className="mb-4 text-sm text-slate-500 hover:text-slate-800" onClick={() => setScreen("home")}>← Back</button>
              <SectionTitle>THE BEST LEADERBOARD</SectionTitle>
              <div className="space-y-3">

                {/* Best Index */}
                <div className={`rounded-sm ${panelClass} p-4 shadow-sm ring-1 ring-slate-200`}>
                  <div className="mb-3 text-lg tracking-[0.12em]" style={{ fontFamily:'"Bebas Neue",sans-serif' }}>THE BEST INDEX</div>
                  <ProgressRows rows={bestIndex} accentHex={currentMode.accentHex} />
                </div>

                {/* Awards — one card per person */}
                <div className={`rounded-sm ${panelClass} p-4 shadow-sm ring-1 ring-slate-200`}>
                  <div className="mb-3 text-lg tracking-[0.12em]" style={{ fontFamily:'"Bebas Neue",sans-serif' }}>🏆 AWARDS</div>
                  <div className="space-y-4">
                    {PEOPLE.map((person) => {
                      const g  = trackers.glizzy?.[person]     || 0;
                      const sc = trackers.sunCruiser?.[person] || 0;
                      const mg = trackers.margarita?.[person]  || 0;
                      const re = Object.values(trackers.rawEgg  || {}).reduce((a,b)=>a+b,0);
                      const fl = Object.values(trackers.florida || {}).reduce((a,b)=>a+b,0);
                      const awards = [
                        { emoji:"🌭", label: getAchievement(g,  GLIZZY_AWARDS),       count: g  },
                        { emoji:"☀️", label: getAchievement(sc, SUN_CRUISER_AWARDS),  count: sc },
                        { emoji:"🍹", label: getAchievement(mg, MARGARITA_AWARDS),    count: mg },
                        { emoji:"🥚", label: getAchievement(re, RAW_EGG_AWARDS),      count: re },
                        { emoji:"🌴", label: getAchievement(fl, FLORIDA_AWARDS),      count: fl },
                      ];
                      return (
                        <div key={person} className="rounded-sm bg-white/60 ring-1 ring-slate-200/60 overflow-hidden">
                          <div className="px-3 py-2 font-semibold text-slate-900 tracking-[0.08em] text-sm border-b border-slate-100" style={{ fontFamily:'"Bebas Neue",sans-serif', fontSize:"1.1rem" }}>
                            {person}
                          </div>
                          <div className="divide-y divide-slate-100">
                            {awards.map(({ emoji, label, count }) => (
                              <div key={emoji} className="flex items-center justify-between px-3 py-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-lg">{emoji}</span>
                                  <span className="text-xs text-slate-500 italic">{label}</span>
                                </div>
                                <span className="text-sm tabular-nums text-slate-700" style={{ fontFamily:'"Orbitron",monospace' }}>{String(count).padStart(2,"0")}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Tracker summaries */}
                {[["METS BAE VOTES",metsBaeRows,null],["GLIZZIES",glizzyRows,glizzyAchievements],["SUN CRUISERS",sunCruiserRows,sunCruiserAchievements],["RAW EGG",rawEggRows,null]].map(([title,rows,achievements]) => (
                  <div key={title} className={`rounded-sm ${panelClass} p-4 shadow-sm ring-1 ring-slate-200`}>
                    <div className="mb-3 text-lg tracking-[0.12em]" style={{ fontFamily:'"Bebas Neue",sans-serif' }}>{title}</div>
                    <ProgressRows rows={rows} accentHex={currentMode.accentHex} achievements={achievements} />
                  </div>
                ))}
                {mode === "margaritaville" && (
                  <div className={`rounded-sm ${panelClass} p-4 shadow-sm ring-1 ring-slate-200`}>
                    <div className="mb-3 text-lg tracking-[0.12em]" style={{ fontFamily:'"Bebas Neue",sans-serif' }}>🍹 MARGARITAS</div>
                    <ProgressRows rows={margaritaRows} accentHex={currentMode.accentHex} achievements={margaritaAchievements} />
                  </div>
                )}
                {mode === "lfgbtqm" && (
                  <button onClick={() => setScreen("lfgbtqm-bae")}
                    className="w-full rounded-sm bg-white/30 p-4 text-center text-lg tracking-[0.12em] text-white backdrop-blur-sm ring-1 ring-white/40 shadow-sm"
                    style={{ fontFamily:'"Bebas Neue",sans-serif' }}>
                    🏳️‍🌈 Mets Bae Power Rankings
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
