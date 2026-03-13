# PLP Strategic Framework: Curve Structure & Anchor Decay

## 1. The Structural Edge Hidden in Plain Sight

Most participants entering the BlackSlon Protocol will do so with a directional thesis: *"energy prices will rise, therefore I buy BS-G/BS-P."* This is a legitimate view. It is also, in the current European energy market structure, frequently a losing position — not because the directional thesis is wrong, but because the participant is fighting a structural force they do not see: **backwardation**.

PLPs who understand this dynamic possess an asymmetric informational advantage over the vast majority of protocol participants. This section defines that advantage mathematically and translates it into three actionable strategies within the BlackSlon Protocol.

---

## 2. Backwardation Defined: The Structural Headwind

A market is in **backwardation** when near-term contract prices exceed long-term contract prices. The forward curve slopes downward. This is the dominant structural condition in European natural gas markets during periods of supply tightness or geopolitical premium.

**Current TTF Forward Curve (March 2026, illustrative):**

| Contract | Price (EUR/MWh) |
|:---------|:--------------:|
| FM (Apr 2026) | 50.00 |
| FQ (Q3 2026) | 42.00 |
| Cal 2027 | 37.00 |
| Cal 2028 | 26.50 |

The curve is not merely declining — it is **steeply declining**. Cal28 trades at 47% below FM. This is not a minor technical condition. It is a structural force with direct consequences for BlackSlon token valuation.

---

## 3. How Backwardation Erodes the Physical Meridian: The Roll Decay Mechanism

The BlackSlon Physical Meridian ($\hat{a}$) is a weighted basket across four time horizons:

$$\hat{a} = (0.10 \cdot P_{Spot}) + (0.40 \cdot P_{FM}) + (0.25 \cdot P_{FQ}) + (0.25 \cdot P_{Cal})$$

Under the TTF curve above:

$$\hat{a} = (0.10 \times 50.00) + (0.40 \times 50.00) + (0.25 \times 42.00) + (0.25 \times 37.00)$$

$$\hat{a} = 5.00 + 20.00 + 10.50 + 9.25 = \mathbf{44.75\ EUR/MWh}$$

**Critical observation:** Even when FM = 50.00 EUR/MWh, the Physical Meridian is already 44.75 — 10.5% below spot. A user buying BS-G at a price anchored near 44.75 EUR believes they are buying "gas at market price." In reality, the anchor already prices in the structural decline embedded in the forward curve.

### 3.1 The ADR Roll Decay

The Asymptotic Daily Rebalancing (ADR) mechanism progressively migrates weight from expiring contracts to their successors. In backwardation, every roll **mechanically lowers the Physical Meridian** — even if all individual contract prices remain completely unchanged.

**The Roll Decay ($\Delta\hat{a}_{roll}$):**

$$\Delta\hat{a}_{roll} = \sum_{i} \Delta W_i \cdot (P_{new,i} - P_{old,i})$$

Where $\Delta W_i$ is the weight migrated from the expiring contract to its successor during each ADR step, and $(P_{new,i} - P_{old,i})$ is the price differential between the incoming and outgoing contract.

In deep backwardation, $(P_{new,i} - P_{old,i}) < 0$ for every segment. Every ADR roll therefore produces a **negative $\Delta\hat{a}_{roll}$** — the anchor drifts downward continuously, even in a static price environment.

**Numerical illustration — FM roll over 10 business days:**

Assume FM expires at 50.00, M2 (next month) = 46.00. The 40% FM weight migrates to M2 over 10 business days — approximately 4% per day.

| Business Day | FM Weight | M2 Weight | Anchor Contribution (FM+M2) |
|:---:|:---:|:---:|:---:|
| 0 | 40% | 0% | 20.00 |
| 3 | 28% | 12% | 14.00 + 5.52 = 19.52 |
| 7 | 12% | 28% | 6.00 + 12.88 = 18.88 |
| 10 | 0% | 40% | 0 + 18.40 = 18.40 |

**Anchor contribution from FM/M2 alone drops from 20.00 to 18.40 EUR — a decline of 1.60 EUR/MWh over 10 business days, with zero change in any market price.** This is pure roll decay.

Applied to the full Settlement Anchor via the 50/25/25 recursive filter:

$$A_{Today} = (0.50 \cdot \hat{a}_{T-1}) + (0.25 \cdot \hat{a}_{T-2}) + (0.25 \cdot \hat{a}_{T-3})$$

The recursive filter smooths the roll decay but does not eliminate it. Over a full ADR cycle, the Settlement Anchor will trace a downward path that is mathematically predetermined by the slope of the forward curve — **independent of whether spot prices move at all.**

