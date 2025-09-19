# 🚀 Configuração da API - Loteria360 Mobile

## ✅ Implementação Concluída

O app foi configurado para se conectar à API do Loteria360 com as seguintes melhorias:

### 🔧 Arquivos Criados/Modificados

1. **`src/config/environment.ts`** - Sistema de configuração flexível
2. **`src/services/api.ts`** - Atualizado para usar configurações
3. **`src/services/authService.ts`** - Atualizado com logs e configurações
4. **`src/utils/apiTest.ts`** - Utilitário para testar conexão
5. **`CONFIGURACAO_API.md`** - Documentação completa

### 🌐 Configurações Disponíveis

#### Desenvolvimento Local (Padrão)
```typescript
API_BASE_URL: 'http://localhost:8080/api/v1'
```

#### Rede Local (Para teste em dispositivos)
```typescript
API_BASE_URL: 'http://192.168.0.57:8080/api/v1'
```

### 🔑 Credenciais para Teste

- **Email**: `teste@teste.com`
- **Senha**: `password`
- **Perfil**: ADMIN

## 🚀 Como Usar

### 1. Configuração Rápida

**Para localhost (desenvolvimento):**
```bash
# Nenhuma configuração adicional necessária
npm start
```

**Para rede local:**
1. Edite `src/config/environment.ts`
2. Descomente a linha: `return localNetworkConfig`
3. Ajuste o IP se necessário

### 2. Configuração Avançada

**Crie um arquivo `.env` na raiz do projeto:**
```bash
API_BASE_URL=http://192.168.0.57:8080/api/v1
API_TIMEOUT=10000
DEBUG=true
LOG_LEVEL=debug
```

### 3. Teste a Conexão

O app agora inclui logs detalhados. Quando você iniciar o app, verá:

```
[INFO] Configuração carregada: {
  API_BASE_URL: 'http://localhost:8080/api/v1',
  API_TIMEOUT: 10000,
  DEBUG: true,
  LOG_LEVEL: 'debug'
}
```

## 🔍 Logs Implementados

- **DEBUG**: Requisições e respostas da API
- **INFO**: Ações importantes (login, logout)
- **WARN**: Avisos (token expirado)
- **ERROR**: Erros da API

## 📱 Testando o Login

1. **Inicie o app:**
```bash
npm start
```

2. **Use as credenciais:**
   - Email: `teste@teste.com`
   - Senha: `password`

3. **Verifique os logs** para confirmar a conexão

## 🛠️ Funcionalidades Implementadas

### ✅ Sistema de Configuração
- Detecção automática de ambiente
- Suporte a variáveis de ambiente
- Configurações flexíveis para diferentes cenários

### ✅ Logs Detalhados
- Logs estruturados para debug
- Diferentes níveis de log
- Informações de requisições e respostas

### ✅ Gerenciamento de Token
- Armazenamento seguro de tokens
- Renovação automática
- Limpeza automática em caso de erro

### ✅ Tratamento de Erros
- Interceptadores de requisição/resposta
- Mensagens de erro amigáveis
- Toast notifications para usuário

## 🔧 Personalização

### Alterar URL da API

**Opção 1: Arquivo de configuração**
```typescript
// src/config/environment.ts
const localNetworkConfig: EnvironmentConfig = {
  API_BASE_URL: 'http://SEU_IP:8080/api/v1',
  // ...
}
```

**Opção 2: Variáveis de ambiente**
```bash
export API_BASE_URL=http://192.168.1.100:8080/api/v1
```

### Alterar Timeout
```typescript
API_TIMEOUT: 15000  // 15 segundos
```

### Desabilitar Logs
```typescript
DEBUG: false
LOG_LEVEL: 'error'
```

## 🚨 Solução de Problemas

### Erro de Conexão
```
[ERROR] Erro da API: http://localhost:8080/api/v1/auth/login 0 Network Error
```

**Soluções:**
1. Verifique se o backend está rodando
2. Confirme a URL da API
3. Para rede local, use o IP correto

### Token Expirado
```
[WARN] Token expirado ou inválido, dados locais removidos
```

**Solução:** O app automaticamente redireciona para login

## 📋 Checklist de Verificação

- [ ] Backend rodando na porta 8080
- [ ] URL da API configurada corretamente
- [ ] Credenciais de teste disponíveis
- [ ] Logs aparecendo no console
- [ ] Login funcionando

## 🎯 Próximos Passos

1. **Teste o login** com as credenciais fornecidas
2. **Explore as funcionalidades** do app
3. **Verifique os logs** para debug
4. **Configure para produção** quando necessário

---

**🎉 O app está pronto para se conectar à API do Loteria360!**

Para mais detalhes, consulte o arquivo `CONFIGURACAO_API.md`.
