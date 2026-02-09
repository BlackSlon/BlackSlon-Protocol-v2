'use client';
import React, { useState } from 'react';
import Link from 'next/link';

export default function TerminalPage() {
  const [activeTab, setActiveTab] = useState('power');

  // Dane przeniesione bezpośrednio z Twojego trading.html
  const powerMarkets = [
    { country: 'DE', index: 'BS-D-DE', price: '762.50', role: 'Logistics' },
    { country: 'PL', index: 'BS-D-PL', price: '735.80', role: 'Import Base' },
    { country: 'FR', index: 'BS-D-FR', price: '768.40', role: 'Refinery' },
    { country: 'IT', index: 'BS-D-IT', price: '772.10', role: 'Med Supply' },
  ];

  const gasMarkets = [
    { country: 'ARA', index: 'BS-GS-ARA', price: '720.00', role: 'Global Hub' },
    { country: 'DE', index: 'BS-GS-DE', price: '742.30', role: 'Consumption' },
    { country: 'PL', index: 'BS-GS-PL', price: '715.40', role: 'Storage' },
  ];

  const currentMarkets = activeTab === 'power' ? powerMarkets : gasMarkets;

  return (
    <main style={{ backgroundColor: '#000', minHeight: '100vh', color: '#fff', fontFamily: 'monospace', padding: '30px' }}>
      
      {/* NAGŁÓWEK Z LOGO */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Link href="/">
            <img src="/BS_image.jpg" alt="Logo" style={{ width: '50px', height: '50px', border: '1px solid #333' }} />
          </Link>
          <h2 style={{ letterSpacing: '2px' }}>BlackSlon Energy Indexes</h2>
        </div>
        <button style={{ backgroundColor: '#fff', color: '#000', border: 'none', padding: '10px 20px', fontWeight: 'bold', cursor: 'pointer' }}>
          CONNECT WALLET
        </button>
      </div>

      {/* PRZEŁĄCZNIKI */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
        <button 
          onClick={() => setActiveTab('power')}
          style={{ backgroundColor: activeTab === 'power' ? '#FFD700' : '#111', color: activeTab === 'power' ? '#000' : '#FFD700', border: '1px solid #FFD700', padding: '10px 20px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          POWER INDEXES
        </button>
        <button 
          onClick={() => setActiveTab('gas')}
          style={{ backgroundColor: activeTab === 'gas' ? '#00FFFF' : '#111', color: activeTab === 'gas' ? '#000' : '#00FFFF', border: '1px solid #00FFFF', padding: '10px 20px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          GASOLINE INDEXES
        </button>
      </div>

      {/* SIATKA KAFELKÓW Z TRADING.HTML */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        {currentMarkets.map((m) => (
          <div key={m.index} style={{ border: '1px solid #222', padding: '20px', backgroundColor: '#050505' }}>
            <div style={{ fontSize: '10px', color: '#666' }}>{m.country} // {m.role}</div>
            <div style={{ color: activeTab === 'power' ? '#FFD700' : '#00FFFF', fontWeight: 'bold', margin: '10px 0' }}>{m.index}</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '15px' }}>{m.price} <span style={{ fontSize: '12px' }}>USD/t</span></div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button style={{ flex: 1, backgroundColor: 'transparent', border: '1px solid #2ECC40', color: '#2ECC40', padding: '5px', fontSize: '10px', cursor: 'pointer' }}>BUY</button>
              <button style={{ flex: 1, backgroundColor: 'transparent', border: '1px solid #FF4136', color: '#FF4136', padding: '5px', fontSize: '10px', cursor: 'pointer' }}>SELL</button>
            </div>
          </div>
        ))}
      </div>

      {/* TWOJA FORMUŁA W STOPCE */}
      <div style={{ marginTop: '50px', borderTop: '1px solid #222', paddingTop: '20px' }}>
        <p style={{ color: '#444' }}>Liquidty Protocol Active // Formula Calibration Mode</p>
        <h3 style={{ margin: '10px 0' }}>P = a · e<sup>(b · S)</sup></h3>
      </div>

    </main>
  );
}