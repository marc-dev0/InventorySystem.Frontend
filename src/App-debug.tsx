import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'

// Componente de Login simple para debug
const SimpleLogin = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Sistema de Inventarios
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Inicia sesión en tu cuenta
          </p>
        </div>
        <form className="mt-8 space-y-6">
          <div>
            <input
              type="text"
              placeholder="Nombre de usuario"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Contraseña"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Iniciar sesión
          </button>
        </form>
      </div>
    </div>
  )
}

// Dashboard simple para debug
const SimpleDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Sistema de Inventarios</h1>
        </div>
      </header>
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card de Productos */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">📦 Productos</h3>
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
              Cargar Excel de Productos
            </button>
          </div>
          
          {/* Card de Stock */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">📊 Stock</h3>
            <input 
              type="text" 
              placeholder="Código de tienda" 
              className="w-full mb-3 px-3 py-2 border rounded"
            />
            <button className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">
              Cargar Excel de Stock
            </button>
          </div>
          
          {/* Card de Ventas */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">💰 Ventas</h3>
            <input 
              type="text" 
              placeholder="Código de tienda" 
              className="w-full mb-3 px-3 py-2 border rounded"
            />
            <button className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700">
              Cargar Excel de Ventas
            </button>
          </div>
        </div>
        
        {/* Sección de trabajos */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">⚙️ Estados de Importación</h3>
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-gray-600">No hay trabajos de importación en progreso</p>
          </div>
        </div>
        
        {/* Info de tecnología */}
        <div className="mt-6 bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-900">🚀 Sistema Funcionando</h4>
          <p className="text-blue-800 text-sm">
            Frontend React + Backend .NET con ClosedXML nativo
          </p>
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<SimpleLogin />} />
          <Route path="/" element={<SimpleDashboard />} />
          <Route path="*" element={<SimpleLogin />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App