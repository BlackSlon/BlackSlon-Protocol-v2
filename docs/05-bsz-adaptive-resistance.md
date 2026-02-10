# 5. BlackSlon Settlement Zone (BSZ) & Adaptive Resistance

## 5.3.1. The Adaptive Friction Formula
The core of the "Stabilizer b" is the formula for the dynamic coefficient $b_{adj}$:

$$b_{adj} = \frac{b_{base}}{(1 + \frac{|P - a|}{a})^2 \cdot (1 + |P - EMA_{P}|)}$$

> **Note:** This formula ensures that the **protocol** remains stable even during high volatility.