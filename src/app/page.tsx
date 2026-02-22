'use client';
import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <main style={{ backgroundColor: '#000', minHeight: '100vh', color: '#fff' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: '20px', padding: '20px' }}>
        
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '64px', fontWeight: '200', letterSpacing: '6px', margin: 0 }}>BlackSlon</h1>
          <p style={{ color: '#888', fontSize: '20px', letterSpacing: '4px', margin: '5px 0 20px 0', fontWeight: '200' }}>Energy Indexes</p>
        </div>

        <div style={{ width: '300px', height: '300px', marginBottom: '40px' }}>
          <img src="/BS_image.jpg" alt="BlackSlon Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', width: '100%', maxWidth: '600px' }}>
          <div style={squareStyle('#FFD700', '#000')} onClick={(e) => { e.preventDefault(); alert('BlackSlon Energy Indexes - coming soon!'); }}>BlackSlon Energy Indexes</div>
          <div style={squareStyle('#FF4136', '#fff')} onClick={(e) => { e.preventDefault(); alert('Broken Market Architecture - coming soon!'); }}>Broken Market Architecture</div>
          <div style={squareStyle('#2ECC40', '#fff')} onClick={(e) => { e.preventDefault(); alert('Manifesto - coming soon!'); }}>Manifesto</div>
          <div style={squareStyle('#0074D9', '#fff')} onClick={(e) => { e.preventDefault(); alert('Matrix of BlackSlon Events - coming soon!'); }}>Matrix of BlackSlon Events</div>
        </div>
      </div>
    </main>
  );
}

const squareStyle = (bgColor: string, textColor: string) => ({
  backgroundColor: bgColor, color: textColor, width: '80px', height: '80px',
  display: 'flex', justifyContent: 'center', alignItems: 'center',
  borderRadius: '0px', cursor: 'pointer', textAlign: 'center' as 'center',
  fontWeight: 'bold' as 'bold', fontSize: '8px', padding: '5px', border: 'none'
});