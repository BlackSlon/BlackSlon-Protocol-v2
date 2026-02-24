// src/app/markets_config.ts

export const BSR_MARKETS = [
  // Electrons (Power) - IPTs
  { id: 'IPT-P-DE', name: 'Power Germany', type: 'Power', b_base: 0.005 },
  { id: 'IPT-P-NO', name: 'Power Nordic', type: 'Power', b_base: 0.008 },
  { id: 'IPT-P-FR', name: 'Power France', type: 'Power', b_base: 0.012 },
  { id: 'IPT-P-PL', name: 'Power Poland', type: 'Power', b_base: 0.015 },
  
  // Molecules (Gas) - IPTs
  { id: 'IPT-G-NL', name: 'Gas Netherlands', type: 'Gas', b_base: 0.010 },
  { id: 'IPT-G-DE', name: 'Gas Germany', type: 'Gas', b_base: 0.012 },
  { id: 'IPT-G-PL', name: 'Gas Poland', type: 'Gas', b_base: 0.030 },
  { id: 'IPT-G-BG', name: 'Gas Bulgaria', type: 'Gas', b_base: 0.045 },
];