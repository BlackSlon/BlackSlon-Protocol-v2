# BSZ Protocol: Dynamic Covariance Solvency Model

## 1. Core Formula: Health Factor (H_BSTZ)
The primary metric for position solvency within the BSZ protocol.
A position is considered safe only if H_BSTZ >= 1.0.

**Formula:**
$$H_{BSTZ} = \frac{Q_{BaSe} \cdot P_{BaSe}}{V_{Pos} \cdot \Omega_{risk}}$$

**Variables:**
* `Q_BaSe`: Quantity of BaSe tokens currently locked as collateral.
* `P_BaSe`: Current market price of the BaSe token.
* `V_Pos`: Nominal value of the open IPT position (50% of Index Value for Long, 100% for Short).
* `Omega_risk`: Dynamic Risk Multiplier (calculated below).

---

## 2. Dynamic Risk Multiplier (Omega_risk)
This parameter adjusts the margin requirement based on market volatility. It uses a "Progressive Friction" model to protect Liquidty during high-stress periods.

**Formula:**
$$\Omega_{risk} = K_{base} \cdot e^{(b \cdot \Delta_{vol})}$$

**Variables:**
* `K_base`: Base collateral requirement factor (Default = 1.0).
* `e`: Euler's number (exponential growth base).
* `b`: Sensitivity Parameter (Calibrated Friction Coefficient). Higher 'b' means the protocol reacts more aggressively to volatility.
* `Delta_vol`: Volatility Divergence Index (derived from EMA).

---

## 3. Volatility Divergence Calculation (Delta_vol)
Calculates the "stress" on the market by comparing Short-term and Long-term Exponential Moving Averages (EMA) for both the instrument (IPT) and the collateral (BaSe).

**Formula:**
$$\Delta_{vol} = \left| \frac{EMA_{short}(P_{IPT}) - EMA_{long}(P_{IPT})}{EMA_{long}(P_{IPT})} \right| + \left| \frac{EMA_{short}(P_{BaSe}) - EMA_{long}(P_{BaSe})}{EMA_{long}(P_{BaSe})} \right|$$

**Logic:**
* If the market is stable, `Delta_vol` approaches 0, and `Omega_risk` remains at `K_base` (Standard requirement).
* If the market is volatile (IPT crashes or BaSe dumps), `Delta_vol` spikes. The exponential function causes `Omega_risk` to increase non-linearly, forcing a higher Health Factor to maintain the position.

---

## 4. Market Scenarios & Protocol Logic

### A. IPT Price Crash (Directional Risk)
* **Context:** User is Long. IPT price drops significantly.
* **Effect:** `V_Pos` (value of position) drops, but usually, the PnL loss is deducted directly from `Q_BaSe`.
* **Protocol Action:** Standard liquidation logic applies if the remaining collateral value fails to meet the `H_BSTZ >= 1.0` requirement.

### B. BaSe Price Drop (Collateral Crunch)
* **Context:** IPT price is stable, but BaSe token loses value.
* **Effect:** 1. The numerator (`Q_BaSe * P_BaSe`) decreases.
    2. Volatility (`Delta_vol`) increases due to the BaSe drop, raising the denominator (`Omega_risk`).
    3. `H_BSTZ` drops rapidly (double penalty).
* **Protocol Action (Internal Rebalancing):** Instead of a full liquidation, the protocol triggers a **Soft Margin Call**. It may automatically close a small percentage of the IPT position to reduce `V_Pos` and restore `H_BSTZ > 1.0` without crashing the BaSe market further.

### C. BaSe Price Increase (The Pump Mechanism)
* **Context:** Demand for BaSe increases, raising `P_BaSe`.
* **Effect:** The numerator increases. Since EMA smoothing ignores normal growth, `Omega_risk` remains stable. `H_BSTZ` rises significantly (e.g., > 1.5).
* **Protocol Action (Liquidty Release):**
    If `H_BSTZ` exceeds a "Surplus Threshold" (e.g., 1.2), the excess value is unlocked as **Free Liquidty**.
    * **User Benefit:** The user can use this surplus to open *new* IPT positions (compounding) without depositing fresh funds.
    * **System Benefit:** This creates buying pressure on IPT and locks more BaSe, creating a positive feedback loop for the token price.