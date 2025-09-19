import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../store'
import { useCallback } from 'react'
import { loginAsync, logoutAsync, loadStoredAuthAsync, clearError } from '../store/slices/authSlice'
import { LoginRequest } from '../types'

export const useAuth = () => {
  const dispatch = useDispatch()
  const { user, token, isAuthenticated, isLoading, error } = useSelector(
    (state: RootState) => state.auth
  )

  const login = useCallback(
    async (credentials: LoginRequest) => {
      return dispatch(loginAsync(credentials))
    },
    [dispatch]
  )

  const logout = useCallback(async () => {
    return dispatch(logoutAsync())
  }, [dispatch])

  const loadStoredAuth = useCallback(async () => {
    return dispatch(loadStoredAuthAsync())
  }, [dispatch])

  const clearAuthError = useCallback(() => {
    dispatch(clearError())
  }, [dispatch])

  const isAdmin = user?.papel === 'ADMIN'
  const isGerente = user?.papel === 'GERENTE'
  const isVendedor = user?.papel === 'VENDEDOR'
  const isAuditor = user?.papel === 'AUDITOR'

  const hasRole = useCallback(
    (roles: string[]) => {
      if (!user) return false
      return roles.includes(user.papel)
    },
    [user]
  )

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    loadStoredAuth,
    clearAuthError,
    isAdmin,
    isGerente,
    isVendedor,
    isAuditor,
    hasRole,
  }
}
