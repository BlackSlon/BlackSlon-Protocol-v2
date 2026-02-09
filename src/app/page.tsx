// Wklej to w miejscu, gdzie wcześniej był przycisk "VIEW INDEXES"
<div style={{ 
  display: 'flex', 
  flexDirection: 'column', 
  alignItems: 'center', 
  gap: '40px',
  marginTop: '20px' 
}}>
  {/* LOGO BLACKSLON */}
  <div style={{ fontSize: '48px', fontWeight: 'bold', letterSpacing: '8px', color: '#fff' }}>
    BLACKSLON
  </div>

  {/* SIATKA 5 KWADRATÓW */}
  <div style={{ 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
    gap: '20px', 
    width: '100%', 
    maxWidth: '900px',
    padding: '20px'
  }}>
    
    {/* ŻÓŁTY - BSEI */}
    <div onClick={() => window.scrollTo({top: 800, behavior: 'smooth'})} style={squareStyle('#FFD700', '#000')}>
      <span style={{fontWeight: 'bold'}}>BSEI</span>
      <span style={{fontSize: '12px', textAlign: 'center'}}>Indexes Terminal</span>
    </div>

    {/* CZERWONY - ARCHITECTURE */}
    <div style={squareStyle('#FF4136', '#fff')}>
      <span style={{fontWeight: 'bold', textAlign: 'center'}}>Broken Market Architecture</span>
    </div>

    {/* ZIELONY - MANIFESTO */}
    <div style={squareStyle('#2ECC40', '#fff')}>
      <span style={{fontWeight: 'bold'}}>Manifesto</span>
    </div>

    {/* NIEBIESKI - MATRIX */}
    <div style={squareStyle('#0074D9', '#fff')}>
      <span style={{fontWeight: 'bold', textAlign: 'center'}}>Matrix of BS Events</span>
    </div>

    {/* BIAŁY - WHITE PAPER */}
    <div style={squareStyle('#FFFFFF', '#000')}>
      <span style={{fontWeight: 'bold'}}>White Paper</span>
    </div>

  </div>
</div>

// DODAJ TĘ FUNKCJĘ POMOCNICZĄ NA DOLE PLIKU LUB NAD KOMPONENTEM
const squareStyle = (bgColor: string, textColor: string) => ({
  backgroundColor: bgColor,
  color: textColor,
  height: '150px',
  display: 'flex',
  flexDirection: 'column' as 'column',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '12px',
  cursor: 'pointer',
  padding: '15px',
  transition: 'transform 0.2s',
  boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
  border: 'none'
});