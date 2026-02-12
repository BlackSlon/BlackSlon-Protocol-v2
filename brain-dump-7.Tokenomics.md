# 🐘 Section 7: Tokenomics & Dual-Token Correlation

The **BlackSlon protocol** operates on a symbiotic relationship between the utility token (**BaSe**) and the settlement instruments (**BS-P-PL**, **BS-G-DE**).

## 7.1. BaSe Token (The Ecosystem Foundation)
* **Function:** Native utility currency, collateral, and value-capture mechanism.
* **Role in the Protocol:** **BaSe** is the primary fuel of the entire BlackSlon Ecosystem. It provides the **Liquidty** necessary to mint energy instruments (**BS-P-PL**, **BS-G-DE**).
* **Interaction with BSTZ:** While the **BSTZ** defines the "Safe Trading Corridor," the **BaSe Vault** acts as the physical shock absorber. 
  * When the price hits the ceiling of the **BSTZ**, the protocol uses **BaSe** to facilitate the creation of new supply.
  * When the price hits the floor, the ecosystem uses **BaSe** reserves to support the buy-back and burn mechanism.

## 7.2. BS-P-PL / BS-G-DE (The Settlement Tokens)
* **Function:** Pure energy index exposure.
* **Correlation:** These tokens are "Soft-Pegged" to the energy market via the **BTZ =** formula. Their value is measured in **BaSe**.

## 7.3. The Stability Loop
1. **Demand Spike:** If buyers rush **BS-P-PL**, the **Stabilizer b** increases friction. Arbitrageurs deposit **BaSe** to mint new **BS-P-PL**, capturing the premium and stabilizing the zone.
2. **Supply Spike:** If sellers dump **BS-P-PL**, the protocol incentives burning the tokens in exchange for **BaSe** from the liquidity pool.