import api from './api'
import { Caixa, PaginatedResponse } from '../types'

export const caixaService = {
  async getCaixas(page: number = 0, size: number = 20): Promise<PaginatedResponse<Caixa>> {
    const response = await api.get(`/caixas?page=${page}&size=${size}`)
    return response.data
  },

  async getCaixasAtivas(): Promise<Caixa[]> {
    const response = await api.get('/caixas/ativas')
    return response.data
  },

  async getCaixa(id: string): Promise<Caixa> {
    const response = await api.get(`/caixas/${id}`)
    return response.data
  },

  async createCaixa(caixa: Omit<Caixa, 'id' | 'criadoEm' | 'atualizadoEm'>): Promise<Caixa> {
    const response = await api.post('/caixas', caixa)
    return response.data
  },

  async updateCaixa(id: string, caixa: Partial<Caixa>): Promise<Caixa> {
    const response = await api.put(`/caixas/${id}`, caixa)
    return response.data
  },

  async toggleCaixaStatus(id: string): Promise<Caixa> {
    const response = await api.patch(`/caixas/${id}/toggle-status`)
    return response.data
  },
}
