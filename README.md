# Loteria360 Mobile

Aplicativo móvel React Native para o sistema Loteria360, desenvolvido com Expo e TypeScript.

## 📱 Visão Geral

O Loteria360 Mobile é um aplicativo para dispositivos móveis que oferece acesso completo às funcionalidades do sistema de gestão de loterias, incluindo vendas, clientes, jogos, bolões e relatórios.

## 🚀 Tecnologias

### Core
- **React Native** - Framework para desenvolvimento mobile
- **Expo** - Plataforma para desenvolvimento React Native
- **TypeScript** - Tipagem estática para JavaScript
- **React Navigation** - Navegação entre telas

### Estado e Gerenciamento
- **Redux Toolkit** - Gerenciamento de estado global
- **React Redux** - Integração React-Redux

### UI e Componentes
- **React Native Vector Icons** - Ícones para a interface
- **React Native Toast Message** - Notificações toast
- **React Native Paper** - Componentes Material Design (opcional)

### Comunicação
- **Axios** - Cliente HTTP para comunicação com API
- **AsyncStorage** - Armazenamento local de dados

## 🏗️ Arquitetura

### Estrutura de Pastas

```
src/
├── components/          # Componentes reutilizáveis
│   ├── auth/           # Componentes de autenticação
│   ├── dashboard/      # Componentes do dashboard
│   ├── forms/          # Formulários
│   ├── layout/         # Componentes de layout
│   └── ui/             # Componentes de UI básicos
├── hooks/              # Hooks personalizados
├── navigation/         # Configuração de navegação
├── screens/            # Telas do aplicativo
├── services/           # Serviços para comunicação com API
├── store/              # Configuração do Redux
│   └── slices/         # Slices do Redux Toolkit
├── types/              # Definições de tipos TypeScript
└── utils/              # Utilitários e helpers
```

### Fluxo de Dados

1. **Redux Store** - Estado global da aplicação
2. **API Services** - Comunicação com backend
3. **Hooks** - Lógica reutilizável
4. **Components** - Interface do usuário

## 🔐 Sistema de Autenticação

### Funcionalidades
- Login com email e senha
- Armazenamento seguro de token JWT
- Renovação automática de token
- Logout com limpeza de dados

### Fluxo de Autenticação
1. Usuário insere credenciais
2. App envia requisição para API
3. API retorna token JWT e dados do usuário
4. Token é armazenado no AsyncStorage
5. Token é incluído automaticamente em requisições subsequentes

## 👥 Sistema de Permissões

### Perfis de Usuário
- **ADMIN** - Acesso total ao sistema
- **GERENTE** - Acesso a gestão operacional
- **VENDEDOR** - Acesso apenas a vendas e clientes
- **AUDITOR** - Acesso apenas a consultas e relatórios

### Controle de Acesso
- Menu dinâmico baseado no perfil do usuário
- Redirecionamento automático para vendedores
- Proteção de rotas por perfil

## 📱 Telas Principais

### Autenticação
- **Login** - Tela de autenticação com validação

### Dashboard
- **Dashboard Principal** - Métricas e resumos gerais
- **Cards de Métricas** - Vendas, valores, clientes, etc.
- **Listas de Top Itens** - Jogos mais vendidos, caixas

### Operacional
- **Vendas** - Lista de vendas realizadas
- **Clientes** - Gestão de clientes cadastrados
- **Jogos** - Visualização de jogos disponíveis
- **Bolões** - Gestão de bolões (futuro)

### Administrativo
- **Usuários** - Gestão de usuários (apenas ADMIN)
- **Relatórios** - Relatórios gerenciais

### Perfil
- **Perfil do Usuário** - Informações e configurações

## 🔧 Configuração e Instalação

### Pré-requisitos
- Node.js (versão 20.19.4 ou superior)
- npm ou yarn
- Expo CLI
- Dispositivo móvel com Expo Go ou emulador

### Instalação

1. **Clone o repositório**
```bash
git clone <repository-url>
cd Loterica360-mobile
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure a API**
```bash
# Edite o arquivo src/services/api.ts
# Altere a URL da API conforme necessário
const API_BASE_URL = 'http://localhost:8080/api/v1'
```

4. **Execute o aplicativo**
```bash
# Para desenvolvimento
npm start

# Para iOS
npm run ios

# Para Android
npm run android

# Para web
npm run web
```

## 📡 Integração com API

### Configuração
O app está configurado para se comunicar com o backend Loteria360 através de:

- **Base URL**: `http://localhost:8080/api/v1`
- **Autenticação**: Bearer Token (JWT)
- **Timeout**: 10 segundos

### Endpoints Principais
- `/auth/login` - Autenticação
- `/dashboard/metrics` - Métricas do dashboard
- `/vendas-caixa` - Gestão de vendas
- `/clientes` - Gestão de clientes
- `/jogos` - Gestão de jogos

## 🎨 Design System

