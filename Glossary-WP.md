# BlackSlon Protocol - Official Glossary & Rules

## Core Terminology
- **BSTZ (BlackSlon Trading Zone)**: The trading area where transacions within BlackSlon Protocol can be settled. The anchor "a" price +/- 10%. 
- **BSEI (BlackSlon BlackSlon Energy Index)**: As for now BlackSlone Power Index for specific market and BlackSlon Gas Index for specific market (national markets in Europe, i.e. German Power Market, Dutch Gas Market, etc.). The base BSTZ price used as the anchor for IPT pricing.
- **IPT (Index Participation Token)**: The tradable asset that follows specific BSEI, i.e. BSPI-PL (BlackSlon Power Index - Poland), BSGI-NL (BlackSlon Gas Index - Netherlands), BSPI-DE (BlackSlon Power Index - Germany), BSGI-BG (BlackSlon Gas Index - Bulgaria), etc.
- **€BSR (BlackSlon Reserve)**: The main protocol token used for collateral and value capture.
- **Liquidity**: The lifeblood of the protocol vaults.

### Liquidity & Assets Terminology
**Total Value Locked (TVL), Reserve Vault, and Vault Value**
In the BlackSlon ecosystem, Total Value Locked (TVL) represents the aggregate market value of all digital assets secured within the protocol’s non-custodial smart contracts. A core component of this TVL is the Reserve Vault—a transparent, automated escrow infrastructure designed to hold the protocol's backing assets. The real-time market valuation of these specific assets is defined as the Vault Value. While TVL reflects the overall scale of the ecosystem, the Vault Value serves as the mathematical anchor for Ecosystem Solvency, providing the direct collateralization and price floor for the €BSR token through the BSTZ formula.







## Mathematical Anchors
- **BSTZ Formula**: (Spot * 0.10) + (FM * 0.40) + (FQ * 0.25) + (Cal * 0.25).
- **Pricing Formula**: $P = a \cdot e^{b \cdot S}$
- **H BSTZ**: Equity / Margin Requirement. Sentinel triggers below 1.0.

## Logic Rules
- **50/50 Rule (SSP)**: Losses are split 50% eEURO / 50% €BSR.
- **Burn & Recycle**: 50% of recovered BSR is burned, 50% goes to the General Reserve Fund.