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
import { vendaCaixaService } from '../services/vendaCaixaService'
import { jogoService } from '../services/jogoService'
import { caixaService } from '../services/caixaService'
import { dashboardService } from '../services/dashboardService'

const VendasScreen: React.FC = () => {
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.auth)
  
  const [vendas, setVendas] = useState<VendaCaixa[]>([])
  const [jogos, setJogos] = useState<Jogo[]>([])
  const [caixas, setCaixas] = useState<Caixa[]>([])
  const [refreshing, setRefreshing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [totalVendas, setTotalVendas] = useState(0)
  const [valorTotal, setValorTotal] = useState(0)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Carregar dados da API
      const [vendasResponse, jogosResponse, caixasResponse, metricsResponse] = await Promise.all([
        vendaCaixaService.getVendas(0, 20),
        jogoService.getJogosAtivos(),
        caixaService.getCaixasAtivas(),
        dashboardService.getMetrics()
      ])
      
      setVendas(vendasResponse.content)
      setJogos(jogosResponse)
      setCaixas(caixasResponse)
      setTotalVendas(metricsResponse.totalVendasHoje)
      setValorTotal(metricsResponse.totalValorHoje)
      
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      Alert.alert('Erro', 'Não foi possível carregar os dados')
      
      // Fallback para dados vazios em caso de erro
      setVendas([])
      setJogos([])
      setCaixas([])
      setTotalVendas(0)
      setValorTotal(0)
    } finally {
      setLoading(false)
    }
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await loadData()
    setRefreshing(false)
  }

  const handleNovaVenda = () => {
    // Implementar navegação para nova venda
    Alert.alert('Nova Venda', 'Funcionalidade em desenvolvimento')
  }

  const getJogoNome = (jogoId: string) => {
    const jogo = jogos.find(j => j.id === jogoId)
    return jogo?.nome || 'Jogo não encontrado'
  }

  const getCaixaNome = (caixaId: string) => {
    const caixa = caixas.find(c => c.id === caixaId)
    return caixa?.nome || 'Caixa não encontrada'
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  const renderVendaItem = ({ item }: { item: VendaCaixa }) => (
    <View style={styles.vendaItem}>
      <View style={styles.vendaHeader}>
        <Text style={styles.jogoNome}>{getJogoNome(item.jogoId)}</Text>
        <Text style={styles.vendaTotal}>{formatCurrency(item.precoTotal)}</Text>
      </View>
      <View style={styles.vendaDetails}>
        <Text style={styles.vendaInfo}>
          {item.quantidade}x {formatCurrency(item.precoUnitario)}
        </Text>
        <Text style={styles.vendaInfo}>{getCaixaNome(item.caixaId)}</Text>
        <Text style={styles.vendaInfo}>{formatDate(item.dataVenda)}</Text>
      </View>
    </View>
  )

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.openDrawer()}
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
          <Text style={styles.summaryValue}>{totalVendas}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Valor Total</Text>
          <Text style={styles.summaryValue}>{formatCurrency(valorTotal)}</Text>
        </View>
      </View>

      {/* Lista de Vendas */}
      <FlatList
        data={vendas}
        renderItem={renderVendaItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.vendasList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="shopping-cart" size={64} color="#ccc" />
            <Text style={styles.emptyText}>Nenhuma venda encontrada</Text>
            <Text style={styles.emptySubtext}>
              Toque no botão + para adicionar uma nova venda
            </Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 50, // Adicionar espaço para a status bar
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  menuButton: {
    padding: 12,
    marginLeft: -4, // Ajustar posição
    minWidth: 44, // Área mínima de toque
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#6200ea',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -4, // Ajustar posição
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
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
  vendasList: {
    padding: 16,
  },
  vendaItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
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
    fontWeight: 'bold',
    color: '#333',
  },
  vendaTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4caf50',
  },
  vendaDetails: {
    gap: 4,
  },
  vendaInfo: {
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
})

export default VendasScreen