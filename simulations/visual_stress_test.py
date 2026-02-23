import math
import matplotlib.pyplot as plt
import os

# Upewnij się, że folder na wykresy istnieje
output_dir = "simulations"
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

class BlackSlonIntegrated:
    def __init__(self, b_base=0.025, alpha=0.3):
        self.anchor_history = []
        self.price = 100.0
        self.ema_p = 100.0
        self.b_base = b_base
        self.alpha = alpha

    def get_weighted_anchor(self, raw_a):
        if len(self.anchor_history) < 3:
            self.anchor_history.insert(0, raw_a)
            return raw_a
        a_t1, a_t2, a_t3 = self.anchor_history[0], self.anchor_history[1], self.anchor_history[2]
        weighted_a = (0.50 * a_t1) + (0.25 * a_t2) + (0.25 * a_t3)
        self.anchor_history.insert(0, weighted_a)
        if len(self.anchor_history) > 3: self.anchor_history.pop()
        return weighted_a

    def execute_trade(self, ds, anchor):
        p_guess = self.price * math.exp(self.b_base * ds)
        # Friction formula
        denom = ((1 + abs(p_guess - anchor) / anchor)**2) * (1 + abs(p_guess - self.ema_p))
        b_adj = self.b_base / denom
        new_p = self.price * math.exp(b_adj * ds)
        self.ema_p = (self.alpha * new_p) + (1 - self.alpha) * self.ema_p
        self.price = new_p
        return new_p

# --- SYMULACJA ---
engine = BlackSlonIntegrated()
data = {"steps": [], "anchor": [], "price": [], "upper": [], "lower": []}

# Scenariusz: 30 kroków czasowych
for i in range(30):
    # Rynek fizyczny powoli rośnie (Raw Anchor)
    raw_market = 100 + (i * 0.5)
    anchor = engine.get_weighted_anchor(raw_market)
    
    # Symulujemy losowy handel użytkowników (Delta S)
    # Najpierw kupują, potem sprzedają
    trade_volume = 18 if 5 < i < 18 else -12 if i > 20 else 2
    price = engine.execute_trade(trade_volume, anchor)
    
    # Zbieranie danych do wykresu
    data["steps"].append(i)
    data["anchor"].append(anchor)
    data["price"].append(price)
    data["upper"].append(anchor * 1.10)
    data["lower"].append(anchor * 0.90)

# --- GENEROWANIE WYKRESU ---
plt.figure(figsize=(12, 6))

# Korytarz BSTZ (+/- 10%)
plt.fill_between(data["steps"], data["lower"], data["upper"], color='gray', alpha=0.15, label='BSTZ Corridor (±10%)')
plt.plot(data["steps"], data["anchor"], '--', color='blue', alpha=0.6, label='Weighted Anchor (a)', linewidth=1.5)

# Cena BSEI
plt.plot(data["steps"], data["price"], color='green', label='BSEI Price (IPT)', linewidth=2.5)

# Upiększanie - POPRAWIONY TYTUŁ
plt.title("BlackSlon Trading Zone - Stress Test Visualization", fontsize=14, pad=20)
plt.xlabel("Time Steps / Transactions")
plt.ylabel("Price Index")
plt.legend(loc='upper left')
plt.grid(True, which='both', linestyle='--', alpha=0.5)

# Zapis do pliku
output_path = os.path.join(output_dir, "bstz_visual_test.png")
plt.savefig(output_path, dpi=100, bbox_inches='tight')
plt.close()
print(f"Sukces! Poprawiony wykres został zapisany jako {output_path}")