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
  SafeAreaView,
  Modal,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { VendaCaixa, ContagemCaixa, VendaCaixaRequest, ContagemCaixaRequest } from '../types'
import { vendaCaixaService } from '../services/vendaCaixaService'
import { contagemCaixaService } from '../services/contagemCaixaService'
import VendaCaixaForm from '../components/forms/VendaCaixaForm'
import ContagemCaixaForm from '../components/forms/ContagemCaixaForm'
import Toast from 'react-native-toast-message'

type TabType = 'vendas' | 'contagem'

const VendasScreen: React.FC = () => {
  const navigation = useNavigation()
  const [activeTab, setActiveTab] = useState<TabType>('vendas')
  
  // Estados para vendas
  const [vendas, setVendas] = useState<VendaCaixa[]>([])
  const [vendasLoading, setVendasLoading] = useState(false)
  const [vendasRefreshing, setVendasRefreshing] = useState(false)
  const [vendasCurrentPage, setVendasCurrentPage] = useState(0)
  const [vendasPageSize] = useState(10)
  const [vendasTotal, setVendasTotal] = useState(0)
  
  // Estados para contagem
  const [contagens, setContagens] = useState<ContagemCaixa[]>([])
  const [contagensLoading, setContagensLoading] = useState(false)
  const [contagensRefreshing, setContagensRefreshing] = useState(false)
  const [contagensCurrentPage, setContagensCurrentPage] = useState(0)
  const [contagensPageSize] = useState(10)
  const [contagensTotal, setContagensTotal] = useState(0)

  // Estados dos modais
  const [isVendaModalOpen, setIsVendaModalOpen] = useState(false)
  const [isContagemModalOpen, setIsContagemModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<VendaCaixa | ContagemCaixa | null>(null)
  const [deleteType, setDeleteType] = useState<'venda' | 'contagem'>('venda')

  useEffect(() => {
    if (activeTab === 'vendas') {
      loadVendas()
    } else {
      loadContagens()
    }
  }, [activeTab, vendasCurrentPage, contagensCurrentPage])

  const loadVendas = async () => {
    setVendasLoading(true)
    try {
      const response = await vendaCaixaService.getVendas(vendasCurrentPage, vendasPageSize)
      setVendas(response.content)
      setVendasTotal(response.totalElements)
    } catch (error) {
      console.error('Erro ao carregar vendas:', error)
      Toast.show({
        type: 'error',
        text1: 'Erro ao carregar vendas',
        text2: 'Tente novamente mais tarde'
      })
    } finally {
      setVendasLoading(false)
    }
  }

  const loadContagens = async () => {
    setContagensLoading(true)
    try {
      const response = await contagemCaixaService.getContagens(contagensCurrentPage, contagensPageSize)
      setContagens(response.content)
      setContagensTotal(response.totalElements)
    } catch (error) {
      console.error('Erro ao carregar contagens:', error)
      Toast.show({
        type: 'error',
        text1: 'Erro ao carregar contagens',
        text2: 'Tente novamente mais tarde'
      })
    } finally {
      setContagensLoading(false)
    }
  }

  const onRefreshVendas = async () => {
    setVendasRefreshing(true)
    await loadVendas()
    setVendasRefreshing(false)
  }

  const onRefreshContagens = async () => {
    setContagensRefreshing(true)
    await loadContagens()
    setContagensRefreshing(false)
  }

  const handleDelete = async () => {
    if (!selectedItem) return

    try {
      if (deleteType === 'venda') {
        await vendaCaixaService.deleteVenda(selectedItem.id)
        Toast.show({
          type: 'success',
          text1: 'Venda excluída',
          text2: 'Venda excluída com sucesso!'
        })
        loadVendas()
      } else {
        await contagemCaixaService.deleteContagem(selectedItem.id)
        Toast.show({
          type: 'success',
          text1: 'Contagem excluída',
          text2: 'Contagem excluída com sucesso!'
        })
        loadContagens()
      }
      setIsDeleteModalOpen(false)
      setSelectedItem(null)
    } catch (error) {
      console.error('Erro ao excluir:', error)
      Toast.show({
        type: 'error',
        text1: 'Erro ao excluir item',
        text2: 'Tente novamente mais tarde'
      })
    }
  }

  const handleModalSuccess = () => {
    if (activeTab === 'vendas') {
      loadVendas()
    } else {
      loadContagens()
    }
    setIsVendaModalOpen(false)
    setIsContagemModalOpen(false)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const renderVendaItem = ({ item }: { item: VendaCaixa }) => (
    <View style={styles.listItem}>
      <View style={styles.itemHeader}>
        <View style={styles.itemLeft}>
          <Text style={styles.itemTitle}>{item.nomeJogo}</Text>
          <Text style={styles.itemSubtitle}>
            Caixa {item.numeroCaixa} - {item.quantidade} bilhetes
          </Text>
          <Text style={styles.itemDate}>{formatDate(item.dataVenda)}</Text>
        </View>
        <View style={styles.itemRight}>
          <Text style={styles.itemValue}>{formatCurrency(item.valorTotal)}</Text>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => {
              setSelectedItem(item)
              setDeleteType('venda')
              setIsDeleteModalOpen(true)
            }}
          >
            <Icon name="delete" size={20} color="#d32f2f" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )

  const renderContagemItem = ({ item }: { item: ContagemCaixa }) => (
    <View style={styles.listItem}>
      <View style={styles.itemHeader}>
        <View style={styles.itemLeft}>
          <Text style={styles.itemTitle}>Contagem Caixa {item.numeroCaixa}</Text>
          <Text style={styles.itemSubtitle}>
            {formatDate(item.dataContagem)} - {item.nomeUsuario}
          </Text>
        </View>
        <View style={styles.itemRight}>
          <Text style={styles.itemValue}>{formatCurrency(item.totalGeral)}</Text>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => {
              setSelectedItem(item)
              setDeleteType('contagem')
              setIsDeleteModalOpen(true)
            }}
          >
            <Icon name="delete" size={20} color="#d32f2f" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon 
        name={activeTab === 'vendas' ? 'shopping-cart' : 'calculate'} 
        size={64} 
        color="#ccc" 
      />
      <Text style={styles.emptyStateTitle}>
        {activeTab === 'vendas' ? 'Nenhuma venda encontrada' : 'Nenhuma contagem encontrada'}
      </Text>
      <Text style={styles.emptyStateSubtitle}>
        {activeTab === 'vendas' 
          ? 'Toque no botão + para registrar uma nova venda'
          : 'Toque no botão + para fazer uma nova contagem'
        }
      </Text>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.openDrawer()}
        >
          <Icon name="menu" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Vendas e Contagem</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            if (activeTab === 'vendas') {
              setIsVendaModalOpen(true)
            } else {
              setIsContagemModalOpen(true)
            }
          }}
        >
          <Icon name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'vendas' && styles.activeTab]}
          onPress={() => setActiveTab('vendas')}
        >
          <Icon name="attach-money" size={20} color={activeTab === 'vendas' ? '#fff' : '#666'} />
          <Text style={[styles.tabText, activeTab === 'vendas' && styles.activeTabText]}>
            Vendas
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'contagem' && styles.activeTab]}
          onPress={() => setActiveTab('contagem')}
        >
          <Icon name="calculate" size={20} color={activeTab === 'contagem' ? '#fff' : '#666'} />
          <Text style={[styles.tabText, activeTab === 'contagem' && styles.activeTabText]}>
            Contagem
          </Text>
        </TouchableOpacity>
      </View>

      {/* Summary */}
      <View style={styles.summary}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>
            {activeTab === 'vendas' ? 'Total Vendas' : 'Total Contagens'}
          </Text>
          <Text style={styles.summaryValue}>
            {activeTab === 'vendas' ? vendasTotal : contagensTotal}
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Hoje</Text>
          <Text style={styles.summaryValue}>
            {activeTab === 'vendas' 
              ? vendas.filter(v => new Date(v.dataVenda).toDateString() === new Date().toDateString()).length
              : contagens.filter(c => new Date(c.dataContagem).toDateString() === new Date().toDateString()).length
            }
          </Text>
        </View>
      </View>

      {/* Lista */}
      <FlatList
        data={activeTab === 'vendas' ? vendas : contagens}
        renderItem={activeTab === 'vendas' ? renderVendaItem : renderContagemItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={activeTab === 'vendas' ? vendasRefreshing : contagensRefreshing}
            onRefresh={activeTab === 'vendas' ? onRefreshVendas : onRefreshContagens}
          />
        }
        ListEmptyComponent={renderEmptyState}
      />

      {/* Modais */}
      <Modal
        visible={isVendaModalOpen}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <VendaCaixaForm
          onSuccess={handleModalSuccess}
          onCancel={() => setIsVendaModalOpen(false)}
        />
      </Modal>

      <Modal
        visible={isContagemModalOpen}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <ContagemCaixaForm
          onSuccess={handleModalSuccess}
          onCancel={() => setIsContagemModalOpen(false)}
        />
      </Modal>

      <Modal
        visible={isDeleteModalOpen}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Excluir {deleteType === 'venda' ? 'Venda' : 'Contagem'}
            </Text>
            <Text style={styles.modalMessage}>
              Tem certeza que deseja excluir esta {deleteType === 'venda' ? 'venda' : 'contagem'}?
              Esta ação não pode ser desfeita.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setIsDeleteModalOpen(false)}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalDeleteButton}
                onPress={handleDelete}
              >
                <Text style={styles.modalDeleteText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    minHeight: 56,
  },
  menuButton: {
    padding: 12,
    minWidth: 48,
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#6200ea',
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    margin: 16,
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#6200ea',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginLeft: 8,
  },
  activeTabText: {
    color: '#fff',
  },
  summary: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
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
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  listItem: {
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
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  itemLeft: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  itemDate: {
    fontSize: 12,
    color: '#999',
  },
  itemRight: {
    alignItems: 'flex-end',
  },
  itemValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4caf50',
    marginBottom: 8,
  },
  deleteButton: {
    padding: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
    lineHeight: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalCancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  modalCancelText: {
    fontSize: 14,
    color: '#666',
  },
  modalDeleteButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#d32f2f',
    borderRadius: 4,
  },
  modalDeleteText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
})

export default VendasScreen