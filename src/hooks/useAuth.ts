import { useState, useEffect } from 'react'
import { authService } from '../services/auth'
import type { User } from '../types'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = authService.getStoredUser()
    if (storedUser && authService.isAuthenticated()) {
      setUser(storedUser)
    }
    setLoading(false)
  }, [])

  const login = async (username: string, password: string) => {
    try {
      const response = await authService.login({ username, password })
      const user = {
        id: '1',
        username: response.username,
        email: response.email,
        role: response.role,
        firstName: response.firstName,
        lastName: response.lastName
      }
      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(user))
      setUser(user)
      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'Error al iniciar sesión' }
    }
  }

  const register = async (username: string, email: string, password: string, firstName: string, lastName: string) => {
    try {
      const response = await authService.register({ username, email, password, firstName, lastName })
      const user = {
        id: '1',
        username: response.username,
        email: response.email,
        role: response.role,
        firstName: response.firstName,
        lastName: response.lastName
      }
      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(user))
      setUser(user)
      return { success: true }
    } catch (error) {
      console.error('Register error:', error)
      return { success: false, error: 'Error al registrar usuario' }
    }
  }

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  return {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user
  }
}