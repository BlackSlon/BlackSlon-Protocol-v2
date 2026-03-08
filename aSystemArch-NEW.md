# System Architecture: The BlackSlon Protocol Stack

---

## 1. Overview

The BlackSlon Protocol is a modular, layered architecture where each component has a single, well-defined responsibility. The system is designed so that no single point of failure can compromise the integrity of the whole — physical market data, internal price discovery, collateral management, and risk controls operate as independent but tightly integrated layers.

---

## 2. The Four-Layer Stack

| Layer | Component | Responsibility |
|:---|:---|:---|
| **Layer 1 — Physical Reality** | Physical Meridian + ADR | Tethers the entire protocol to real European energy markets |
| **Layer 2 — Price Discovery** | BSEI (Hybrid $I_t$) + Order Book | Translates physical reality into real-time virtual settlement prices |
| **Layer 3 — Tradeable Instruments** | BS-P & BS-G Tokens | The core products — perpetual, market-specific virtual energy settlement units |
| **Layer 4 — Collateral & Risk** | Reserve Vault + Health Factor | Manages user capital, enforces margin requirements, executes liquidations |
| **Layer 5 — Stability** | BSR-SR + Anti-Death-Spiral Rule | Protects systemic solvency during extreme market stress |

Each layer feeds into the next. Physical Meridian moves → BSEI adjusts → BS-P/G token value recalculates → margin requirements update → Reserve Vault re-evaluates Health Factors → BSR-SR monitors for systemic stress. The entire chain executes autonomously, in real time, without human intervention.

---

## 3. The Reserve Vault

The Reserve Vault is the collateral management engine of Layer 3. It is the on-chain repository responsible for custody, real-time valuation, and settlement of all committed capital across the protocol.

Its three core functions are:

**Collateral Aggregation:** The Vault tracks each user's collateral portfolio — the mix of eEURO and €BSR across all open positions — and continuously calculates total committed capital. This is the $k$-loop defined in the Master Equity Formula.

**Dynamic Valuation:** The Vault monitors $P_{BSR}$ in real time, recalculating the "hard value" of each account as €BSR market price fluctuates. This feeds directly into the Health Factor ($H_{BSSZ}$) calculation.

**Settlement Clearinghouse:** All realized losses from liquidation events are settled within the Vault under the 50/50 Rule — symmetric absorption between eEURO and €BSR balances. Liquidation surplus flows directly to the BSR Stability Reserve (BSR-SR).

---

## 4. Custody Model: Regulated, Not Non-Custodial

The BlackSlon Protocol operates under a **regulated custody model**, consistent with its CASP license obligations under MiCA. User assets deposited as collateral are held within the Protocol Vault under the legal custody of the BlackSlon Entity, with full segregation from operational funds.

This is a deliberate architectural choice. A fully non-custodial model is incompatible with:
- MiCA CASP licensing requirements
- REMIT compliance for PLP participants
- KYC/AML obligations under 6AMLD
- Physical settlement obligations in Phase 2

All fund movements are governed by audited smart contract logic. There is no discretionary human access to user deposits — the Managing Entity operates the infrastructure but cannot unilaterally move user funds outside of the pre-defined mathematical rules of the protocol.

> **In short:** Regulated custody with algorithmic governance — not self-custody, not arbitrary control.

---

## 5. BS-P & BS-G: The Core Tradeable Instruments

BS-P (BlackSlon Power) and BS-G (BlackSlon Gas) tokens are the instruments that users actually buy, sell, and hold. Every other component of the protocol exists to support their integrity.

Each token represents **100 kWh** of electric power or natural gas in a specific European market (e.g., BS-G-NL for Dutch gas on TTF, BS-P-DE for German market). They are perpetual — no expiry, no rollover — and their price is always bounded by the BSSZ corridor of the market they belong to.

Their value at any moment is:

$$V_{token} = I_t \times 100\text{ kWh}$$

Where $I_t$ is the BSEI for that market — always at least 80% anchored to the Physical Meridian. BS-P/G tokens serve a dual purpose: energy price hedge for industrial consumers, and energy-denominated store of value for investors. In Phase 2, they gain physical redemption rights for 1MW+ (minimum yearly contracted power or gas capacity) consumers via the Virtual-to-Physical Swap mechanism.

Full specification: `BS-PG-Token-Specification.md`

---

## 6. Component Cross-Reference

Each architectural component is fully specified in its dedicated document:

| Component | Document |
|:---|:---|
| BS-P & BS-G token specification, valuation, PnL, Phase 2 redemption | `BS-PG-Token-Specification.md` |
| Physical Meridian, ADR, BSSZ corridor | `BSSZ-Framework.md` |
| BSEI pricing, R-VWAP, Circuit Breaker | `BSEI-Framework.md` |
| Master Equity Formula, Health Factor, Smart Liquidation | `Risk-Management-Micro.md` |
| LPS, €BSR Supply Model, Tokenomics | `Economic-Equilibrium-Treasury-Governance.md` |
| BSR Stability Reserve, Anti-Death-Spiral | `BSR-Stability-Reserve.md` |
| Physical Liquidity Providers | `Physical-Liquidity-Provider.md` |
| KYC/AML, CASP, MiCA Classification | `Regulatory-Compliance-Legal-Framework.md` + `KYC-AML-Framework.md` |
