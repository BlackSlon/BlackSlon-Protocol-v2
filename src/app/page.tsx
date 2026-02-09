'use client';
import React from 'react';

export default function Home() {
  return (
    <main style={{ backgroundColor: '#000', minHeight: '100vh', color: '#fff', fontFamily: 'monospace' }}>
      
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        minHeight: '85vh',
        gap: '25px',
        padding: '20px' 
      }}>
        
        {/* LOGO BLACKSLON - Ścieżka musi pasować do pliku w folderze public */}
        <div style={{ width: '130px', height: '130px' }}>
          <img 
            src="/BS_image.jpg" 
            alt="BlackSlon Logo" 
            style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
          />
        </div>

        <h1 style={{ fontSize: '42px', fontWeight: 'bold', letterSpacing: '12px', margin: '0' }}>
          BLACKSLON
        </h1>

        {/* SIATKA 5 MNIEJSZYCH KWADRATÓW (115px) */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(115px, 1fr))', 
          gap: '12px', 
          width: '100%', 
          maxWidth: '750px' 
        }}>
          
          <div 
            onClick={() => document.getElementById('indexes-section')?.scrollIntoView({ behavior: 'smooth' })} 
            style={squareStyle('#FFD700', '#000')}
          >
            BlackSlon Energy Indexes
          </div>

          <div style={squareStyle('#FF4136', '#fff')}>Broken Market Architecture</div>
          <div style={squareStyle('#2ECC40', '#fff')}>Manifesto</div>
          
          <div style={squareStyle('#0074D9', '#fff')}>
            Matrix of BlackSlon Events
          </div>

          <div style={squareStyle('#FFFFFF', '#000')}>White Paper</div>
        </div>
      </div>

      {/* SEKCJA Z TERMINALEM */}
      <div id="indexes-section" style={{ paddingTop: '80px' }}>
         {/* Tu zostaje Twój dotychczasowy kod z Liquidty protocol */}
      </div>

    </main>
  );
}

const squareStyle = (bgColor: string, textColor: string) => ({
  backgroundColor: bgColor,
  color: textColor,
  height: '115px', // Zmniejszony rozmiar zgodnie z prośbą
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '8px',
  cursor: 'pointer',
  textAlign: 'center' as 'center',
  fontWeight: 'bold' as 'bold',
  fontSize: '10px',
  padding: '10px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
  border: 'none',
  transition: 'transform 0.2s'
});