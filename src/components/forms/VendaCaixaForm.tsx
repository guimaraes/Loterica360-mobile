import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Platform,
  Modal,
  FlatList,
} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { useNavigation } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { VendaCaixaRequest, Caixa, Jogo } from '../../types'
import { caixaService } from '../../services/caixaService'
import { jogoService } from '../../services/jogoService'
import { vendaCaixaService } from '../../services/vendaCaixaService'
import Toast from 'react-native-toast-message'

interface VendaCaixaFormProps {
  onSuccess: () => void
  onCancel: () => void
  venda?: VendaCaixaRequest
  isEditing?: boolean
}

const VendaCaixaForm: React.FC<VendaCaixaFormProps> = ({
  onSuccess,
  onCancel,
  venda,
  isEditing = false
}) => {
  const navigation = useNavigation()
  const [formData, setFormData] = useState<VendaCaixaRequest>({
    caixaId: '',
    jogoId: '',
    quantidade: 1,
    dataVenda: new Date().toISOString().split('T')[0]
  })
  const [caixas, setCaixas] = useState<Caixa[]>([])
  const [jogos, setJogos] = useState<Jogo[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showCaixaModal, setShowCaixaModal] = useState(false)
  const [showJogoModal, setShowJogoModal] = useState(false)

  useEffect(() => {
    loadInitialData()
    if (venda) {
      setFormData(venda)
    }
  }, [venda])

  const loadInitialData = async () => {
    try {
      setLoadingData(true)
      const [caixasResponse, jogosResponse] = await Promise.all([
        caixaService.getAllCaixasAtivas(),
        jogoService.getJogosAtivos()
      ])
      
      setCaixas(caixasResponse)
      setJogos(jogosResponse)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      Toast.show({
        type: 'error',
        text1: 'Erro ao carregar dados',
        text2: 'Tente novamente mais tarde'
      })
    } finally {
      setLoadingData(false)
    }
  }

  const handleSubmit = async () => {
    if (!formData.caixaId || !formData.jogoId || formData.quantidade <= 0) {
      Toast.show({
        type: 'error',
        text1: 'Campos obrigatórios',
        text2: 'Preencha todos os campos obrigatórios'
      })
      return
    }

    try {
      setLoading(true)
      
      if (isEditing) {
        // Implementar edição se necessário
        Toast.show({
          type: 'success',
          text1: 'Venda atualizada',
          text2: 'Venda atualizada com sucesso!'
        })
      } else {
        await vendaCaixaService.createVenda(formData)
        Toast.show({
          type: 'success',
          text1: 'Venda registrada',
          text2: 'Venda registrada com sucesso!'
        })
      }
      
      onSuccess()
    } catch (error) {
      console.error('Erro ao salvar venda:', error)
      Toast.show({
        type: 'error',
        text1: 'Erro ao salvar venda',
        text2: 'Tente novamente mais tarde'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof VendaCaixaRequest, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false)
    if (selectedDate) {
      const dateString = selectedDate.toISOString().split('T')[0]
      handleInputChange('dataVenda', dateString)
    }
  }

  const getSelectedJogo = () => {
    return jogos.find(j => j.id === formData.jogoId)
  }

  const calculateTotal = () => {
    const jogo = getSelectedJogo()
    if (jogo && formData.quantidade > 0) {
      return jogo.preco * formData.quantidade
    }
    return 0
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  if (loadingData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando dados...</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          <Text style={styles.title}>Nova Venda</Text>

          {/* Caixa */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Caixa *</Text>
            <TouchableOpacity
              style={styles.pickerContainer}
              onPress={() => setShowCaixaModal(true)}
            >
              <Text style={styles.pickerLabel}>
                {formData.caixaId 
                  ? `Caixa ${caixas.find(c => c.id === formData.caixaId)?.numero} - ${caixas.find(c => c.id === formData.caixaId)?.descricao || 'Sem descrição'}`
                  : 'Selecione uma caixa'
                }
              </Text>
              <Icon name="arrow-drop-down" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Jogo */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Jogo *</Text>
            <TouchableOpacity
              style={styles.pickerContainer}
              onPress={() => setShowJogoModal(true)}
            >
              <Text style={styles.pickerLabel}>
                {formData.jogoId 
                  ? `${jogos.find(j => j.id === formData.jogoId)?.nome} - ${formatCurrency(jogos.find(j => j.id === formData.jogoId)?.preco || 0)}`
                  : 'Selecione um jogo'
                }
              </Text>
              <Icon name="arrow-drop-down" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Quantidade */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Quantidade *</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => {
                  if (formData.quantidade > 1) {
                    handleInputChange('quantidade', formData.quantidade - 1)
                  }
                }}
              >
                <Icon name="remove" size={20} color="#666" />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{formData.quantidade}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => handleInputChange('quantidade', formData.quantidade + 1)}
              >
                <Icon name="add" size={20} color="#666" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Data */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Data da Venda *</Text>
            <TouchableOpacity
              style={styles.pickerContainer}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.pickerLabel}>
                {new Date(formData.dataVenda).toLocaleDateString('pt-BR')}
              </Text>
              <Icon name="calendar-today" size={20} color="#666" />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={new Date(formData.dataVenda)}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateChange}
                maximumDate={new Date()}
              />
            )}
          </View>

          {/* Resumo */}
          {formData.jogoId && formData.quantidade > 0 && (
            <View style={styles.summaryContainer}>
              <Text style={styles.summaryTitle}>Resumo da Venda</Text>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Jogo:</Text>
                <Text style={styles.summaryValue}>{getSelectedJogo()?.nome}</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Preço unitário:</Text>
                <Text style={styles.summaryValue}>{formatCurrency(getSelectedJogo()?.preco || 0)}</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Quantidade:</Text>
                <Text style={styles.summaryValue}>{formData.quantidade}</Text>
              </View>
              <View style={[styles.summaryItem, styles.totalItem]}>
                <Text style={styles.totalLabel}>Valor total:</Text>
                <Text style={styles.totalValue}>{formatCurrency(calculateTotal())}</Text>
              </View>
            </View>
          )}

          {/* Botões */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onCancel}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.submitButton, loading && styles.disabledButton]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.submitButtonText}>
                {loading ? 'Salvando...' : isEditing ? 'Atualizar' : 'Registrar Venda'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Modal de Seleção de Caixa */}
      <Modal
        visible={showCaixaModal}
        animationType="slide"
        transparent
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecionar Caixa</Text>
              <TouchableOpacity onPress={() => setShowCaixaModal(false)}>
                <Icon name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={caixas}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    handleInputChange('caixaId', item.id)
                    setShowCaixaModal(false)
                  }}
                >
                  <Text style={styles.modalItemText}>
                    Caixa {item.numero} - {item.descricao || 'Sem descrição'}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* Modal de Seleção de Jogo */}
      <Modal
        visible={showJogoModal}
        animationType="slide"
        transparent
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecionar Jogo</Text>
              <TouchableOpacity onPress={() => setShowJogoModal(false)}>
                <Icon name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={jogos}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    handleInputChange('jogoId', item.id)
                    setShowJogoModal(false)
                  }}
                >
                  <Text style={styles.modalItemText}>
                    {item.nome} - {formatCurrency(item.preco)}
                  </Text>
                </TouchableOpacity>
              )}
            />
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
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  form: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
    textAlign: 'center',
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  pickerWrapper: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  pickerLabel: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    padding: 16,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 20,
    minWidth: 40,
    textAlign: 'center',
  },
  summaryContainer: {
    backgroundColor: '#e3f2fd',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 12,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  totalItem: {
    borderTopWidth: 1,
    borderTopColor: '#bbdefb',
    paddingTop: 8,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976d2',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976d2',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginRight: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#6200ea',
    padding: 16,
    borderRadius: 8,
    marginLeft: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalItemText: {
    fontSize: 16,
    color: '#333',
  },
})

export default VendaCaixaForm
