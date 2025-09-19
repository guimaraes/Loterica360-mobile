/**
 * Utilitário para testar conexão com a API
 * Use este arquivo para verificar se a API está acessível
 */

import { config, log, validateConfig } from '../config/environment'
import { authService } from '../services/authService'

export const testApiConnection = async () => {
  log.info('=== TESTE DE CONEXÃO COM A API ===')
  
  // 1. Validar configuração
  log.info('1. Validando configuração...')
  const isConfigValid = validateConfig()
  
  if (!isConfigValid) {
    log.error('❌ Configuração inválida!')
    return false
  }
  
  log.info('✅ Configuração válida:', {
    API_BASE_URL: config.API_BASE_URL,
    API_TIMEOUT: config.API_TIMEOUT,
  })
  
  // 2. Testar credenciais de teste
  log.info('2. Testando login com credenciais de teste...')
  
  const testCredentials = {
    email: 'teste@teste.com',
    senha: 'password'
  }
  
  try {
    const response = await authService.login(testCredentials)
    log.info('✅ Login realizado com sucesso!')
    log.info('Usuário:', {
      id: response.user.id,
      nome: response.user.nome,
      email: response.user.email,
      papel: response.user.papel
    })
    
    // Fazer logout após o teste
    await authService.logout()
    log.info('✅ Logout realizado com sucesso!')
    
    return true
    
  } catch (error: any) {
    log.error('❌ Erro no teste de login:', error.message)
    
    if (error.response) {
      log.error('Status:', error.response.status)
      log.error('Data:', error.response.data)
    }
    
    return false
  }
}

// Função para testar conectividade básica
export const testBasicConnectivity = async () => {
  log.info('=== TESTE DE CONECTIVIDADE BÁSICA ===')
  
  try {
    const response = await fetch(config.API_BASE_URL.replace('/api/v1', '/actuator/health'))
    
    if (response.ok) {
      log.info('✅ API está acessível!')
      return true
    } else {
      log.warn('⚠️ API retornou status:', response.status)
      return false
    }
    
  } catch (error: any) {
    log.error('❌ Erro de conectividade:', error.message)
    return false
  }
}

// Função para exibir informações de debug
export const showDebugInfo = () => {
  log.info('=== INFORMAÇÕES DE DEBUG ===')
  log.info('Configuração atual:', config)
  log.info('Timestamp:', new Date().toISOString())
  log.info('User Agent:', navigator.userAgent || 'React Native')
}

// Função principal para executar todos os testes
export const runAllTests = async () => {
  log.info('🚀 Iniciando testes da API...')
  
  const results = {
    config: false,
    connectivity: false,
    login: false
  }
  
  // Teste 1: Configuração
  results.config = validateConfig()
  
  // Teste 2: Conectividade básica
  results.connectivity = await testBasicConnectivity()
  
  // Teste 3: Login (apenas se conectividade OK)
  if (results.connectivity) {
    results.login = await testApiConnection()
  }
  
  // Resultado final
  log.info('=== RESULTADOS DOS TESTES ===')
  log.info('Configuração:', results.config ? '✅' : '❌')
  log.info('Conectividade:', results.connectivity ? '✅' : '❌')
  log.info('Login:', results.login ? '✅' : '❌')
  
  const allPassed = Object.values(results).every(result => result === true)
  
  if (allPassed) {
    log.info('🎉 Todos os testes passaram! API está funcionando corretamente.')
  } else {
    log.warn('⚠️ Alguns testes falharam. Verifique a configuração e conectividade.')
  }
  
  return results
}
