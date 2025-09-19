import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store'
import { setSidebarOpen } from '../store/slices/uiSlice'
import { useAuth } from '../hooks/useAuth'
import Icon from 'react-native-vector-icons/MaterialIcons'

const ProfileScreen: React.FC = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.auth)
  const { logout } = useAuth()

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: logout,
        },
      ]
    )
  }

  const getRoleDisplayName = (papel: string) => {
    const roleNames = {
      ADMIN: 'Administrador',
      GERENTE: 'Gerente',
      VENDEDOR: 'Vendedor',
      AUDITOR: 'Auditor',
    }
    return roleNames[papel as keyof typeof roleNames] || papel
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => dispatch(setSidebarOpen(true))}
        >
          <Icon name="menu" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Perfil</Text>
      </View>
      
      <View style={styles.content}>
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Icon name="account-circle" size={80} color="#6200ea" />
          </View>
          
          <Text style={styles.userName}>{user?.nome}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          
          <View style={styles.roleContainer}>
            <Icon name="verified" size={20} color="#4caf50" />
            <Text style={styles.userRole}>{getRoleDisplayName(user?.papel || '')}</Text>
          </View>
          
          <View style={styles.statusContainer}>
            <Icon 
              name={user?.ativo ? "check-circle" : "cancel"} 
              size={20} 
              color={user?.ativo ? "#4caf50" : "#f44336"} 
            />
            <Text style={[
              styles.statusText, 
              { color: user?.ativo ? "#4caf50" : "#f44336" }
            ]}>
              {user?.ativo ? "Ativo" : "Inativo"}
            </Text>
          </View>
        </View>
        
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="edit" size={24} color="#6200ea" />
            <Text style={styles.actionText}>Editar Perfil</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="lock" size={24} color="#6200ea" />
            <Text style={styles.actionText}>Alterar Senha</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="settings" size={24} color="#6200ea" />
            <Text style={styles.actionText}>Configurações</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="logout" size={24} color="#fff" />
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>
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
  content: {
    flex: 1,
    padding: 16,
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  userRole: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4caf50',
    marginLeft: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  actionsContainer: {
    marginBottom: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
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
  actionText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#d32f2f',
    padding: 16,
    borderRadius: 8,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
})

export default ProfileScreen