### Cores Principais
- **Primária**: #6200ea (Roxo)
- **Sucesso**: #4caf50 (Verde)
- **Erro**: #d32f2f (Vermelho)
- **Aviso**: #ff9800 (Laranja)
- **Info**: #2196f3 (Azul)

### Tipografia
- **Títulos**: 20-24px, weight: bold
- **Subtítulos**: 16-18px, weight: 600
- **Corpo**: 14-16px, weight: normal
- **Legendas**: 12-14px, weight: normal

### Componentes
- **Cards**: Sombras sutis, bordas arredondadas
- **Botões**: Bordas arredondadas, estados de hover
- **Inputs**: Bordas definidas, ícones integrados

## 🔄 Gerenciamento de Estado

### Redux Slices

#### AuthSlice
- Estado de autenticação do usuário
- Token JWT
- Dados do usuário logado
- Ações: login, logout, loadStoredAuth

#### UiSlice
- Estado da interface
- Loading states
- Configurações de tema
- Notificações

### Hooks Personalizados

#### useAuth
- Gerenciamento de autenticação
- Verificação de permissões
- Utilidades de usuário

#### usePermissions
- Verificação de papéis
- Controle de acesso
- Validação de permissões

## 📱 Funcionalidades por Perfil

### ADMIN
- ✅ Dashboard completo
- ✅ Gestão de usuários
- ✅ Gestão de jogos
- ✅ Gestão de bolões
- ✅ Relatórios
- ✅ Vendas e clientes

### GERENTE
- ✅ Dashboard completo
- ✅ Gestão de jogos
- ✅ Gestão de bolões
- ✅ Relatórios
- ✅ Vendas e clientes

### VENDEDOR
- ✅ Tela de vendas (redirecionamento automático)
- ✅ Gestão de clientes
- ✅ Visualização de jogos ativos
- ❌ Gestão de usuários
- ❌ Relatórios administrativos

### AUDITOR
- ✅ Dashboard de consulta
- ✅ Visualização de dados
- ✅ Relatórios
- ❌ Operações de modificação

## 🚀 Deploy e Build

### Build para Produção

1. **Configure as variáveis de ambiente**
```bash
# Crie um arquivo .env
API_BASE_URL=https://api.loteria360.com/api/v1
```

2. **Build do aplicativo**
```bash
# Para Android
expo build:android

# Para iOS
expo build:ios

# Para web
expo build:web
```

### Deploy

O app pode ser distribuído através de:
- **Google Play Store** (Android)
- **Apple App Store** (iOS)
- **Web** (PWA)
- **Expo Go** (desenvolvimento/teste)

## 🧪 Testes

### Estrutura de Testes
```bash
# Execute os testes
npm test

# Testes com coverage
npm run test:coverage

# Testes em modo watch
npm run test:watch
```

### Tipos de Teste
- **Unit Tests** - Componentes individuais
- **Integration Tests** - Fluxos completos
- **E2E Tests** - Testes end-to-end

## 📊 Performance

### Otimizações Implementadas
- **Lazy Loading** - Carregamento sob demanda
- **Memoização** - Componentes otimizados
- **FlatList** - Listas virtuais para grandes volumes
- **Image Caching** - Cache de imagens
- **Bundle Splitting** - Divisão de código

### Métricas
- **Tempo de carregamento inicial**: < 3s
- **Tempo de navegação**: < 1s
- **Uso de memória**: < 100MB
- **Tamanho do bundle**: < 50MB

## 🔧 Desenvolvimento

### Scripts Disponíveis
```bash
npm start          # Inicia o servidor de desenvolvimento
npm run android    # Executa no Android
npm run ios        # Executa no iOS
npm run web        # Executa no navegador
npm run lint       # Executa o linter
npm run type-check # Verifica tipos TypeScript
```

### Convenções de Código
- **TypeScript** - Tipagem obrigatória
- **ESLint** - Linting de código
- **Prettier** - Formatação automática
- **Conventional Commits** - Padrão de commits

## 🐛 Debugging

### Ferramentas
- **React Native Debugger** - Debug avançado
- **Flipper** - Inspeção de rede e estado
- **Expo Dev Tools** - Ferramentas de desenvolvimento
- **Redux DevTools** - Debug do estado Redux

### Logs
```bash
# Logs do Expo
expo logs

# Logs específicos do dispositivo
adb logcat  # Android
xcrun simctl spawn booted log stream # iOS
```

## 📚 Documentação Adicional

- [React Native Docs](https://reactnative.dev/)
- [Expo Docs](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/)

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 📞 Suporte

Para suporte e dúvidas:
- **Email**: suporte@loteria360.com
- **Documentação**: [docs.loteria360.com](https://docs.loteria360.com)
- **Issues**: [GitHub Issues](https://github.com/loteria360/mobile/issues)

---

**Loteria360 Mobile** - Desenvolvido com ❤️ para a gestão de loterias

