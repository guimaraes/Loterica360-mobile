import api from './api'
import { ContagemCaixa, ContagemCaixaRequest, PaginatedResponse } from '../types'

export const contagemCaixaService = {
  async getContagens(page: number = 0, size: number = 20): Promise<PaginatedResponse<ContagemCaixa>> {
    const response = await api.get(`/contagem-caixa?page=${page}&size=${size}`)
    return response.data
  },

  async getContagensByPeriodo(
    dataInicio: string, 
    dataFim: string, 
    page: number = 0, 
    size: number = 20
  ): Promise<PaginatedResponse<ContagemCaixa>> {
    const response = await api.get(
      `/contagem-caixa/periodo?dataInicio=${dataInicio}&dataFim=${dataFim}&page=${page}&size=${size}`
    )
    return response.data
  },

  async getContagemById(id: string): Promise<ContagemCaixa> {
    const response = await api.get(`/contagem-caixa/${id}`)
    return response.data
  },

  async createContagem(contagem: ContagemCaixaRequest): Promise<ContagemCaixa> {
    const response = await api.post('/contagem-caixa', contagem)
    return response.data
  },

  async deleteContagem(id: string): Promise<void> {
    await api.delete(`/contagem-caixa/${id}`)
  }
}
