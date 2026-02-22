// engine.js - Serce protokołu BlackSlon Settlement Zone (BSZ)

class BlackSlonEngine {
    constructor(b_base = 0.0001, ema_alpha = 0.2) {
        this.b_base = b_base;
        this.ema_alpha = ema_alpha;
        this.current_ema = null;
    }

    // Obliczanie hybrydowej kotwicy (50/25/25)
    calculateAnchor(t1, t2, t3) {
        return (t1 * 0.50) + (t2 * 0.25) + (t3 * 0.25);
    }

    // Główny wzór na Stabilizer b (Logarytm + EMA)
    calculateAdaptiveB(P, anchor, emaP) {
        const deviation = Math.abs(P - anchor) / anchor;
        const volatility = Math.abs(P - emaP);
        
        // Nasz mianownik: (1+dev)^2 * (1+vol)
        const denominator = Math.pow(1 + deviation, 2) * (1 + volatility);
        return this.b_base / denominator;
    }

    // Aktualizacja EMA (wywoływana przy każdej transakcji)
    updateEMA(newP) {
        if (this.current_ema === null) {
            this.current_ema = newP;
        } else {
            this.current_ema = (newP * this.ema_alpha) + (this.current_ema * (1 - this.ema_alpha));
        }
        return this.current_ema;
    }

    // Wyliczanie nowej ceny z uwzględnieniem BSZ (+/- 10%)
    getNextPrice(anchor, b_adj, liquidityS) {
        let p = anchor * Math.exp(b_adj * liquidityS);
        
        // Sztywne widełki BSZ
        const maxP = anchor * 1.10;
        const minP = anchor * 0.90;
        
        return Math.max(minP, Math.min(maxP, p));
    }
}

// Eksportujemy do użycia w przeglądarce
window.BSZ_Engine = new BlackSlonEngine();