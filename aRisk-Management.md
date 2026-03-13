# Risk Management: User-Level Portfolio Protection

---

## Overview

The BlackSlon Protocol implements a sophisticated, multi-layered risk management framework that protects both individual users and the protocol's systemic integrity. This document defines the **User-Level Risk Engine** — the automated system that monitors portfolio health, enforces margin requirements, and executes intelligent position management when accounts approach insolvency.

Unlike traditional energy clearing systems that rely on manual intervention or binary liquidation, the BlackSlon Protocol uses a **continuous health monitoring system** combined with **incremental de-risking logic** to preserve capital while maintaining market stability.

---

## 1. The Tiering Matrix: Collateral Mix & Capital Efficiency

The BlackSlon Protocol incentivizes long-term accumulation and strategic use of **€BSR** (BlackSlon Reserve Token). Higher €BSR ratios in the collateral vault result in **lower Initial Margin (IM) requirements** and **significantly reduced Trading Fees**, maximizing capital efficiency.

This creates a natural alignment between protocol sustainability (€BSR demand) and user profitability (lower costs, higher leverage).

<br>

| Collateral Mix (€BSR / eEURO) | Margin LONG | Margin SHORT | Max Leverage (L/S) | Trading Fee |
|:---|:---:|:---:|:---:|:---:|
| **10% €BSR** / 90% eEURO (Min) | 50% | 100% | 1:2.0 / 1:1.0 | 1.00% |
| **25% €BSR** / 75% eEURO | 45% | 90% | 1:2.2 / 1:1.1 | 0.85% |
| **50% €BSR** / 50% eEURO | 40% | 80% | 1:2.5 / 1:1.2 | 0.60% |
| **75% €BSR** / 25% eEURO | 30% | 60% | 1:3.3 / 1:1.6 | 0.35% |
| **100% €BSR** / 0% eEURO (Max) | **25%** | **50%** | **1:4.0 / 1:2.0** | **0.20%** |

<br>

### Key Observations:

- **Asymmetric Margin:** SHORT positions require 2× the margin of LONG positions
- **Fee Compression:** 100% €BSR collateral reduces trading fees by **80%** compared to minimum €BSR usage (0.20% vs 1.00%).
- **Capital Efficiency:** Maximum €BSR stake enables 4:1 leverage on LONG positions — the highest capital efficiency tier.

**Implementation Note:** The Tiering Matrix is enforced at the smart contract level. Users select their €BSR/eEURO ratio **per trade** — not globally. This allows tactical collateral allocation across different positions based on conviction and risk tolerance.

---

## 2. The Master Equity Formula: Portfolio Sigma ($\Sigma_{Portfolio}$)

To maintain **Cross-Collateral Integrity** and avoid fragmented risk valuation, the protocol aggregates all collateral and all floating profits/losses into a single, real-time value: **Total Equity**.

This unified calculation is the foundation of the Health Factor ($H_{BSSZ}$) and all margin enforcement logic.

<br>

### 2.1 Full Expanded Form

$$Equity_{total} = \underbrace{\left( \sum_{k=1}^{n} Q_{eEURO,k} + \sum_{k=1}^{n} Q_{€BSR,k} \cdot P_{€BSR} \right)}_{\text{Total Aggregated Collateral (Vault)}} + \underbrace{\sum_{j=1}^{m} \Delta PnL_j}_{\text{Net Unrealized PnL (Market)}}$$

<br>

### 2.2 Condensed Form (Equivalent)

$$Equity_{total} = \underbrace{\sum_{k=1}^{n} CollateralValue_k}_{\text{Loop } k \text{ — Vault Assets}} + \underbrace{\sum_{j=1}^{m} \Delta PnL_j}_{\text{Loop } j \text{ — Active Positions}}$$

<br>

### Variable Definitions

- **$Equity_{total}$** — Real-time total portfolio value (Vault Value + Net Unrealized PnL). This is the **numerator** of the Health Factor formula.
- **$Q_{eEURO}$** — eEURO balance held as collateral.
- **$Q_{€BSR}$** — €BSR balance held as collateral.
- **$P_{€BSR}$** — Current market price of the €BSR token (updated every block).
- **$\Delta PnL_j$** — Unrealized profit or loss from open position $j$ (BS-P or BS-G), calculated against the **BSEI** (BlackSlon Energy Index).

<br>

### Loop $k$ — Vault Assets (Collateral Base)

- **$n$ (Total Collateral Tiers):** Total number of distinct collateral "buckets" in the user's vault. Since there are no expiries, $n$ refers to different €BSR/eEURO ratio allocations defined in the Tiering Matrix.
- **$k$ (Collateral Asset Iterator):** Iterates over each collateral deposit ($k = 1, 2, \dots, n$). Identifies whether the system is calculating a 10% €BSR bucket, a 50% €BSR bucket, etc.
- **Action:** Sums the value of all vault assets to establish total committed capital (Initial Margin base).

