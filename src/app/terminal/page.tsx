'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// Definicja typów dla TypeScripta
interface MarketComponents {
    fw: number;
    fm: number;
    fq: number;
    fy: number;
}

interface MarketData {
    country: string;
    index: string;
    price: number;
    role: string;
    oi: number;
}

interface PricesState {
    [key: string]: MarketData[];
}

// Funkcja do obliczania wagi ceny
const calculateWeightPrice = (c: MarketComponents) => {
    return (c.fw * 0.1) + (c.fm * 0.4) + (c.fq * 0.25) + (c.fy * 0.25);
};

export default function TerminalPage() {
    const [activeTab, setActiveTab] = useState<string>('power');
    const [prices, setPrices] = useState<PricesState>({
        power: [
            { country: 'DE', index: 'BS-E-DE', price: calculateWeightPrice({ fw: 85.4, fm: 85.4, fq: 85.4, fy: 85.4 }) / 10, role: 'Anchor', oi: 1245000 },
            { country: 'PL', index: 'BS-E-PL', price: calculateWeightPrice({ fw: 101.2, fm: 101.2, fq: 101.2, fy: 101.2 }) / 10, role: 'Coal Base', oi: 890000 },
            { country: 'FR', index: 'BS-E-FR', price: calculateWeightPrice({ fw: 71.6, fm: 71.6, fq: 71.6, fy: 71.6 }) / 10, role: 'Nuclear Base', oi: 2100000 },
            { country: 'RO', index: 'BS-E-RO', price: calculateWeightPrice({ fw: 91.4, fm: 91.4, fq: 91.4, fy: 91.4 }) / 10, role: 'Strong Flow', oi: 180000 },
            { country: 'NO', index: 'BS-E-NO', price: calculateWeightPrice({ fw: 83.6, fm: 83.6, fq: 83.6, fy: 83.6 }) / 10, role: 'Hydro', oi: 1100000 },
            { country: 'BG', index: 'BS-E-BG', price: calculateWeightPrice({ fw: 105.4, fm: 105.4, fq: 105.4, fy: 105.4 }) / 10, role: 'Balkan Entry', oi: 220000 },
            { country: 'GB', index: 'BS-E-GB', price: calculateWeightPrice({ fw: 92.0, fm: 92.0, fq: 92.0, fy: 92.0 }) / 10, role: 'Island Market', oi: 95000 },
            { country: 'HU', index: 'BS-E-HU', price: calculateWeightPrice({ fw: 106.2, fm: 106.2, fq: 106.2, fy: 106.2 }) / 10, role: 'CEE Hub', oi: 450000 },
            { country: 'IT', index: 'BS-E-IT', price: calculateWeightPrice({ fw: 109.3, fm: 109.3, fq: 109.3, fy: 109.3 }) / 10, role: 'South Demand', oi: 750000 }
        ],
        nat_gas: [
            { country: 'NL', index: 'BS-G-NL', price: calculateWeightPrice({ fw: 32.8, fm: 32.8, fq: 32.8, fy: 32.8 }) / 10, role: 'EU Benchmark', oi: 5600000 },
            { country: 'PL', index: 'BS-G-PL', price: calculateWeightPrice({ fw: 31.2, fm: 31.2, fq: 31.2, fy: 31.2 }) / 10, role: 'Growth', oi: 1200000 },
            { country: 'UA', index: 'BS-G-UA', price: calculateWeightPrice({ fw: 34.1, fm: 34.1, fq: 34.1, fy: 34.1 }) / 10, role: 'Storage', oi: 8900000 },
            { country: 'IT', index: 'BS-G-IT', price: calculateWeightPrice({ fw: 35.45, fm: 35.45, fq: 35.45, fy: 35.45 }) / 10, role: 'South Demand', oi: 750000 },
            { country: 'UK', index: 'BS-G-UK', price: calculateWeightPrice({ fw: 27.9, fm: 27.9, fq: 27.9, fy: 27.9 }) / 10, role: 'Island Market', oi: 420000 },
            { country: 'TR', index: 'BS-G-TR', price: calculateWeightPrice({ fw: 36.8, fm: 36.8, fq: 36.8, fy: 36.8 }) / 10, role: 'Asian Corridor', oi: 310000 },
            { country: 'AT', index: 'BS-G-AT', price: calculateWeightPrice({ fw: 38.6, fm: 38.6, fq: 38.6, fy: 38.6 }) / 10, role: 'CEE Hub', oi: 640000 },
            { country: 'BG', index: 'BS-G-BG', price: calculateWeightPrice({ fw: 32.5, fm: 32.5, fq: 32.5, fy: 32.5 }) / 10, role: 'Balkan Entry', oi: 220000 }
        ]
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setPrices(prev => {
                const next = { ...prev };
                const vol = 0.01; // Stała niska wolatylność dla energii i gazu
                if (next[activeTab]) {
                    next[activeTab] = next[activeTab].map(m => {
                        const rawNewPrice = m.price + (Math.random() - 0.5) * vol;
                        return {
                            ...m, 
                            price: +(Math.max(0.01, rawNewPrice)).toFixed(2),
                            oi: Math.max(0, m.oi + Math.floor((Math.random() - 0.4) * 100))
                        }
                    });
                }
                return next;
            });
        }, 3000);
        return () => clearInterval(interval);
    }, [activeTab]);

    const getAccent = () => {
        return activeTab === 'power' ? '#FFD700' : '#87CEEB';
    };

    const displayPrice = (val: number) => val.toFixed(2);

    const calculateBenchmarkValue = () => {
        const currentPrices = prices[activeTab];
        if (!currentPrices) return "0.00";
        const avg = currentPrices.reduce((a, b) => a + b.price, 0) / currentPrices.length;
        return avg.toFixed(2);
    };

    return (
        <main style={{ backgroundColor: '#000', minHeight: '100vh', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
                <Link href="/" style={{ width: '32px', height: '32px', border: '2px solid #fff', backgroundColor: '#000', display: 'block' }}>
                    <img src="/BS_image.jpg" alt="BlackSlon Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </Link>
            </div>

            <div style={{ background: '#000', color: '#fff', fontFamily: 'monospace', padding: '15px', border: `2px solid ${getAccent()}`, maxWidth: '1000px', margin: 'auto', transition: 'border-color 0.5s ease' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #333', marginBottom: '20px', paddingBottom: '10px' }}>
                    <div>
                        <div style={{ fontSize: '18px', fontWeight: 'bold' }}>BlackSlon Energy Indexes</div>
                        <div style={{ fontSize: '9px', color: '#666' }}>Zero Spread | Zero Expiry | 24/7 **Liquidty** protocol</div>
                    </div>
                    <button style={{ background: '#fff', color: '#000', border: '1px solid #fff', padding: '5px 10px', fontSize: '9px', cursor: 'pointer', fontWeight: 'bold' }}>CONNECT WALLET</button>
                </div>

                {/* PRZEŁĄCZNIKI: TYLKO POWER I GAS */}
                <div style={{ display: 'flex', marginBottom: '25px', gap: '4px' }}>
                    <button onClick={() => setActiveTab('power')} style={{ 
                        background: activeTab === 'power' ? '#FFD700' : 'transparent', 
                        color: activeTab === 'power' ? '#000' : '#fff', 
                        border: '1px solid #FFD700', padding: '8px 15px', cursor: 'pointer', fontSize: '9px', fontWeight: 'bold' 
                    }}> BLACKSLON POWER </button>
                    <button onClick={() => setActiveTab('nat_gas')} style={{ 
                        background: activeTab === 'nat_gas' ? '#87CEEB' : 'transparent', 
                        color: activeTab === 'nat_gas' ? '#000' : '#fff', 
                        border: '1px solid #87CEEB', padding: '8px 15px', cursor: 'pointer', fontSize: '9px', fontWeight: 'bold' 
                    }}> BLACKSLON GAS </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '8px' }}>
                    {(prices[activeTab] || []).map(m => (
                        <div key={m.index} style={{ background: '#050505', padding: '12px', border: '1px solid #1a1a1a' }}>
                            <div style={{ fontSize: '8px', color: '#444' }}>{m.country} // {m.role}</div>
                            <div style={{ fontWeight: 'bold', fontSize: '11px' }}>{m.index}</div>
                            <div style={{ margin: '8px 0' }}>
                                <span style={{ fontSize: '20px', fontWeight: 'bold', color: getAccent() }}>
                                    {displayPrice(m.price)}
                                </span>
                                <span style={{ fontSize: '7px', color: '#444', marginLeft: '3px' }}>€/100 kWh eq</span>
                            </div>
                            <div style={{ display: 'flex', gap: '4px', marginBottom: '10px' }}>
                                <button style={{ flex: 1, background: 'transparent', color: '#00ff88', border: '1px solid #00ff88', padding: '6px 0', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}>BUY</button>
                                <button style={{ flex: 1, background: 'transparent', color: '#ff4444', border: '1px solid #ff4444', padding: '6px 0', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}>SELL</button>
                            </div>
                            <div style={{ borderTop: '1px solid #111', paddingTop: '8px' }}>
                                <div style={{ fontSize: '7px', color: '#444' }}>OPEN INTEREST</div>
                                <div style={{ fontSize: '10px', color: '#fff' }}>{m.oi.toLocaleString()} kWh</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ marginTop: '20px', padding: '20px 10px', border: '2px solid #333', background: '#050505', textAlign: 'center', borderColor: getAccent() }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff' }}>
                            {activeTab.toUpperCase()} BENCHMARK:
                        </span>
                        <span style={{ fontSize: '22px', fontWeight: 'bold', color: getAccent() }}>
                            {calculateBenchmarkValue()}
                        </span>
                        <span style={{ fontSize: '9px', color: '#666' }}>€/100 kWh eq</span>
                    </div>
                </div>
            </div>
        </main>
    );
}