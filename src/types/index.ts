export interface User {
  id: string
  nome: string
  email: string
  papel: 'ADMIN' | 'GERENTE' | 'VENDEDOR' | 'AUDITOR'
  ativo: boolean
  criadoEm: string
  atualizadoEm: string
}

export interface LoginRequest {
  email: string
  senha: string
}

export interface LoginResponse {
  token: string
  user: User
}

export interface Jogo {
  id: string
  nome: string
  descricao: string
  preco: number
  ativo: boolean
  criadoEm: string
  atualizadoEm: string
}

export interface Cliente {
  id: string
  nome: string
  cpf: string
  email?: string
  telefone?: string
  endereco?: string
  cidade?: string
  estado?: string
  cep?: string
  dataNascimento?: string
  consentimentoLgpd: boolean
  criadoEm: string
  atualizadoEm: string
}

export interface VendaCaixa {
  id: string
  caixaId: string
  numeroCaixa: number
  descricaoCaixa?: string
  jogoId: string
  nomeJogo: string
  precoJogo: number
  quantidade: number
  valorTotal: number
  dataVenda: string
  usuarioId: string
  nomeUsuario: string
  criadoEm: string
}

export interface VendaCaixaRequest {
  caixaId: string
  jogoId: string
  quantidade: number
  dataVenda: string
}

export interface Bolao {
  id: string
  nome: string
  descricao: string
  valorAposta: number
  quantidadeNumeros: number
  dataInicio: string
  dataFim: string
  status: 'ABERTO' | 'ENCERRADO' | 'CANCELADO'
  criadoEm: string
  atualizadoEm: string
}

export interface Caixa {
  id: string
  numero: number
  descricao?: string
  ativo: boolean
  criadoEm: string
}

export interface ContagemCaixa {
  id: string
  caixaId: string
  numeroCaixa: number
  descricaoCaixa?: string
  dataContagem: string
  usuarioId: string
  nomeUsuario: string
  notas200: number
  notas100: number
  notas50: number
  notas20: number
  notas10: number
  notas5: number
  notas2: number
  moedas1: number
  moedas050: number
  moedas025: number
  moedas010: number
  moedas005: number
  totalNotas: number
  totalMoedas: number
  totalGeral: number
  criadoEm: string
}

export interface ContagemCaixaRequest {
  caixaId: string
  dataContagem: string
  notas200: number
  notas100: number
  notas50: number
  notas20: number
  notas10: number
  notas5: number
  notas2: number
  moedas1: number
  moedas050: number
  moedas025: number
  moedas010: number
  moedas005: number
}

export interface DashboardMetrics {
  totalVendas: number
  totalValor: number
  totalVendasHoje: number
  totalValorHoje: number
  totalClientes: number
  totalUsuarios: number
  totalJogos: number
  totalBoloes: number
  vendasPorJogo: Array<{ jogo: string; quantidade: number; valor: number }>
  vendasPorCaixa: Array<{ caixa: string; quantidade: number; valor: number }>
  vendasPorDia: Array<{ data: string; quantidade: number; valor: number }>
}

export interface PaginatedResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  first: boolean
  last: boolean
}

export interface ApiError {
  detail: string
  errors?: Array<{
    field: string
    message: string
  }>
}

export interface MenuItem {
  id: string
  name: string
  route?: string
  icon: string
  children?: MenuItem[]
  badge?: string | number
  disabled?: boolean
  roles?: ('ADMIN' | 'GERENTE' | 'VENDEDOR' | 'AUDITOR')[]
}

export interface MenuSection {
  id: string
  title: string
  items: MenuItem[]
}


