import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  TextInput,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useDispatch } from 'react-redux'
import { setSidebarOpen } from '../store/slices/uiSlice'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { Cliente } from '../types'

const ClientesScreen: React.FC = () => {
  const navigation = useNavigation()
  const dispatch = useDispatch()
  
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [refreshing, setRefreshing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')

  useEffect(() => {
    loadClientes()
  }, [])

  const loadClientes = async () => {
    try {
      setLoading(true)
      // Aqui você faria a chamada para a API
      // const response = await clienteService.getClientes()
      // setClientes(response.data.content)
      
      // Dados mockados para demonstração
      setClientes([
        {
          id: '1',
          nome: 'João Silva',
          cpf: '123.456.789-00',
          email: 'joao@email.com',
          telefone: '(11) 99999-9999',
          endereco: 'Rua das Flores, 123',
          cidade: 'São Paulo',
          estado: 'SP',
          cep: '01234-567',
          dataNascimento: '1990-05-15',
          consentimentoLgpd: true,
          criadoEm: '2024-01-15T10:30:00',
          atualizadoEm: '2024-01-15T10:30:00',
        },
        {
          id: '2',
          nome: 'Maria Santos',
          cpf: '987.654.321-00',
          email: 'maria@email.com',
          telefone: '(11) 88888-8888',
          endereco: 'Av. Paulista, 456',
          cidade: 'São Paulo',
          estado: 'SP',
          cep: '01310-100',
          consentimentoLgpd: true,
          criadoEm: '2024-02-20T14:45:00',
          atualizadoEm: '2024-02-20T14:45:00',
        },
      ])
    } catch (error) {
      console.error('Erro ao carregar clientes:', error)
      Alert.alert('Erro', 'Erro ao carregar lista de clientes')
    } finally {
      setLoading(false)
    }
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await loadClientes()
    setRefreshing(false)
  }

  const handleNovoCliente = () => {
    Alert.alert('Novo Cliente', 'Funcionalidade será implementada')
  }

  const handleEditarCliente = (cliente: Cliente) => {
    Alert.alert('Editar Cliente', `Editar cliente: ${cliente.nome}`)
  }

  const formatCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  const filteredClientes = clientes.filter(cliente =>
    cliente.nome.toLowerCase().includes(searchText.toLowerCase()) ||
    cliente.cpf.includes(searchText) ||
    (cliente.email && cliente.email.toLowerCase().includes(searchText.toLowerCase()))
  )

  const renderClienteItem = ({ item }: { item: Cliente }) => (
    <TouchableOpacity
      style={styles.clienteItem}
      onPress={() => handleEditarCliente(item)}
    >
      <View style={styles.clienteHeader}>
        <View style={styles.clienteInfo}>
          <Text style={styles.clienteNome}>{item.nome}</Text>
          <Text style={styles.clienteCpf}>{formatCPF(item.cpf)}</Text>
        </View>
        <Icon name="edit" size={20} color="#666" />
      </View>
      
      {item.email && (
        <View style={styles.clienteDetail}>
          <Icon name="email" size={16} color="#666" />
          <Text style={styles.clienteDetailText}>{item.email}</Text>
        </View>
      )}
      
      {item.telefone && (
        <View style={styles.clienteDetail}>
          <Icon name="phone" size={16} color="#666" />
          <Text style={styles.clienteDetailText}>{item.telefone}</Text>
        </View>
      )}
      
      <View style={styles.clienteDetail}>
        <Icon name="location-on" size={16} color="#666" />
        <Text style={styles.clienteDetailText}>
          {item.cidade}, {item.estado}
        </Text>
      </View>
      
      <View style={styles.lgpdContainer}>
        <Icon 
          name={item.consentimentoLgpd ? "check-circle" : "cancel"} 
          size={16} 
          color={item.consentimentoLgpd ? "#4caf50" : "#f44336"} 
        />
        <Text style={[
          styles.lgpdText, 
          { color: item.consentimentoLgpd ? "#4caf50" : "#f44336" }
        ]}>
          {item.consentimentoLgpd ? "LGPD Consentido" : "LGPD Não Consentido"}
        </Text>
      </View>
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
        <Text style={styles.headerTitle}>Clientes</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleNovoCliente}>
          <Icon name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchWrapper}>
          <Icon name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar clientes..."
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Icon name="clear" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Summary */}
      <View style={styles.summary}>
        <Text style={styles.summaryText}>
          Total: {filteredClientes.length} cliente(s)
        </Text>
      </View>

      {/* Lista de Clientes */}
      <FlatList
        data={filteredClientes}
        renderItem={renderClienteItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="people" size={64} color="#ccc" />
            <Text style={styles.emptyText}>
              {searchText ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}
            </Text>
            {!searchText && (
              <TouchableOpacity style={styles.emptyButton} onPress={handleNovoCliente}>
                <Text style={styles.emptyButtonText}>Novo Cliente</Text>
              </TouchableOpacity>
            )}
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
  searchContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
  },
  summary: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  summaryText: {
    fontSize: 14,
    color: '#666',
  },
  list: {
    flex: 1,
    paddingHorizontal: 16,
  },
  clienteItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  clienteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  clienteInfo: {
    flex: 1,
  },
  clienteNome: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  clienteCpf: {
    fontSize: 14,
    color: '#666',
  },
  clienteDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  clienteDetailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
  lgpdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  lgpdText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
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
    textAlign: 'center',
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

export default ClientesScreen

