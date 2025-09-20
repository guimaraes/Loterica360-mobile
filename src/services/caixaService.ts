import api from './api'
import { Caixa, PaginatedResponse } from '../types'

export const caixaService = {
  async getCaixas(page: number = 0, size: number = 20): Promise<PaginatedResponse<Caixa>> {
    const response = await api.get(`/caixas?page=${page}&size=${size}`)
    return response.data
  },

  async getAllCaixasAtivas(): Promise<Caixa[]> {
    const response = await api.get('/caixas/ativas')
    return response.data
  },

  async getCaixaById(id: string): Promise<Caixa> {
    const response = await api.get(`/caixas/${id}`)
    return response.data
  }
}