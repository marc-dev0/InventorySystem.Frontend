import React, { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/auth'
import type { User } from '../types'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (username: string, email: string, password: string, firstName: string, lastName: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = () => {
      try {
        const storedUser = authService.getStoredUser()
        if (storedUser && authService.isAuthenticated()) {
          setUser(storedUser)
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
        authService.logout()
      }
      setLoading(false)
    }

    initAuth()
  }, [])

  const login = async (username: string, password: string) => {
    try {
      const response = await authService.login({ username, password })
      console.log('Login response:', response)
      
      // La API devuelve el objeto directamente con token, username, email, role, firstName, lastName
      const user = {
        id: '1', // Temporal - se puede extraer del token JWT si es necesario
        username: response.username,
        email: response.email,
        role: response.role,
        firstName: response.firstName || '',
        lastName: response.lastName || ''
      }
      
      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(user))
      setUser(user)
      return { success: true }
    } catch (error: any) {
      console.error('Login error:', error)
      const message = error.response?.data?.message || error.message || 'Error al iniciar sesión'
      return { success: false, error: message }
    }
  }

  const register = async (username: string, email: string, password: string, firstName: string, lastName: string) => {
    try {
      const response = await authService.register({ username, email, password, firstName, lastName })
      console.log('Register response:', response)
      
      // Después del registro exitoso, hacer login automáticamente
      const loginResult = await login(username, password)
      if (loginResult.success) {
        return { success: true }
      } else {
        return { success: true, message: 'Usuario registrado exitosamente. Por favor inicia sesión.' }
      }
    } catch (error: any) {
      console.error('Register error:', error)
      const message = error.response?.data?.message || error.message || 'Error al registrar usuario'
      return { success: false, error: message }
    }
  }

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}