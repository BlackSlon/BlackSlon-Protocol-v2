// src/app/markets_config.ts

export type MarketType = 'Power' | 'Gas'
export type MarketStatus = 'active' | 'dormant'

export interface BSRMarket {
  id: string
  name: string
  type: MarketType
  b_base: number
  status: MarketStatus
}

export const BSR_MARKETS: BSRMarket[] = [

  // ── ACTIVE MARKETS ──────────────────────────────────────────────────────────
  // Power (Electrons)
  { id: 'BS-P-DE', name: 'German Power Market',  type: 'Power', b_base: 0.008, status: 'active' },
  { id: 'BS-P-NO', name: 'Nordic Power Market',  type: 'Power', b_base: 0.012, status: 'active' },
  { id: 'BS-P-PL', name: 'Polish Power Market',  type: 'Power', b_base: 0.005, status: 'active' },
  { id: 'BS-P-UK', name: 'British Power Market', type: 'Power', b_base: 0.015, status: 'active' },
  // Gas (Molecules)
  { id: 'BS-G-NL', name: 'Dutch Gas Market',     type: 'Gas',   b_base: 0.010, status: 'active' },
  { id: 'BS-G-DE', name: 'German Gas Market',    type: 'Gas',   b_base: 0.012, status: 'active' },
  { id: 'BS-G-PL', name: 'Polish Gas Market',    type: 'Gas',   b_base: 0.030, status: 'active' },
  { id: 'BS-G-BG', name: 'Balkan Gas Market',    type: 'Gas',   b_base: 0.045, status: 'active' },
  
  // ── COMING SOON — POWER ─────────────────────────────────────────────────────
  { id: 'BS-P-FR', name: 'French Power Market',      type: 'Power', b_base: 0.008, status: 'dormant' },
  { id: 'BS-P-IT', name: 'Italian Power Market',     type: 'Power', b_base: 0.010, status: 'dormant' },
  { id: 'BS-P-ES', name: 'Spanish Power Market',     type: 'Power', b_base: 0.009, status: 'dormant' },
  { id: 'BS-P-BE', name: 'Belgian Power Market',     type: 'Power', b_base: 0.009, status: 'dormant' },
  { id: 'BS-P-AT', name: 'Austrian Power Market',    type: 'Power', b_base: 0.010, status: 'dormant' },
  { id: 'BS-P-CZ', name: 'Czech Power Market',       type: 'Power', b_base: 0.015, status: 'dormant' },
  { id: 'BS-P-GR', name: 'Greek Power Market',       type: 'Power', b_base: 0.020, status: 'dormant' },
  { id: 'BS-P-RO', name: 'Romanian Power Market',    type: 'Power', b_base: 0.025, status: 'dormant' },
  { id: 'BS-P-PT', name: 'Portuguese Power Market',  type: 'Power', b_base: 0.012, status: 'dormant' },
  { id: 'BS-P-HU', name: 'Hungarian Power Market',   type: 'Power', b_base: 0.020, status: 'dormant' },
  { id: 'BS-P-BG', name: 'Bulgarian Power Market',   type: 'Power', b_base: 0.035, status: 'dormant' },
  { id: 'BS-P-SK', name: 'Slovak Power Market',      type: 'Power', b_base: 0.018, status: 'dormant' },
  { id: 'BS-P-HR', name: 'Croatian Power Market',    type: 'Power', b_base: 0.022, status: 'dormant' },
  { id: 'BS-P-SI', name: 'Slovenian Power Market',   type: 'Power', b_base: 0.020, status: 'dormant' },
  { id: 'BS-P-UA', name: 'Ukrainian Power Market',   type: 'Power', b_base: 0.050, status: 'dormant' },
  { id: 'BS-P-TR', name: 'Turkish Power Market',     type: 'Power', b_base: 0.040, status: 'dormant' },

  // ── COMING SOON — GAS ───────────────────────────────────────────────────────
  { id: 'BS-G-FR', name: 'French Gas Market',        type: 'Gas',   b_base: 0.010, status: 'dormant' },
  { id: 'BS-G-IT', name: 'Italian Gas Market',       type: 'Gas',   b_base: 0.015, status: 'dormant' },
  { id: 'BS-G-UK', name: 'British Gas Market',       type: 'Gas',   b_base: 0.012, status: 'dormant' },
  { id: 'BS-G-ES', name: 'Spanish Gas Market',       type: 'Gas',   b_base: 0.015, status: 'dormant' },
  { id: 'BS-G-BE', name: 'Belgian Gas Market',       type: 'Gas',   b_base: 0.012, status: 'dormant' },
  { id: 'BS-G-AT', name: 'Austrian Gas Market',      type: 'Gas',   b_base: 0.018, status: 'dormant' },
  { id: 'BS-G-CZ', name: 'Czech Gas Market',         type: 'Gas',   b_base: 0.020, status: 'dormant' },
  { id: 'BS-G-GR', name: 'Greek Gas Market',         type: 'Gas',   b_base: 0.025, status: 'dormant' },
  { id: 'BS-G-RO', name: 'Romanian Gas Market',      type: 'Gas',   b_base: 0.030, status: 'dormant' },
  { id: 'BS-G-PT', name: 'Portuguese Gas Market',    type: 'Gas',   b_base: 0.020, status: 'dormant' },
  { id: 'BS-G-HU', name: 'Hungarian Gas Market',     type: 'Gas',   b_base: 0.025, status: 'dormant' },
  { id: 'BS-G-SK', name: 'Slovak Gas Market',        type: 'Gas',   b_base: 0.022, status: 'dormant' },
  { id: 'BS-G-HR', name: 'Croatian Gas Market',      type: 'Gas',   b_base: 0.028, status: 'dormant' },
  { id: 'BS-G-SI', name: 'Slovenian Gas Market',     type: 'Gas',   b_base: 0.025, status: 'dormant' },
  { id: 'BS-G-UA', name: 'Ukrainian Gas Market',     type: 'Gas',   b_base: 0.055, status: 'dormant' },
  { id: 'BS-G-TR', name: 'Turkish Gas Market',       type: 'Gas',   b_base: 0.040, status: 'dormant' },
  { id: 'BS-G-BL', name: 'Baltic Gas Market',        type: 'Gas',   b_base: 0.025, status: 'dormant' },
]