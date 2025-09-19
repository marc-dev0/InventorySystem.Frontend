# 🎨 InventorySystem.Frontend

> Cliente web moderno desarrollado en React 18 + TypeScript para gestión empresarial de inventarios

![React](https://img.shields.io/badge/React-18.3-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![Vite](https://img.shields.io/badge/Vite-7.1-green)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-cyan)

## 📋 Tabla de Contenidos

- [🎯 Descripción](#-descripción)
- [✨ Características](#-características)
- [🚀 Inicio Rápido](#-inicio-rápido)
- [📁 Estructura del Proyecto](#-estructura-del-proyecto)
- [🔧 Tecnologías](#-tecnologías)
- [🎪 Componentes Principales](#-componentes-principales)
- [🛡️ Autenticación](#️-autenticación)
- [📊 Gestión de Estado](#-gestión-de-estado)
- [🎨 Estilos y UI](#-estilos-y-ui)
- [📱 Responsive Design](#-responsive-design)
- [🧪 Testing](#-testing)
- [🚀 Build y Deploy](#-build-y-deploy)

## 🎯 Descripción

Aplicación web moderna que proporciona una interfaz intuitiva para la gestión completa de inventarios empresariales. Diseñada específicamente para tiendas con múltiples ubicaciones que necesitan:

- **Dashboard centralizado** con métricas en tiempo real
- **Gestión de productos** con stock multi-tienda
- **Importación de datos** mediante drag & drop
- **Autenticación segura** con roles de usuario
- **Interfaz responsive** para escritorio y mobile

### 🎪 Características Especiales

- **SPA (Single Page Application)** - Navegación fluida sin recargas
- **TypeScript** - Tipado fuerte para mejor desarrollo
- **Componentes reutilizables** - Arquitectura modular
- **Estado centralizado** - Gestión eficiente de datos
- **UI/UX moderna** - Diseño intuitivo y profesional

## ✨ Características

### 🏠 Dashboard Principal
- **Métricas en tiempo real** - Stock, ventas, productos
- **Gráficos interactivos** - Visualización de datos
- **Alertas inteligentes** - Stock bajo, importaciones
- **Resumen ejecutivo** - KPIs principales

### 📦 Gestión de Productos
- **CRUD completo** - Crear, leer, actualizar, eliminar
- **Búsqueda avanzada** - Por código, nombre, categoría
- **Filtros dinámicos** - Estado, stock, categoría
- **Paginación inteligente** - Carga eficiente de datos

### 📊 Importación de Datos
- **Drag & Drop** - Arrastrar archivos Excel/CSV
- **Validación en tiempo real** - Errores y advertencias
- **Progreso visual** - Barras de progreso y estados
- **Historial de importaciones** - Tracking completo

### 🏪 Multi-Tienda
- **Selector de tienda** - Cambio de contexto
- **Stock por ubicación** - Inventario específico
- **Transferencias** - Movimientos entre tiendas
- **Reportes por tienda** - Analytics específicos

### 🔐 Seguridad
- **Login/Logout** - Autenticación JWT
- **Roles de usuario** - Admin vs Usuario
- **Rutas protegidas** - Acceso controlado
- **Sesión persistente** - LocalStorage seguro

## 🚀 Inicio Rápido

### 📋 Prerequisites

```bash
# Verificar versiones
node --version  # >= 18.0
npm --version   # >= 9.0
```

### 1️⃣ Instalación

```bash
# Clonar e instalar
git clone <repository-url>
cd InventorySystem.Frontend
npm install
```

### 2️⃣ Configuración

```bash
# Crear archivo de entorno (opcional)
cp .env.example .env.local

# Configurar API URL
VITE_API_URL=http://localhost:5000/api
```

### 3️⃣ Desarrollo

```bash
# Ejecutar en modo desarrollo
npm run dev

# Abrir navegador
open http://localhost:5173
```

### 4️⃣ Build para Producción

```bash
# Compilar para producción
npm run build

# Preview del build
npm run preview
```

## 📁 Estructura del Proyecto

```
InventorySystem.Frontend/
├── 📂 public/                      # 🌐 Assets estáticos
│   ├── 📄 index.html              #   Template HTML
│   └── 📄 favicon.ico             #   Icono de la app
├── 📂 src/                        # 💻 Código fuente
│   ├── 📂 components/             #   🧩 Componentes reutilizables
│   │   ├── DataTable.tsx          #   Tabla de datos con paginación
│   │   ├── FileUpload.tsx         #   Upload de archivos drag&drop
│   │   ├── Pagination.tsx         #   Componente de paginación
│   │   ├── JobStatus.tsx          #   Estado de trabajos en background
│   │   ├── ImportHistory.tsx      #   Historial de importaciones
│   │   ├── PrivateRoute.tsx       #   Protección de rutas
│   │   └── CurrencyDisplay.tsx    #   Formato de monedas
│   ├── 📂 pages/                  #   📄 Páginas principales
│   │   ├── Login.tsx              #   Página de inicio de sesión
│   │   ├── Register.tsx           #   Página de registro
│   │   ├── Dashboard.tsx          #   Dashboard principal
│   │   ├── Products.tsx           #   Gestión de productos
│   │   ├── Stock.tsx              #   Gestión de stock
│   │   └── ImportData.tsx         #   Importación de datos
│   ├── 📂 context/                #   🔄 Contextos de React
│   │   ├── AuthContext.tsx        #   Contexto de autenticación
│   │   └── AppContext.tsx         #   Contexto global de la app
│   ├── 📂 services/               #   🌐 Servicios API
│   │   ├── api.ts                 #   Cliente HTTP base (Axios)
│   │   ├── authService.ts         #   Servicios de autenticación
│   │   ├── productService.ts      #   Servicios de productos
│   │   ├── stockService.ts        #   Servicios de stock
│   │   └── importService.ts       #   Servicios de importación
│   ├── 📂 hooks/                  #   🎣 Custom hooks
│   │   ├── useAuth.ts             #   Hook de autenticación
│   │   ├── useApi.ts              #   Hook para API calls
│   │   ├── usePagination.ts       #   Hook de paginación
│   │   └── useDebounce.ts         #   Hook de debounce
│   ├── 📂 types/                  #   📝 Definiciones TypeScript
│   │   ├── auth.ts                #   Tipos de autenticación
│   │   ├── product.ts             #   Tipos de productos
│   │   ├── stock.ts               #   Tipos de stock
│   │   └── api.ts                 #   Tipos de API responses
│   ├── 📂 utils/                  #   🛠️ Utilidades
│   │   ├── formatters.ts          #   Formateo de datos
│   │   ├── validators.ts          #   Validaciones
│   │   ├── constants.ts           #   Constantes de la app
│   │   └── helpers.ts             #   Funciones helper
│   ├── 📄 App.tsx                 #   Componente raíz
│   ├── 📄 main.tsx                #   Punto de entrada
│   ├── 📄 index.css               #   Estilos globales
│   └── 📄 vite-env.d.ts          #   Tipos de Vite
├── 📄 package.json               # Dependencias y scripts
├── 📄 tsconfig.json              # Configuración TypeScript
├── 📄 vite.config.ts             # Configuración Vite
├── 📄 tailwind.config.js         # Configuración Tailwind
├── 📄 postcss.config.js          # Configuración PostCSS
└── 📄 README.md                  # Esta documentación
```

## 🔧 Tecnologías

### Core Framework
- **React 18.3** - Framework UI con Concurrent Features
- **TypeScript 5.9** - Tipado estático para JavaScript
- **Vite 7.1** - Build tool ultra-rápido
- **React Router 6.26** - Enrutamiento SPA

### Librerías UI/UX
```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-router-dom": "^6.26.1",
  "axios": "^1.11.0"
}
```

### Styling & Design
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **PostCSS** - Procesamiento avanzado de CSS
- **Autoprefixer** - Prefijos CSS automáticos

### Development Tools
```json
{
  "typescript": "^5.9.2",
  "vite": "^7.1.3",
  "@types/react": "^18.3.3",
  "@types/react-dom": "^18.3.0",
  "eslint": "^8.57.0"
}
```

### Build & Tooling
- **ESLint** - Linting de código
- **PostCSS** - Transformaciones CSS
- **TypeScript Compiler** - Verificación de tipos

## 🎪 Componentes Principales

### 🗂️ DataTable Component

```tsx
interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  pagination?: PaginationConfig;
  loading?: boolean;
  onRowClick?: (item: T) => void;
}

// Uso
<DataTable
  data={products}
  columns={productColumns}
  pagination={{ page: 1, pageSize: 20 }}
  loading={isLoading}
/>
```

### 📤 FileUpload Component

```tsx
interface FileUploadProps {
  accept: string;
  onFileSelect: (file: File) => void;
  maxSize?: number;
  disabled?: boolean;
}

// Uso
<FileUpload
  accept=".xlsx,.xls,.csv"
  onFileSelect={handleFileUpload}
  maxSize={10 * 1024 * 1024} // 10MB
/>
```

### 📄 Pagination Component

```tsx
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

// Uso
<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={setCurrentPage}
/>
```

### 🔄 JobStatus Component

```tsx
interface JobStatusProps {
  jobId: string;
  onComplete?: (result: any) => void;
  onError?: (error: string) => void;
}

// Uso
<JobStatus
  jobId={importJobId}
  onComplete={handleImportComplete}
  onError={handleImportError}
/>
```

## 🛡️ Autenticación

### Auth Context

```tsx
interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Provider
<AuthProvider>
  <App />
</AuthProvider>
```

### useAuth Hook

```tsx
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Uso en componentes
const { user, login, logout, isAuthenticated } = useAuth();
```

### Protected Routes

```tsx
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate to="/login" replace />
  );
};
```

### JWT Token Management

```typescript
// Almacenamiento seguro
const setToken = (token: string) => {
  localStorage.setItem('auth_token', token);
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

// Limpieza automática
const removeToken = () => {
  localStorage.removeItem('auth_token');
  delete api.defaults.headers.common['Authorization'];
};
```

## 📊 Gestión de Estado

### API Service Layer

```typescript
// Base API client
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Auto logout en 401
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### Custom Hooks para API

```typescript
// useApi Hook
const useApi = <T>(apiCall: () => Promise<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiCall();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  return { data, loading, error, execute };
};
```

### State Management Pattern

```typescript
// Context + Reducer pattern para estado complejo
interface AppState {
  selectedStore: Store | null;
  notifications: Notification[];
  globalLoading: boolean;
}

const AppContext = createContext<{
  state: AppState;
  dispatch: Dispatch<AppAction>;
} | null>(null);
```

## 🎨 Estilos y UI

### Tailwind Configuration

```javascript
// tailwind.config.js
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        secondary: {
          500: '#6b7280',
          600: '#4b5563',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
```

### Component Styling Pattern

```tsx
// Tailwind classes con variantes
const Button = ({ variant, size, children, ...props }) => {
  const baseClasses = 'font-medium rounded-lg transition-colors';

  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]}`}
      {...props}
    >
      {children}
    </button>
  );
};
```

### Design System

```css
/* Design tokens en CSS custom properties */
:root {
  --color-primary: 59 130 246;
  --color-secondary: 107 114 128;
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}
```

## 📱 Responsive Design

### Breakpoint Strategy

```css
/* Tailwind responsive prefixes */
sm: 640px   /* tablets */
md: 768px   /* small desktop */
lg: 1024px  /* desktop */
xl: 1280px  /* large desktop */
2xl: 1536px /* extra large */
```

### Mobile-First Components

```tsx
// Layout responsivo
const Layout = ({ children }) => (
  <div className="min-h-screen bg-gray-50">
    {/* Header móvil/desktop */}
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <img className="h-8 w-auto" src="/logo.svg" alt="Logo" />
          </div>

          {/* Navigation - hidden on mobile */}
          <nav className="hidden md:flex space-x-8">
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/products">Productos</NavLink>
            <NavLink to="/stock">Stock</NavLink>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-gray-500">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>

    {/* Main content */}
    <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {children}
    </main>
  </div>
);
```

### Responsive Data Tables

```tsx
// DataTable responsivo
const ResponsiveTable = ({ data, columns }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          {columns.map((column) => (
            <th
              key={column.key}
              className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider
                ${column.hiddenOnMobile ? 'hidden md:table-cell' : ''}
              `}
            >
              {column.title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {data.map((item, index) => (
          <tr key={index} className="hover:bg-gray-50">
            {columns.map((column) => (
              <td
                key={column.key}
                className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900
                  ${column.hiddenOnMobile ? 'hidden md:table-cell' : ''}
                `}
              >
                {column.render ? column.render(item) : item[column.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
```

## 🧪 Testing

### Test Structure (Setup recomendado)

```
src/
├── __tests__/           # Tests globales
├── components/
│   ├── DataTable.tsx
│   └── __tests__/
│       └── DataTable.test.tsx
├── pages/
│   ├── Dashboard.tsx
│   └── __tests__/
│       └── Dashboard.test.tsx
└── utils/
    ├── helpers.ts
    └── __tests__/
        └── helpers.test.ts
```

### Testing Stack Recomendado

```json
{
  "devDependencies": {
    "@testing-library/react": "^13.4.0",
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/user-event": "^14.4.3",
    "vitest": "^0.34.0",
    "jsdom": "^22.1.0"
  }
}
```

### Ejemplo de Test

```tsx
// DataTable.test.tsx
import { render, screen } from '@testing-library/react';
import { DataTable } from '../DataTable';

const mockData = [
  { id: 1, name: 'Product 1', price: 10.50 },
  { id: 2, name: 'Product 2', price: 25.00 }
];

const mockColumns = [
  { key: 'name', title: 'Name' },
  { key: 'price', title: 'Price' }
];

describe('DataTable', () => {
  test('renders table with data', () => {
    render(<DataTable data={mockData} columns={mockColumns} />);

    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Product 2')).toBeInTheDocument();
    expect(screen.getByText('$10.50')).toBeInTheDocument();
  });

  test('shows loading state', () => {
    render(<DataTable data={[]} columns={mockColumns} loading={true} />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
```

## 🚀 Build y Deploy

### Development Build

```bash
# Desarrollo con hot reload
npm run dev

# Build de desarrollo
npm run build -- --mode development
```

### Production Build

```bash
# Build optimizado para producción
npm run build

# Analizar bundle size
npm run build -- --analyze

# Preview del build de producción
npm run preview
```

### Optimizaciones de Build

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          utils: ['axios']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version)
  }
})
```

### Environment Variables

```bash
# .env.local
VITE_API_URL=https://api.inventorysystem.com
VITE_APP_TITLE="Inventory System"
VITE_ENABLE_ANALYTICS=true
```

### Deploy Strategies

#### Static Hosting (Netlify/Vercel)
```bash
# Build y deploy automático
npm run build
# Los archivos de dist/ se despliegan automáticamente
```

#### Docker Container
```dockerfile
# Dockerfile para frontend
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Performance Optimizations

- **Code splitting** automático por rutas
- **Lazy loading** de componentes pesados
- **Tree shaking** para eliminar código no usado
- **Asset optimization** con Vite
- **Bundle analysis** para identificar bottlenecks

---

**InventorySystem.Frontend** - Interfaz moderna para gestión empresarial de inventarios ⚡