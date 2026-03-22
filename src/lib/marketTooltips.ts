// ─── Market Info Map ─────────────────────────────────────────────────────────

export interface MarketInfo {
  marketName: string
  bsMarketName: string
  exchangeName: string
  commodity: 'gas' | 'power'
  token: string
}

const MARKET_INFO: Record<string, MarketInfo> = {
  'BS-P-PL': { marketName: 'Polish Power Wholesale Market',   bsMarketName: 'BlackSlon Polish Power Market',    exchangeName: 'Polish Energy Exchange (TGE)', commodity: 'power', token: 'BS-P-PL' },
  'BS-P-DE': { marketName: 'German Power Wholesale Market',   bsMarketName: 'BlackSlon German Power Market',    exchangeName: 'EEX',                         commodity: 'power', token: 'BS-P-DE' },
  'BS-P-NO': { marketName: 'Nordic Power Wholesale Market',   bsMarketName: 'BlackSlon Nordic Power Market',    exchangeName: 'Nord Pool NO',                commodity: 'power', token: 'BS-P-NO' },
  'BS-P-UK': { marketName: 'UK Power Wholesale Market',       bsMarketName: 'BlackSlon UK Power Market',         exchangeName: 'N2EX UK',                     commodity: 'power', token: 'BS-P-UK' },
  'BS-G-NL': { marketName: 'Dutch TTF Gas Wholesale Market',  bsMarketName: 'BlackSlon Dutch Gas Market',        exchangeName: 'ICE Endex TTF',               commodity: 'gas',   token: 'BS-G-NL' },
  'BS-G-DE': { marketName: 'German THE Gas Wholesale Market', bsMarketName: 'BlackSlon German Gas Market',       exchangeName: 'EEX',                         commodity: 'gas',   token: 'BS-G-DE' },
  'BS-G-PL': { marketName: 'Polish Gas Wholesale Market',     bsMarketName: 'BlackSlon Polish Gas Market',       exchangeName: 'Polish Energy Exchange (TGE)', commodity: 'gas',   token: 'BS-G-PL' },
  'BS-G-BG': { marketName: 'Bulgarian Gas Wholesale Market',  bsMarketName: 'BlackSlon Bulgarian Gas Market',    exchangeName: 'Balkan Gas Hub',               commodity: 'gas',   token: 'BS-G-BG' },
}

export function getMarketInfo(marketId: string): MarketInfo {
  return MARKET_INFO[marketId] ?? MARKET_INFO['BS-P-PL']
}

// ─── Market-specific tooltip content ─────────────────────────────────────────

