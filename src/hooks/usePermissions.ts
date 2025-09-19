import { useAuth } from './useAuth'

export const useIsAdmin = () => {
  const { isAdmin } = useAuth()
  return isAdmin
}

export const useIsGerente = () => {
  const { isGerente } = useAuth()
  return isGerente
}

export const useIsVendedor = () => {
  const { isVendedor } = useAuth()
  return isVendedor
}

export const useIsAuditor = () => {
  const { isAuditor } = useAuth()
  return isAuditor
}

export const useHasRole = (roles: string[]) => {
  const { hasRole } = useAuth()
  return hasRole(roles)
}

export const useCanAccess = (resource: string, action: string = 'read') => {
  const { user } = useAuth()
  
  if (!user) return false

  // Definir permissões baseadas no papel do usuário
  const permissions = {
    ADMIN: {
      users: ['create', 'read', 'update', 'delete'],
      clients: ['create', 'read', 'update', 'delete'],
      games: ['create', 'read', 'update', 'delete'],
      boloes: ['create', 'read', 'update', 'delete'],
      sales: ['create', 'read', 'update', 'delete'],
      reports: ['read'],
      dashboard: ['read'],
    },
    GERENTE: {
      users: ['read'],
      clients: ['create', 'read', 'update'],
      games: ['create', 'read', 'update'],
      boloes: ['create', 'read', 'update'],
      sales: ['create', 'read', 'update'],
      reports: ['read'],
      dashboard: ['read'],
    },
    VENDEDOR: {
      users: [],
      clients: ['create', 'read', 'update'],
      games: ['read'],
      boloes: ['read'],
      sales: ['create', 'read'],
      reports: [],
      dashboard: [],
    },
    AUDITOR: {
      users: ['read'],
      clients: ['read'],
      games: ['read'],
      boloes: ['read'],
      sales: ['read'],
      reports: ['read'],
      dashboard: ['read'],
    },
  }

  const userPermissions = permissions[user.papel as keyof typeof permissions]
  if (!userPermissions) return false

  const resourcePermissions = userPermissions[resource as keyof typeof userPermissions]
  if (!resourcePermissions) return false

  return (resourcePermissions as string[]).includes(action)
}

