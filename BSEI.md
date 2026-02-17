# 🐘 BLACKSLON SETTLEMENT ZONE (BSZ)
## Technical Specification & Index Architecture (2026)

**Official Assets:** `BLSN-G-PL`, `BLSN-E-PL`  
**Market Identifier:** `BlackSlone Energy Index (BSEI)`  
**Compliance:** ART (Asset-Referenced Tokens) under MiCA  
**Principle:** 90% RWA Floor + 10% Dynamic Corridor

---

### 1. The Core Formula (BTZ-Base)
Wzór wyliczający **wartość godziwą (Fair Value)** zabezpieczenia opartego na Real-World Assets (RWA). Stanowi on fundament i "punkt zero" dla korytarza cenowego.

$$BTZ = \sum_{i=1}^{n} (Weight_{i} \times AssetPrice_{i}) \times \text{Stabilizer } b$$

> **Note:** **Liquidty** w tym **protocol** jest bezpośrednio powiązana z fizycznymi dostawami energii od partnerów (StoneX, Trafigura).

---

### 2. BlackSlone Energy Index (BSEI)
Wzór wyliczający cenę transakcyjną wewnątrz aplikacji. To jest "Index Price", którym handlują gracze/użytkownicy w ramach korytarza $\pm 10\%$.

$$BSEI = a_{Today} \cdot e^{b_{adj} \cdot S}$$

* **$a_{Today}$**: Wartość bazowa pochodząca bezpośrednio z wzoru **BTZ =** (Fundament).
* **$e^{b \cdot S}$**: Silnik Bonding Curve reagujący na popyt wewnętrzny i podaż.
* **Constraint**: Algorytm wymusza, aby $BSEI$ zawsze mieścił się w przedziale $[0.9 \cdot BTZ, 1.1 \cdot BTZ]$.

---

### 3. Segment Management & Rebalancing Logic

| Segment | Weight | Model Name | Rebalancing Strategy |
| :--- | :--- | :--- | :--- |
| **CAL** | 25% | **The Dormant Year** | **Stage 1 (Jan-Jun):** 100% Cal n+1. **Stage 2 (Jul-Dec):** Weekly ADR shift to n+2 + "Safe Fuse". |
| **FQ** | 25% | **The Rolling Window** | Podział na FQ1 i FQ2. Weekly ADR w 2. i 3. miesiącu kwartału. FQ3/FQ4 ignorowane. |
| **FM** | Variable | **Front Month** | **Daily ADR** aktywowane wyłącznie w ostatnich 10-12 dniach miesiąca (FM). |

---

### 4. Stability & Security Mechanisms

* **Asymptotic Daily Rebalancing (ADR):** Wygładza przejścia między kontraktami, eliminując "klify" na indeksie **BSEI**.
* **Stabilizer b:** Hybryda Logarithmic b oraz EMA, chroniąca **Liquidty** przed atakami spekulacyjnymi.
* **Safe Fuse:** Blokada ADR w przypadku braku płynności na kontraktach Cal n+2.

---

### 5. Strategic Game Mechanics (Gamified RWA)
* **Popyt na BaSe:** Trzymanie (staking) BaSe zwiększa siłę nabywczą gracza i pozwala na handel na **BSEI** z niższym spreadem.
* **Arbitrage Signaling:** Gdy $BSEI$ dotyka granicy $+10\%$, **protocol** generuje sygnały dla arbitrów w celu przywrócenia równowagi względem **BTZ**.
* **Interconnectors:** Gracze opłacają przesył między krajami w tokenach, co generuje stały obieg i popyt na aktywa.



# 🐘 BLACKSLON SETTLEMENT ZONE (BSZ)
## Technical Specification & Integrated Index Logic (2026)

**Official Assets:** `BLSN-G-PL`, `BLSN-E-PL`  
**Market Identifier:** `BlackSlone Energy Index (BSEI)`  
**Compliance:** ART (Asset-Referenced Tokens) under MiCA  
**Risk Model:** 90% RWA Floor + 10% Dynamic Trading Corridor

---

### 1. The Core Formula (BTZ-Base)
Wzór wyliczający **wartość godziwą (Fair Value)** zabezpieczenia (BaSe). To jest "kotwica" całego systemu.

$$BTZ = \sum_{i=1}^{n} (Weight_{i} \times AssetPrice_{i}) \times \text{Stabilizer } b$$

---

### 2. BlackSlone Energy Index (BSEI) & Armored Stabilizer
Cena transakcyjna (IPT) poruszająca się w korytarzu $\pm 10\%$. Wykorzystuje model **Progressive Friction** do hamowania spekulacji.

$$BSEI = a_{Today} \cdot e^{b_{adj} \cdot S}$$

#### Zintegrowany Algorytm $b_{adj}$ (Stabilizer b):
Aby zapewnić stabilność **Liquidty**, parametr wrażliwości ($b$) jest dynamicznie redukowany przez trzy filtry:

