import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Toast from 'react-native-toast-message'
import { API_BASE_URL, API_TIMEOUT, TOKEN_STORAGE_KEY, USER_STORAGE_KEY, log } from '../config/environment'

// Criar instância do axios
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor para adicionar token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_STORAGE_KEY)
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
        log.debug('Token adicionado à requisição:', config.url)
      }
    } catch (error) {
      log.error('Erro ao obter token:', error)
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor para tratar erros
api.interceptors.response.use(
  (response) => {
    log.debug('Resposta da API:', response.config.url, response.status)
    return response
  },
  async (error) => {
    log.error('Erro da API:', error.config?.url, error.response?.status, error.message)

    const errorResponse = error.response?.data

    if (error.response?.status === 401) {
      // Token expirado ou inválido
      await AsyncStorage.removeItem(TOKEN_STORAGE_KEY)
      await AsyncStorage.removeItem(USER_STORAGE_KEY)
      log.warn('Token expirado ou inválido, dados locais removidos')
      // Redirecionar para login será feito pelo componente
    } else if (error.response?.status === 403) {
      const message = errorResponse?.detail || 'Você não tem permissão para realizar esta ação'
      Toast.show({
        type: 'error',
        text1: 'Acesso Negado',
        text2: message,
      })
    } else if (error.response?.status >= 500) {
      const message = errorResponse?.detail || 'Erro interno do servidor. Tente novamente mais tarde.'
      Toast.show({
        type: 'error',
        text1: 'Erro do Servidor',
        text2: message,
      })
    } else if (errorResponse?.detail) {
      // Usar mensagem amigável do backend
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: errorResponse.detail,
      })

      // Tratar erros de validação com mensagens específicas dos campos
      if (errorResponse.errors && errorResponse.errors.length > 0) {
        errorResponse.errors.forEach((validationError: any) => {
          if (validationError.field && validationError.message) {
            Toast.show({
              type: 'error',
              text1: `${validationError.field}:`,
              text2: validationError.message,
              visibilityTime: 4000,
            })
          }
        })
      }
    } else if (error.response?.data?.message) {
      // Fallback para formato antigo de mensagem
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: error.response.data.message,
      })
    } else {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Ocorreu um erro inesperado',
      })
    }

    return Promise.reject(error)
  }
)

export default api
