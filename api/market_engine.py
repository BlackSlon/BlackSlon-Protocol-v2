from http.server import BaseHTTPRequestHandler
import json
import math

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        # Konfiguracja 8 rynków z Twoją kalibracją b_base
        MARKETS = {
            "BLSN-E-DE": {"name": "Power DE", "b_base": 0.005},
            "BLSN-E-NO": {"name": "Power Nordic", "b_base": 0.008},
            "BLSN-E-PL": {"name": "Power PL", "b_base": 0.015},
            "BLSN-E-FR": {"name": "Power FR", "b_base": 0.012},
            "BLSN-G-NL": {"name": "Gas NL", "b_base": 0.010},
            "BLSN-G-DE": {"name": "Gas DE", "b_base": 0.012},
            "BLSN-G-PL": {"name": "Gas PL", "b_base": 0.030},
            "BLSN-G-BG": {"name": "Gas BG", "b_base": 0.045},
        }

        # Symulowane dane z Wyroczni (Oracles)
        # W przyszłości tu będzie połączenie z realnym API giełdowym
        mock_raw = {"spot": 100, "fm": 102, "fq": 105, "cal": 110}
        
        results = {}
        for mid, cfg in MARKETS.items():
            # 1. Raw Anchor (Wagi: 10/40/25/25)
            raw_a = (mock_raw['spot'] * 0.10 + mock_raw['fm'] * 0.40 + 
                     mock_raw['fq'] * 0.25 + mock_raw['cal'] * 0.25)
            
            # 2. Weighted Anchor (Inercja 50/25/25)
            # Na potrzeby API: uproszczona inercja (wersja pełna wymaga bazy danych)
            weighted_a = round(raw_a, 2)
            
            # 3. Korytarz BSTZ (+/- 10%)
            low, high = round(weighted_a * 0.9, 2), round(weighted_a * 1.1, 2)
            
            results[mid] = {
                "name": cfg["name"],
                "weighted_anchor": weighted_a,
                "bsei_price": weighted_a, # Startujemy od ceny kotwicy
                "b_base": cfg["b_base"],
                "corridor": {"low": low, "high": high}
            }

        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(results).encode())
        return