$$b_{adj} = \frac{b_{base}}{\ln(S + 1) \cdot (1 + \frac{|BTZ - a|}{a})^2 \cdot (1 + |BTZ - EMA_{BTZ}|)}$$

* **$\ln(S + 1)$**: Tłumienie logarytmiczne stresu rynkowego (popytu).
* **$(1 + \frac{|BTZ - a|}{a})^2$**: Kwadratowy opór korytarza (gwałtownie usztywnia cenę przy granicy 10%).
* **$(1 + |BTZ - EMA_{BTZ}|)$**: Filtr zmienności, reagujący na odchylenie od średniej kroczącej.

---

### 3. Segment Management & Rebalancing Logic (ADR)

| Segment | Weight | Model Name | Rebalancing Strategy |
| :--- | :--- | :--- | :--- |
| **CAL** | 25% | **The Dormant Year** | **Stage 1 (Jan-Jun):** 100% Cal n+1. **Stage 2 (Jul-Dec):** Weekly ADR shift to n+2 + "Safe Fuse". |
| **FQ** | 25% | **The Rolling Window** | Podział na FQ1 i FQ2. Weekly ADR w 2. i 3. miesiącu kwartału. |
| **FM** | Variable | **Front Month** | **Daily ADR** aktywowane wyłącznie w ostatnich 10-12 dniach miesiąca. |

---

### 4. Advanced System Safeties

* **Asymptotic Daily Rebalancing (ADR):** Eliminuje skoki cenowe przy rolowaniu kontraktów na indeksie **BSEI**.
* **Safe Fuse (Liquidity Fuse):** Wstrzymuje procesy rebalansingu, jeśli rynek nie dostarcza realnej **Liquidty** na nowych kontraktach.
* **Arbitrage Signal:** Generowany automatycznie, gdy $b_{adj}$ spada poniżej krytycznego progu, co oznacza, że cena $BSEI$ jest „przepompowana” względem fundamentu.

---

### 5. Strategy: Gamified RWA
* **BaSe Staking:** Trzymanie BaSe obniża mianownik we wzorze na $b_{adj}$ dla danego użytkownika, pozwalając mu na handel z mniejszym „tarciem”.
* **Popyt na BaSe:** Zwiększa wartość $BTZ$ (fundamentu), co przesuwa cały korytarz 10% w górę, pozwalając na realny wzrost wartości portfela graczy.



## 2. BlackSlone Energy Index (BSEI) - Global Market Price
Cena transakcyjna (IPT) jest wyliczana globalnie dla wszystkich użytkowników. Algorytm skupia się wyłącznie na stabilizacji korytarza +10% względem fundamentu.

$$BSEI = BTZ \cdot e^{b_{adj} \cdot S}$$

#### Globalny Stabilizator b (Armored Logic):
Parametr wrażliwości ($b_{adj}$) jest identyczny dla każdego zlecenia w systemie, co zapewnia pełną przejrzystość i odporność na manipulacje:

$$b_{adj} = \frac{b_{base}}{\ln(S + 1) \cdot (1 + \frac{|BTZ - a|}{a})^2 \cdot (1 + |BTZ - EMA_{BTZ}|)}$$

* **Standardowy mianownik:** Usunięto modyfikatory lojalnościowe. System traktuje każdy wolumen ($S$) tak samo, nakładając logarytmiczny i kwadratowy opór przy granicach korytarza.

---

## 5. Simplified Economic Model (Fee-Based)
Zamiast skomplikowanej gry, **protocol** stosuje przejrzysty model prowizji. Popyt na BaSe jest generowany przez realne oszczędności finansowe, a nie zmianę mechaniki ceny.

### 5.1 Trading Fees & Staking
| Tier | BaSe Staked | Fee Per Trade | System Role |
| :--- | :--- | :--- | :--- |
| **Public** | 0 | 1.00% | Retail User |
| **Partner** | 5,000 | 0.40% | Liquidity Provider |
| **Institutional** | 50,000 | 0.05% | Arbitrageur |

* **Prowizje:** Są naliczane *po* wyliczeniu ceny BSEI, co czyni silnik transakcyjny lżejszym i szybszym.
* **BaSe Value:** Popyt na BaSe wynika z chęci obniżenia kosztów transakcyjnych (Fee), co nadal "pompuje" wartość fundamentu **BTZ =**.
---

---

def calculate_market_friction(market_name, annual_mwh):
    # Benchmark: rynek, gdzie 100k EUR przesuwa cenę o 0.5%
    benchmark_mwh = 500000000  # np. 500 TWh (Niemcy)
    capacity_factor = annual_mwh / benchmark_mwh
    
    # Podstawowe b_adj skalowane przez pojemność rynku
    return b_base / (log(S + 1) * capacity_factor)

# Przykład użycia:
# Niemcy (DE): shift = 0.5%
# Węgry (HU): shift = 2.1% (bo rynek jest mniejszy)