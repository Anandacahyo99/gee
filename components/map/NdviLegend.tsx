// components/map/NdviLegend.tsx
export default function NdviLegend() {
    const items = [
      { color: '#056201', label: 'Sangat Subur (> 0.8)' },
      { color: '#207401', label: 'Tebu Sehat (0.6 - 0.8)' },
      { color: '#FCD163', label: 'Vegetasi Rendah (0.4 - 0.6)' },
      { color: '#CE7E45', label: 'Lahan Terbuka (< 0.4)' },
    ];
  
    return (
      <div style={{
        position: 'absolute', bottom: '20px', right: '20px', 
        backgroundColor: 'white', padding: '10px', borderRadius: '5px',
        zIndex: 1000, boxShadow: '0 0 10px rgba(0,0,0,0.2)', fontSize: '12px'
      }}>
        <h4 style={{ margin: '0 0 10px 0' }}>Tingkat Kesehatan Lahan</h4>
        {items.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
            <div style={{ width: '20px', height: '10px', backgroundColor: item.color, marginRight: '10px' }}></div>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    );
  }