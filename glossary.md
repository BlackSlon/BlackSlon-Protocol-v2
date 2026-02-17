# BlackSlon Protocol - Official Glossary & Rules

## Core Terminology
- **BSTZ (BlackSlon Trading Zone)**: The trading area where transacions within BlackSlon Protocol can be settled. The anchor "a" price +/- 10%. 
- **BSEI (BlackSlon BlackSlon Energy Index)**: As for now BlackSlone Power Index for specific market and BlackSlon Gas Index for specific market (national markets in Europe, i.e. German Power Market, Dutch Gas Market, etc.). The base BSTZ price used as the anchor for IPT pricing.
- **IPT (Index Participation Token)**: The tradable asset that follows BBSTZspecific BSEI.
- **€BSR (BlackSlon Reserve)**: The main protocol token used for collateral and value capture.
- **Liquidity**: The lifeblood of the protocol vaults.








## Mathematical Anchors
- **BSTZ Formula**: (Spot * 0.10) + (FM * 0.40) + (FQ * 0.25) + (Cal * 0.25).
- **Pricing Formula**: $P = a \cdot e^{b \cdot S}$
- **H BSTZ**: Equity / Margin Requirement. Sentinel triggers below 1.0.

## Logic Rules
- **50/50 Rule (SSP)**: Losses are split 50% eEURO / 50% €BSR.
- **Burn & Recycle**: 50% of recovered BSR is burned, 50% goes to the General Reserve Fund.