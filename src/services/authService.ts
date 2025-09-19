import api from './api'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { LoginRequest, LoginResponse, User } from '../types'

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await api.post('/auth/login', credentials)
    const { token, user } = response.data

    // Salvar token e usuário no AsyncStorage
    await AsyncStorage.setItem('token', token)
    await AsyncStorage.setItem('user', JSON.stringify(user))

    return { token, user }
  },

  async logout(): Promise<void> {
    try {
      // Tentar fazer logout no backend
      await api.post('/auth/logout')
    } catch (error) {
      // Ignorar erros de logout no backend
      console.log('Erro ao fazer logout no backend:', error)
    } finally {
      // Sempre limpar dados locais
      await AsyncStorage.removeItem('token')
      await AsyncStorage.removeItem('user')
    }
  },

  async getStoredToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('token')
    } catch (error) {
      console.error('Erro ao obter token:', error)
      return null
    }
  },

  async getStoredUser(): Promise<User | null> {
    try {
      const userString = await AsyncStorage.getItem('user')
      if (userString) {
        return JSON.parse(userString)
      }
      return null
    } catch (error) {
      console.error('Erro ao obter usuário:', error)
      return null
    }
  },

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getStoredToken()
    return !!token
  },

  async refreshToken(): Promise<string | null> {
    try {
      const response = await api.post('/auth/refresh')
      const { token } = response.data
      await AsyncStorage.setItem('token', token)
      return token
    } catch (error) {
      console.error('Erro ao renovar token:', error)
      return null
    }
  },
}