export function getMarketTooltips(marketId: string) {
  const m = getMarketInfo(marketId)

  return {

    bssz:
      `The BSSZ is the physically-anchored price corridor within which all BlackSlon Protocol transactions are executed and settled. It is derived from a weighted blend of the short-dated forward curve — capturing real market stress — and the long-dated curve, acting as a structural stabiliser. Orders outside the corridor are rejected before they reach the matching engine. The BSSZ does not suppress price discovery — it separates genuine market trends from short-term noise. If the physical market sustains a move, the Anchor follows over subsequent days and the corridor shifts accordingly. Trends pass through. Panic does not.`,

    anchor:
      `The Anchor is calculated as a weighted average of physical spot and forward prices — 10% Day-Ahead spot, 40% Front Month, 25% Front Quarter, and 25% Calendar Year — smoothed over the last three trading days using a recursive 50/25/25 formula. This three-day smoothing prevents any single-day spike or manipulation from instantly shifting the corridor. The Anchor moves with the real market trend — if the price of the underlying commodity rises for several consecutive days, the Anchor rises with it and the entire corridor shifts upward. It is the protocol's mathematical connection to physical market reality — here, for the ${m.marketName}.`,

    floor:
      `The Floor is the lower boundary of the BSSZ corridor, set at Anchor minus 10%. It is deliberately tight by design. Because the Anchor continuously tracks the physical market trend, the Floor does not cap the upside — it moves up with the market. Its purpose is to protect long-term BlackSlon token holders from sudden, irrational downward spikes that bear no relation to the underlying physical trend. Positions cannot be opened or settled below this level. The Floor is a shield against manipulation and panic-driven sell-offs, not a constraint on legitimate price discovery — here, for the ${m.marketName}.`,

    cap:
      `The Cap is the upper boundary of the BSSZ corridor, set at Anchor plus 20%. It is wider than the Floor by design, reflecting the asymmetric nature of energy commodity price shocks — prices spike upward far more violently than they collapse. A participant who wants to buy at elevated prices may do so within the corridor. If the physical market sustains that move, the Anchor will follow over subsequent days and the Cap will shift upward accordingly. The asymmetry is not arbitrary — it mirrors the structural behaviour of European energy markets during geopolitical and supply-side shocks — here, for ${m.commodity} on the ${m.marketName}.`,

    fm:
      `Front Month is the current settlement price of the front-month commodity contract on the reference exchange, verified by oracles. It is the most liquid and widely traded segment of the forward curve, carrying 40% weight in the Anchor calculation. This is the product professional market participants trade every day — here, for ${m.commodity} on the ${m.exchangeName}.`,

    bsszVsFwd:
      `This section compares the Anchor against the current Front Month price on the reference exchange. The difference reveals whether the physical market is trading at a premium or discount relative to the Anchor. A positive spread indicates the physical market has moved ahead of the Anchor, suggesting upward momentum not yet fully absorbed into the corridor. A negative spread indicates the physical market has pulled back. This comparison is updated daily and gives participants a real-time view of how the BSSZ corridor relates to live physical market conditions — here, for the ${m.marketName} on the ${m.exchangeName}.`,

    spread:
      `The Spread shows the difference between the current Front Month price on the reference exchange and the Anchor, expressed both in percentage terms and in absolute EUR per 100 kWh. A positive spread means the physical market is trading above the Anchor — the forward curve has moved faster than the corridor. A negative spread means the physical market has retreated below the Anchor. The spread is a leading indicator: sustained positive spreads signal that the Anchor will follow upward in subsequent days as the recursive formula absorbs the new price levels. It is the gap between where the market is and where the corridor is anchored — here, for the ${m.marketName}.`,

    orderBook:
      `The Order Book is the live limit order book where participants trade BlackSlon tokens directly with each other at supply/demand-driven prices — here, ${m.token} on the ${m.bsMarketName}. All bids and asks are visible to all participants in real time — there is no preferential order routing or hidden liquidity. Orders are constrained by the BSSZ corridor: no order outside the range of Anchor minus 10% to Anchor plus 20% can be placed or executed. The matching engine uses price-time priority — the best-priced order executes first, and among equal prices, the earliest order has priority.`,

    liquidity:
      `The Liquidity indicator shows the total volume of trades executed on a BlackSlon Market over the last 24 hours — a direct measure of market activity and depth. Higher volume signals an active, liquid market where positions can be entered and exited at fair prices with minimal slippage. Lower volume may indicate wider spreads and reduced price discovery efficiency. Unlike traditional energy exchanges that operate within fixed daily windows, BlackSlon Protocol runs 24/7/365 — liquidity is continuously generated across all time zones, including weekends and holidays when physical risk events most commonly occur — here, for the ${m.bsMarketName}.`,

    bsei:
      `The BlackSlon Energy Index (BSEI) is the transaction-derived settlement benchmark for BlackSlon Markets, calculated exclusively from executed trades. It uses a three-tier Segmented Rolling VWAP over a 72-hour window: the most recent 24 hours carry 50% weight, the preceding 24–48 hours carry 25%, and the oldest 48–72 hours carry 25%. This structure makes single-session manipulation economically unviable — to move the BSEI, an actor would need to dominate trading volume across three consecutive days. The BSEI is the single source of data for Mark-to-Market valuation and margin requirements — here, for the ${m.bsMarketName} (${m.token}).`,

    collateral:
      `The Collateral Configuration defines the ratio of €BSR to eEURO used as margin to open a new position. Every position in the BlackSlon Protocol is backed by a dual-asset collateral portfolio — here, for buying and selling ${m.token} on the ${m.bsMarketName}. The higher the proportion of €BSR in your collateral, the lower your required % margin and trading fees — and the higher your available leverage. At 100% €BSR, the margin requirement drops to 25% for long positions and fees fall to 0.20%. At 10% €BSR, the margin requirement is 50% and fees are 1.00%. This tiered system aligns protocol sustainability with user capital efficiency — staking more €BSR signals long-term commitment and is rewarded with better trading conditions. When closing a position, the closing fee is a flat 0.20% of the position's notional value, regardless of your €BSR ratio.`,

    requiredMargin:
      `The Required Margin is the minimum collateral that must be deposited and locked to open and maintain your position. It is calculated as a percentage of the position's notional value, determined by your Collateral Configuration tier and the direction of your trade. Short (SELL) positions require twice the margin of long (BUY) positions — by design, not by symmetry. BlackSlon is built primarily for long-term token holders and participants who want structural exposure to European energy markets. The higher short margin is a deliberate architectural choice to protect long holders from coordinated long squeezes and to preserve the protocol's role as an energy-linked store of value. The margin is locked in your BlackSlon Vault for the duration of the position. If your portfolio equity falls below 50% of aggregate required margin, the Smart Incremental Liquidation mechanism activates — reducing positions in 10% steps rather than forcing a full close.`,

    tradingTerminal:
      `The BlackSlon Trading Terminal is the order entry interface for buying and selling BlackSlon tokens — here, ${m.token} on the ${m.bsMarketName}. Start by selecting BUY or SELL — this determines the required margin and fee structure for your order. Then set your order price within the BSSZ corridor — any price outside the BSSZ will be rejected before reaching the matching engine. Set your quantity in tokens, where 1 token represents 100 kWh of energy. In the Collateral Configuration section, choose your €BSR to eEURO ratio — the higher the €BSR proportion, the lower your required margin and fees. The terminal will calculate your exact €BSR deposit, required margin, and eEURO deposit in real time. Once you are satisfied with the parameters, CONFIRM your ORDER. Your order is then placed directly in the BlackSlon Order Book and matched against available counterparties using price-time priority. Active orders are visible below and can be cancelled at any time before execution.`,

  }
}

