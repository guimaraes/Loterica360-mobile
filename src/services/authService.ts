import api from './api'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { LoginRequest, LoginResponse, User } from '../types'
import { TOKEN_STORAGE_KEY, USER_STORAGE_KEY, log } from '../config/environment'

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    log.debug('Tentando fazer login:', credentials.email)
    const response = await api.post('/auth/login', credentials)
    const { token, usuario } = response.data

    // Salvar token e usuário no AsyncStorage
    await AsyncStorage.setItem(TOKEN_STORAGE_KEY, token)
    await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(usuario))
    
    log.info('Login realizado com sucesso:', usuario.email)

    return { token, user: usuario }
  },

  async logout(): Promise<void> {
    try {
      // Tentar fazer logout no backend
      await api.post('/auth/logout')
      log.info('Logout realizado no backend')
    } catch (error) {
      // Ignorar erros de logout no backend
      log.warn('Erro ao fazer logout no backend:', error)
    } finally {
      // Sempre limpar dados locais
      await AsyncStorage.removeItem(TOKEN_STORAGE_KEY)
      await AsyncStorage.removeItem(USER_STORAGE_KEY)
      log.info('Dados locais removidos')
    }
  },

  async getStoredToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(TOKEN_STORAGE_KEY)
    } catch (error) {
      log.error('Erro ao obter token:', error)
      return null
    }
  },

  async getStoredUser(): Promise<User | null> {
    try {
      const userString = await AsyncStorage.getItem(USER_STORAGE_KEY)
      if (userString) {
        return JSON.parse(userString)
      }
      return null
    } catch (error) {
      log.error('Erro ao obter usuário:', error)
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
      await AsyncStorage.setItem(TOKEN_STORAGE_KEY, token)
      log.info('Token renovado com sucesso')
      return token
    } catch (error) {
      log.error('Erro ao renovar token:', error)
      return null
    }
  },
}