---

## 4. The PLP Edge: Three Actionable Strategies

### Strategy 1: Structural Short — Selling Roll Decay

**Thesis:** In steep backwardation, the Settlement Anchor will mechanically decline over time due to ADR roll mechanics. A SHORT position on BS-G (or BS-P in backwardated power markets) profits from this anchor decay without requiring any directional move in spot energy prices.

**Setup:**
- Open SHORT position on BS-G-NL when FM/Cal spread exceeds a defined threshold
- Target: anchor decay over one full ADR cycle (approx. 1 month for FM roll, quarterly for FQ roll)
- Exit: when ADR migration is complete and anchor has reset to new, lower level

**Roll Yield Calculation ($RY$):**

$$RY = \frac{\hat{a}_{today} - \hat{a}_{T+30}}{{\hat{a}_{today}}} \times \frac{365}{30}$$

Where $\hat{a}_{T+30}$ is the projected Physical Meridian 30 days forward, assuming static market prices and full ADR roll execution. This annualised roll yield represents the structural return available to a SHORT position independently of directional price movement.

**Risk parameters:**
- Maximum loss bounded by BSSZ ceiling: $+20\%$ above Settlement Anchor
- Margin requirement: SHORT at minimum 50% of notional (100% BSR ratio tier)
- Stop-loss discipline: if FM prices spike upward (supply shock), roll decay is overwhelmed by directional move

**Signal — FM/Cal Spread Threshold ($S_{trigger}$):**

$$S_{trigger} = \frac{P_{FM} - P_{Cal}}{P_{FM}} > 20\%$$

When this spread exceeds 20%, roll decay is structurally significant enough to justify a dedicated short position. At current TTF levels (FM=50, Cal27=37), $S_{trigger} = 26\%$ — well above threshold.

---

### Strategy 2: Cross-Market Arbitrage — Curve Differential Between BSSZ Markets

**Thesis:** Different European gas markets exhibit different degrees of backwardation. TTF (BS-G-NL) and TGE (BS-G-PL) are both in backwardation, but the slope and depth of their forward curves differ due to regional supply/demand dynamics, infrastructure constraints, and seasonal storage patterns. This creates a **spread opportunity** between the two BlackSlon markets.

**The Cross-Market Spread ($CS$):**

$$CS = \hat{a}_{NL} - \hat{a}_{PL}$$

Where $\hat{a}_{NL}$ and $\hat{a}_{PL}$ are the Physical Meridians for the Dutch and Polish gas markets respectively, calculated from their respective reference exchange data.

**Implementation:**
- **LONG BS-G-PL / SHORT BS-G-NL** when $CS$ is wide (NL anchor significantly above PL anchor) and converging
- **LONG BS-G-NL / SHORT BS-G-PL** when $CS$ is narrow or inverted and historical spread suggests mean reversion

**Why this works in BlackSlon specifically:**

Each BSSZ market operates its own isolated Physical Meridian with its own ADR schedule. Because TGE and TTF have different liquidity profiles, different seasonal patterns, and different ADR weights calibrated to their specific markets, their anchors do not move in lockstep — even when the underlying markets are strongly correlated in spot terms.

The PLP is uniquely positioned to execute this strategy because:
1. They have direct access to both TTF and TGE on physical exchanges
2. They can monitor both Physical Meridians in real time via the BlackSlon oracle feed
3. They can hedge the physical leg of the spread on physical exchanges while holding the virtual leg within BlackSlon — achieving near-perfect delta neutrality across both dimensions

**Spread mean-reversion signal:**

$$\Delta CS_{30d} = CS_{today} - CS_{T-30}$$

If $|\Delta CS_{30d}|$ exceeds one standard deviation of the 90-day historical spread distribution, a mean-reversion position is warranted.

---

### Strategy 3: Delta-Neutral Hedging with Anchor Decay Overlay

**Thesis:** A PLP providing liquidity to the Order Book accumulates directional inventory as the natural consequence of market making. The standard PLP response is to hedge this inventory on physical exchanges to achieve delta neutrality. The advanced PLP incorporates the **roll decay overlay** — adjusting the hedge ratio to account for the known future movement of the Settlement Anchor.

**Standard delta-neutral hedge ratio ($\Delta_{std}$):**

$$\Delta_{std} = -\frac{Q_{virtual}}{Q_{physical}}$$

Where $Q_{virtual}$ is the net virtual position accumulated through market making, and $Q_{physical}$ is the offsetting position on TTF/TGE.

**Anchor-adjusted hedge ratio ($\Delta_{adj}$):**

