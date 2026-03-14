// src/app/markets_config.ts

export const BSR_MARKETS = [
  // Electrons (Power) - BS
  { id: 'BS-P-PL', name: 'Polish Power Market', type: 'Power', b_base: 0.005 },
  { id: 'BS-P-DE', name: 'German Power Market', type: 'Power', b_base: 0.008 },
  { id: 'BS-P-NO', name: 'Nordic Power Market', type: 'Power', b_base: 0.012 },
  { id: 'BS-P-UK', name: 'British Power Market', type: 'Power', b_base: 0.015 },
  
  // Molecules (Gas) - BS
  { id: 'BS-G-NL', name: 'Dutch Gas Market', type: 'Gas', b_base: 0.010 },
  { id: 'BS-G-DE', name: 'German Gas Market', type: 'Gas', b_base: 0.012 },
  { id: 'BS-G-PL', name: 'Polish Gas Market', type: 'Gas', b_base: 0.030 },
  { id: 'BS-G-BG', name: 'Balkan Gas Market', type: 'Gas', b_base: 0.045 },
];