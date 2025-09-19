import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useDispatch } from 'react-redux'
import { setSidebarOpen } from '../store/slices/uiSlice'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { Jogo } from '../types'

const JogosScreen: React.FC = () => {
  const navigation = useNavigation()
  const dispatch = useDispatch()
  
  const [jogos, setJogos] = useState<Jogo[]>([])
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    loadJogos()
  }, [])

  const loadJogos = async () => {
    try {
      // Dados mockados para demonstração
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
        {
          id: '3',
          nome: 'Lotofácil',
          descricao: 'Loteria da Lotofácil',
          preco: 5.00,
          ativo: false,
          criadoEm: '2024-01-01T00:00:00',
          atualizadoEm: '2024-01-01T00:00:00',
        },
      ])
    } catch (error) {
      console.error('Erro ao carregar jogos:', error)
      Alert.alert('Erro', 'Erro ao carregar lista de jogos')
    }
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await loadJogos()
    setRefreshing(false)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const renderJogoItem = ({ item }: { item: Jogo }) => (
    <View style={[styles.jogoItem, !item.ativo && styles.jogoInativo]}>
      <View style={styles.jogoHeader}>
        <Text style={styles.jogoNome}>{item.nome}</Text>
        <View style={[styles.statusBadge, item.ativo ? styles.ativo : styles.inativo]}>
          <Text style={styles.statusText}>
            {item.ativo ? 'Ativo' : 'Inativo'}
          </Text>
        </View>
      </View>
      <Text style={styles.jogoDescricao}>{item.descricao}</Text>
      <Text style={styles.jogoPreco}>{formatCurrency(item.preco)}</Text>
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
        <Text style={styles.headerTitle}>Jogos</Text>
      </View>

      {/* Lista de Jogos */}
      <FlatList
        data={jogos}
        renderItem={renderJogoItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="games" size={64} color="#ccc" />
            <Text style={styles.emptyText}>Nenhum jogo encontrado</Text>
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
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  menuButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  list: {
    flex: 1,
    padding: 16,
  },
  jogoItem: {
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
  jogoInativo: {
    opacity: 0.6,
  },
  jogoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  jogoNome: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ativo: {
    backgroundColor: '#e8f5e8',
  },
  inativo: {
    backgroundColor: '#ffebee',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4caf50',
  },
  jogoDescricao: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  jogoPreco: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6200ea',
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
  },
})

export default JogosScreen
