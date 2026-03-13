# BlackSlon Protocol — TCPA Proposal
## Tiered Collateral Price Anchor (TCPA)
### Proposed Addition to White Paper v3.0 — Section 13.X

---

## 1. Problem Statement

The current H_BSSZ formula creates a structural vulnerability for users with high €BSR collateral ratios under market stress:

$$H_{BSSZ} = \frac{Equity_{total}}{\sum IM_j \cdot 0.5}$$

$$Equity_{total} = Q_{eEURO} + Q_{€BSR} \cdot P_{€BSR}(t) + \sum \Delta PnL_j$$

When energy markets move violently (a routine occurrence — TTF saw +24.7% intraday on March 2nd, 2026), three things happen simultaneously for a leveraged 100% €BSR user:

1. **$\Delta PnL_j$ falls** — the energy position loses value
2. **$P_{€BSR}(t)$ falls** — collateral loses value (€BSR is correlated with protocol stress)
3. **SIL activates** — Smart Incremental Liquidation sells €BSR, which further depresses $P_{€BSR}$
