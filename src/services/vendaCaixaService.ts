import api from './api'
import { VendaCaixa, PaginatedResponse } from '../types'

export const vendaCaixaService = {
  async getVendas(page: number = 0, size: number = 20): Promise<PaginatedResponse<VendaCaixa>> {
    const response = await api.get(`/vendas-caixa?page=${page}&size=${size}`)
    return response.data
  },

  async getVenda(id: string): Promise<VendaCaixa> {
    const response = await api.get(`/vendas-caixa/${id}`)
    return response.data
  },

  async createVenda(venda: Omit<VendaCaixa, 'id' | 'criadoEm' | 'atualizadoEm'>): Promise<VendaCaixa> {
    const response = await api.post('/vendas-caixa', venda)
    return response.data
  },

  async updateVenda(id: string, venda: Partial<VendaCaixa>): Promise<VendaCaixa> {
    const response = await api.put(`/vendas-caixa/${id}`, venda)
    return response.data
  },
}