// ─── Static tooltips (not market-specific) ───────────────────────────────────

export const STATIC_TOOLTIPS = {

  availableLiquidity:
    `Available Liquidity shows your free capital — the €BSR and eEURO balances that are not currently locked as margin in open positions. This is the capital you can deploy immediately to open new positions, add to existing collateral, convert between €BSR and eEURO, or withdraw. The balance updates in real time as positions are opened, closed, or partially liquidated. Maintaining sufficient Available Liquidity is the primary way to keep your Health Factor in the Safe zone and avoid Smart Liquidation events.`,

  vault:
    `The BlackSlon Vault holds your locked collateral — the €BSR and eEURO that are committed as margin for your open positions. These funds are secured by the smart contract and cannot be withdrawn while positions are open. When a position is closed or reduced, the corresponding collateral is released back to Available Liquidity. The Vault is segregated from the Protocol Treasury — your collateral is your collateral, not the protocol's operating capital. In the event of a liquidation, 100% of the liquidated collateral is transferred to the Protocol Vault — directly strengthening the protocol's asset base and long-term solvency. There is no extraction, no fee diversion, and no third-party claim. Every liquidation event makes the protocol stronger.`,

  portfolio:
    `The Portfolio shows all your open positions across all BlackSlon Gas & Power Markets, valued in real time using the BSEI as the Mark-to-Market benchmark. For each position you can see the number of tokens held, total volume in kWh, average entry price, current BSEI price, and unrealized profit in eEURO. Positions never expire — there is no forced roll, no year-end liquidity crunch. A position opened today remains valid indefinitely, continuously anchored to physical market reality through the BSSZ corridor. Your PnL reflects the difference between your average entry price and the current BSEI-derived market value.`,

  healthFactor:
    `The Health Factor (H) is your portfolio's real-time stability metric — the ratio of your total equity to 50% of your aggregate required margin. H above 1.10 means your account is fully operational with no restrictions. Between 1.05 and 1.10, a margin call notification is triggered. Between 1.00 and 1.05, your account enters Reduce-Only mode — you can close positions or add collateral, but cannot open new ones. Below 1.00, the Smart Incremental Liquidation Mechanism activates: the system reduces your most impactful position by 10% — never closing in full — to restore your Health Factor above the threshold. The colour gradient reflects your current zone: green is safe, yellow is a warning, orange is restricted, red is intervention.`,

  solvency:
    `The Ecosystem Solvency Index (H-solv) measures the financial health of the entire BlackSlon Protocol — not just your account. It is the ratio of the protocol's total adjusted assets (vaulted eEURO, risk-adjusted €BSR reserves, and the Stability Reserve) to its total liabilities — the aggregate In-The-Money exposure across all profitable positions, committed margins, and operational reserves. H-solv is published on-chain in real time and triggers automated responses at defined thresholds. Tier I (above 1.15) means full expansion mode with no restrictions. Tier II (1.05–1.15) is standard operations. Tier III (1.00–1.05) restricts new positions to minimum 50% eEURO collateral. Tier IV (below 1.00) activates a full hard stop on new positions and triggers emergency governance procedures.`,

  portal:
    `The Portal allows you to convert between €BSR — the BlackSlon Protocol's native utility token — and eEURO, the MiCA-compliant Euro stablecoin that serves as the settlement currency. The exchange rate is not speculative: it is mathematically derived from the BlackSlon Protocol Vault's net asset value using the formula P_BSR = V_eEURO / (S_BSR × RR), where V_eEURO is total vaulted eEURO, S_BSR is circulating supply, and RR is the Reserve Ratio safety multiplier. Because every liquidation event transfers 100% of liquidated collateral to the BlackSlon Protocol Vault, converting eEURO to €BSR increases your collateral efficiency, reduces your trading fees, and gives you direct exposure to the protocol's long-term growth.`,

}
