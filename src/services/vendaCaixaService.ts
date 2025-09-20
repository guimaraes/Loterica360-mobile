import api from './api'
import { VendaCaixa, VendaCaixaRequest, PaginatedResponse } from '../types'

export const vendaCaixaService = {
  async getVendas(page: number = 0, size: number = 20): Promise<PaginatedResponse<VendaCaixa>> {
    const response = await api.get(`/vendas-caixa?page=${page}&size=${size}`)
    return response.data
  },

  async getVendasByPeriodo(
    dataInicio: string, 
    dataFim: string, 
    page: number = 0, 
    size: number = 20
  ): Promise<PaginatedResponse<VendaCaixa>> {
    const response = await api.get(
      `/vendas-caixa/periodo?dataInicio=${dataInicio}&dataFim=${dataFim}&page=${page}&size=${size}`
    )
    return response.data
  },

  async getVendaById(id: string): Promise<VendaCaixa> {
    const response = await api.get(`/vendas-caixa/${id}`)
    return response.data
  },

  async createVenda(venda: VendaCaixaRequest): Promise<VendaCaixa> {
    const response = await api.post('/vendas-caixa', venda)
    return response.data
  },

  async deleteVenda(id: string): Promise<void> {
    await api.delete(`/vendas-caixa/${id}`)
  }
}


