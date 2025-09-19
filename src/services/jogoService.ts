import api from './api'
import { Jogo, PaginatedResponse } from '../types'

export const jogoService = {
  async getJogos(page: number = 0, size: number = 20): Promise<PaginatedResponse<Jogo>> {
    const response = await api.get(`/jogos?page=${page}&size=${size}`)
    return response.data
  },

  async getJogosAtivos(): Promise<Jogo[]> {
    const response = await api.get('/jogos/ativos')
    return response.data
  },

  async getJogo(id: string): Promise<Jogo> {
    const response = await api.get(`/jogos/${id}`)
    return response.data
  },

  async createJogo(jogo: Omit<Jogo, 'id' | 'criadoEm' | 'atualizadoEm'>): Promise<Jogo> {
    const response = await api.post('/jogos', jogo)
    return response.data
  },

  async updateJogo(id: string, jogo: Partial<Jogo>): Promise<Jogo> {
    const response = await api.put(`/jogos/${id}`, jogo)
    return response.data
  },

  async toggleJogoStatus(id: string): Promise<Jogo> {
    const response = await api.patch(`/jogos/${id}/toggle-status`)
    return response.data
  },
}
