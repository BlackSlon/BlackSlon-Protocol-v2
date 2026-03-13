## 13. Risk Management: Position (User) Level

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
