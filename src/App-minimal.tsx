function App() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f3f4f6',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          color: '#1f2937',
          marginBottom: '1rem'
        }}>
          🎉 Sistema de Inventarios
        </h1>
        <p style={{
          color: '#6b7280',
          marginBottom: '2rem'
        }}>
          Frontend funcionando correctamente
        </p>
        
        {/* Simulación de botones */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <button style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '0.75rem 1rem',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            📦 Cargar Productos
          </button>
          <button style={{
            backgroundColor: '#10b981',
            color: 'white',
            padding: '0.75rem 1rem',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            📊 Cargar Stock
          </button>
          <button style={{
            backgroundColor: '#8b5cf6',
            color: 'white',
            padding: '0.75rem 1rem',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            💰 Cargar Ventas
          </button>
        </div>
        
        <div style={{
          backgroundColor: '#f9fafb',
          padding: '1rem',
          borderRadius: '4px',
          border: '1px solid #e5e7eb'
        }}>
          <p style={{
            fontSize: '0.875rem',
            color: '#374151',
            margin: '0'
          }}>
            ✅ React funcionando<br/>
            ✅ Frontend cargado<br/>
            ✅ Listo para conectar backend
          </p>
        </div>
      </div>
    </div>
  )
}

export default App