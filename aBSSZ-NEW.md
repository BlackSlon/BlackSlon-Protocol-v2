# BlackSlon Settlement Zone (BSSZ): The Physical Energy Framework for Virtual Energy Trading

The BlackSlon Settlement Zone is a hard-capped corridor for all trading and settlement activities within the BlackSlon Protocol. Established independently for every power and gas market across the European continent, by synthesizing fixed mathematical parameters with market-specific variables.

The BSSZ acts as a rigid systemic constraint. The BlackSlon Protocol only permits, validates, and settles orders and transactions that occur strictly within this predefined zone. Outside this corridor, the system has no operational capacity — placing orders and trading is technically impossible and settlement is blocked.

---

## 1. The Physical Meridian ($\hat{a}$)

Every BSSZ is anchored by the **Physical Meridian** ($\hat{a}$) — the protocol's absolute reference line, derived exclusively from external, physical market parameters. The Physical Meridian serves as the unbreakable foundation that keeps the BSSZ tethered to physical energy market reality.

The Physical Meridian represents the Weighted Aggregation of external energy market data across four time horizons. This value is the absolute origin for all internal calculations.

**The Physical Meridian Formula:**

$$\hat{a} = \sum_{i=1}^{n} (Weight_i \times AssetPrice_i)$$

Component Definitions:

- $\hat{a}$ **(The Physical Meridian):** The single, calculated reference line. It is the result of the aggregation process and serves as the pivot of the settlement zone for a specific market.
- $\sum_{i=1}^{n}$ **(The Active Basket):** The Weighted Aggregator across $n$ market segments (where $n=4$). It is an "Active" process because the underlying components are dynamically managed via rebalancing protocols.
- $Weight_i$ **(Segment Allocation & Weights):** Fixed coefficients defining the influence of each time-horizon, balancing immediate volatility with long-term structural stability:
  - $W_{Spot} = 10\%$: Represents the immediate Day-Ahead (SPOT) price.
  - $W_{FM} = 40\%$: Front Month. The primary liquidity driver.
  - $W_{FQ} = 25\%$: Front Quarter. Captures seasonal trends.
  - $W_{Cal} = 25\%$: Calendar Year. Stabilizes the BSSZ against short and mid-term shocks.
- $AssetPrice_i$ **(Market Data Source):** The raw reference price for segment $i$, sourced directly from exchanges or OTC markets and verified by Oracles.

> **Design Rationale:** The four-segment basket is deliberately structured so that no single time horizon dominates. Even in extreme spot events (e.g., a Front Month spike of 50%), the Cal (25%) and FQ (25%) segments act as structural dampeners, preventing the Physical Meridian from overreacting to short-term shocks. This inertia is a feature, not a limitation.

---

## 2. Asymptotic Daily Rebalancing (ADR): The Stability Engine

To ensure the Physical Meridian remains stable and does not suffer from "Price Cliffs" when energy contracts expire, the protocol implements ADR (Asymptotic Daily Rebalancing) — the "Smoothing Engine" of the protocol. It ensures that the transition between an expiring contract and a new one is seamless, preventing artificial or sudden jumps in the BSSZ corridor.

In energy markets, the price of a contract expiring today (FM, FQ, or Cal) can be significantly different from the contract for the next consecutive period. Without ADR, the Physical Meridian would "jump" at the moment of expiration, potentially pushing or collapsing the entire BSSZ corridor.

Instead of a hard switch (which creates price cliffs), the protocol uses ADR to asymptotically transition the weight from the expiring contract to the incoming one, ensuring the Physical Meridian remains a continuous and smooth curve.

**Segment-Specific Execution:**

- **Day-Ahead (Spot):** The $W_{DA}$ (10%) weight is anchored 100% to the Day-Ahead settlement price every day.
- **Front Month (Business Day ADR):** During the final 10–12 business days of the month, the system progressively migrates the $W_{FM}$ (40%) weight. Each business day, the influence of the current month ($FM$) is reduced while the influence of the next month ($M2$) is increased.
- **Front Quarter (Weekly ADR):** The protocol performs a phased reallocation of the $W_{FQ}$ (25%) weight every Friday during the second and third months of the quarter, moving exposure from FQ to Q2.
- **Calendar (Dormant ADR):** A conditional migration of the $W_{Cal}$ (25%) weight from Cal to Cal2, initiated only when the external Liquidity Fuse confirms sufficient market depth. Migration begins annually on July 1st and continues via equal weekly rebalancing every Friday through year-end.

| Segment | Weight | Rebalancing (ADR) | Logic |
|:---|:---|:---|:---|
| **Spot** | 10% | Daily | 100% Day-Ahead Settlement price |
| **Front Month (FM)** | 40% | Delayed Daily ADR | Days 1–15: 100% FM. Last 10–12 days: daily shift to M2 |
| **Front Quarter (FQ)** | 25% | The Rolling Window | Month 1: 100% FQ. Month 2–3: every Friday shift to Q2 |
| **Calendar (Cal)** | 25% | The Dormant Year | Jan–June: 100% Cal. July–Dec: every Friday shift to Cal2 |

---