$$\Delta_{adj} = \Delta_{std} \cdot \left(1 + \frac{\Delta\hat{a}_{roll}}{\hat{a}_{today}}\right)^{-1}$$

The adjustment factor $\left(1 + \frac{\Delta\hat{a}_{roll}}{\hat{a}_{today}}\right)^{-1}$ is less than 1 in backwardation (since $\Delta\hat{a}_{roll} < 0$). This means the **physical hedge is slightly underweighted** relative to the virtual position — allowing the PLP to capture a portion of the roll decay as positive carry on their book, rather than hedging it away entirely.

**Practical implementation:**

| Scenario | $\Delta\hat{a}_{roll}$ | $\Delta_{adj}$ vs $\Delta_{std}$ | PLP Position |
|:---------|:---:|:---:|:-------------|
| Steep backwardation (FM/Cal > 25%) | −3% to −5% monthly | 3–5% underhedged | Profitable carry from roll decay |
| Mild backwardation (FM/Cal 10–25%) | −1% to −2% monthly | 1–2% underhedged | Modest carry, lower risk |
| Flat curve (FM/Cal < 10%) | ~0% | Neutral | Standard delta hedge |

**Risk management for the overlay:**

The anchor decay overlay introduces a residual directional risk — if FM prices spike sharply upward (e.g., geopolitical shock), the underhedge becomes a loss. PLPs employing this strategy should:

1. Set a **roll overlay limit** — maximum underhedge of 5% of total virtual book
2. Define a **stop-out price** — if FM rises above $\hat{a}_{today} \times 1.10$, close the overlay immediately and revert to full $\Delta_{std}$
3. Monitor the **BSSZ ceiling distance** — as price approaches $A + 20\%$, reduce the overlay proportionally

---

## 5. The Retail Participant's Structural Disadvantage

Understanding backwardation also defines the PLP's responsibility as a liquidity provider. A retail participant who buys BS-G because "gas prices will rise" is implicitly:

1. **Paying the curve premium** — buying at an anchor already 10–15% below spot FM due to the basket weighting
2. **Fighting roll decay** — as ADR mechanically lowers the anchor over time, the token price faces structural downward pressure even if FM prices are unchanged
3. **Unaware of the horizon mismatch** — they are thinking in spot terms; the protocol prices in weighted-average forward curve terms

This does not mean the retail participant is wrong to be long BS-G. If FM prices rise by more than the roll decay rate, the position is profitable. But the **breakeven is higher than they think** — they need spot prices to rise not just to cover their entry price, but to overcome the embedded roll decay in the anchor.

**Minimum FM appreciation required to breakeven ($P_{BE}$):**

$$P_{BE} = P_{entry} + |\Delta\hat{a}_{roll}| \cdot \frac{1}{W_{FM}}$$

Where $W_{FM} = 0.40$ is the FM weight in the Physical Meridian basket. A 1 EUR/MWh roll decay in the anchor requires approximately 2.5 EUR/MWh of FM appreciation to offset — because FM only drives 40% of the anchor.

The PLP who understands this is not exploiting retail participants. They are **providing genuine price discovery** by taking the structurally correct short side of a position that retail participants systematically underprice.

---

## 6. The Power Market Case: BS-P-DE and the Seasonal Hump

German power (EEX Phelix) presents a structurally distinct forward curve that requires a different analytical lens — but arrives at the same conclusion over the time horizon that matters most for the BlackSlon Protocol.

**Current EEX DE Power Forward Curve (March 2026, illustrative):**

| Contract | Price (EUR/MWh) | vs FM |
|:---------|:--------------:|:-----:|
| FM (Apr 2026) | 91.20 | — |
| FQ (Q3 2026) | 98.00 | +7.5% |
| Cal 2027 | 92.00 | +0.9% |
| Cal 2028 | 75.00 | −17.8% |
| Cal 2029 | 70.00 | −23.2% |

At first glance, the front of the curve looks nothing like backwardation. FM (91.20) is below Q3 (98.00) — classic seasonal contango driven by summer cooling demand and reduced solar output in peak hours. Cal27 (92.00) sits almost exactly at FM. A participant looking only at the front of the curve might conclude the market is flat or mildly in contango.

**This reading is wrong for the BlackSlon Protocol — and here is why.**

### 6.1 The Relevant Horizon: Phase 2 Physical Redemption

BS-P/G tokens in Phase 2 become redeemable for physical energy delivery under 2–3 year supply contracts. This means the economically relevant horizon for a participant holding BS-P-DE is not April 2026 — it is Cal 2027, Cal 2028, and Cal 2029. And on that horizon, DE power is unambiguously in **backwardation**:

$$\text{Cal27} \rightarrow \text{Cal28}: \quad \frac{75.00 - 92.00}{92.00} = -18.5\%$$

$$\text{Cal28} \rightarrow \text{Cal29}: \quad \frac{70.00 - 75.00}{75.00} = -6.7\%$$

A participant who buys BS-P-DE today with a 2–3 year redemption horizon is buying into a curve that declines 23% by the time their redemption window opens. The seasonal hump at Q3 is irrelevant to their economics — it will have rolled off long before they exercise their Phase 2 rights.

### 6.2 Physical Meridian Calculation for BS-P-DE

Applying the 10/40/25/25 basket (using Spot ≈ FM = 91.20 as approximation, Cal = Cal27 per current ADR state):

$$\hat{a}_{DE} = (0.10 \times 91.20) + (0.40 \times 91.20) + (0.25 \times 98.00) + (0.25 \times 92.00)$$

$$\hat{a}_{DE} = 9.12 + 36.48 + 24.50 + 23.00 = \mathbf{93.10\ EUR/MWh}$$

Note that $\hat{a}_{DE} = 93.10$ is **above FM (91.20)** — because the Q3 seasonal premium (98.00) pulls the basket upward. This creates the opposite dynamic from gas in the short term: the Physical Meridian is slightly above spot FM, meaning BS-P-DE buyers are not immediately fighting the anchor.

However, as the ADR rolls Q3 exposure into Cal27 (92.00) and then Cal27 migrates toward Cal28 (75.00), the Physical Meridian will progressively converge downward. **Over a 2–3 year horizon, the roll decay in DE power is structurally equivalent to gas — it is simply deferred by one seasonal cycle.**

### 6.3 Comparative Backwardation Intensity

| Market | FM Price | Cal+2 Price | Backwardation (FM→Cal+2) | Roll Decay Urgency |
|:-------|:--------:|:-----------:|:------------------------:|:-----------------:|
| TTF Gas (BS-G-NL) | 50.00 | 26.50 | **−47%** | Immediate, steep |
| DE Power (BS-P-DE) | 91.20 | 75.00 | **−18%** | Deferred, moderate |

Gas backwardation is more severe and more immediate — it begins eroding the anchor from the first ADR cycle. Power backwardation is shallower and deferred — the seasonal hump provides temporary support before the structural decline takes hold.

For PLPs, this means:

- **BS-G-NL shorts** should be positioned immediately and managed actively through each FM roll
- **BS-P-DE shorts** can be initiated with a longer time horizon — the structural decay materialises over quarters, not weeks — making them lower-maintenance but requiring patience and a larger capital allocation to hold through seasonal volatility

### 6.4 The Cross-Commodity Spread Opportunity

The differential backwardation between gas and power creates a **cross-commodity spread** within the BlackSlon Protocol:

$$Spread_{G/P} = \hat{a}_{NL} - \hat{a}_{DE} \cdot k$$

Where $k$ is the gas-to-power conversion efficiency factor (typically 0.40–0.45 for gas-fired power generation, reflecting the thermal efficiency of CCGT plants).

When this spread widens beyond historical norms, it signals that gas and power are mispriced relative to each other — either gas is too cheap relative to the power it can generate, or power is too expensive relative to its gas input cost. A PLP who understands the spark spread can position accordingly:

- **LONG BS-G-NL / SHORT BS-P-DE** when gas is underpriced relative to power (negative spark spread)
- **SHORT BS-G-NL / LONG BS-P-DE** when gas is overpriced relative to power (compressed spark spread)

This strategy is available exclusively to PLPs with physical market access — retail participants cannot execute the physical leg required to make it delta-neutral.

---

## 7. Summary: The PLP's Informational Advantage

| Mechanism | Retail Participant | Informed PLP |
|:----------|:-----------------:|:------------:|
| Sees FM price | ✓ | ✓ |
| Understands Physical Meridian basket | ✗ | ✓ |
| Calculates ADR roll decay | ✗ | ✓ |
| Prices roll yield into strategy | ✗ | ✓ |
| Executes cross-market curve arbitrage (G vs P) | ✗ | ✓ |
| Adjusts hedge ratio for anchor decay | ✗ | ✓ |
| Positions for deferred power backwardation | ✗ | ✓ |
| Executes spark spread strategy | ✗ | ✓ |

The BlackSlon Protocol does not eliminate information asymmetry — no market can. What it does is make the structural mechanics **fully transparent and mathematically defined**, so that any participant willing to invest in understanding them can access the same edge. This section is that investment for PLPs.