<br>

### Loop $j$ — Active Market Exposure (Floating Risk)

- **$m$ (Total Position Count):** Total number of active trading positions currently open across all energy markets (BS-P, BS-G).
- **$j$ (Position Iterator):** Iterates over each open position ($j = 1, 2, \dots, m$). Identifies individual BS-P Buys, BS-G Sells, or any active market exposure.
- **Action:** Sums the Mark-to-Market (MtM) floating PnL across all active positions. Represents the dynamic, real-time component of Total Equity.

<br>

By separating these two loops, the protocol can instantly distinguish between **"hard" vault assets** (realized capital) and **"soft" floating gains/losses** (unrealized market exposure).

---

## 3. The Health Factor Formula ($H_{BSSZ}$)

The **Health Factor** is the primary **Stability Parameter** of a user's portfolio. It quantifies the portfolio's proximity to the **Systemic Intervention Sequence** — an automated, multi-stage process of incremental position closure designed to preserve capital and maintain protocol liquidity.

<br>

$$H_{BSSZ} = \frac{Equity_{total}}{\left( \sum_{j=1}^{m} IM_j \right) \cdot 0.5}$$

<br>

### Variable Definitions

- **$Equity_{total}$** — Real-time total portfolio value (defined in Section 2).
- **$IM_j$** — Initial Margin required to open position $j$, determined by the Tiering Matrix based on the chosen €BSR stake for that specific trade.
- **$m$** — Total number of active open positions.
- **$\sum_{j=1}^{m} IM_j$** — **Aggregate Initial Margin:** total committed capital locked in the protocol across all open positions.
- **$0.5$** — **Stop-out Threshold constant.** This divisor means that when $H_{BSSZ} = 1.0$, the user's Equity equals exactly **50% of their Aggregate Initial Margin** — the trigger point for Smart De-risking.

<br>

### Mathematical Equivalence

$$H_{BSSZ} = 1.0 \iff Equity_{total} = \left( \sum_{j=1}^{m} IM_j \right) \cdot 0.5$$

The Health Factor simply expresses this ratio as a normalized scalar:
- **$H > 1.0$** → Account is **above** the intervention threshold (safe).
- **$H \le 1.0$** → Account is **at or below** the intervention threshold (de-risking triggered).

---

## 4. Smart Incremental Liquidation Mechanism

The BlackSlon Protocol does **not** blindly close the largest or most losing position. Instead, it applies **smart logic** to determine which position reduction offers the best **"Health-to-Loss" ratio** — minimizing realized losses while restoring account safety.

<br>

### 4.1 Activation Trigger

The Smart Incremental Liquidation Mechanism activates when:

$$Trigger_{DeRisk} \iff Equity_{total} \le \left( \sum_{j=1}^{m} IM_j \right) \cdot 0.5 \quad \Longleftrightarrow \quad H_{BSSZ} \le 1.0$$

<br>

### 4.2 Recovery Target

The mechanism's goal is to restore $H_{BSSZ}$ **above 1.0** (specifically $H \ge 1.0 + \epsilon$, where $\epsilon$ is a small positive buffer, typically 0.02–0.05).

$$Recovery\ Target: \quad H_{BSSZ} \ge 1.0 + \epsilon$$

> **Important:** The Safe Zone ($H > 1.10$) is **NOT** the immediate recovery target. The mechanism stops as soon as the account exits the Intervention Zone. Further improvement is the user's responsibility.

<br>

### 4.3 Execution Logic

The system evaluates all active positions and executes the following steps:

1. **Step A — Simulation:** For each position $j$, the system simulates a **10% Volume Reduction**.
2. **Step B — Sufficiency Test:** Checks whether the simulated 10% reduction is sufficient to restore $H_{BSSZ} \ge 1.0 + \epsilon$.
3. **Step C — Priority Ranking:** If multiple positions are "Sufficient," the system selects the one with the **lowest realized loss impact** (ascending loss order — smallest loss first).
4. **Step D — Iteration:** If no single reduction is sufficient, the system applies the 10% cut to the lowest-impact position, then re-evaluates $H_{BSSZ}$. The loop continues — ascending from lowest to highest loss impact — until $H_{BSSZ} \ge 1.0 + \epsilon$.
5. **Step E — Re-evaluation:** Each reduction lowers the total $\sum IM_j$, which immediately improves $H_{BSSZ}$. If market conditions continue to deteriorate, the mechanism re-activates automatically.

<br>

### 4.4 Balanced Loss Absorption (The 50/50 Rule)

Losses incurred during position reduction are settled by deducting **equal value** from the user's **eEURO balance** and **€BSR balance**. This symmetric settlement policy maintains protocol liquidity by balancing impact between stable currency and native utility tokens.

**Example:**
- Position closed at a **100 EUR loss**.
- Settlement: **50 EUR deducted from eEURO** + **50 EUR equivalent deducted from €BSR** (at current $P_{€BSR}$).

