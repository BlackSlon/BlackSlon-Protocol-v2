# BlackSlon Protocol
## White Paper v1.0
### The New Architecture of European Energy Wholesale Markets

**Version:** 1.0 | **Status:** APPROVED | **Date:** March 2026  
**Language:** English | **Classification:** Public

---

> *"I did not add layers. I stripped them away until only truth remained."*  
> — Kazimierz Malewicz, 1915

---

## Table of Contents

1. [Preface: The Scale of the Problem](#1-preface)
2. [The Two Gates of the Private Club](#2-the-two-gates)
3. [The Failures BlackSlon Is Solving](#3-failures)
4. [The BlackSlon Answer](#4-answer)
5. [The Philosophy: Kazimierz Malewicz and the Zero Form](#5-philosophy)
6. [Founder's Heritage](#6-founder)
7. [The Name: Black Swan × Black Elephant](#7-name)
8. [BSSZ Framework: The Physical Energy Foundation](#8-bssz)
9. [BSEI Framework: The Transaction Settlement Index](#9-bsei)
10. [BS-P & BS-G Token Specification](#10-tokens)
11. [Economic Equilibrium & Treasury Governance](#11-economics)
12. [Ecosystem Solvency: Macro Level](#12-macro-solvency)
13. [Risk Management: Position Level](#13-risk)
14. [Liquidity Layer](#14-liquidity)
15. [Physical Liquidity Provider (PLP)](#15-plp)
16. [KYC/AML Framework](#16-kyc)
17. [Regulatory Compliance & Legal Framework](#17-regulatory)
18. [BSR-SR Stability Reserve](#18-bsr-sr)
19. [System Architecture](#19-architecture)
20. [Protocol Constants Reference](#20-constants)

---

## 1. Preface: The Scale of the Problem

The European wholesale energy market is one of the largest and most consequential financial ecosystems on the planet.

Power alone: approximately **3,570,000,000 MWh** traded annually at an average of **€70/MWh** — a market valued at **~€250 billion** in physical delivery. Natural gas: approximately **2,500,000,000 MWh** equivalent at **€50/MWh** — another **~€250 billion**. Combined physical delivery value: **~€500 billion per year**.

But physical delivery is only the tip of the iceberg. On the TTF gas hub alone (by far the biggest European energy exchange), physically settled contracts represent an estimated 3–5% of total traded volume. The rest is financial — hedges, spreads, rollovers, and speculative flow. The true notional turnover of European energy markets runs into the **trillions of euros annually**.

And yet — this trillion-euro market is effectively controlled by fewer than **800 entities**.

---

## 2. The Two Gates of the Private Club

The European wholesale energy market does not have one centre. It has two interlocking institutional pillars — and together, they define who is allowed to participate in a trillion-euro flow.

**The European Energy Exchange (EEX)**, headquartered in Leipzig, officially lists between 800 and 1,000 members. Consolidate subsidiaries into their parent holding groups and the number narrows to approximately **700–800 unique institutional actors**. Roughly 30% are pure financial institutions — banks, hedge funds, and proprietary trading desks with no physical energy exposure.

**ICE Futures Europe**, headquartered in London, operates the benchmarks that price the world's energy: TTF Natural Gas Futures and ICE Brent Crude. Its official membership list counts **316 direct participants**: Goldman Sachs, J.P. Morgan, Morgan Stanley, Barclays, BNP Paribas, Shell, BP, TotalEnergies, RWE, Vattenfall, Equinor, Citadel, Virtu Financial, Optiver, TP ICAP.

Consolidate subsidiaries to real holding groups and the number falls to approximately **200–220 unique institutional actors**. The entire European gas benchmark — the price that heats homes, drives European industrial output and determines electricity prices across a continent — is effectively controlled by fewer than 250 real players.

These 316 ICE members are a precisely stratified ecosystem:

- **75 global banks (G-SIBs)** — the infrastructure layer. They don't just trade. They clear. Every transaction on ICE/EEX passes through their balance sheets. When prices spike 15% in a single session and clearinghouses double margin requirements, these are the only entities that can open new positions. Their capital is unconstrained. Their margin calls are self-financed. While independent traders and industrial hedgers are being force-liquidated, Goldman and JPMorgan accumulate positions at distressed prices — legally, algorithmically, and at scale. The market is not merely unfair at the moment of maximum stress. It is architecturally designed to transfer wealth at precisely that moment.

- **65 proprietary trading firms and hedge funds** — the liquidity layer. Citadel, Optiver, Flow Traders, Virtu. They hold no physical energy interest. They trade their own capital through high-frequency algorithms. They are why the price on your screen updates every millisecond. They are also why, in conditions of extreme volatility — a Middle East escalation, a Gazprom supply cut, a cold snap across the continent — price movements are amplified rather than absorbed.

- **120 brokers and inter-dealer brokers** — From institutional giants like TP ICAP, Marex, and BGC Partners to professional gateways like Interactive Brokers and retail platforms like XTB. This layer acts as the gatekeeper. Every smaller participant pays a heavy toll in the form of commissions, widening spreads, and "onboarding friction." Broker-published transparency data consistently confirms that **70–80%** of non-institutional participants lose capital while attempting to navigate these opaque, high-leverage environments.

- **55 physical energy giants and commodity houses** — the anchor layer. Shell, BP, TotalEnergies, Equinor, RWE, Engie, Vattenfall. These are the participants that give the futures market its fundamental value. Shell does not sell TTF/Phelix Power to speculate. It sells to hedge its exposure to physical gas. This is the layer that anchors the forward curve to reality — the gravitational pull that no purely financial market possesses.

What is not on either list is as revealing as what is. No municipal heating utilities. No small power plants. No small renewable energy producers. No industrial consumers. No individuals. No entity without a **€3–5 million capital base** and six to twelve months of regulatory onboarding. EEX and ICE Futures Europe are, by architectural intention, closed to everyone outside a narrow institutional stratum.

**BlackSlon opens that door.**

---

## 3. The Failures BlackSlon is Solving

The European wholesale energy market suffers from structural failures that no incremental reform has been able to address:

**The Capital Barrier.** Entry requires €3–5 million in liquid capital or bank guarantees — before a single trade is executed. Independent traders are forced to compete against state-backed giants with investment-grade ratings and unlimited access to cheap capital, using nothing but their own equity.

**The Collapse of Risk Management.** VaR models and Monte Carlo simulations — the industry's standard tools — were built for a world where annual price volatility in European energy markets stayed within **2–3%**. In that world, one-year forward contracts were the standard instrument: a producer locked in a price for the coming year, an industrial consumer hedged their cost base, and the system functioned. That world no longer exists.

Today, annualised volatility regularly exceeds **50%** — as witnessed most recently following the outbreak of conflict in Iran, when European gas and power markets moved violently within hours. We witnessed on TTF gas market a +24.7% intraday spike on March 2nd, followed by a 50.4% weekly surge peaking at 68.63 EUR/MWh, only to see a -19.5% daily collapse in the following session. This is a level of volatility typical of collapsing 'shitcoins,' not the continent's primary energy benchmark.

The result is a structural collapse of the forward curve as a hedging instrument. Beyond the front month, liquidity has effectively disappeared for most participants. Year-ahead contracts — once the backbone of industrial energy procurement — are now the exclusive domain of entities with unlimited capital buffers.

This creates the most dangerous asymmetry in modern financial markets: **at the exact moment of a shock — when prices spike, volatility explodes, and positions are being force-closed across the industry — financial moguls like Goldman Sachs and JPMorgan are the only players who can open new positions.** The market does not just disadvantage smaller participants during crises. It is structurally designed to transfer wealth from them to the institutions at the precise moment of maximum stress. When the market moves 15% in hours, the models disintegrate — and clearinghouses respond by hiking margin requirements, cannibalising the remaining liquidity of their own participants at the worst possible moment.

I spent over twenty years embracing volatility. It was never the trader's enemy — it was the point. Volatility is where mispricing lives, where prepared traders find edge. **But we have arrived somewhere different.** The volatility we face today is not opportunity. It is a carousel rotating fast enough that entry and exit are both impossible — not because you lack skill, but because the system can't handle that level of volatility. The game itself has been redesigned.

**Legal Gatekeeping.** Energy Exchanges onboarding takes 6–12 months. A single standardised EFET framework agreement "negotiations" costs up to €50,000 in legal fees plus 6-12 months of "administrative overhead" — for a document that offers almost no room for actual negotiation. This is not compliance. It is a manufactured entry fee designed to maintain exclusivity.

**Counterparty Risk.** Over 30 energy suppliers collapsed in the UK alone since 2020. Gazprom terminated long-term contracts across Europe in 2022 without consequence. US LNG tankers performed mid-ocean U-turns in 2022, breaking delivery contracts with Asian buyers because spot premiums in Europe exceeded penalties. In Ukraine — one of Europe's most significant energy hubs — 100% prepayment is required even for the largest state entities, because the system has no mechanism for trust.

**Market Illiquidity and Time Constraints.** In Poland, Europe's fastest-growing gas market, natural gas trading is effectively limited to a 2–4 hour daily window. Outside that window: no participants, no market makers, no liquidity. Critical events — weather shocks, geopolitical developments, infrastructure failures — cannot be priced in until the market reopens. The result is gaps, manipulation, and cascading volatility at every open.

**Information Asymmetry.** Real-time price discovery is a paid privilege. Bloomberg terminals, Argus, Platts, Montel — tens of thousands of euros per year, restricted to a single user. This is further exacerbated by the deliberate gatekeeping of historical transparency: even official exchanges like the EEX only publish free data reaching back a few weeks. If you need to investigate market trends or verify prices from just six months ago, you are met with a paywall. In the legacy system, the past is as expensive as the present, leaving smaller players with no way to audit, benchmark, or learn from market history without paying the "institutional tax."Small producers and industrial consumers trade in the dark, structurally disadvantaged before the first order is placed.

**The Death of Seasonality and the Peak/Off-Peak Regime.** The Summer/Winter storage spread — the foundational carry trade of European gas markets — is dead. Governments now mandate 90% storage filling regardless of price. Traders are forced to inject at a loss as a regulatory obligation. Banks, already risk-averse toward the energy sector, are tightening credit lines further. The result is a liquidity vacuum in an already capital-starved market.

Furthermore, the traditional Peak/Off-Peak regime in power markets has become obsolete. In the legacy world, the afternoon window from 13:00 to 15:00 was the "Daily Peak" — the most expensive hours of the day. Today, in the era of mass solar generation, these same hours during summer often witness negative prices across major European wholesale markets. Producers are forced to pay consumers to offload their energy, a phenomenon known as "Renewable Cannibalization."

---

## 4. The BlackSlon Answer

> **Zero expiry. Zero formality. Zero barriers. Standard 100 kWh of energy in 1 Token.**

BlackSlon is the first decentralised protocol built specifically for the European wholesale energy market. It does not attempt to replicate the legacy system on a blockchain. It eliminates the structural failures and replaces them with a mathematically governed, 24/7/365 open market infrastructure.

**Democratised Access.** We reduce the minimum entry threshold by four orders of magnitude. Instead of €744,600 for the smallest German yearly power contract (1 MW Baseload × 8,760 hours × €85/MWh), participation begins at **100 kWh** — the price of a small energy unit. The same market, accessible to any participant, anywhere, at any time.

**Perpetual Instruments.** BS-P and BS-G tokens — BlackSlon Power and Gas — are non-expiring claims on the real-time value of energy within specific European markets. There is no forced roll, no year-end liquidity crunch, no expiry mechanics. A position opened today remains valid indefinitely, continuously marked to the BlackSlon Energy Index (BSEI) — a real-time, physically-anchored benchmark that no single actor can manipulate.

**Algorithmic Price Truth.** The BSEI (BlackSlon Energy Settlement Index) is an autonomous transaction-weighted index — derived from executed BS-P/G trades, continuously calculated, and bounded by the physical market via BSSZ. It is the reference price for all mark-to-market valuations.

**Instant Settlement. No Intermediaries.** eEURO — our MiCA-compliant Euro stablecoin — settles positions in seconds. No clearing banks. No 24-48 hour wire transfer delays. No positions force-closed because a payment arrived one hour late. Capital is liquid, on-chain, and always accessible.

**Institutional-Grade Risk Architecture.** The protocol operates a dual-layer risk framework: individual account health monitored in real time through the Health Factor ($H_{BSSZ}$), and systemic solvency tracked through the Ecosystem Solvency Index ($H_{solv}$). Smart Incremental Liquidation replaces catastrophic forced closures with surgical, 10% position reductions that protect both users and the protocol Vault simultaneously.

**Physical Market Tether.** BlackSlon is not a purely synthetic protocol. Physical Liquidity Providers — licensed European energy trading entities with direct access to TTF, EEX, EPEX, and TGE — will underpin every market. In Phase 2, BS-P/G tokens become redeemable for physical energy delivery for 1MW+ industrial consumers. Following the industrial stabilization, the protocol expands to all remaining participants, including small enterprises and individual households. The virtual and physical markets are not separated — they are the same market, accessed through different interfaces.

---

## 5. The Philosophy: Kazimierz Malewicz and the Zero Form

BlackSlon draws its design philosophy from **Kazimierz Malewicz** — the Polish-Russian-Ukrainian artist and founding father of Suprematism, pioneer of the Zero Form.

Malewicz did not simplify painting. He stripped it to its irreducible essence — a black square on white canvas — and in doing so created something more powerful than everything that came before it. He did not add layers. He removed them until only truth remained.

**BlackSlon strips energy trading to its irreducible essence:**

**Zero Expiry.** BS-P/G tokens never expire. No forced rolls, no year-end liquidity crunch, no December 31st panic. A position opened today is valid indefinitely — its price reflecting the mathematical synthesis of spot reality, forward expectations, and the infinite horizon of the market simultaneously.

**Zero Curve.** We collapse the fragmented forward curve — intraday, day-ahead, month, quarter, year — into a single, perpetual Token. No contango. No backwardation. If your analysis says energy prices will rise over the next three years, you buy the Token. One instrument. One truth.

**Zero Counterparty Risk.** The protocol is the counterparty. Not a bank, not a clearing house, not a trading company, producer or end-user. A trustless, mathematically governed system — immutable, transparent, always solvent by design.

**Zero Entry Barrier.** 100 kWh minimum. Any participant. Anywhere. Any time.

*We don't add layers of complexity. We strip them away.*

---

## 6. Founder's Heritage

BlackSlon was built by an energy trader who spent decades inside the system that BlackSlon is now replacing.

Forged in the **post-Soviet energy frontier** — Central-Eastern Europe (CEE), a landscape defined by tectonic shifts. The dissolution of the Soviet Union, the reunification of Germany, the collapse of Yugoslavia, the War in Ukraine. A region where legacy systems collapse under pressure — repeatedly, predictably, and always at the worst possible moment.

Trading Natural Gas, Power, Crude Oil, Refined Products, Carbon Emissions Allowances, Green Certificates, and complex cross-commodity spreads — as Trader, Originator, Partner, and CEO in tier-one global trading houses. Operations on ICE, EEX, EPEX Spot and TGE. Navigating the chronic illiquidity of CEE/SEE markets and the deep liquidity of North-Western Europe.

Most critically: operating in the frontier markets of Eastern Europe **before digital benchmarks or centralised exchanges existed**. That era taught what no Bloomberg terminal can: how markets really work when the infrastructure fails, the regulator intervenes, and the counterparty disappears.

Alumnus of the University of Warsaw (UW), St. Petersburg State University (SPbGU), and Moscow State University of International Relations (MGIMO) in International Relations, PhD studies at the University of Warsaw.

---

## 7. The Name: Black Swan × Black Elephant

In Slavic languages, *Slon* / *Слон* means **Elephant**.

**BlackSlon** is the synthesis of two concepts that define the energy markets of our era:

The **Black Swan** — the unpredictable, catastrophic event that models cannot anticipate: the pandemic, the war, the mid-ocean U-turn of a contracted LNG tanker, the overnight vanishing of Gazprom.

The **Black Elephant** — the massive, obvious risk that everyone in the room can see, and everyone chooses to ignore: the structural insolvency of clearing infrastructure, the death of the forward curve, the regulatory capture of markets that were supposed to be free.

While the industry chases Black Swans, BlackSlon focuses on the Elephants. The risks are not hidden. They are hiding in plain sight — in the architecture of a market that has not fundamentally changed since the 20th century.

**BlackSlon is not an optimization of this system. It is its replacement.**

---

## 8. BlackSlon Settlement Zone (BSSZ): The Physical Energy Framework for Virtual Energy Trading

The BlackSlon Settlement Zone is a hard-capped corridor for all trading and settlement activities within the BlackSlon Protocol. Established independently for every power and gas market across the European continent, by synthesizing fixed mathematical parameters with market-specific variables.

The BSSZ acts as a rigid systemic constraint. The BlackSlon Protocol only permits, validates, and settles orders and transactions that occur strictly within this predefined zone. Outside this corridor, the system has no operational capacity — placing orders and trading is technically impossible and settlement is blocked.

---

### 8.1. The Raw Physical Meridian ($\hat{a}$)

Every BSSZ is anchored by the **Physical Meridian** ($\hat{a}$) — the protocol's absolute reference line, derived exclusively from external, physical market parameters. The Physical Meridian serves as the unbreakable foundation that keeps the BSSZ tethered to physical energy market reality.

The Physical Meridian represents the Weighted Aggregation of external energy market data across four time horizons. This value is the absolute origin for all internal calculations.

**The Physical Meridian Formula:**

$$\hat{a} = \sum_{i=1}^{n} (Weight_i \times AssetPrice_i)$$

Component Definitions:

- $\hat{a}$ **(The Physical Meridian):** The single, calculated reference line. It is the result of the aggregation process and serves as the pivot of the BlackSlone Settlement Zone (BSSZ) for a specific market.
- $\sum_{i=1}^{n}$ **(The Active Basket):** The Weighted Aggregator across $n$ market segments (where $n=4$). It is an "Active" process because the underlying components are dynamically managed via rebalancing protocols.
- $Weight_i$ **(Segment Allocation & Weights):** Fixed coefficients defining the influence of each time-horizon, balancing immediate volatility with long-term structural stability:
  - $W_{Spot} = 10\%$: Represents the immediate Day-Ahead (SPOT) price.
  - $W_{FM} = 40\%$: Front Month. The primary liquidity driver.
  - $W_{FQ} = 25\%$: Front Quarter. Captures seasonal trends.
  - $W_{Cal} = 25\%$: Calendar Year. Long-term structural stability against short and mid-term shocks.
- $AssetPrice_i$ **(Market Data Source):** The raw reference price for segment $i$, sourced directly from exchanges or OTC markets and verified by Oracles.

**Structural Logic & Genesis:** The four-segment basket is deliberately structured so that no single time horizon dominates. Even in extreme spot events (e.g., a Front Month spike of 50%), the Cal (25%) and FQ (25%) segments act as structural dampeners, preventing the Physical Meridian from overreacting to short-term shocks. This inertia is a feature, not a limitation.

---

### 8.2. Asymptotic Daily Rebalancing (ADR): The Stability Engine

To ensure the Physical Meridian remains stable and does not suffer from "Price Cliffs" when energy contracts expire or there Black Swan events during weekend or holiday trading gaps, the protocol implements ADR (Asymptotic Daily Rebalancing) — the "Smoothing Engine" of the protocol. 

It ensures that all transitions — whether between expiring and incoming contracts or across volatility-heavy market gaps — are seamless. By integrating these shifts through a controlled mathematical curve, ADR prevents artificial or sudden jumps in the BSST corridor.

In energy markets, the price of a contract expiring today (FM, FQ, or Cal) can be significantly different from the contract for the next consecutive period. Without ADR, the Physical Meridian would "jump" at the moment of expiration, potentially pushing or collapsing the entire BSSZ corridor.

Instead of a hard switch (which creates price cliffs), the protocol uses ADR to asymptotically transition the weight from the expiring contract to the incoming one, ensuring the Physical Meridian remains a continuous and smooth curve.

**Segment-Specific Execution:**

- **Day-Ahead (Spot):** The $W_{DA}$ (10%) weight is anchored 100% to the Day-Ahead settlement price every day.
- **Front Month (Business Day ADR):** During the final 10–12 business days of the month, the system progressively migrates the $W_{FM}$ (40%) weight. Each business day, the influence of the current month ($FM$) is reduced while the influence of the next month ($M2$) is increased.
- **Front Quarter (Weekly ADR):** The protocol performs a phased reallocation of the $W_{FQ}$ (25%) weight every Friday during the second and third months of the quarter, moving exposure from FQ to Q2.
- **Calendar (Dormant ADR):** A conditional migration of the $W_{Cal}$ (25%) weight from Cal to Cal2. Migration begins annually on July 1st and continues via equal weekly rebalancing every Friday through year-end.

| Segment | Weight | Rebalancing (ADR) | Logic |
|:---|:---|:---|:---|
| **Spot** | 10% | Daily | 100% Day-Ahead Settlement price |
| **Front Month (FM)** | 40% | Delayed Daily ADR | Days 1–15: 100% FM. Last 10–12 days: daily shift to M2 |
| **Front Quarter (FQ)** | 25% | The Rolling Window | Month 1: 100% FQ. Month 2–3: every Friday shift to Q2 |
| **Calendar (Cal)** | 25% | The Dormant Year | Jan–June: 100% Cal. July–Dec: every Friday shift to Cal2 |

---

### 8.3. The Settlement Anchor (A): The 50/25/25 Historical Recursive Formula

The Physical Meridian ($\hat{a}$) captures today's weighted market reality. However, a single-day value is still susceptible to intraday manipulation or sudden external shocks. To finalize the noise reduction process and ensure the BSSZ corridor possesses high resistance to momentary spikes, the protocol applies a Historical Recursive Filter to produce the Settlement Anchor (A) — the value that actually sets the corridor.

This mechanism forces the current reference line to remain tethered to its recent trajectory, preventing extreme single-day volatility from disrupting the BSSZ.

**The Recursive Equation:**

$$A_{Today} = (0.50 \cdot a_{T-1}) + (0.25 \cdot a_{T-2}) + (0.25 \cdot a_{T-3})$$

Component Definitions:

- $A_{Today}$: The final Settlement Anchor used to set the corridor for the current day.
- $a_{T-1}$: Physical Meridian from day $-1$. Carries the highest weight (50%), acting as the primary setter.
- $a_{T-2}$: Physical Meridian from day $-2$, with 25% weight.
- $a_{T-3}$: Physical Meridian from day $-3$, with 25% weight.

---

### 8.4. The BlackSlon Settlement Zone (BSSZ) Formula

Once the Settlement Anchor ($A$) is established, the protocol defines the BlackSlon Settlement Zone:

$$BSSZ_{Range} = [A - 10\%, A + 20\%]$$

**The Settlement Anchor ($A$) as the Pivot:** The Settlement Anchor ($A$) is the only variable that moves the entire corridor. The BSSZ is strictly limited to an asymmetric range of $-10\%$ and $+20\%$ relative to it:

- **BSSZ Floor ($-10\%$):** Blocks settlement if the price drops more than 10% below the Settlement Anchor ($A$), preventing sudden liquidity drainage and protecting against cascading sell-offs.

- **BSSZ Ceiling ($+20\%$):** Allows for significant value appreciation, driving long-term demand for €BSR and BlackSlon Power and Gas Tokens. This asymmetry reflects the fundamental nature of energy markets — prices spike upward far more violently than they collapse. The ceiling also protects short positions from catastrophic squeezes, insulating the protocol from irrational, high-velocity upward volatility.

**Structural Logic & Genesis:** The $-10\% / +20\%$ design deliberately incentivizes long-term holding of BS-P/G tokens as an energy-linked store of value (virtual energy investment denominated in eEURO), while protecting the protocol's liquidity structure from both directional extremes.

**Intra-Zone:** Full operational support — transaction validation and settlement enabled.

**Extra-Zone:** Systematic lockout — all trading activity is automatically halted if price attempts to move beyond these boundaries.

Each market operates within its own isolated BSSZ, allowing the BlackSlon Protocol to enforce localized settlement rules tailored to the specific dynamics of each jurisdiction.

---

### 8.5. The Long-Term Vision: From Physical Meridian and Settlement Anchor to Market Benchmark

The Physical Meridian and Settlement Anchor are designed to be transitional references — not permanent dependencies.

In Phase 1, the BSSZ is tethered to physical exchange/OTC data (TTF, EEX, EPEX, TGE, etc.) because the BlackSlon Protocol is building its liquidity base and establishing market trust. Exchange/OTC-sourced prices represent the most credible and manipulation-resistant external reference available, with no risk of data unavailability given continuous exchange quotation obligations.

As the BlackSlon Ecosystem matures and the BlackSlon Protocol accumulates sufficient trading volume and participant depth, the protocol anticipates a natural inversion: **the BSEI itself becomes the benchmark** — a more liquid, transparent, and accessible reference than the underlying physical markets it was originally derived from.

This mirrors the historical evolution of financial benchmarks: instruments initially derived from physical markets eventually become the reference that physical markets price against. The BlackSlon Protocol is designed to follow the same trajectory in European energy markets — transitioning from a protocol tethered to physical reality, to a protocol that defines it.

---

## 9. BSEI Framework: The Transaction Settlement Index

### 9.1 The Nature of the BSEI

The BlackSlon Energy Settlement Index (BSEI) is the **transaction-derived settlement benchmark** of the BlackSlon Protocol. It is computed exclusively from executed BS-P/G trades on the Open Order Book — it is not an external benchmark nor a function of the Physical Meridian.

> **Causal direction:** BS-P/G transactions → BSEI. The BSEI reflects what market participants have actually paid and received. The Physical Meridian defines the BSSZ corridor independently.

The BSEI serves three functions:
- **Mark-to-Market (MtM):** Real-time PnL calculation for all open positions
- **Margin Reference:** Basis for dynamic collateral requirements
- **Settlement Guard:** Reference price for all settlement events within the BSSZ

### 9.2 BSEI Formula: Weighted Transaction Settlement Index (WTSI-24h)

```
I_t = Σ(P_i × V_i × w_i) / Σ(V_i × w_i)
```

Where:

| Symbol | Definition |
|:-------|:-----------|
| P_i | Execution price of transaction i (EUR/100kWh) |
| V_i | Volume of transaction i (tokens) |
| w_i | Time-decay weight: exp(−λ × Δt_i) |
| Δt_i | Hours elapsed since transaction i |
| λ | Decay constant = ln(2)/6 ≈ 0.1155 (6-hour half-life) |

**Half-life rationale:** A transaction executed 6 hours ago carries 50% of its original weight. A transaction from 24 hours ago retains ~6.25%. This calibration reflects energy market rhythms: reactive enough to capture intraday momentum, stable enough to resist flash manipulation.

### 9.3 BSEI Safeguards

**1. BSSZ Anchor Guard**

The BSEI is bounded to a zone relative to the Physical Meridian:

```
I_t ∈ [a × 0.85, a × 1.25]
```

If executed transactions would push BSEI outside this range, it is capped at the boundary. This prevents extreme thin-market manipulation from corrupting the MtM reference.

**2. Minimum Volume Fallback**

```
If Σ(V_i over 24h) < MinVolume_threshold → I_t = a
```

When insufficient trading volume exists (market bootstrap or extreme illiquidity), BSEI defaults to the Physical Meridian. This ensures MtM valuations always have a valid reference.

**3. Off-Hours Continuity**

BSEI updates 24/7 from internal transactions, even when physical exchanges are closed and the Physical Meridian is frozen. During weekends and holidays, the corridor remains active and BSEI continues to reflect actual trading activity.

### 9.4 The Order Book Circuit Breaker (b_adj)

To prevent order book price movements from violating the BSSZ corridor or creating destabilising velocity:

```
b_adj = b_base / [(1 + |P − a|/a)² × (1 + |P − EMA_P|)]
```

| Market | b_base | Rationale |
|:-------|:------:|:----------|
| German Power (EEX) | 0.005 | High liquidity, deep order book |
| Dutch Gas (TTF) | 0.008 | High liquidity, global benchmark |
| Polish Gas (TGE) | 0.025 | Medium liquidity, regional market |
| Balkan Power | 0.050 | Low liquidity, high volatility |

**Momentum Brake (EMA_P):**
```
EMA_P = α × P + (1 − α) × EMA_prev
```

High α (0.3): reactive, shorter memory — recommended for high-liquidity markets.  
Low α (0.05): stable, longer memory — recommended for low-liquidity markets.

### 9.5 PnL Calculation

```
MtM_LONG  = (I_t,now − I_t,open) × N_tokens × 100 kWh
MtM_SHORT = (I_t,open − I_t,now) × N_tokens × 100 kWh
```

All PnL is denominated in eEURO.

---

## 10. BS-P & BS-G Token Specification

### 10.1 Core Properties

| Property | Description |
|:---------|:------------|
| Underlying | 100 kWh of electric power (BS-P) or natural gas (BS-G) |
| Market Specificity | Each token dedicated to a specific national/regional market |
| Perpetual | No expiration date — no rollover costs |
| BSSZ Corridor | Price bounded by [a − 10%, a + 20%] relative to Physical Meridian |
| Minimum Unit | 1 token = 100 kWh |
| Settlement Currency | eEURO |
| Phase 1 | Virtual settlement only |
| Phase 2 | Physical redemption for 1MW+ industrial consumers |

### 10.2 Market Taxonomy

**Format:** `BS-[Type]-[Country Code]`

| Ticker | Instrument | Reference Market |
|:-------|:----------|:----------------|
| BS-G-NL | BlackSlon Gas — Netherlands | Dutch TTF |
| BS-G-DE | BlackSlon Gas — Germany | THE/Gaspool |
| BS-G-PL | BlackSlon Gas — Poland | TGE |
| BS-G-BG | BlackSlon Gas — Bulgaria | Regional OTC |
| BS-P-DE | BlackSlon Power — Germany | EEX |
| BS-P-FR | BlackSlon Power — France | EPEX Spot |
| BS-P-PL | BlackSlon Power — Poland | TGE |
| BS-P-NL | BlackSlon Power — Netherlands | APX |

Each market has its own isolated BSSZ corridor and Physical Meridian. Markets do not cross-contaminate each other's price dynamics.

### 10.3 Mark-to-Market Valuation

The mark-to-market value of a position uses the BSEI as reference:

```
V_position = I_t × N_tokens × 100 kWh
```

> **Note:** The BSEI is derived from executed transactions. The token position value tracks the BSEI; the BSEI does not determine — it reflects — actual market prices from completed trades.

### 10.4 Opening a Position

**Long (BUY — energy price appreciation):**
```
Required Collateral = I_t × N_tokens × Margin_LONG
```

**Short (SELL — energy price decline):**
```
Required Collateral = I_t × N_tokens × Margin_SHORT
```

Margin rates are determined by the Tiering Matrix (Section 13.1). SHORT positions require 2× the margin of LONG positions — energy markets spike upward far more violently than they collapse.

### 10.5 Phase 2: Physical Redemption

In Phase 2, BS-P/G tokens gain physical redemption rights for eligible industrial consumers (minimum 1 MW annual baseload). The Virtual-to-Physical Swap mechanism converts virtual positions into physical energy supply contracts:

```
Physical Delivery = N_tokens × 100 kWh × Baseload Profile
```

The pre-locked token value covers the baseload component. Balancing, network, and variable costs are settled separately under the physical supply agreement with the PLP.

---

## 11. Economic Equilibrium & Treasury Governance

### 11.1 The €BSR Supply Model

```
S_BSR(t) = S_initial + Σ M_purchased − Σ B_burned
```

| Component | Description |
|:----------|:------------|
| S_initial | Genesis Supply — fixed amount minted at launch |
| Σ M_purchased | Tokens minted through user purchases (1:1 eEURO value) |
| Σ B_burned | Tokens burned via Loss Participation System (LPS) |

### 11.2 The 50/50 Loss Participation System (LPS)

When a liquidation threshold is breached:

**Case A — Collateral in €BSR:**
- 50% Permanent Burn → null address, removed from supply
- 50% Treasury Re-entry → increases V_eEURO backing

**Case B — Collateral in eEURO:**
- 50% Asset Backing → remains in Vault, increases V_eEURO
- 50% Buyback & Burn → protocol purchases €BSR at market and burns it

Whether a user loses €BSR or eEURO, the result for long-term holders is identical: total supply shrinks, and eEURO backing per token grows.

### 11.3 The €BSR Valuation Formula

```
P_BSR = V_eEURO / (S_BSR × RR)
```

| Symbol | Definition |
|:-------|:-----------|
| V_eEURO | Total liquid eEURO in Treasury Vault |
| S_BSR | Current circulating supply |
| RR | Reserve Ratio (safety multiplier, ≥ 1.0) |

As S_BSR shrinks via burn, even stable V_eEURO produces mathematically rising P_BSR.

### 11.4 Short Selling Prohibition

€BSR cannot be short sold within the BlackSlon Protocol. This is an **immutable architectural constraint** enforced at the smart contract level. Permitting short positions would create a perverse incentive — users profiting from a falling €BSR price while that same decline erodes the collateral base of other users. This prohibition is not subject to governance override.

### 11.5 The Tiering Matrix

| BSR Stake | Margin LONG | Margin SHORT | Trading Fee |
|:---------:|:-----------:|:------------:|:-----------:|
| 10% | 50% | 100% | 1.00% |
| 25% | 45% | 90% | 0.85% |
| 50% | 40% | 80% | 0.60% |
| 75% | 30% | 60% | 0.35% |
| 100% | 25% | 50% | 0.20% |

Five discrete tiers only. Fractional values are not permitted.

### 11.6 Protocol Revenue

**Trading Fees:**
```
Fee_trade = Position_Notional × φ
```

| Destination | Allocation | Purpose |
|:------------|:----------:|:--------|
| Protocol Vault (V_eEURO) | 85% | Increases backing, appreciates P_BSR |
| BSR Stability Reserve (BSR-SR) | 15% | Funds shock absorber |

**Ecosystem Maintenance Fee:** 0.1% monthly (≈1.2% annually) of total Vault value.

### 11.7 Governance

| Phase | Control | Mechanism |
|:------|:--------|:----------|
| Phase 1 — Genesis | Multisig Council | Rapid response during initial calibration |
| Phase 2 — DAO | €BSR holders | Voting power proportional to amount + duration staked |

---

## 12. Ecosystem Solvency: Macro Level

### 12.1 The Ecosystem Solvency Index (H_solv)

```
H_solv = (V_eEURO + V_BSR × (1 − h_BSR) + BSR-SR_balance)
         ─────────────────────────────────────────────────────
         (Σ|PnL_ITM| + Σ IM_total + Reserve_Op)
```

**Numerator — Adjusted Asset Base:**
- **V_eEURO:** Total fiat-backed eEURO in Vault. Zero haircut.
- **V_BSR × (1 − h_BSR):** Risk-adjusted €BSR protocol reserve. Haircut applied for volatility.
- **BSR-SR_balance:** Stability Reserve. Ring-fenced, counted separately.

**Denominator — Total Systemic Liabilities:**
- **Σ|PnL_ITM|:** Aggregate unrealised profit of all in-the-money positions.
- **Σ IM_total:** All initial margin locked system-wide.
- **Reserve_Op:** Fixed operational reserve (oracle feeds, infrastructure, PLP settlement fees).

### 12.2 Dynamic €BSR Haircut

```
h_BSR = 10%  if H_solv > 1.15  (Tier I)
        15%  if 1.05 ≤ H_solv ≤ 1.15  (Tier II)
        25%  if 1.00 ≤ H_solv < 1.05  (Tier III)
        35%  if H_solv < 1.00  (Tier IV)
```

### 12.3 Solvency Resilience Tiers

| Tier | H_solv | Regime | Automated Response |
|:----:|:------:|:------:|:------------------|
| I | > 1.15 | Expansion | Full operations. Maximum €BSR ratios permitted. |
| II | 1.05–1.15 | Equilibrium | Normal operations. h_BSR = 15%. Enhanced monitoring. |
| III | 1.00–1.05 | Mitigation | New positions: eEURO-only collateral. h_BSR = 25%. BSR-SR Soft Fuse. |
| IV | < 1.00 | Safeguard | Hard stop on new positions. Reduce-Only. BSR-SR Hard Fuse. Emergency governance vote. |

### 12.4 Tier III Stabilisation Mechanisms

**eEURO-Only Entry Mandate:** All new positions collateralised 100% in eEURO. Forces immediate hard-anchor liquidity inflow.

**Dynamic Haircut Escalation:** h_BSR rises to 25%, reducing recognised €BSR value. Users with high €BSR exposure see declining H_BSSZ, incentivising organic deleveraging.

**BSR-SR Soft Fuse:** Stability Reserve enters monitoring mode. Tranche T1 prepared but not deployed.

### 12.5 Tier IV Emergency Protocol

1. Hard Stop — no new positions
2. Reduce-Only — position reduction or eEURO addition only
3. BSR-SR Hard Fuse — tranched deployment begins
4. Anti-Death-Spiral Lock — if ΔP_BSR ≤ −10% simultaneously, Emergency Collateral Lock activates
5. Governance Emergency Vote — within 24 hours

---

## 13. Risk Management: Position Level

### 13.1 The Tiering Matrix & Initial Margin

For a position of Q tokens at price P with BSR Stake s% and margin rate m%:

```
TotalNotional  = P × Q × 100 kWh
IM_total       = TotalNotional × m / 100
IM_BSR (EUR)   = IM_total × s / 100
IM_BSR (BSR)   = IM_BSR(EUR) / P_BSR
IM_eEURO       = IM_total × (1 − s/100)
```

> **Unit note:** Q is in tokens (1 token = 100 kWh). TotalNotional is fully EUR-denominated.

### 13.2 The Master Equity Formula

```
Equity_total = (Σ Q_eEURO + Σ Q_BSR × P_BSR) + Σ ΔPnL_j
```

Free balances = total balance minus all locked IM collateral across active positions.

### 13.3 H_BSSZ Health Factor

```
H_BSSZ = Equity_total / (Σ IM_j × 0.50)
```

- **H > 1.0** → above Intervention Threshold (safe)
- **H ≤ 1.0** → at or below Intervention Threshold (liquidation triggered)

### 13.4 Protective Zone System

| Zone | H_BSSZ | Label | Actions Permitted |
|:----:|:------:|:-----:|:-----------------|
| I | H > 1.10 | SAFE | Full trading, withdrawals, new positions |
| II | 1.05 < H ≤ 1.10 | WARNING | Margin call. New positions allowed. No free margin withdrawal. |
| III | 1.00 < H ≤ 1.05 | RESTRICTED | Reduce-only. No new positions. |
| IV | H ≤ 1.00 | INTERVENTION | Smart Incremental Liquidation triggered. All actions blocked. |

> **Boundary rule:** Boundary values belong to the lower (worse) zone. H_BSSZ = 1.05 → RESTRICTED, not WARNING.

> **Terminology:** Zone IV trigger = **Intervention Threshold**. The term "Stop-out Threshold" is deprecated.

### 13.5 Epsilon Buffer (ε)

**ε = 0.02** is the minimum equity buffer — a protocol constant.

- **Zone boundary enforcement:** Equity_total ≥ ε × TotalNotional_j required before SIL may halt.
- **Post-liquidation residual:** After each SIL step, remaining equity must not fall below ε × residual notional.

### 13.6 Smart Incremental Liquidation (SIL)

Activates when H_BSSZ ≤ 1.00. Design principle: **minimum necessary intervention**.

```
TargetEquity = (Σ IM_j × 0.50) × (1.00 + ε) = (Σ IM_j × 0.50) × 1.02
```

| Step | Action |
|:----:|:-------|
| 1 | H_BSSZ ≤ 1.00 detected |
| 2 | Compute TargetEquity |
| 3 | Select position with highest IM contribution. Skip locked-instrument positions. |
| 4 | Liquidate 10% of candidate position's notional (SIL_step) |
| 5 | Recalculate H_BSSZ. If H > 1.02 → halt. Else → repeat. |
| 6 | Cap: no single round may liquidate > 50% of a position (SIL_max) |

**Liquidation Proceeds Distribution:**

| Destination | Amount | Purpose |
|:------------|:------:|:--------|
| Trader account | Residual after fees | Returned to free balance |
| Protocol Treasury | 0.10% of notional | Liquidation fee |
| BSR-SR Reserve | 0.05% of notional | Stability reserve top-up |

### 13.7 BSSZ Lockout & IM Behaviour

During a BSSZ lockout:
- **IM remains fully locked** in the vault and continues to count in H_BSSZ denominator unchanged.
- **Unrealised PnL is frozen** at last valid price and continues to contribute to Equity_total.
- **SIL is suspended** for positions on the locked instrument. The engine liquidates unlocked positions first, then waits for lockout to lift.

### 13.8 Anti-Death-Spiral Mechanism

**ADS Trigger** — activates when the 3-block rolling average H_BSSZ across all accounts falls below:

```
H_BSSZ,avg(3) < 1.03   (ADS_threshold)
```

Additionally, if both conditions are true simultaneously:
```
H_BSSZ,avg(3) < 1.03  AND  ΔP_BSR ≤ −10%
```

**Emergency Collateral Lock** activates:
- All €BSR collateral frozen at T-24h price for margin calculations
- Duration: max 48 hours OR until H_BSSZ,avg > 1.10
- Breaks the feedback loop: falling P_BSR → lower collateral → more liquidations → more €BSR selling

**ADS Response Sequence:**
1. Pause all SIL executions protocol-wide for 15 minutes (ADS_pause)
2. Activate BSR-SR Buyback Engine
3. Notify all PLPs to widen liquidity provision
4. After 15 min, re-evaluate. If still < 1.03 → extend by one additional pause interval
5. Resume SIL only when H_BSSZ,avg(3) ≥ 1.03 for two consecutive blocks

> **ADS vs Zone boundaries:** ADS (1.03) operates on the **protocol-wide average**, while zones (1.05, 1.00) operate on **individual accounts**. These are independent metrics and do not overlap.

---

## 14. Liquidity Layer

### 14.1 The Three-Layer Liquidity Stack

| Layer | Provider | Role | Availability |
|:-----:|:---------|:----:|:------------|
| 1 | User-to-User (Open Order Book) | Primary price discovery | Always active |
| 2 | Physical Liquidity Providers (PLPs) | Professional market making + physical hedge | Active from Day 1 |
| 3 | Protocol Liquidity Vault | Market maker of last resort | Activated when L1+L2 insufficient |

Layer 3 hard exposure limit: **15% of total Vault value** (λ_max = 0.15). Enforced at smart contract level. Cannot be overridden by governance.

Layer 3 activates only when H_solv is in Tier I or II. Suspended in Tier III and IV.

### 14.2 Concentration Risk Framework

**Open Interest Limit:** No single participant may hold more than **20% of total open interest** in any single BSSZ market.

**PLP Market Share Limit:** No single PLP may provide more than **40% of total active liquidity quotes** across all BSSZ markets simultaneously.

**Collateral Concentration:** No single eEURO issuer or custodian may represent more than **50% of total V_eEURO**.

**Market-Level Imbalance Monitor:**

```
Imbalance = |Σ OI_LONG − Σ OI_SHORT| / Σ OI_total
```

| Imbalance Level | Response |
|:----------------|:--------|
| < 60% | Normal operations |
| 60%–75% | PLP alert — additional minority-direction liquidity incentivised |
| > 75% | New dominant-direction positions require 150% of standard margin |
| > 90% | New dominant-direction positions suspended |

---

## 15. Physical Liquidity Provider (PLP)

### 15.1 Eligibility Requirements

| Requirement | Specification |
|:------------|:-------------|
| Market Access | Direct membership or brokerage access to ≥1 major European energy exchange |
| Regulatory Status | Licensed energy trading entity, REMIT compliance mandatory |
| Capital Requirement | Minimum €500,000 eEURO committed to PLP Vault |
| Technical Integration | API connectivity to BlackSlon matching engine |
| KYC/AML | Full institutional verification under MiCA CASP framework |

### 15.2 Fee & Incentive Structure

```
PLP_Revenue = Fee_trade × ρ_PLP + ΔPnL_hedge
```

| Committed Capital | €BSR Genesis Allocation | Fee Share Multiplier |
|:-----------------:|:----------------------:|:--------------------:|
| €500K – €2M | Standard | 1.0× |
| €2M – €10M | Enhanced | 1.3× |
| €10M+ | Strategic Partner | 1.6× + Governance Rights |

### 15.3 PLP Coverage Mechanism

1. User order matched on Open Order Book at BSEI price
2. If no organic counterparty: PLP quotes within BSSZ corridor
3. PLP evaluates net virtual imbalance and decides: Hedge / Hold / Pass to Vault
4. Physical hedge executed on TTF, EEX, EPEX if applicable

```
PLP Hedge Ratio = Net Virtual Imbalance (tokens) / PLP Risk Capacity (MWh)
```

---

## 16. KYC/AML Framework

### 16.1 Three-Tier Verification Model

| Tier | Participant | KYC Level | AML Monitoring |
|:----:|:-----------|:----------:|:--------------|
| 1 | Retail Users | Standard identity (ID + proof of address) | Automated transaction screening |
| 2 | Institutional Users | Enhanced Due Diligence — UBO, source of funds | Real-time on-chain + off-chain |
| 3 | PLPs | Full institutional KYC + REMIT compliance + exchange membership | Continuous + ACER reporting |

### 16.2 The Dual Regulatory Exposure

**MiCA (EU 2023/1114):** BlackSlon operates as a CASP. Every user must be identified before accessing the protocol. Source of funds must be verifiable.

**REMIT (EU 1227/2011):** PLPs are licensed energy traders on physical exchanges. Any virtual position that influences or is influenced by a physical hedge falls within REMIT's scope.

### 16.3 Ongoing Transaction Monitoring

Red flags monitored continuously:
- **Structuring:** Multiple deposits just below reporting thresholds
- **Layering:** Rapid cycling between eEURO and €BSR with no apparent trading purpose
- **Velocity Anomalies:** Sudden large positions inconsistent with historical behaviour
- **Cross-Market Manipulation:** Correlated spikes in virtual BlackSlon positions and physical TTF/EEX prices

---

## 17. Regulatory Compliance & Legal Framework

### 17.1 Asset Classification under MiCA

| Token | MiCA Classification | Key Properties |
|:------|:-------------------:|:--------------|
| **€BSR** | Native Utility Token (Title II) | Price = f(Vault NAV). Not an ART. Short selling permanently prohibited. |
| **eEURO** | Electronic Money Token — EMT (Title IV) | 1:1 EUR peg. MiCA-compliant stablecoin. |
| **BS-P & BS-G** | Hybrid Utility Token / Virtual Settlement Unit | Price bounded by BSSZ. Not an ART. Phase 2: potential ART reclassification. |

### 17.2 Strategic Roadmap

**Phase 1 — Virtual Exposure & Capital Accumulation**
- Virtual Trading Point (VTP) model
- No physical redemption guarantee
- Closed-loop ecosystem
- NCA White Paper notification ≥ 20 working days before publication

**Phase 2 — Hybrid Integration & Physical Redemption (Year 2–3)**
- BS-P/G exchangeable for physical kWh
- Eligibility: ≥1 MW annual baseload consumption
- Virtual-to-Physical Swap under 1–3 year Power/Gas Sales Agreement
- Potential ART reclassification with 1:1 physical reserves

### 17.3 Legal Jurisdiction

Governing entity established in **Lithuania**. Bank of Lithuania provides the most predictable and efficient CASP licensing process within EU MiCA.

---

## 18. BSR-SR Stability Reserve

### 18.1 Reserve Funding

```
BSR-SR_balance = Σ(Fees × 0.15) + Σ(MintPremium × 0.20) + Σ(LiqSurplus)
```

| Source | Allocation | Trigger |
|:-------|:----------:|:--------|
| Trading Fees | 15% of all fees | Continuous |
| Token Issuance Premium | 20% of BSR mint premium | On every mint |
| Liquidation Surplus | 100% of surplus after liquidation | On every liquidation |

### 18.2 The Fuse System

**Soft Fuse (Monitoring Mode):**
```
ΔP_BSR ≤ −5% in ≤ 24h
```
Activates monitoring. No capital deployment. Protocol prepares reserve.

**Hard Fuse (Active Intervention):**
```
ΔP_BSR ≤ −15% in ≤ 72h  OR  BSR-SR_balance < MinReserve_threshold
```
Triggers automatic buyback from open market.

### 18.3 The Buyback Engine (Tranched Deployment)

```
Tranche_n = BSR-SR_balance × R_n
```

| Tranche | Reserve Deployed | Unlock Condition |
|:-------:|:----------------:|:----------------|
| T1 | 10% | Hard Fuse triggered |
| T2 | 15% | Price still ≤ −15% after 24h |
| T3 | 25% | Price still ≤ −20% after 48h |
| T4 Emergency | 40% | Governance vote |
| Floor | 10% | **Never deployed** — absolute minimum reserve |

### 18.4 Mint/Burn Stabilisation

**Deflationary Burn (price falling):**
```
If ΔP_BSR ≤ −15%: Burn_auto = (BSR-SR_balance × 0.05) / P_BSR
```

**Inflationary Mint (price overheating):**
```
If ΔP_BSR ≥ +30%: Mint_auto = (ExcessDemand / P_BSR) × 0.10
```

---

## 19. System Architecture

### 19.1 The Five-Layer Protocol Stack

| Layer | Component | Responsibility |
|:-----:|:----------|:--------------|
| 1 | Physical Meridian + ADR | Tethers protocol to real European energy markets |
| 2 | BSEI (WTSI-24h) + Order Book | Transaction-derived settlement index + price discovery |
| 3 | BS-P & BS-G Tokens | Core tradeable instruments — perpetual virtual settlement units |
| 4 | Reserve Vault + H_BSSZ | Collateral management, margin enforcement, position liquidation |
| 5 | BSR-SR + Anti-Death-Spiral | Systemic solvency protection during extreme stress |

Each layer feeds into the next autonomously, in real time, without human intervention.

### 19.2 Custody Model

The BlackSlon Protocol operates under a **regulated custody model**, consistent with CASP license obligations under MiCA. User assets are held within the Protocol Vault under legal custody of the BlackSlon Entity, with full segregation from operational funds.

All fund movements are governed by audited smart contract logic. The Managing Entity operates the infrastructure but cannot unilaterally move user funds outside pre-defined protocol rules.

> **Regulated custody with algorithmic governance — not self-custody, not arbitrary control.**

### 19.3 Component Cross-Reference

| Component | Module |
|:----------|:-------|
| BS-P & BS-G specification, valuation, PnL, Phase 2 | Module 10 (this document, Section 10) |
| Physical Meridian, ADR, BSSZ corridor | Module 8 (Section 8) |
| BSEI pricing, WTSI-24h, Circuit Breaker | Module 9 (Section 9) |
| Master Equity Formula, H_BSSZ, SIL | Module 13 (Section 13) |
| LPS, €BSR Supply Model, Tokenomics | Module 11 (Section 11) |
| BSR Stability Reserve, Anti-Death-Spiral | Module 18 (Section 18) |
| Physical Liquidity Providers | Module 15 (Section 15) |
| KYC/AML, CASP, MiCA Classification | Module 16–17 (Sections 16–17) |

---

## 20. Protocol Constants Reference

| Constant | Symbol | Value | Used In |
|:---------|:------:|:-----:|:--------|
| Epsilon buffer | ε | **0.02** | H_BSSZ, SIL |
| BSEI decay constant | λ | ln(2)/6 ≈ 0.1155 | BSEI formula |
| BSEI anchor guard lower | — | a × 0.85 | BSEI safeguard |
| BSEI anchor guard upper | — | a × 1.25 | BSEI safeguard |
| Physical Meridian weights | W | 10/40/25/25 | ADR |
| ADR recursive weights | — | 50/25/25 | ADR |
| BSSZ floor | — | a × 0.90 | BSSZ |
| BSSZ ceiling | — | a × 1.20 | BSSZ |
| BSEI anchor weight (deprecated) | ω | — | Replaced by WTSI-24h |
| IM denominator factor | — | 0.50 | H_BSSZ |
| SIL step size | SIL_step | 10% | SIL |
| SIL round cap | SIL_max | 50% | SIL |
| Intervention Threshold | H_INT | ≤ 1.00 | Zone IV |
| SAFE zone lower bound | H_SAFE | > 1.10 | Zone I |
| ADS trigger | ADS_threshold | **1.03** | ADS |
| ADS rolling window | ADS_window | 3 blocks | ADS |
| ADS pause duration | ADS_pause | 15 min | ADS |
| Emergency Collateral Lock duration | — | max 48h | ADS |
| Emergency Collateral Lock release | — | H_BSSZ,avg > 1.10 | ADS |
| Vault exposure limit | λ_max | 15% | Layer 3 |
| OI concentration limit | — | 20% per participant | Liquidity |
| PLP market share limit | — | 40% per PLP | Liquidity |
| Collateral concentration limit | — | 50% per issuer | Liquidity |
| Tier I H_solv threshold | — | > 1.15 | H_solv |
| Tier II H_solv threshold | — | 1.05–1.15 | H_solv |
| Tier III H_solv threshold | — | 1.00–1.05 | H_solv |
| Tier IV H_solv threshold | — | < 1.00 | H_solv |
| h_BSR Tier I | — | 10% | H_solv |
| h_BSR Tier II | — | 15% | H_solv |
| h_BSR Tier III | — | 25% | H_solv |
| h_BSR Tier IV | — | 35% | H_solv |
| BSR-SR fee allocation | — | 15% of fees | BSR-SR |
| BSR-SR mint premium | — | 20% of premium | BSR-SR |
| Trading fee: T1 (10% BSR) | φ | 1.00% | Tiering |
| Trading fee: T5 (100% BSR) | φ | 0.20% | Tiering |
| Protocol Vault fee share | — | 85% of fees | Treasury |
| Maintenance fee | — | 0.1%/month | Treasury |
| PLP min capital | — | €500,000 | PLP |
| Liquidation fee | — | 0.10% of notional | SIL |
| BSR-SR SIL contribution | — | 0.05% of notional | SIL |

---

*BlackSlon Protocol — White Paper v1.0 | March 2026*  
*This document supersedes all prior individual module documents.*  
*© BlackSlon Protocol. All rights reserved.*
