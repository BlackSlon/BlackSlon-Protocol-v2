## **€BSR** : Skarbiec i "Silnik" Systemu
Skoro IPT ma podłogę w RWA, to co stanowi o wartości €BSR? €BSR to „udział” w całym organizmie protocol.
Wartość €BSR rośnie dzięki trzem filarom:

NAV (Net Asset Value): €BSR jest właścicielem wszystkich nadwyżek w systemie. Jeśli w skarbcu zostaje marża z handlu lub opłaty za hedging, to one podnoszą wartość księgową €BSR.

Użyteczność (Utility): Ludzie kupują go, żeby mieć niższe opłaty i mniejszy depozyt na IPT.



### 6. The BSTZ Power Slider: Collateral & Leverage Logic
Wartość depozytu i wysokość prowizji są ściśle uzależnione od udziału tokena **€BSR** w zabezpieczeniu pozycji. Mechanizm ten stymuluje **Liquidity** i popyt na natywne aktywo **protocol**.    

| €BSR Ratio (%) | Required Margin | Leverage | Trading Fee | Tier Status |
| :--- | :--- | :--- | :--- | :--- |
| **10% (Min)** | **50%** | **1:2.0** | 1.00% | Tourist |
| **25%** | **45%** | **1:2.2** | 0.85% | Resident |
| **50%** | **40%** | **1:2.5** | 0.60% | Professional |
| **75%** | **30%** | **1:3.3** | 0.35% | Expert |
| **100% (Max)** | **25%** | **1:4.0** | **0.20%** | **Energy Whale** |

> **Note:** Wszystkie depozyty są przeliczane na wartość eEURO w momencie otwarcia transakcji. Krótka sprzedaż (Shorting) tokena €BSR jest systemowo zablokowana, aby chronić stabilność **BSTZ**.


### 6. The BSTZ Power Slider: Long vs Short Comparison
Wymagany depozyt (Margin) jest uzależniony od kierunku transakcji oraz udziału tokena **€BSR**. Pozycje krótkie (Short) wymagają 2x większego zabezpieczenia ze względu na wyższe ryzyko systemowe.

| €BSR Ratio (%) | Margin LONG | Margin SHORT | Leverage (L / S) | Trading Fee |
| :--- | :--- | :--- | :--- | :--- |
| **10% (Min)** | **50%** | **100%** | 1:2.0 / 1:1.0 | 1.00% |
| **25%** | **45%** | **90%** | 1:2.2 / 1:1.1 | 0.85% |
| **50%** | **40%** | **80%** | 1:2.5 / 1:1.2 | 0.60% |
| **75%** | **30%** | **60%** | 1:3.3 / 1:1.6 | 0.35% |
| **100% (Max)** | **25%** | **50%** | **1:4.0 / 1:2.0** | **0.20%** |

> **Zasada Liquidity:** Pozycje Short przy minimalnym udziale BaSe (10%) wymagają pełnego pokrycia (100% eEURO), co eliminuje ryzyko niewypłacalności przy gwałtownych skokach cen energii.