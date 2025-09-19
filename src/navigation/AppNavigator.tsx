import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../store'
import { loadStoredAuthAsync } from '../store/slices/authSlice'

// Screens
import LoginScreen from '../screens/LoginScreen'
import DashboardScreen from '../screens/DashboardScreen'
import VendasScreen from '../screens/VendasScreen'
import ClientesScreen from '../screens/ClientesScreen'
import JogosScreen from '../screens/JogosScreen'
import BoloesScreen from '../screens/BoloesScreen'
import UsuariosScreen from '../screens/UsuariosScreen'
import RelatoriosScreen from '../screens/RelatoriosScreen'
import ProfileScreen from '../screens/ProfileScreen'

// Components
import DrawerContent from '../components/layout/DrawerContent'

const Stack = createStackNavigator()
const Drawer = createDrawerNavigator()

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
  </Stack.Navigator>
)

const AppDrawer = () => {
  const { user } = useSelector((state: RootState) => state.auth)
  
  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerContent {...props} user={user} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: 280,
        },
      }}
    >
      <Drawer.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{ title: 'Dashboard' }}
      />
      
      {user?.papel === 'VENDEDOR' ? (
        // Vendedor só pode acessar vendas
        <Drawer.Screen 
          name="Vendas" 
          component={VendasScreen}
          options={{ title: 'Vendas' }}
        />
      ) : (
        // Outros perfis podem acessar outras telas
        <>
          <Drawer.Screen 
            name="Vendas" 
            component={VendasScreen}
            options={{ title: 'Vendas' }}
          />
          <Drawer.Screen 
            name="Clientes" 
            component={ClientesScreen}
            options={{ title: 'Clientes' }}
          />
          <Drawer.Screen 
            name="Jogos" 
            component={JogosScreen}
            options={{ title: 'Jogos' }}
          />
          <Drawer.Screen 
            name="Boloes" 
            component={BoloesScreen}
            options={{ title: 'Bolões' }}
          />
          {user?.papel === 'ADMIN' && (
            <Drawer.Screen 
              name="Usuarios" 
              component={UsuariosScreen}
              options={{ title: 'Usuários' }}
            />
          )}
          {(user?.papel === 'ADMIN' || user?.papel === 'GERENTE' || user?.papel === 'AUDITOR') && (
            <Drawer.Screen 
              name="Relatorios" 
              component={RelatoriosScreen}
              options={{ title: 'Relatórios' }}
            />
          )}
        </>
      )}
      
      <Drawer.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Perfil' }}
      />
    </Drawer.Navigator>
  )
}

const AppNavigator = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    // Carregar dados de autenticação salvos ao inicializar o app
    dispatch(loadStoredAuthAsync())
  }, [dispatch])

  if (isLoading) {
    // Aqui você pode adicionar um componente de loading
    return null
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppDrawer /> : <AuthStack />}
    </NavigationContainer>
  )
}

export default AppNavigator

