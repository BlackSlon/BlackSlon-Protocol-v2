import datetime
import calendar

class BSTZProtocol:
    def __init__(self):
        self.anchor_history = []
        # Oficjalne wagi: Spot (10%), Front Month (40%), Front Quarter (25%), Calendar (25%)
        self.weights = {"spot": 0.10, "fm": 0.40, "fq": 0.25, "cal": 0.25}

    def _get_adr_weights(self, date):
        """Asymptotic Daily Rebalancing (ADR) - płynne przejście między kontraktami"""
        day = date.day
        days_in_month = calendar.monthrange(date.year, date.month)[1]
        adr_map = {}
        
        # Okno ADR dla Front Month (ostatnie 12 dni miesiąca)
        adr_start_day = days_in_month - 12
        if day <= adr_start_day:
            adr_map['fm_m1'], adr_map['fm_m2'] = 1.0, 0.0
        else:
            step = (day - adr_start_day) / 12
            adr_map['fm_m1'], adr_map['fm_m2'] = 1.0 - step, step
        return adr_map

    def calculate_raw_anchor(self, prices, date):
        """Krok 1: Surowy impuls rynkowy (Raw Anchor â)"""
        adr = self._get_adr_weights(date)
        
        # Obliczenie komponentów
        fm_val = (prices['m1'] * adr['fm_m1'] + prices['m2'] * adr['fm_m2']) * self.weights['fm']
        fq_val = prices['q1'] * self.weights['fq']
        cal_val = prices['n1'] * self.weights['cal']
        spot_val = prices['spot'] * self.weights['spot']
        
        return spot_val + fm_val + fq_val + cal_val

    def get_weighted_anchor(self, raw_anchor):
        """Krok 2: Filtr 50/25/25 wyliczający stabilną kotwicę (Weighted Anchor a)"""
        if len(self.anchor_history) < 3:
            # Inicjalizacja historii przy pierwszym uruchomieniu
            self.anchor_history.insert(0, raw_anchor)
            return raw_anchor
        
        # Formuła inercji: a_Today = (0.50 * a_T-1) + (0.25 * a_T-2) + (0.25 * a_T-3)
        a_t1, a_t2, a_t3 = self.anchor_history[0], self.anchor_history[1], self.anchor_history[2]
        weighted_a = (0.50 * a_t1) + (0.25 * a_t2) + (0.25 * a_t3)
        
        # Aktualizacja kolejki (historia ostatnich 3 dni)
        self.anchor_history.insert(0, weighted_a)
        if len(self.anchor_history) > 3: 
            self.anchor_history.pop()
            
        return round(weighted_a, 4)

# --- URUCHOMIENIE TESTU ---
if __name__ == "__main__":
    bstz = BSTZProtocol()
    start_date = datetime.date(2026, 3, 20)
    
    # Dane testowe: FM M1 jest tani (90), a M2 drogi (130). Testujemy wygasanie kontraktu.
    market_prices = {'spot': 100, 'm1': 90, 'm2': 130, 'q1': 110, 'n1': 105}
    
    print(f"{'Data':<12} | {'Raw Anchor':<15} | {'Weighted Anchor':<18} | {'BSTZ Range (±10%)'}")
    print("-" * 85)

    for i in range(12):
        curr_date = start_date + datetime.timedelta(days=i)
        raw_val = bstz.calculate_raw_anchor(market_prices, curr_date)
        weighted_val = bstz.get_weighted_anchor(raw_val)
        
        low, high = weighted_val * 0.9, weighted_val * 1.1
        print(f"{curr_date.strftime('%Y-%m-%d'):<12} | {raw_val:<15.2f} | {weighted_val:<18.2f} | {low:.2f} - {high:.2f}")