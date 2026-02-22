## **6. Risk Management: Micro (User) Level**
<br>

**1. Tiering Matrix** 
The protocol incentivizes the use of €BSR (BlackSlon Reserve). Higher BSR ratios result in lower Initial Margin (IM) requirements and reduced Trading Fees, significantly increasing capital efficiency.
<br>
<br>

| €BSR Ratio/Stake (%) | Margin LONG | Margin SHORT | Leverage (L/S) | Trading Fee |
| :--- | :--- | :--- | :--- | :--- |
| **10% (Min)** | **50%** | **100%** | 1:2.0 / 1:1.0 | 1.00% |
| **25%** | **45%** | **90%** | 1:2.2 / 1:1.1 | 0.85% |
| **50%** | **40%** | **80%** | 1:2.5 / 1:1.2 | 0.60% |
| **75%** | **30%** | **60%** | 1:3.3 / 1:1.6 | 0.35% |
| **100% (Max)** | **25%** | **50%** | **1:4.0 / 1:2.0** | **0.20%** |

<br>
<br>

**2. The Master Equity Formula (Portfolio Sigma)**
To avoid "Liquidation Communism," we aggregate all collateral and all floating profits/losses into a single, real-time value.
<br>
<br>

$$Equity_{total} = \underbrace{\left( \sum_{k=1}^{n} Q_{eEURO, k} + \sum_{k=1}^{n} Q_{BSR, k} \cdot P_{BSR} \right)}_{\text{Total Aggregated Collateral}} + \underbrace{\sum_{j=1}^{m} \Delta PnL_{IPT, j}}_{\text{Net Unrealized PnL}}$$



where:
- $Equity_{total}$: The real-time total value of the user's portfolio (Vault Value + Net Unrealized PnL). This is the "numerator" representing the current available capital.
- $Q_{eEURO}$: The eEURO Balance held as collateral.
- $Q_{BSR}$: The €BSR Balance (BlackSlon Reserve Tokens) held as collateral.
- $P_{BSR}$: Current market price of the €BSR token.
- $\Delta PnL_{IPT}$: The Unrealized Profit or Loss from an open position on the Index Participation Token (IPT).
- $\sum$ (Sigma): Represents the mathematical summation of all individual collateral units and positions held in the portfolio.
<br>  
<br>

$$Equity_{total} = \underbrace{\sum_{k=1}^{n} \text{Collateral Value}_k}_{\text{Vault (Loop } k\text{)}} + \underbrace{\sum_{j=1}^{m} \Delta PnL_j}_{\text{Market (Loop } j\text{)}}$$
<br>
<br>

where:
> Collateral Indices (The Assets)
- $n$ (Total Collateral Tiers/Types): Represents the total number of distinct collateral "buckets" or asset categories held in the user’s vault. Since there are no expiries, $n$ refers specifically to the different BSR/eEURO ratio allocations (Tiers).
- $k$ (Collateral Index/Asset Iterator): The specific iterator for collateral assets. It represents an individual entry in the list of deposited funds (where $k = 1, 2, 3, \dots, n$). The protocol uses this index to sum up all eEURO and €BSR (BlackSlon Reserve) values. The specific index used to loop through each collateral type (where $k = 1, 2, \dots, n$). It identifies whether the system is currently calculating the value of a 10% BSR bucket, a 50% BSR bucket, or a 90% eEURO deposit.Loop $k$ Sums the value of all assets "held in the vault" as Initial Margin. This loop iterates through every distinct collateral deposit ($Q_{eEURO}$ and $Q_{BSR}$) to establish the total committed capital providing Liquidty to the protocol. It represents the realized base of the portfolio.
> Trading Indices (The Positions)
- $m$ (Total Position Count/Number of Open Positions): The total number of active trading positions currently open across all available energy markets (e.g., Gas, Electricity, Longs, and Shorts).
- $j$ (Position Index/Iterator): The specific iterator for open market positions. It represents a single, specific trade (where $j = 1, 2, 3, \dots, m$). This index allows the system to calculate the individual $\Delta PnL_{IPT}$ for each position before netting them into the total sum. Loop $j$ (Active Exposure):
Sums the floating results of everything "working in the market." This loop calculates the net Unrealized Profit and Loss ($\Delta PnL$), or rather MtM Value from all active IPT (Index Participation Token) positions. It represents the dynamic, real-time market risk currently affecting the Total Equity.

By separating these two loops, the protocol can instantly distinguish between the "hard" assets you own (the vault) and the "soft" floating gains or losses on open positions.