---

## 5. Margin Monitoring & Alert System

The BlackSlon Protocol continuously monitors the solvency of every position. The following **Health Zones**, based on $H_{BSSZ}$, define automated actions triggered during critical market conditions.

<br>

| Zone | $H_{BSSZ}$ Range | Protocol Action |
|:---|:---:|:---|
| **SAFE** (Green) | $H > 1.10$ | **Full Operational Access.** No restrictions on trading. Users may open new BS-P/G positions and manage the Vault freely. |
| **WARNING** (Yellow) | $1.05 < H \le 1.10$ | **Margin Call notification triggered.** User is alerted to reinforce the BlackSlon Reserve Vault by depositing additional €BSR or eEURO. |
| **RESTRICTED** (Orange) | $1.00 < H \le 1.05$ | **Position Lock activated.** Existing exposures remain active. Account restricted to **Reduce-Only** or **Collateral-Add** actions. No new positions permitted. |
| **INTERVENTION** (Red) | $H \le 1.00$ | **Smart De-risking Mechanism triggered.** System automatically initiates the Incremental Liquidation Mechanism (see Section 4). |

<br>

### Zone Continuity Note

The four zones are **mutually exclusive** and **collectively exhaustive**: every possible value of $H_{BSSZ}$ falls into exactly one zone. The zones form a contiguous, descending hierarchy from $H > 1.10$ (Safe) down to $H \le 1.00$ (Intervention).

The **0.5 constant** in the Health Factor formula (Section 3) establishes that $H = 1.0$ precisely corresponds to the point where **Equity equals 50% of Aggregate Initial Margin** — the Stop-out Threshold.

---

## 6. Integration with Protocol-Level Risk Systems

The User-Level Risk Engine operates in coordination with two higher-order systemic safeguards:

### 6.1 BSSZ Corridor Enforcement

All orders and settlements must occur within the **BSSZ corridor** ($[a - 10\%, a + 20\%]$), where $a$ is the Physical Meridian. Orders outside this range are rejected at the matching engine level — **before** they can affect user portfolios.

Full BSSZ specification: `aBSSZ-NEW.md`

### 6.2 Ecosystem Solvency Index ($H_{solv}$)

While $H_{BSSZ}$ monitors individual user health, the **Ecosystem Solvency Index** ($H_{solv}$) monitors the protocol's aggregate capital adequacy. When $H_{solv}$ drops into Tier III or IV, the protocol restricts new position openings **globally** — preventing further liquidity obligations from accumulating when the capital base is under stress.

Full $H_{solv}$ framework: `aEcosystemSolvency-NEW.md`

---

## 7. Practical Example: Health Factor Calculation

**User Portfolio:**
- eEURO Balance: 5,000 EUR
- €BSR Balance: 2,000 BSR @ 2.50 EUR/BSR = 5,000 EUR equivalent
- **Total Collateral:** 10,000 EUR

**Open Positions:**
- Position 1 (BS-P LONG): 100 units @ 10.50 EUR, IM = 2,625 EUR (25% margin, 100% €BSR), Current PnL = +200 EUR
- Position 2 (BS-G SHORT): 50 units @ 12.00 EUR, IM = 3,000 EUR (50% margin, 10% €BSR), Current PnL = -150 EUR

**Calculation:**

$$Equity_{total} = 10,000 + 200 - 150 = 10,050\ EUR$$

$$\sum IM_j = 2,625 + 3,000 = 5,625\ EUR$$

$$H_{BSSZ} = \frac{10,050}{5,625 \times 0.5} = \frac{10,050}{2,812.5} = 3.57$$

**Result:** $H_{BSSZ} = 3.57$ → **SAFE Zone** (Green). User has full operational access.

---

## 8. Design Philosophy: Capital Preservation Over Punitive Liquidation

Traditional clearing systems treat liquidation as a **binary event** — positions are closed in full, often at unfavorable prices, with little regard for capital preservation. The BlackSlon Protocol rejects this approach.

The Smart Incremental Liquidation Mechanism is designed to:
- **Minimize realized losses** by closing only the minimum volume necessary to restore health.
- **Preserve remaining positions** that may recover as markets stabilize.
- **Avoid cascading liquidations** that amplify market volatility.

This user-centric design aligns with the protocol's broader mission: to democratize access to professional energy markets while maintaining institutional-grade risk management standards.

---

## Conclusion

The BlackSlon Risk Management Framework represents a fundamental reimagining of how energy derivative protocols should protect participants. By combining continuous health monitoring, intelligent position management, and capital-efficient collateral incentives, the protocol delivers a risk engine that is simultaneously **safer for users** and **more stable for the ecosystem** than traditional clearing systems.

This is not risk elimination — energy markets are inherently volatile. This is **risk intelligence**: a system that responds dynamically, proportionally, and transparently to protect capital while preserving market access.
