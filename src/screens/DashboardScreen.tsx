import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useDispatch } from 'react-redux'
import { setSidebarOpen } from '../store/slices/uiSlice'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { DashboardMetrics } from '../types'

const { width } = Dimensions.get('window')

const DashboardScreen: React.FC = () => {
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      // Aqui você faria a chamada para a API
      // const response = await dashboardService.getMetrics()
      // setMetrics(response.data)
      
      // Dados mockados para demonstração
      setMetrics({
        totalVendas: 1250,
        totalValor: 45680.50,
        totalVendasHoje: 45,
        totalValorHoje: 2340.00,
        totalClientes: 890,
        totalUsuarios: 12,
        totalJogos: 25,
        totalBoloes: 8,
        vendasPorJogo: [
          { jogo: 'Mega Sena', quantidade: 450, valor: 22500 },
          { jogo: 'Quina', quantidade: 320, valor: 16000 },
          { jogo: 'Lotofácil', quantidade: 280, valor: 1400 },
        ],
        vendasPorCaixa: [
          { caixa: 'Caixa 1', quantidade: 650, valor: 22840 },
          { caixa: 'Caixa 2', quantidade: 600, valor: 22840 },
        ],
        vendasPorDia: [
          { data: '2024-09-19', quantidade: 45, valor: 2340 },
          { data: '2024-09-18', quantidade: 52, valor: 2890 },
          { data: '2024-09-17', quantidade: 38, valor: 2100 },
        ],
      })
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error)
    }
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await loadDashboardData()
    setRefreshing(false)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const MetricCard: React.FC<{
    title: string
    value: string | number
    icon: string
    color: string
    onPress?: () => void
  }> = ({ title, value, icon, color, onPress }) => (
    <TouchableOpacity
      style={[styles.metricCard, { borderLeftColor: color }]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.metricHeader}>
        <Icon name={icon} size={24} color={color} />
        <Text style={styles.metricTitle}>{title}</Text>
      </View>
      <Text style={[styles.metricValue, { color }]}>{value}</Text>
    </TouchableOpacity>
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
        <Text style={styles.headerTitle}>Dashboard</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
          <Icon name="refresh" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Métricas Principais */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumo Geral</Text>
          <View style={styles.metricsGrid}>
            <MetricCard
              title="Vendas Hoje"
              value={metrics?.totalVendasHoje || 0}
              icon="today"
              color="#4caf50"
            />
            <MetricCard
              title="Valor Hoje"
              value={formatCurrency(metrics?.totalValorHoje || 0)}
              icon="attach-money"
              color="#2196f3"
            />
            <MetricCard
              title="Total Vendas"
              value={metrics?.totalVendas || 0}
              icon="shopping-cart"
              color="#ff9800"
            />
            <MetricCard
              title="Total Valor"
              value={formatCurrency(metrics?.totalValor || 0)}
              icon="account-balance-wallet"
              color="#9c27b0"
            />
          </View>
        </View>

        {/* Métricas Secundárias */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações Gerais</Text>
          <View style={styles.metricsGrid}>
            <MetricCard
              title="Clientes"
              value={metrics?.totalClientes || 0}
              icon="people"
              color="#00bcd4"
              onPress={() => navigation.navigate('Clientes' as never)}
            />
            <MetricCard
              title="Jogos"
              value={metrics?.totalJogos || 0}
              icon="games"
              color="#795548"
              onPress={() => navigation.navigate('Jogos' as never)}
            />
            <MetricCard
              title="Bolões"
              value={metrics?.totalBoloes || 0}
              icon="group"
              color="#607d8b"
              onPress={() => navigation.navigate('Boloes' as never)}
            />
            <MetricCard
              title="Usuários"
              value={metrics?.totalUsuarios || 0}
              icon="person"
              color="#e91e63"
              onPress={() => navigation.navigate('Usuarios' as never)}
            />
          </View>
        </View>

        {/* Top Jogos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Jogos</Text>
          <View style={styles.listContainer}>
            {metrics?.vendasPorJogo.slice(0, 3).map((item, index) => (
              <View key={index} style={styles.listItem}>
                <View style={styles.listItemLeft}>
                  <Text style={styles.listItemTitle}>{item.jogo}</Text>
                  <Text style={styles.listItemSubtitle}>
                    {item.quantidade} vendas
                  </Text>
                </View>
                <Text style={styles.listItemValue}>
                  {formatCurrency(item.valor)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Vendas por Caixa */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vendas por Caixa</Text>
          <View style={styles.listContainer}>
            {metrics?.vendasPorCaixa.map((item, index) => (
              <View key={index} style={styles.listItem}>
                <View style={styles.listItemLeft}>
                  <Text style={styles.listItemTitle}>{item.caixa}</Text>
                  <Text style={styles.listItemSubtitle}>
                    {item.quantidade} vendas
                  </Text>
                </View>
                <Text style={styles.listItemValue}>
                  {formatCurrency(item.valor)}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
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
  refreshButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricCard: {
    width: (width - 48) / 2,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
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
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricTitle: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  listContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  listItemLeft: {
    flex: 1,
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  listItemSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  listItemValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4caf50',
  },
})

export default DashboardScreen

