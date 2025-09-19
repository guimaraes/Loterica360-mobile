# Configuração da API - Loteria360 Mobile

## 📡 Conectando o App à API

O app foi configurado para se conectar à API do Loteria360. Aqui está como configurar e usar:

### 🔧 Configuração Automática

O app agora usa um sistema de configuração flexível localizado em `src/config/environment.ts` que:

1. **Detecta automaticamente o ambiente** (desenvolvimento/produção)
2. **Permite configuração via variáveis de ambiente**
3. **Fornece configurações padrão para diferentes cenários**

### 🌐 URLs Configuradas

#### Desenvolvimento Local
```typescript
API_BASE_URL: 'http://localhost:8080/api/v1'
```

#### Rede Local (Desenvolvimento)
```typescript
API_BASE_URL: 'http://192.168.0.57:8080/api/v1'
```

#### Produção
```typescript
API_BASE_URL: 'https://api.loteria360.com/api/v1'
```

### ⚙️ Como Alterar a Configuração

#### Opção 1: Arquivo .env (Recomendado)

1. **Crie um arquivo `.env` na raiz do projeto:**
```bash
# Configurações da API Loteria360
API_BASE_URL=http://localhost:8080/api/v1
API_TIMEOUT=10000
DEBUG=true
LOG_LEVEL=debug
TOKEN_STORAGE_KEY=loteria360_token
USER_STORAGE_KEY=loteria360_user
```

2. **Para rede local, altere o IP:**
```bash
API_BASE_URL=http://192.168.0.57:8080/api/v1
```

#### Opção 2: Editar o Arquivo de Configuração

Edite o arquivo `src/config/environment.ts` e altere as configurações:

```typescript
// Para usar rede local, descomente esta linha:
return localNetworkConfig

// Ou edite diretamente:
const defaultConfig: EnvironmentConfig = {
  API_BASE_URL: 'http://SEU_IP_AQUI:8080/api/v1',
  // ... outras configurações
}
```

#### Opção 3: Variáveis de Ambiente do Sistema

```bash
export API_BASE_URL=http://192.168.0.57:8080/api/v1
export DEBUG=true
```

### 🔐 Credenciais para Teste

Use as credenciais do arquivo `CREDENCIAIS_TESTE.md`:

- **Email**: `teste@teste.com`
- **Senha**: `password`
- **Perfil**: ADMIN

### 📱 Testando a Conexão

1. **Inicie o app:**
```bash
npm start
```

2. **Verifique os logs no console** - você deve ver:
```
[INFO] Configuração carregada: {
  API_BASE_URL: 'http://localhost:8080/api/v1',
  API_TIMEOUT: 10000,
  DEBUG: true,
  LOG_LEVEL: 'debug'
}
```

3. **Tente fazer login** com as credenciais de teste

### 🔍 Logs e Debug

O app agora inclui logs detalhados:

- **DEBUG**: Requisições e respostas da API
- **INFO**: Ações importantes (login, logout)
- **WARN**: Avisos (token expirado)
- **ERROR**: Erros da API

### 🚨 Solução de Problemas

#### Erro de Conexão
```
[ERROR] Erro da API: http://localhost:8080/api/v1/auth/login 0 Network Error
```

**Soluções:**
1. Verifique se o backend está rodando
2. Confirme a URL da API
3. Para rede local, use o IP correto da máquina

#### Token Expirado
```
[WARN] Token expirado ou inválido, dados locais removidos
```

**Solução:** Faça login novamente

#### CORS Error
Se estiver testando no navegador (web), pode haver problemas de CORS.

### 📋 Checklist de Configuração

- [ ] Backend rodando na porta 8080
- [ ] URL da API configurada corretamente
- [ ] Arquivo .env criado (se usando)
- [ ] Credenciais de teste disponíveis
- [ ] Logs aparecendo no console

### 🔄 Próximos Passos

1. **Teste o login** com as credenciais fornecidas
2. **Explore as funcionalidades** baseadas no perfil do usuário
3. **Verifique os logs** para debug
4. **Configure para produção** quando necessário

---

**Nota:** O app está configurado para funcionar tanto em desenvolvimento local quanto em rede local, facilitando o teste em dispositivos reais.