<br>
<br>

**3. The Health Factor Formula ($H_{BSTZ}$)**

$$H_{BSTZ} = \frac{Equity_{total}}{\left( \sum_{j=1}^{m} IM_j \right) \cdot 0.5}$$

where:
- $Equity_{total}$ (Account Net Value): The real-time total value of the user's portfolio (Vault Value + Net Unrealized PnL). This is the "numerator" representing the current available capital.
- $IM_j$ (Initial Margin of Position $j$): The original amount of collateral (in eEURO equivalent) required to open position $j$. This value is determined by the Tiering Matrix based on the chosen BSR stake for that specific trade.
- $m$ (Total Position Count): The total number of active, open trading positions. The system loops through all $m$ positions to calculate the total required margin.
- $0.5$ (Stop-out Threshold): The constant representing the Stop-out Threshold. When the Health Factor drops below this value, the system triggers the Smart De-risking. It establishes that the protocol will intervene when the user's Net Account Value reaches 50% of their Aggregate Initial Margin.
- $\sum_{j=1}^{m} IM_j$ (Total Required Margin/Aggregate Initial Margin): The combined total of all initial margins required for all currently open positions. This represents the user's Total Committed Capital locked within the protocol
<br>
<br>

**4. Smart Incremental Liquidation Mechanism**
The BlackSlon protocol does not blindly cut the random / largest loss or postion. Instead, it applies a smart logic to determine which position's reduction offers the best "Health-to-Loss" ratio.

The Smart Incremental Liquidation Mechanism activates immediately if the Total Equity falls below 50% of the required initial margin:

$$Trigger_{DeRisk} \iff Equity_{total} \le \left( \sum_{j=1}^{m} IM_j \right) \cdot 0.5$$


The system evaluates all active positions ($j=1$ to $m$) and calculates the Health Deficit ($D_H$): the exact amount of $Equity$ or $IM$ reduction required to return $H_{BSTZ}$ to a safe level (e.g.,$H_{BSTZ} \ge 1.0 + \epsilon$), using the following logic:
  - Step A: Simulation. For each position $j$, the system simulates a 10% Volume Reduction.
  - Step B: Sufficiency Test. It checks if this 10% reduction is Sufficient to push $H_{BSTZ}$ back above the trigger threshold.
  - Step C: Priority Ranking. * If multiple positions are "Sufficient," the system selects the one with the Lowest Realized Loss impact.
  - If $H_{BSTZ}$ is still $\le 1.0$, it moves to the next lowest impact position and repeats the 10% cut. The loop continues "bottom-up" until the account is safe, (e.g., $H_{BSTZ} \ge 1.0 + \epsilon$).
  - Re-evaluation: The reduction lowers the required  $\sum$ (Sigma), instantly improving the account's Health Factor. If the market continues to drop, the system repeats the Smart Incremental Liquidation Mechanism.

Balanced Loss Absorption (The 50/50 Rule) 
The loss incurred during a position reduction is settled by deducting equal value from the user's eEURO balance and €BSR (BlackSlon Reserve). This symmetric settlement policy ensures that the protocol maintains its Liquidty by balancing the impact between stable currency and native utility tokens.

<br>
<br>

**5. Margin Monitoring & Alert System**
The protocol continuously monitors the safety and solvency of every position within the BlackSlon Protocol. The following thresholds, based on the $H_{BSTZ}$ (Health Factor), define the automated actions triggered during critical market conditions to preserve Liquidty.

The Protective Mechanism Hierarchy
- Safe Zone (Green) — Optimal Health ($H_{BSTZ} > 1.10$)
This is the standard operating state of the account. Full Operational Access. There are no restrictions on trading activities. Users have unrestricted freedom to open new IPT positions and manage existing exposures.
- Warning Zone (Yellow) - ($H_{BSTZ} \le 1.10$): 
A system-wide Margin Call notification is triggered. The user is alerted to reinforce their BlackSlon Reserve Vault by depositing additional BlackSlon Reserve (€BSR) or eEURO to bolster their collateral buffer.
- Restricted Zone (Orange) - ($H_{BSTZ} \le 1.05$): 
The account enters a Position Lock state. While existing market exposures remain active, the user is restricted from opening any new positions until the health factor is improved above this threshold.
- Intervention Zone (Red) - ($H_{BSTZ} \le 1.00$): 
The Smart De-risking Mechanism is activated. The system utilizes Smart Incremental Liquidation Mechanism.

