import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  FlatList,
  Alert,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store'
import { setSidebarOpen } from '../store/slices/uiSlice'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { VendaCaixa, Jogo, Caixa } from '../types'

const VendasScreen: React.FC = () => {
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.auth)
  
  const [vendas, setVendas] = useState<VendaCaixa[]>([])
  const [jogos, setJogos] = useState<Jogo[]>([])
  const [caixas, setCaixas] = useState<Caixa[]>([])
  const [refreshing, setRefreshing] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      // Aqui você faria as chamadas para a API
      // const [vendasResponse, jogosResponse, caixasResponse] = await Promise.all([
      //   vendaCaixaService.getVendas(),
      //   jogoService.getJogosAtivos(),
      //   caixaService.getCaixasAtivas(),
      // ])
      
      // Dados mockados para demonstração
      setVendas([
        {
          id: '1',
          caixaId: '1',
          jogoId: '1',
          quantidade: 5,
          precoUnitario: 5.00,
          precoTotal: 25.00,
          dataVenda: '2024-09-19T10:30:00',
          vendedorId: user?.id || '',
          clienteId: '1',
          criadoEm: '2024-09-19T10:30:00',
          atualizadoEm: '2024-09-19T10:30:00',
        },
        {
          id: '2',
          caixaId: '1',
          jogoId: '2',
          quantidade: 3,
          precoUnitario: 2.50,
          precoTotal: 7.50,
          dataVenda: '2024-09-19T11:15:00',
          vendedorId: user?.id || '',
          criadoEm: '2024-09-19T11:15:00',
          atualizadoEm: '2024-09-19T11:15:00',
        },
      ])
      
      setJogos([
        {
          id: '1',
          nome: 'Mega Sena',
          descricao: 'Loteria da Mega Sena',
          preco: 5.00,
          ativo: true,
          criadoEm: '2024-01-01T00:00:00',
          atualizadoEm: '2024-01-01T00:00:00',
        },
        {
          id: '2',
          nome: 'Quina',
          descricao: 'Loteria da Quina',
          preco: 2.50,
          ativo: true,
          criadoEm: '2024-01-01T00:00:00',
          atualizadoEm: '2024-01-01T00:00:00',
        },
      ])
      
      setCaixas([
        {
          id: '1',
          nome: 'Caixa 1',
          ativo: true,
          criadoEm: '2024-01-01T00:00:00',
          atualizadoEm: '2024-01-01T00:00:00',
        },
      ])
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      Alert.alert('Erro', 'Erro ao carregar dados das vendas')
    } finally {
      setLoading(false)
    }
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await loadData()
    setRefreshing(false)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR')
  }

  const getJogoNome = (jogoId: string) => {
    const jogo = jogos.find(j => j.id === jogoId)
    return jogo?.nome || 'Jogo não encontrado'
  }

  const getCaixaNome = (caixaId: string) => {
    const caixa = caixas.find(c => c.id === caixaId)
    return caixa?.nome || 'Caixa não encontrado'
  }

  const handleNovaVenda = () => {
    // Aqui você navegaria para uma tela de nova venda
    Alert.alert('Nova Venda', 'Funcionalidade será implementada')
  }

  const renderVendaItem = ({ item }: { item: VendaCaixa }) => (
    <View style={styles.vendaItem}>
      <View style={styles.vendaHeader}>
        <Text style={styles.jogoNome}>{getJogoNome(item.jogoId)}</Text>
        <Text style={styles.vendaValor}>{formatCurrency(item.precoTotal)}</Text>
      </View>
      <View style={styles.vendaDetails}>
        <Text style={styles.vendaDetail}>
          <Icon name="shopping-cart" size={16} color="#666" /> {item.quantidade}x {formatCurrency(item.precoUnitario)}
        </Text>
        <Text style={styles.vendaDetail}>
          <Icon name="store" size={16} color="#666" /> {getCaixaNome(item.caixaId)}
        </Text>
        <Text style={styles.vendaDetail}>
          <Icon name="access-time" size={16} color="#666" /> {formatDate(item.dataVenda)}
        </Text>
      </View>
    </View>
  )

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => dispatch(setSidebarOpen(true))}
        >
          <Icon name="menu" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Vendas</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleNovaVenda}>
          <Icon name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Resumo */}
      <View style={styles.summary}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total Vendas</Text>
          <Text style={styles.summaryValue}>{vendas.length}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Valor Total</Text>
          <Text style={styles.summaryValue}>
            {formatCurrency(vendas.reduce((sum, venda) => sum + venda.precoTotal, 0))}
          </Text>
        </View>
      </View>

      {/* Lista de Vendas */}
      <FlatList
        data={vendas}
        renderItem={renderVendaItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="shopping-cart" size={64} color="#ccc" />
            <Text style={styles.emptyText}>Nenhuma venda encontrada</Text>
            <TouchableOpacity style={styles.emptyButton} onPress={handleNovaVenda}>
              <Text style={styles.emptyButtonText}>Nova Venda</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  menuButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#6200ea',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summary: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  list: {
    flex: 1,
    paddingHorizontal: 16,
  },
  vendaItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  vendaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  jogoNome: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  vendaValor: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4caf50',
  },
  vendaDetails: {
    gap: 4,
  },
  vendaDetail: {
    fontSize: 14,
    color: '#666',
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: '#6200ea',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
})

export default VendasScreen
