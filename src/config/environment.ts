/**
 * Configurações de ambiente para o app Loteria360 Mobile
 * 
 * Para desenvolvimento local, você pode:
 * 1. Alterar diretamente os valores abaixo
 * 2. Criar um arquivo .env na raiz do projeto (recomendado)
 * 3. Usar variáveis de ambiente do sistema
 */

interface EnvironmentConfig {
  API_BASE_URL: string
  API_TIMEOUT: number
  DEBUG: boolean
  LOG_LEVEL: 'debug' | 'info' | 'warn' | 'error'
  TOKEN_STORAGE_KEY: string
  USER_STORAGE_KEY: string
}

// Configuração padrão para desenvolvimento
const defaultConfig: EnvironmentConfig = {
  // URL da API - ajuste conforme necessário
  API_BASE_URL: 'http://localhost:8080/api/v1',
  
  // Timeout para requisições HTTP (em ms)
  API_TIMEOUT: 10000,
  
  // Modo debug
  DEBUG: true,
  
  // Nível de log
  LOG_LEVEL: 'debug',
  
  // Chaves para armazenamento local
  TOKEN_STORAGE_KEY: 'loteria360_token',
  USER_STORAGE_KEY: 'loteria360_user',
}

// Configuração para produção
const productionConfig: EnvironmentConfig = {
  API_BASE_URL: 'https://api.loteria360.com/api/v1',
  API_TIMEOUT: 15000,
  DEBUG: false,
  LOG_LEVEL: 'error',
  TOKEN_STORAGE_KEY: 'loteria360_token',
  USER_STORAGE_KEY: 'loteria360_user',
}

// Configuração para rede local (desenvolvimento)
const localNetworkConfig: EnvironmentConfig = {
  API_BASE_URL: 'http://192.168.0.57:8080/api/v1',
  API_TIMEOUT: 10000,
  DEBUG: true,
  LOG_LEVEL: 'debug',
  TOKEN_STORAGE_KEY: 'loteria360_token',
  USER_STORAGE_KEY: 'loteria360_user',
}

// Função para obter configuração baseada no ambiente
function getEnvironmentConfig(): EnvironmentConfig {
  // Verificar se estamos em desenvolvimento
  const isDevelopment = __DEV__
  
  // Verificar se há variáveis de ambiente definidas
  const hasEnvVars = process.env.API_BASE_URL
  
  if (hasEnvVars) {
    // Usar variáveis de ambiente se disponíveis
    return {
      API_BASE_URL: process.env.API_BASE_URL || defaultConfig.API_BASE_URL,
      API_TIMEOUT: parseInt(process.env.API_TIMEOUT || '10000'),
      DEBUG: process.env.DEBUG === 'true',
      LOG_LEVEL: (process.env.LOG_LEVEL as any) || 'debug',
      TOKEN_STORAGE_KEY: process.env.TOKEN_STORAGE_KEY || defaultConfig.TOKEN_STORAGE_KEY,
      USER_STORAGE_KEY: process.env.USER_STORAGE_KEY || defaultConfig.USER_STORAGE_KEY,
    }
  }
  
  // Para desenvolvimento, você pode alternar entre configurações:
  // - defaultConfig: localhost
  // - localNetworkConfig: rede local (IP específico)
  
  if (isDevelopment) {
    // Para usar rede local, descomente a linha abaixo:
    // return localNetworkConfig
    
    return defaultConfig
  }
  
  // Produção
  return productionConfig
}

// Exportar configuração atual
export const config = getEnvironmentConfig()

// Exportar configurações individuais para facilitar o uso
export const {
  API_BASE_URL,
  API_TIMEOUT,
  DEBUG,
  LOG_LEVEL,
  TOKEN_STORAGE_KEY,
  USER_STORAGE_KEY,
} = config

// Função para log condicional
export const log = {
  debug: (message: string, ...args: any[]) => {
    if (DEBUG && LOG_LEVEL === 'debug') {
      console.log(`[DEBUG] ${message}`, ...args)
    }
  },
  info: (message: string, ...args: any[]) => {
    if (LOG_LEVEL === 'info' || LOG_LEVEL === 'debug') {
      console.info(`[INFO] ${message}`, ...args)
    }
  },
  warn: (message: string, ...args: any[]) => {
    if (LOG_LEVEL === 'warn' || LOG_LEVEL === 'info' || LOG_LEVEL === 'debug') {
      console.warn(`[WARN] ${message}`, ...args)
    }
  },
  error: (message: string, ...args: any[]) => {
    console.error(`[ERROR] ${message}`, ...args)
  },
}

// Função para verificar se a configuração está correta
export const validateConfig = (): boolean => {
  try {
    new URL(API_BASE_URL)
    return true
  } catch {
    log.error('URL da API inválida:', API_BASE_URL)
    return false
  }
}

// Log da configuração atual (apenas em desenvolvimento)
if (__DEV__) {
  log.info('Configuração carregada:', {
    API_BASE_URL,
    API_TIMEOUT,
    DEBUG,
    LOG_LEVEL,
  })
}
