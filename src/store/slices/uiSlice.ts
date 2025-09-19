import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UiState {
  isLoading: boolean
  sidebarOpen: boolean
  theme: 'light' | 'dark'
  notifications: Array<{
    id: string
    type: 'success' | 'error' | 'warning' | 'info'
    title: string
    message: string
    timestamp: number
  }>
}

const initialState: UiState = {
  isLoading: false,
  sidebarOpen: false,
  theme: 'light',
  notifications: [],
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload
    },
    addNotification: (state, action: PayloadAction<{
      type: 'success' | 'error' | 'warning' | 'info'
      title: string
      message: string
    }>) => {
      const notification = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        ...action.payload,
      }
      state.notifications.push(notification)
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      )
    },
    clearNotifications: (state) => {
      state.notifications = []
    },
  },
})

export const {
  setLoading,
  toggleSidebar,
  setSidebarOpen,
  setTheme,
  addNotification,
  removeNotification,
  clearNotifications,
} = uiSlice.actions

export default uiSlice.reducer

