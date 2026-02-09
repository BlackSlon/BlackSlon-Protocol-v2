'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// Definicja typów dla TypeScripta
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

export default function TerminalPage() {
    const [activeTab, setActiveTab] = useState<string>('power');
    const [prices, setPrices] = useState<PricesState>({
        power: [
            { country: 'DE', index: 'BS-E-DE', price: 9.15, role: 'Anchor', oi: 1245000 },
            { country: 'PL', index: 'BS-E-PL', price: 10.21, role: 'Coal Base', oi: 890000 },
            { country: 'FR', index: 'BS-E-FR', price: 7.16, role: 'Nuclear Base', oi: 2100000 },
            { country: 'RO', index: 'BS-E-RO', price: 9.14, role: 'Strong Flow', oi: 180000 },
            { country: 'NO', index: 'BS-E-NO', price: 8.36, role: 'Hydro', oi: 1100000 },
            { country: 'BG', index: 'BS-E-BG', price: 10.54, role: 'Balkan Entry', oi: 220000 },
            { country: 'GB', index: 'BS-E-GB', price: 9.31, role: 'Island Market', oi: 95000 },
            { country: 'HU', index: 'BS-E-HU', price: 10.62, role: 'CEE Hub', oi: 450000 },
            { country: 'IT', index: 'BS-E-IT', price: 10.93, role: 'South Demand', oi: 750000 }
        ],
        nat_gas: [
            { country: 'NL', index: 'BS-G-NL', price: 28.50, role: 'EU Benchmark', oi: 5600000 },
            { country: 'PL', index: 'BS-G-PL', price: 31.20, role: 'Growth', oi: 1200000 },
            { country: 'UA', index: 'BS-G-UA', price: 34.10, role: 'Storage', oi: 8900000 },
            { country: 'IT', index: 'BS-G-IT', price: 35.45, role: 'South Demand', oi: 750000 },
            { country: 'UK', index: 'BS-G-UK', price: 27.90, role: 'Island Market', oi: 420000 },
            { country: 'TR', index: 'BS-G-TR', price: 36.80, role: 'Asian Corridor', oi: 310000 },
            { country: 'AT', index: 'BS-G-AT', price: 32.10, role: 'CEE Hub', oi: 640000 },
            { country: 'BG', index: 'BS-G-BG', price: 33.50, role: 'Balkan Entry', oi: 220000 }
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
                <Link href="/" style={{ width: '32px', height: '32px', border: '2px solid #fff', backgroundColor: '#000', display: 'block' }}></Link>
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