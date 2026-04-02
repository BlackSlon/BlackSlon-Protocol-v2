"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Segment {
  id: string;
  num: string;
  icon: string;
  title: string;
  sub: string;
  tagLabel: string;
  tagColor: string; // Tailwind classes for the tag
  isNew?: boolean;
  how2y: string;
  needs: string[];
  pain: string[];
  aiPersona: string;
  aiDesc: string;
  aiTags: string[];
  defaultMarket: string; // e.g. "/markets/BS-G-NL"
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const SEGMENTS: Segment[] = [
  {
    id: "pro-trader",
    num: "01",
    icon: "📊",
    title: "Pro Energy Trader",
    sub: "You trade gas & power daily inside BP, Orlen, DTEK or Shell. Non-compete blocks your private access. BlackSlon is your first legal market.",
    tagLabel: "PRO TRADER",
    tagColor: "border-blue-500/50 bg-blue-500/5 text-blue-400",
    how2y: "Speculates on the direction of the 2-year rolling contract price. Knows when backwardation narrows or widens — that is the edge.",
    needs: [
      "Full terminal — live BSSZ, BSEI, H-factor",
      "Cross-hub spread TTF / THE / TGE / Phelix",
      "Backwardation curve analysis 24m",
      "Vol surface and hedge timing",
      "P&L attribution per position",
    ],
    pain: [
      "Non-compete prevents private trading",
      "€3–5M capital barrier to entry",
      "No legal instrument for individual energy traders",
    ],
    aiPersona: "Quant Companion",
    aiDesc:
      "Monitors positions 24/7, detects BSEI anomalies vs Physical Meridian, suggests timing based on backwardation rolling. Speaks risk manager language — not crypto.",
    aiTags: ["BSSZ anomaly", "Backwardation tracker", "Cross-hub arb", "Roll-yield", "Vol alert", "H-factor"],
    defaultMarket: "/markets/BS-G-NL",
  },
  {
    id: "producer-baseload",
    num: "02",
    icon: "⚛️",
    title: "Baseload Producer",
    sub: "Nuclear, gas or coal plant. You deliver power 24h/day in flat profile. Full 1:1 hedge against your 2-year production profile.",
    tagLabel: "PRODUCER · BASELOAD",
    tagColor: "border-green-500/50 bg-green-500/5 text-green-400",
    how2y: "Hedge 1:1: you produce in flat baseload = you can fully cover the 2-year delivery contract with BS-P tokens. Sell BS-P when price > LCOE.",
    needs: [
      "1:1 hedge ratio for baseload profile",
      "Alert: BS-P > LCOE → open SELL",
      "PnL hedge vs physical realisation",
      "Backwardation 24m vs marginal cost",
      "REMIT compliance reporting",
    ],
    pain: [
      "No instrument for mid-size power plants",
      "Margin calls during 2022 spike events",
      "Expensive bank guarantees for EEX / ICE",
    ],
    aiPersona: "Production Risk Manager",
    aiDesc:
      "Analyses production profile and calculates optimal SELL timing on BS-P. Compares token price to LCOE and marginal cost. When BS-P > LCOE → alert: open hedge.",
    aiTags: ["1:1 hedge", "LCOE alert", "Cal 24m timing", "REMIT", "Baseload profile", "Backwardation yield"],
    defaultMarket: "/markets/BS-P-DE",
  },
  {
    id: "producer-renewables",
    num: "03",
    icon: "☀️",
    title: "Renewable Producer",
    sub: "Wind or solar farm. Intermittent generation. Partial portfolio hedge based on capacity factor — not full 1:1.",
    tagLabel: "PRODUCER · OZE",
    tagColor: "border-green-500/50 bg-green-500/5 text-green-400",
    how2y: "Cannot hedge 1:1 — does not deliver flat. Use BS-P for partial portfolio closing at capacity factor level (e.g. 35% of exposure).",
    needs: [
      "Hedge ratio = f(capacity factor)",
      "Renewable Cannibalization alert (prices < 0)",
      "Portfolio closing — proportional hedge",
      "Profile correlation with BSSZ",
    ],
    pain: [
      "Renewable Cannibalization at solar noon in summer",
      "Cannot hedge full production profile",
      "Seasonality vs bank financing requirements",
    ],
    aiPersona: "Renewable Portfolio Assistant",
    aiDesc:
      "Calculates capacity factor and suggests proportional hedging. Monitors negative price windows and Cannibalization risk in real time.",
    aiTags: ["Capacity factor", "Cannibalization alert", "Portfolio closing", "Profile vs BSSZ", "Balancing cost"],
    defaultMarket: "/markets/BS-P-DE",
  },
  {
    id: "industrial-consumer",
    num: "04",
    icon: "🏭",
    title: "Large Industrial Consumer",
    sub: "You need cheap baseload energy. Certainty of price for 2 years. Backwardation in Cal+1/Cal+2 is direct savings for your P&L.",
    tagLabel: "INDUSTRIAL HEDGER",
    tagColor: "border-green-500/50 bg-green-500/5 text-green-400",
    how2y: "Buy BS token = lock the baseload price (Cal embedded in BSSZ) for 24 months. Phase 2: token redeemable 1:1 against physical supply agreement.",
    needs: [
      "Baseload Cal price 24m vs your current supplier contract",
      "Savings calculator: how much do I save buying now vs in 6m",
      "CFO report: exposure and hedge coverage",
      "Alert when backwardation > savings threshold",
    ],
    pain: [
      "No access to Cal+1/Cal+2 without €M bank guarantees",
      "Prepayment to supplier — you finance their working capital",
      "Information asymmetry vs institutional traders",
    ],
    aiPersona: "Energy Procurement Advisor",
    aiDesc:
      "Focused on baseload price and savings. Answers one question: 'How much do I save by buying now?' Generates CFO-ready reports.",
    aiTags: ["Cal baseload 24m", "Savings calculator", "CFO report", "Backwardation alert", "Annual budget"],
    defaultMarket: "/markets/BS-G-NL",
  },
  {
    id: "energy-investor",
    num: "05",
    icon: "💡",
    title: "Energy Investor",
    sub: "You believe energy prices will rise. Not energy stocks — direct local exposure. First instrument of its kind.",
    tagLabel: "NEW ASSET CLASS",
    tagColor: "border-purple-500/50 bg-purple-500/5 text-purple-400",
    isNew: true,
    how2y: "Buy BS token as investment, not for physical delivery. Energy under AI: data centres are heavy industry of the 21st century. Local energy = local inflation hedge.",
    needs: [
      "Macro thesis: why energy prices will rise",
      "BS-P-DE vs EON/RWE stocks vs energy ETF comparison",
      "Correlation with EUR inflation and AI compute costs",
      "Portfolio allocation: energy vs other asset classes",
      "Exit alert when backwardation disappears",
    ],
    pain: [
      "No direct local energy instrument existed before BlackSlon",
      "Energy stocks = indirect exposure with many other risks",
      "Oil loses relevance with EV electrification",
    ],
    aiPersona: "Energy-as-Asset Analyst",
    aiDesc:
      "Explains why energy is a new asset class: AI demand, locality, structural inflation. Compares BS-P-DE vs alternatives. Builds investment thesis in asset manager language.",
    aiTags: ["AI demand thesis", "Locality premium", "Inflation correlation", "vs energy stocks", "vs oil", "Asset allocation"],
    defaultMarket: "/markets/BS-P-DE",
  },
  {
    id: "household-active",
    num: "06",
    icon: "🏠",
    title: "Active Household Hedger",
    sub: "You understand hedging. Give us your consumption — AI tells you how many tokens to buy and when.",
    tagLabel: "RETAIL · ACTIVE",
    tagColor: "border-yellow-500/50 bg-yellow-500/5 text-yellow-400",
    how2y: "Buy tokens = lock your household bill price for 24 months. Phase 2: token exchangeable for supply agreement with local provider at token price.",
    needs: [
      "Input consumption → AI says how many tokens to buy",
      "Alert when prices are historically low",
      "Simulator: at this price my bill = X EUR",
      "Simple dashboard — not a trading terminal",
    ],
    pain: [
      "High bills especially in winter",
      "No hedging tools for individuals before BlackSlon",
      "Understands hedging concept but not the market",
    ],
    aiPersona: "Personal Energy Assistant",
    aiDesc:
      "'Buy 450 kWh BS-G now — prices are 18% below 12-month average. Your bills are protected until March 2027.'",
    aiTags: ["Consumption calculator", "Optimal timing", "Low price alert", "Bill simulator", "Plain language"],
    defaultMarket: "/markets/BS-G-NL",
  },
  {
    id: "household-passive",
    num: "07",
    icon: "🛡️",
    title: "Passive Protection",
    sub: "Bills are rising. You want protection. Zero market knowledge required. One button: Protect my energy costs.",
    tagLabel: "RETAIL · PASSIVE",
    tagColor: "border-yellow-500/50 bg-yellow-500/5 text-yellow-400",
    how2y: "Fully automatic mode. AI buys and rolls the position. Phase 2: automatic 2-year supply contract renewal at token price.",
    needs: [
      "Onboarding: 2 questions maximum",
      "One button: 'Protect for winter'",
      "Zero trading terminology",
      "Push: 'Protected until March 2027 at X EUR'",
    ],
    pain: [
      "Fear of rising energy bills",
      "Zero knowledge of energy markets",
      "Bad associations with crypto: speculation, risk",
    ],
    aiPersona: "Set & Forget Guardian",
    aiDesc:
      "AI asks only: 'How much do you pay for energy per month?' and 'For how many months?' — everything else is automatic. No charts. No prices. Just: 'Protected until March 2027.'",
    aiTags: ["2-step onboarding", "Zero jargon", "Push notifications", "Auto-rolling", "Set & forget"],
    defaultMarket: "/markets/BS-G-NL",
  },
  {
    id: "speculator",
    num: "08",
    icon: "🎰",
    title: "Speculator",
    sub: "You trade crypto and stocks. Energy volatility now exceeds most crypto. Same instincts — new market. AI translates for you.",
    tagLabel: "SPECULATOR",
    tagColor: "border-red-500/50 bg-red-500/5 text-red-400",
    how2y: "Speculates on price direction of the 2-year rolling contract. Energy now = higher vol than most crypto. AI translates energy signals into your language.",
    needs: [
      "Technical signals translated into energy language",
      "'TTF +12% in 3 days = oversold vs Anchor' alerts",
      "Vol ranking: energy vs BTC vs NASDAQ",
      "Real-time P&L, crypto-style UI",
    ],
    pain: [
      "Does not know energy fundamentals",
      "Used to crypto exchange UI (24/7, high volatility)",
      "Needs edge — energy vol is the new frontier",
    ],
    aiPersona: "AI Trader Companion",
    aiDesc:
      "Translates energy signals into crypto trader language. AI replaces domain knowledge. 'BSSZ upper band + momentum → possible revert, H-factor 2.1 = safe margin.'",
    aiTags: ["Momentum alerts", "Vol ranking", "BSSZ levels", "vs crypto", "Short-term timing"],
    defaultMarket: "/markets/BS-P-DE",
  },
  {
    id: "institutional",
    num: "09",
    icon: "🏦",
    title: "Institutional / Broker / B2B",
    sub: "Family office, fund, or broker distributing energy tokens to clients. Commodity allocation without futures complexity.",
    tagLabel: "INSTITUTIONAL",
    tagColor: "border-gray-500/50 bg-gray-500/5 text-gray-400",
    how2y: "Allocate a portion of portfolio to local energy market as inflation hedge. Or distribute tokens as product to clients with commission on volume.",
    needs: [
      "Portfolio risk report — energy as % of allocation",
      "Correlation BS-P/G with EUR inflation and macro",
      "H_solv protocol monitoring (due diligence)",
      "Compliance documentation AIFMD / ILPA",
      "Multi-client dashboard for brokers",
    ],
    pain: [
      "Futures = roll cost + margin + segregated account",
      "No regulated energy product for asset managers",
      "ETRM complexity for family offices",
    ],
    aiPersona: "Portfolio & Relationship Analyst",
    aiDesc:
      "Generates investment and compliance reports. For brokers: multi-client dashboard, alerts when a client approaches Warning Zone, automatic client reports.",
    aiTags: ["Risk report", "Macro correlation", "H_solv monitor", "Compliance", "Multi-client", "Auto-reports"],
    defaultMarket: "/markets/BS-P-DE",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function ProfileSelector() {
  const [active, setActive] = useState<string | null>(null);
  const router = useRouter();

  const activeSegment = SEGMENTS.find((s) => s.id === active) ?? null;

  function handleSelect(id: string) {
    setActive((prev) => (prev === id ? null : id));
  }

  function handleEnter(seg: Segment) {
    // Store profile in localStorage so the markets page can read it
    if (typeof window !== "undefined") {
      localStorage.setItem("bs_profile", seg.id);
    }
    router.push(`${seg.defaultMarket}?profile=${seg.id}`);
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center font-mono">

      {/* ── Top bar (matches existing market page) ── */}
      <div className="w-full border-b border-gray-900 sticky top-0 z-50 bg-black/95 backdrop-blur-sm">
        <div className="w-full max-w-[1600px] mx-auto px-4 py-1.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {/* Same logo box as market page */}
            <div className="w-5 h-5 border border-yellow-500/60 flex items-center justify-center text-[10px] text-yellow-400">
              八
            </div>
            <span className="text-[9px] uppercase tracking-widest text-gray-500">
              BLACKSLON PROTOCOL
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-700 animate-pulse" />
            <span className="text-[9px] uppercase tracking-widest text-gray-600">LIVE</span>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[1600px] mx-auto px-4 py-10">

        {/* ── Header ── */}
        <div className="text-center mb-10">
          <p className="text-[9px] uppercase tracking-widest text-gray-600 mb-4">
            BLACKSLON PROTOCOL — PROFILE SELECTION
          </p>
          <h1 className="text-4xl font-light tracking-wide text-white mb-2">
            Who are <span className="text-yellow-400 font-semibold">you</span>?
          </h1>
          <p className="text-[10px] uppercase tracking-widest text-gray-600 mb-8">
            SELECT YOUR PROFILE — YOUR AI ADVISOR ADAPTS TO YOUR NEEDS
          </p>

          {/* Core paradigm strip */}
          <div className="inline-flex border border-gray-900 divide-x divide-gray-900 text-[9px] uppercase tracking-widest">
            {[
              { label: "TOKEN", value: "1 BS = 100 kWh" },
              { label: "CONTRACT", value: "2-YEAR ROLLING DELIVERY" },
              { label: "STRUCTURE", value: "BACKWARDATION EMBEDDED" },
              { label: "MARKET", value: "LOCAL · ISOLATED · 24/7" },
            ].map((item) => (
              <div key={item.label} className="px-4 py-2 text-center">
                <div className="text-gray-600 mb-1">{item.label}</div>
                <div className="text-yellow-400">{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Segments grid ── */}
        <div className="grid grid-cols-3 gap-px bg-gray-900 border border-gray-900 mb-px">
          {SEGMENTS.map((seg) => (
            <div
              key={seg.id}
              onClick={() => handleSelect(seg.id)}
              className={`
                relative bg-black px-5 py-5 cursor-pointer transition-colors group
                ${active === seg.id ? "bg-gray-950" : "hover:bg-gray-950"}
              `}
            >
              {/* Active top line */}
              {active === seg.id && (
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-yellow-500" />
              )}

              {/* NEW badge */}
              {seg.isNew && (
                <div className="absolute top-3 right-3 text-[8px] uppercase tracking-widest border border-yellow-500/40 text-yellow-500 px-1.5 py-0.5">
                  NEW
                </div>
              )}

              {/* Number */}
              <div className="text-[9px] text-gray-700 tracking-widest mb-2">{seg.num}</div>

              {/* Icon + title row */}
              <div className="flex items-start gap-2.5 mb-2">
                <div className="w-7 h-7 border border-gray-800 flex items-center justify-center text-sm shrink-0 mt-0.5">
                  {seg.icon}
                </div>
                <div className="text-[13px] font-semibold text-white leading-tight tracking-wide">
                  {seg.title}
                </div>
              </div>

              {/* Subtitle */}
              <p className="text-[10px] text-gray-500 leading-relaxed tracking-wide mb-3">
                {seg.sub}
              </p>

              {/* Tag */}
              <div className={`inline-block text-[8px] uppercase tracking-widest px-2 py-0.5 rounded-sm border mb-3 ${seg.tagColor}`}>
                {seg.tagLabel}
              </div>

              {/* AI label */}
              <div className="text-[9px] text-gray-700 tracking-widest mb-1">AI ADVISOR</div>
              <div className="text-[10px] text-gray-500 tracking-wide mb-4">{seg.aiPersona}</div>

              {/* Enter button */}
              <button
                onClick={(e) => { e.stopPropagation(); handleEnter(seg); }}
                className="w-full text-[8px] uppercase tracking-widest py-1.5 border border-gray-800 text-gray-600 hover:border-yellow-500 hover:text-yellow-400 transition-colors"
              >
                ENTER AS {seg.tagLabel} →
              </button>
            </div>
          ))}
        </div>

        {/* ── Detail panel ── */}
        {activeSegment && (
          <div className="border border-gray-900 border-t-0 bg-[#050505] p-6 grid grid-cols-3 gap-8">

            {/* Col 1: Needs */}
            <div>
              <div className="text-[9px] uppercase tracking-widest text-gray-600 mb-3 pb-2 border-b border-gray-900">
                WHAT YOU NEED FROM BLACKSLON
              </div>

              {/* 2Y contract logic */}
              <div className="border-l-2 border-yellow-500/30 pl-3 mb-4 bg-yellow-500/5 py-2 pr-2">
                <div className="text-[8px] uppercase tracking-widest text-yellow-600 mb-1.5">
                  2-YEAR ROLLING CONTRACT LOGIC
                </div>
                <div className="text-[10px] text-gray-500 leading-relaxed">
                  {activeSegment.how2y}
                </div>
              </div>

              {activeSegment.needs.map((n) => (
                <div key={n} className="text-[10px] text-gray-500 py-1.5 border-b border-gray-900/60 leading-relaxed">
                  <span className="text-yellow-600 mr-1.5">→</span>{n}
                </div>
              ))}
            </div>

            {/* Col 2: Pain points */}
            <div>
              <div className="text-[9px] uppercase tracking-widest text-gray-600 mb-3 pb-2 border-b border-gray-900">
                CURRENT MARKET PAIN POINTS
              </div>
              {activeSegment.pain.map((p) => (
                <div key={p} className="text-[10px] text-gray-500 py-1.5 border-b border-gray-900/60 leading-relaxed">
                  <span className="text-red-800 mr-1.5">✕</span>{p}
                </div>
              ))}
            </div>

            {/* Col 3: AI Advisor */}
            <div>
              <div className="text-[9px] uppercase tracking-widest text-gray-600 mb-3 pb-2 border-b border-gray-900">
                YOUR AI ADVISOR
              </div>
              <div className="border border-gray-900 p-4 bg-black">
                <div className="text-[15px] font-semibold text-yellow-400 tracking-wide mb-2">
                  {activeSegment.aiPersona}
                </div>
                <p className="text-[10px] text-gray-500 leading-relaxed tracking-wide mb-4">
                  {activeSegment.aiDesc}
                </p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {activeSegment.aiTags.map((t) => (
                    <span key={t} className="text-[8px] uppercase tracking-widest border border-gray-800 text-gray-600 px-1.5 py-0.5">
                      {t}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => handleEnter(activeSegment)}
                  className="w-full text-[9px] uppercase tracking-widest py-2 border border-yellow-500/40 text-yellow-400 hover:bg-yellow-500 hover:text-black transition-colors"
                >
                  ENTER MARKET WITH THIS PROFILE →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Bottom CTA ── */}
        <div className="text-center mt-10 pt-8 border-t border-gray-900">
          <p className="text-[9px] uppercase tracking-widest text-gray-700 mb-4">
            OR ENTER DIRECTLY AS GUEST — FULL TERMINAL ACCESS
          </p>
          <button
            onClick={() => router.push("/markets/BS-P-DE")}
            className="text-[10px] uppercase tracking-widest px-8 py-2.5 border border-gray-800 text-gray-500 hover:border-yellow-500 hover:text-yellow-400 transition-colors"
          >
            ENTER MARKETS →
          </button>
        </div>

      </div>
    </main>
  );
}
