import math
import datetime

# --- INTEGRACJA SILNIKÓW ---

class BlackSlonEngine:
    def __init__(self, b_base=0.025, alpha=0.3, initial_price=100.0):
        # Parametry BSTZ (Korytarz)
        self.anchor_history = []
        self.weights = {"spot": 0.10, "fm": 0.40, "fq": 0.25, "cal": 0.25}
        
        # Parametry BSEI (Handel)
        self.price = initial_price
        self.ema_p = initial_price
        self.b_base = b_base
        self.alpha = alpha

    def get_weighted_anchor(self, raw_anchor):
        """Filtr 50/25/25 dla stabilizacji korytarza"""
        if len(self.anchor_history) < 3:
            self.anchor_history.insert(0, raw_anchor)
            return raw_anchor
        a_t1, a_t2, a_t3 = self.anchor_history[0], self.anchor_history[1], self.anchor_history[2]
        weighted_a = (0.50 * a_t1) + (0.25 * a_t2) + (0.25 * a_t3)
        self.anchor_history.insert(0, weighted_a)
        return round(weighted_a, 4)

    def execute_bsei_trade(self, delta_s, anchor_a):
        """Handel z uwzględnieniem tarcia względem aktualnej kotwicy"""
        # Projected Price guess
        p_guess = self.price * math.exp(self.b_base * delta_s)
        # Friction b_adj
        denom = ((1 + abs(p_guess - anchor_a) / anchor_a)**2) * (1 + abs(p_guess - self.ema_p))
        b_adj = self.weights.get('b_adj_limit', self.b_base) / denom
        
        new_price = self.price * math.exp(b_adj * delta_s)
        self.ema_p = (self.alpha * new_price) + (1 - self.alpha) * self.ema_p
        self.price = round(new_price, 4)
        return self.price, b_adj

# --- SYMULACJA DYNAMICZNA ---
engine = BlackSlonEngine()
# Początkowy stan rynku
market_prices = {'spot': 100, 'fm': 100, 'fq': 100, 'cal': 100}

print(f"{'Zdarzenie':<15} | {'Kotwica (a)':<12} | {'Cena BSEI':<12} | {'Status Korytarza'}")
print("-" * 70)

# Scenariusz: Rynek fizyczny rośnie, a ludzie zaczynają kupować
scenarios = [
    ("Start", 100, 0),
    ("Wzrost Rynku", 110, 0),     # Tylko rynek rośnie
    ("Duże Kupno", 110, 80),      # Użytkownik kupuje (Delta S = 80)
    ("Kolejne Kupno", 110, 50),   # Próba wypchnięcia ceny
    ("Korekta Rynku", 105, -30),  # Rynek spada, użytkownik sprzedaje
]

for name, m_price, ds in scenarios:
    # 1. Aktualizacja korytarza (uproszczona dla testu)
    anchor = engine.get_weighted_anchor(m_price)
    low, high = anchor * 0.9, anchor * 1.1
    
    # 2. Egzekucja handlu
    bsei_price, _ = engine.execute_bsei_trade(ds, anchor)
    
    # 3. Walidacja strefy BSTZ
    status = "Wewnątrz" if low <= bsei_price <= high else "!!! POZA STREFĄ !!!"
    
    print(f"{name:<15} | {anchor:<12.2f} | {bsei_price:<12.2f} | {status}")