## 3. The 50/25/25 Historical Recursive Formula

To ensure the Physical Meridian possesses high inertia and resistance to short-term market noise, the protocol applies a Historical Recursive Filter built on a 3-day historical average. This mechanism forces the current reference line to remain tethered to its recent trajectory, preventing extreme volatility from disrupting the BSSZ.

**The Recursive Equation:**

$$a_{Today} = (0.50 \cdot a_{T-1}) + (0.25 \cdot a_{T-2}) + (0.25 \cdot a_{T-3})$$

Component Definitions:

- $a_{Today}$: The Physical Meridian for the current day.
- $a_{T-1}$: Physical Meridian from day $-1$. Carries the highest weight (50%), acting as the primary setter.
- $a_{T-2}$: Physical Meridian from day $-2$, with 25% weight.
- $a_{T-3}$: Physical Meridian from day $-3$, with 25% weight.

---

## 4. The BlackSlon Settlement Zone (BSSZ) Formula

Once the Physical Meridian ($A$) is established, the protocol defines the BlackSlon Settlement Zone:

$$BSSZ_{Range} = [A - 10\%, A + 20\%]$$

**The Physical Meridian as the Pivot:** The Physical Meridian ($A$) is the only variable that moves the entire corridor. The BSSZ is strictly limited to an asymmetric range of $-10\%$ and $+20\%$ relative to it:

- **BSSZ Floor ($-10\%$):** Blocks settlement if the price drops more than 10% below the Physical Meridian, preventing sudden liquidity drainage and protecting against cascading sell-offs.
- **BSSZ Ceiling ($+20\%$):** Allows for significant value appreciation, driving long-term demand for €BSR and BlackSlon Power and Gas Tokens. This asymmetry reflects the fundamental nature of energy markets — prices spike upward far more violently than they collapse. The ceiling also protects short positions from catastrophic squeezes, insulating the protocol from irrational, high-velocity upward volatility.

> **Asymmetry Rationale:** The $-10\% / +20\%$ design deliberately incentivizes long-term holding of BS-P/G tokens as an energy-linked store of value (virtual energy investment denominated in eEURO), while protecting the protocol's liquidity structure from both directional extremes.

**Intra-Zone:** Full operational support — transaction validation and settlement enabled.

**Extra-Zone:** Systematic lockout — all trading activity is automatically halted if price attempts to move beyond these boundaries.

Each market operates within its own isolated BSSZ, allowing the BlackSlon Protocol to enforce localized settlement rules tailored to the specific dynamics of each jurisdiction.

---

## 5. Extra-Zone Position Handling: The Hybrid Protocol

When the price reaches a BSSZ boundary and the corridor locks, open positions are not treated uniformly. The protocol applies a **Hybrid Position Handling** logic that distinguishes between profitable and at-risk positions:

### 5.1 In-Profit Positions → Freeze & Wait

Positions with positive unrealized PnL at the moment of lockout are **frozen at the boundary price**:
- PnL is calculated and locked at the floor or ceiling price
- Positions remain open and are not force-closed
- Settlement is automatically re-enabled once the Physical Meridian shifts and the BSSZ corridor re-opens
- No additional margin is required during the freeze period

### 5.2 At-Risk Positions → Smart Incremental Liquidation

Positions with negative unrealized PnL that breach the Health Factor threshold ($H_{BSSZ} \leq 1.00$) during a lockout event are subject to the standard **Smart Incremental Liquidation Mechanism**:
- The system executes the standard 10% volume reduction loop
- Liquidation price is capped at the boundary price (floor or ceiling) — no worse execution is possible
- The 50/50 eEURO/€BSR loss absorption rule applies normally

### 5.3 New Positions → Full Block

During an Extra-Zone lockout, **no new positions may be opened** in any direction until the corridor re-activates. This prevents users from attempting to exploit boundary conditions.

### 5.4 Re-activation Conditions

The BSSZ corridor re-activates automatically when the next daily calculation of the Physical Meridian produces a new value, shifting the entire corridor and potentially bringing the market price back within the valid range:

$$\text{Re-activation}: \quad a_{Today} \neq a_{T-1}$$

---

## 6. The Long-Term Vision: From Physical Meridian to Market Benchmark

The Physical Meridian is designed to be a transitional reference — not a permanent dependency.

In Phase 1, the BSSZ is tethered to physical exchange data (TTF, EEX, EPEX, TGE, etc.) because the BlackSlon Protocol is building its liquidity base and establishing market trust. Exchange-sourced prices represent the most credible and manipulation-resistant external reference available, with no risk of data unavailability given continuous exchange quotation obligations.

As the BlackSlon Ecosystem matures and the BSEI accumulates sufficient trading volume and participant depth, the protocol anticipates a natural inversion: **the BSEI itself becomes the benchmark** — a more liquid, transparent, and accessible reference than the underlying physical markets it was originally derived from.

This mirrors the historical evolution of financial benchmarks: instruments initially derived from physical markets eventually become the reference that physical markets price against. The BlackSlon Protocol is designed to follow the same trajectory in European energy markets — transitioning from a protocol tethered to physical reality, to a protocol that defines it.

