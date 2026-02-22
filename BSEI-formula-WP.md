## **BlackSlone Energy Indexes (BSEI): New Benchmark for Energy Trading & Hedging**

### 1. BlackSlone Energy Indexes (BSEI)
The BlackSlon Energy Indexes (BSEI) are a set of dynamic, autonomous pricing protocols - virtual energy trading points. Unlike traditional indexes that simply mirror external data, the BSEI functions as a self-regulating settlement zone where valuation is driven by internal supply and demand while remaining tethered to physical reality via Anchor $a$.Operating as a perpetual, high-fidelity settlement zone, the BSEI eliminates the friction of traditional energy trading through its five-pillar "Zero-Friction" architecture:

- **Zero Expiration**: Unlike traditional energy futures, the BSEI is a perpetual index with no expiry date, allowing for long-term holding without rollover or overnigh costs,

- **Zero Spread**: Transactions are executed at a symmetric, mathematically derived settlement price, ensuring that entering or exiting a position yields the same execution price, ensuring total transparency and fairness.

- **Zero Formalities**: Participation in the BSEI is immediate and permissionless, removing the administrative and legal hurdles typical for wholesale energy markets.

- **Zero Counterparty Risk**: Every transaction is settled directly against the Protocol’s automated Liquidity pools, governed by the immutable laws of the Autonomous Settlement Engine.

- **Zero Entry Barrier**: Granular volume settlement, down to a 100 kilowatt-hour (100kWh) enables participation at any scale, removing the high minimum-volume requirements typical for the professional energy traders.
<br>
<br>

**The BSEI Pricing Formula**
$$BSEI_{t} = \underbrace{BSEI_{t-1}}_{\text{Recursive Base}} \times \underbrace{e^{(b_{adj} \times \Delta S)}}_{\text{Momentum Engine}}$$

Definitions:
- $BSEI_{t}$: The updated real-time valuation of the BlackSlon Energy Index. The BSEI represents also the Symmetric Transactional Value of an Index Participation Token (IPT). It functions as a Zero-Spread Bid/Ask price, meaning the protocol settles both buy and sell orders at the same mathematically derived execution point. The price is dynamic and recalculated for every transaction based on the net change in internal liquidity ($\Delta S$)
- $BSEI_{t-1}$: The official execution value of the last validated transaction, serving as the recursive anchor for the current calculation. It represents the finalized state of the protocol before the new $\Delta S$ is applied.
- $e$: Euler’s number (${\approx 2.718}$), defining the non-linear relationship between Liquidity flow and the Valuation Trajectory within the bonding curve.
- $b_{adj}$ (Friction Stabilizer): A dynamic sensitivity parameter that flattens the curve as the price approaches the BSTZ boundaries (Ceiling or Floor levels) or moves too fast.
- $\Delta S$ (Net Stress Change): The variation in the internal Stress factor ($S$) resulting from an individual buy or sell transaction. It represents the precise volume of Liquidity flow processed by the BSEI engine in a single execution event.

<br>

**Sub-Component: The Friction Stabilizer ($b_{adj}$)**

To ensure the index remains within the BSTZ ($\pm 10\%$ of the Anchor($a$)—the protocol’s Gravitational Center defined in the BSTZ formula), the $b$ parameter is recalculated for every trade:

$$b_{adj} = \frac{b_{base}}{\left(1 + \frac{|P - a|}{a}\right)^2 \times (1 + |P - EMA_P|)}$$

Where:
- $b_{base}$ (DNA of each market): The base sensitivity parameter / liquidity density factor calibrated for each specific energy market. It represents the Systemic Inertia of the protocol—determining how much the price inherently reacts to capital flow ($\Delta S$) before any dynamic friction is applied. T he value of $b_{base}$ is not arbitrary; it is a value derived from historical liquidity depth and volatility profiles of each market. In a high-liquidity market, $b_{base}$ is calibrated to be lower (i.e. 0.005 for German power market), for medium-liquidity markets like Polish gas market, $b_{base}$ is calibrated to be higher (i.e. 0.025), and for low-liquidity markets like Balkan power markets, $b_{base}$ is calibrated to be even higher (i.e. 0.05).
- $a$: The Anchor (Gravitational Center) of the BSTZ formula.
- $P$: $P$ (Projected Price of Current Transaction): The anticipated price level of the Index for the pending transaction. By using the projected value rather than the current state, the protocol pre-calculates the necessary friction to prevent boundary violations of the BSTZ.
- $EMA_P$: The Exponential Moving Average of the price, used to detect rapid movements.
<br>
<br>

**Sub-Component: The Momentum Brake ($EMA_P$)**

The Momentum Brake is a dynamic component of the $b_{adj}$ parameter that monitors the rate of price change. It is calculated as the Exponential Moving Average of the price ($EMA_P$). When the price moves too quickly, the Momentum Brake increases the $b_{adj}$ value, which in turn increases the friction and slows down the price movement. This prevents the index from overshooting the BSTZ boundaries and ensures that the price remains within the desired range.

The EMA Formula:
$$EMA_P = (\alpha \cdot P) + (1 - \alpha) \cdot EMA_{prev}$$

where:
- $P$ (Projected Settlement Price): The anticipated price of the current transaction before execution.
- $EMA_{prev}$: The value of the Exponential Moving Average from the last validated settlement.
- $\alpha$ (The Smoothing Factor): A calibration constant ($0 < \alpha < 1$) that dictates the "memory" of the system.
    - High $\alpha$ makes the $EMA$ reactive (shorter memory). Recommended for High Liquidity Markets.
    - Low $\alpha$ makes the $EMA$ heavy and stable (longer memory), increasing the protection against sudden volatility. Recommended for Low Liquidity Markets.
<br>
<br>


The $EMA_P$ is the primary input for the second half of the friction formula: $(1 + |P - EMA_P|)$.
- **Velocity Detection**: If a transaction attempts to push the price significantly higher or lower than the recent trend, the absolute difference $|P - EMA_P|$ increases instantly.
- **Instantaneous Dampening**: This difference acts as a multiplier in the denominator of $b_{adj}$. As the gap grows, the $b$ parameter collapses, flattening the bonding curve mid-transaction.
- **The "Viscosity" Effect**: This creates a mathematical "shock absorber." The faster you try to move the price, the more "viscous" (thick) the market becomes, effectively forcing the trader to pay a premium for speed, which protects the Liquidity pool.