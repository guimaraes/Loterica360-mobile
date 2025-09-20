import api from './api'
import { Cliente, PaginatedResponse } from '../types'

export const clienteService = {
  async getClientes(page: number = 0, size: number = 20): Promise<PaginatedResponse<Cliente>> {
    const response = await api.get(`/clientes?page=${page}&size=${size}`)
    return response.data
  },

  async getCliente(id: string): Promise<Cliente> {
    const response = await api.get(`/clientes/${id}`)
    return response.data
  },

  async createCliente(cliente: Omit<Cliente, 'id' | 'criadoEm' | 'atualizadoEm'>): Promise<Cliente> {
    const response = await api.post('/clientes', cliente)
    return response.data
  },

  async updateCliente(id: string, cliente: Partial<Cliente>): Promise<Cliente> {
    const response = await api.put(`/clientes/${id}`, cliente)
    return response.data
  },
}


