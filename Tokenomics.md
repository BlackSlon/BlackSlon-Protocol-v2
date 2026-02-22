# Tokenomics & Dual-Token Correlation

The **BlackSlon protocol** operates on a symbiotic relationship between utility token (**€BSR**) and Index Participation Tokens (**BS-IPT-P-PL** for Polish Power Market, **BS-IPT-P-DE** for German Power Market, **BS-IPT-G-NL** for Dutch Gas Market).

Genesis: Tworzysz 100 mln tokenów, ale... one są „zamknięte” w kontrakcie.

## 7.1. BSR Token (The Ecosystem Foundation)
* **Function:** Native utility currency, collateral, and value-capture mechanism.
* **Role in Protocol:** **€BSR** is the primary fuel of the entire BlackSlon Ecosystem. It provides **Liquidity** necessary to mint energy instruments (**BS-IPT-P-PL**, **BS-IPT-P-DE**, **BS-IPT-G-NL**).
* **Interaction with BSTZ:** While the **BSTZ** defines the "Safe Trading Corridor," the **BSR Vault** acts as the physical shock absorber. 
  * When the price hits the ceiling of the **BSTZ**, the protocol uses **BaSe** to facilitate the creation of new supply.
  * When the price hits the floor, the ecosystem uses **BaSe** reserves to support the buy-back and burn mechanism.

## 7.2. BS-IPT-PL / BS-IPT-DE / BS-IPT-NL (The Settlement Tokens)
* **Function:** Pure energy index exposure.
* **Correlation:** These tokens are "Soft-Pegged" to energy market via **BTZ =** formula. Their value is measured in **€BSR**.

## 7.3. The Stability Loop
1. **Demand Spike:** If buyers rush **BS-IPT-PL**, the **Stabilizer b** increases friction. Arbitrageurs deposit **€BSR** to mint new **BS-IPT-PL**, capturing the premium and stabilizing the zone.
2. **Supply Spike:** If sellers dump **BS-IPT-PL**, the protocol incentives burning the tokens in exchange for **€BSR** from the liquidity pool.

## 7.4. The Burn & Resilience Mechanism
The BlackSlon Protocol implements a dual-action value capture system triggered by the Smart Incremental Liquidation Mechanism. When a loss is settled within the BlackSlon Reserve Vault, the €BSR portion is subjected to a "Burn & Recycle" protocol designed for long-term ecosystem health:
- **Deflationary Burn (50%):** Half of the recovered BSR is permanently removed from the total supply. This constant buy-back-and-burn pressure induces a deflationary effect, directly increasing the scarcity and potential value for all remaining token holders.
- **Protocol Resilience Recycling (50%):** The remaining half is diverted to the BlackSlon Reserve Fund. This capital is strategically held to ensure the protocol maintains 100% Liquidty and Stability.

### Why this is a "Flywheel":
- Traders lose $\rightarrow$ Supply drops (Burn) $\rightarrow$ Token value rises.
- Higher token value $\rightarrow$ Stronger Vaults $\rightarrow$ More Liquidty for the whole system.