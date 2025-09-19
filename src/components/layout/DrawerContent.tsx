import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native'
import { DrawerContentScrollView, DrawerContentComponentProps } from '@react-navigation/drawer'
import { useNavigation } from '@react-navigation/native'
import { useAuth } from '../../hooks/useAuth'
import { useDispatch } from 'react-redux'
import { setSidebarOpen } from '../../store/slices/uiSlice'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { User } from '../../types'

interface DrawerContentProps extends DrawerContentComponentProps {
  user: User | null
}

const DrawerContent: React.FC<DrawerContentProps> = ({ user, ...props }) => {
  const navigation = useNavigation()
  const { logout } = useAuth()
  const dispatch = useDispatch()

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            await logout()
            dispatch(setSidebarOpen(false))
          },
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

  const menuItems = [
    {
      name: 'Dashboard',
      icon: 'dashboard',
      route: 'Dashboard',
      roles: ['ADMIN', 'GERENTE', 'AUDITOR'],
    },
    {
      name: 'Vendas',
      icon: 'shopping-cart',
      route: 'Vendas',
      roles: ['ADMIN', 'GERENTE', 'VENDEDOR'],
    },
    {
      name: 'Clientes',
      icon: 'people',
      route: 'Clientes',
      roles: ['ADMIN', 'GERENTE', 'VENDEDOR', 'AUDITOR'],
    },
    {
      name: 'Jogos',
      icon: 'games',
      route: 'Jogos',
      roles: ['ADMIN', 'GERENTE', 'AUDITOR'],
    },
    {
      name: 'Bolões',
      icon: 'group',
      route: 'Boloes',
      roles: ['ADMIN', 'GERENTE', 'AUDITOR'],
    },
    {
      name: 'Usuários',
      icon: 'person',
      route: 'Usuarios',
      roles: ['ADMIN'],
    },
    {
      name: 'Relatórios',
      icon: 'assessment',
      route: 'Relatorios',
      roles: ['ADMIN', 'GERENTE', 'AUDITOR'],
    },
    {
      name: 'Perfil',
      icon: 'account-circle',
      route: 'Profile',
      roles: ['ADMIN', 'GERENTE', 'VENDEDOR', 'AUDITOR'],
    },
  ]

  const filteredMenuItems = menuItems.filter(item => 
    user && item.roles.includes(user.papel)
  )

  return (
    <View style={styles.container}>
      <DrawerContentScrollView {...props} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Icon name="account-circle" size={60} color="#6200ea" />
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{user?.nome}</Text>
              <Text style={styles.userRole}>{getRoleDisplayName(user?.papel || '')}</Text>
              <Text style={styles.userEmail}>{user?.email}</Text>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {filteredMenuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => {
                navigation.navigate(item.route as never)
                dispatch(setSidebarOpen(false))
              }}
            >
              <Icon name={item.icon} size={24} color="#666" />
              <Text style={styles.menuItemText}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </DrawerContentScrollView>

      {/* Footer */}
      <View style={styles.footer}>
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
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userDetails: {
    marginLeft: 15,
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  userRole: {
    fontSize: 14,
    color: '#6200ea',
    fontWeight: '600',
    marginTop: 2,
  },
  userEmail: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  menuContainer: {
    paddingTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    paddingLeft: 20,
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    padding: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#d32f2f',
    padding: 12,
    borderRadius: 8,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
})

export default DrawerContent
