# Credenciais para Teste - Loteria360 Mobile

## 🔐 **Credenciais de Login**

### **Usuário Administrador**
- **Email**: `teste@teste.com`
- **Senha**: `password`
- **Perfil**: ADMIN (acesso total)

### **Usuários do Sistema**
- **Admin**: `admin@loteria360.local` (senha não configurada)
- **Vendedores**: `joao@loteria360.local`, `maria@loteria360.local`, etc.
- **Gerente**: `ana@loteria360.local`

## 🌐 **Configuração da API**

A API está configurada para acessar:
- **URL**: `http://192.168.0.57:8080/api/v1`
- **Status**: ✅ Funcionando
- **CORS**: ✅ Configurado

## 📱 **Como Testar**

1. **Abra o app mobile** (Expo Go ou simulador)
2. **Use as credenciais**:
   - Email: `teste@teste.com`
   - Senha: `password`
3. **Explore as funcionalidades** baseadas no perfil ADMIN

## 🔧 **Funcionalidades Disponíveis**

### **Como ADMIN**:
- ✅ Dashboard completo
- ✅ Gestão de usuários
- ✅ Gestão de jogos
- ✅ Gestão de bolões
- ✅ Relatórios
- ✅ Vendas e clientes

### **Como VENDEDOR**:
- ✅ Apenas tela de vendas
- ✅ Gestão de clientes
- ❌ Outras funcionalidades bloqueadas

## 🚨 **Importante**

- O IP `192.168.0.57` é específico da sua rede local
- Se o IP mudar, atualize o arquivo `src/services/api.ts`
- Certifique-se de que o backend está rodando na porta 8080
- O banco MySQL deve estar acessível

## 📞 **Suporte**

Se houver problemas de conexão:
1. Verifique se o backend está rodando: `curl http://192.168.0.57:8080/actuator/health`
2. Verifique se o IP da rede não mudou: `ifconfig | grep inet`
3. Teste o login via API: `curl -X POST http://192.168.0.57:8080/api/v1/auth/login -H "Content-Type: application/json" -d '{"email":"teste@teste.com","senha":"password"}'`
