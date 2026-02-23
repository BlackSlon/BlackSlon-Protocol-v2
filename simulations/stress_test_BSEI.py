import math

class BSEIProtocol:
    def __init__(self, b_base=0.025, alpha=0.3, initial_price=100.0):
        self.price = initial_price
        self.ema_p = initial_price
        self.b_base = b_base   # DNA rynku (np. 0.025 dla gazu)
        self.alpha = alpha     # Smoothing factor
        self.last_a = 100.0    # Ostatnia znana kotwica

    def calculate_b_adj(self, projected_p, anchor_a):
        """
        Formuła: b_adj = b_base / ((1 + |P-a|/a)^2 * (1 + |P - EMA_p|))
        Im większy mianownik, tym mniejsze b_adj -> większe tarcie.
        """
        boundary_friction = (1 + abs(projected_p - anchor_a) / anchor_a)**2
        momentum_friction = 1 + abs(projected_p - self.ema_p)
        
        b_adj = self.b_base / (boundary_friction * momentum_friction)
        return b_adj

    def execute_trade(self, delta_s, anchor_a):
        """
        Implementacja Momentum Engine: BSEI_t = BSEI_t-1 * e^(b_adj * delta_s)
        """
        # 1. Wyznaczenie P (Projected Price) - prosta estymacja przed nałożeniem tarcia
        p_guess = self.price * math.exp(self.b_base * delta_s)
        
        # 2. Obliczenie b_adj na podstawie P
        b_adj = self.calculate_b_adj(p_guess, anchor_a)
        
        # 3. Finalna egzekucja
        new_price = self.price * math.exp(b_adj * delta_s)
        
        # 4. Aktualizacja Momentum Brake (EMA_P)
        self.ema_p = (self.alpha * new_price) + (1 - self.alpha) * self.ema_p
        
        self.price = round(new_price, 4)
        return self.price, b_adj

# --- SCENARIUSZ TESTOWY ---
if __name__ == "__main__":
    # Inicjalizacja: Rynek o średniej płynności (b_base = 0.025)
    bsei = BSEIProtocol(b_base=0.025, alpha=0.3)
    anchor = 100.0  # Weighted Anchor ustalony przez BSTZ
    
    # Symulacja: Seria transakcji (Kupno/Sprzedaż)
    # Delta S > 0 (Kupno), Delta S < 0 (Sprzedaż)
    market_flow = [10, 10, 50, -20, 100, -150] 

    print(f"--- Stress Test BSEI (Anchor: {anchor}) ---")
    print(f"{'Operacja':<10} | {'Delta S':<10} | {'Cena BSEI':<12} | {'b_adj (Friction)':<15}")
    print("-" * 60)

    for ds in market_flow:
        op = "KUPNO" if ds > 0 else "SPRZEDAŻ"
        price, b_adj = bsei.execute_trade(ds, anchor)
        print(f"{op:<10} | {ds:<10} | {price:<12} | {b_adj:<15.6f}")

    print("\n--- ANALIZA VISCOSITY (Efekt Lepkości) ---")
    print(f"Finalne EMA_P (Momentum Brake): {round(bsei.ema_p, 4)}")