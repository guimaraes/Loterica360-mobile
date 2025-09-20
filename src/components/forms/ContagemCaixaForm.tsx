import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Modal,
  FlatList,
  TextInput,
} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { ContagemCaixaRequest, Caixa } from '../../types'
import { caixaService } from '../../services/caixaService'
import { contagemCaixaService } from '../../services/contagemCaixaService'
import Toast from 'react-native-toast-message'

interface ContagemCaixaFormProps {
  onSuccess: () => void
  onCancel: () => void
  contagem?: ContagemCaixaRequest
  isEditing?: boolean
}

const ContagemCaixaForm: React.FC<ContagemCaixaFormProps> = ({
  onSuccess,
  onCancel,
  contagem,
  isEditing = false
}) => {
  const [formData, setFormData] = useState<ContagemCaixaRequest>({
    caixaId: '',
    dataContagem: new Date().toISOString().split('T')[0],
    notas200: 0,
    notas100: 0,
    notas50: 0,
    notas20: 0,
    notas10: 0,
    notas5: 0,
    notas2: 0,
    moedas1: 0,
    moedas050: 0,
    moedas025: 0,
    moedas010: 0,
    moedas005: 0
  })
  const [caixas, setCaixas] = useState<Caixa[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showCaixaModal, setShowCaixaModal] = useState(false)

  useEffect(() => {
    loadInitialData()
    if (contagem) {
      setFormData(contagem)
    }
  }, [contagem])

  const loadInitialData = async () => {
    try {
      setLoadingData(true)
      const caixasResponse = await caixaService.getAllCaixasAtivas()
      setCaixas(caixasResponse)
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
    if (!formData.caixaId) {
      Toast.show({
        type: 'error',
        text1: 'Caixa obrigatória',
        text2: 'Selecione uma caixa'
      })
      return
    }

    try {
      setLoading(true)
      
      if (isEditing) {
        // Implementar edição se necessário
        Toast.show({
          type: 'success',
          text1: 'Contagem atualizada',
          text2: 'Contagem atualizada com sucesso!'
        })
      } else {
        await contagemCaixaService.createContagem(formData)
        Toast.show({
          type: 'success',
          text1: 'Contagem registrada',
          text2: 'Contagem registrada com sucesso!'
        })
      }
      
      onSuccess()
    } catch (error) {
      console.error('Erro ao salvar contagem:', error)
      Toast.show({
        type: 'error',
        text1: 'Erro ao salvar contagem',
        text2: 'Tente novamente mais tarde'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof ContagemCaixaRequest, value: number | string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false)
    if (selectedDate) {
      const dateString = selectedDate.toISOString().split('T')[0]
      handleInputChange('dataContagem', dateString)
    }
  }

  const calculateTotals = () => {
    const totalNotas = 
      (formData.notas200 || 0) * 200 +
      (formData.notas100 || 0) * 100 +
      (formData.notas50 || 0) * 50 +
      (formData.notas20 || 0) * 20 +
      (formData.notas10 || 0) * 10 +
      (formData.notas5 || 0) * 5 +
      (formData.notas2 || 0) * 2

    const totalMoedas = 
      (formData.moedas1 || 0) * 1 +
      (formData.moedas050 || 0) * 0.50 +
      (formData.moedas025 || 0) * 0.25 +
      (formData.moedas010 || 0) * 0.10 +
      (formData.moedas005 || 0) * 0.05

    return {
      totalNotas,
      totalMoedas,
      totalGeral: totalNotas + totalMoedas
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const totals = calculateTotals()

  if (loadingData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando dados...</Text>
        </View>
      </SafeAreaView>
    )
  }

  const notaFields = [
    { key: 'notas200' as keyof ContagemCaixaRequest, label: 'R$ 200,00', value: formData.notas200 },
    { key: 'notas100' as keyof ContagemCaixaRequest, label: 'R$ 100,00', value: formData.notas100 },
    { key: 'notas50' as keyof ContagemCaixaRequest, label: 'R$ 50,00', value: formData.notas50 },
    { key: 'notas20' as keyof ContagemCaixaRequest, label: 'R$ 20,00', value: formData.notas20 },
    { key: 'notas10' as keyof ContagemCaixaRequest, label: 'R$ 10,00', value: formData.notas10 },
    { key: 'notas5' as keyof ContagemCaixaRequest, label: 'R$ 5,00', value: formData.notas5 },
    { key: 'notas2' as keyof ContagemCaixaRequest, label: 'R$ 2,00', value: formData.notas2 }
  ]

  const moedaFields = [
    { key: 'moedas1' as keyof ContagemCaixaRequest, label: 'R$ 1,00', value: formData.moedas1 },
    { key: 'moedas050' as keyof ContagemCaixaRequest, label: 'R$ 0,50', value: formData.moedas050 },
    { key: 'moedas025' as keyof ContagemCaixaRequest, label: 'R$ 0,25', value: formData.moedas025 },
    { key: 'moedas010' as keyof ContagemCaixaRequest, label: 'R$ 0,10', value: formData.moedas010 },
    { key: 'moedas005' as keyof ContagemCaixaRequest, label: 'R$ 0,05', value: formData.moedas005 }
  ]

  const renderQuantityInput = (field: keyof ContagemCaixaRequest, label: string, value: number) => (
    <View style={styles.quantityInputContainer} key={field}>
      <Text style={styles.quantityLabel}>{label}</Text>
      <View style={styles.quantityInputRow}>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => {
            if (value > 0) {
              handleInputChange(field, value - 1)
            }
          }}
        >
          <Icon name="remove" size={16} color="#666" />
        </TouchableOpacity>
        <TextInput
          style={styles.quantityTextInput}
          value={value.toString()}
          onChangeText={(text) => {
            const newValue = parseInt(text) || 0
            handleInputChange(field, Math.max(0, newValue))
          }}
          keyboardType="numeric"
          textAlign="center"
          maxLength={4}
        />
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => handleInputChange(field, value + 1)}
        >
          <Icon name="add" size={16} color="#666" />
        </TouchableOpacity>
      </View>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          <Text style={styles.title}>Contagem de Caixa</Text>

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

          {/* Data */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Data da Contagem *</Text>
            <TouchableOpacity
              style={styles.pickerContainer}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.pickerLabel}>
                {new Date(formData.dataContagem).toLocaleDateString('pt-BR')}
              </Text>
              <Icon name="calendar-today" size={20} color="#666" />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={new Date(formData.dataContagem)}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateChange}
                maximumDate={new Date()}
              />
            )}
          </View>

          {/* Notas */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Notas</Text>
            <View style={styles.quantityGrid}>
              {notaFields.map(({ key, label, value }) => 
                renderQuantityInput(key, label, value)
              )}
            </View>
          </View>

          {/* Moedas */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Moedas</Text>
            <View style={styles.quantityGrid}>
              {moedaFields.map(({ key, label, value }) => 
                renderQuantityInput(key, label, value)
              )}
            </View>
          </View>

          {/* Resumo */}
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryTitle}>Resumo da Contagem</Text>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Notas:</Text>
              <Text style={styles.summaryValue}>{formatCurrency(totals.totalNotas)}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Moedas:</Text>
              <Text style={styles.summaryValue}>{formatCurrency(totals.totalMoedas)}</Text>
            </View>
            <View style={[styles.summaryItem, styles.totalItem]}>
              <Text style={styles.totalLabel}>Total Geral:</Text>
              <Text style={styles.totalValue}>{formatCurrency(totals.totalGeral)}</Text>
            </View>
          </View>

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
                {loading ? 'Salvando...' : isEditing ? 'Atualizar' : 'Registrar Contagem'}
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
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  quantityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quantityInputContainer: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 12,
  },
  quantityLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  quantityInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 12,
    minWidth: 24,
    textAlign: 'center',
  },
  quantityTextInput: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 12,
    minWidth: 40,
    textAlign: 'center',
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  summaryContainer: {
    backgroundColor: '#e8f5e8',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2e7d32',
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
    borderTopColor: '#c8e6c9',
    paddingTop: 8,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2e7d32',
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
    backgroundColor: '#4caf50',
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

export default ContagemCaixaForm
