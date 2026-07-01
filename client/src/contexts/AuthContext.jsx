import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { authAPI } from '../services/api'
import toast from 'react-hot-toast'

const AuthContext = createContext()

const initialState = {
  user: null,
  doctor: null,
  token: localStorage.getItem('token'),
  isLoading: false,
  isAuthenticated: false,
}

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        isLoading: true,
      }
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        doctor: action.payload.doctor,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      }
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        doctor: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      }
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        doctor: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      }
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload.user,
        doctor: action.payload.doctor,
      }
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      }
    default:
      return state
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Persist auth state to localStorage
  useEffect(() => {
    if (state.token) {
      localStorage.setItem('token', state.token)
      localStorage.setItem('user', JSON.stringify(state.user))
      authAPI.defaults.headers.common['Authorization'] = `Bearer ${state.token}`
    } else {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      delete authAPI.defaults.headers.common['Authorization']
    }
  }, [state.token, state.user])

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          dispatch({ type: 'SET_LOADING', payload: true })
          const response = await authAPI.get('/auth/me')
          
          if (response.data.success) {
            dispatch({
              type: 'LOGIN_SUCCESS',
              payload: {
                user: response.data.data.user,
                doctor: response.data.data.doctor,
                token,
              },
            })
          } else {
            dispatch({ type: 'LOGOUT' })
          }
        } catch (error) {
          console.error('Auth check failed:', error)
          dispatch({ type: 'LOGOUT' })
        } finally {
          dispatch({ type: 'SET_LOADING', payload: false })
        }
      }
    }

    checkAuth()
  }, [])

  const login = async (credentials) => {
    try {
      dispatch({ type: 'LOGIN_START' })
      const response = await authAPI.post('/auth/login', credentials)
      
      if (response.data.success) {
        const { user, doctor, token } = response.data.data
        
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
        
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            user,
            doctor,
            token,
          },
        })
        
        toast.success('Login successful!')
        return { success: true, user }
      } else {
        dispatch({ type: 'LOGIN_FAILURE' })
        toast.error(response.data.message || 'Login failed')
        return { success: false, message: response.data.message }
      }
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE' })
      const message = error.response?.data?.message || 'Login failed'
      toast.error(message)
      return { success: false, message }
    }
  }

  const register = async (userData) => {
    try {
      dispatch({ type: 'LOGIN_START' })
      
      // Use the same endpoint for both user and doctor registration
      // The backend will handle the role-based logic
      const response = await authAPI.post('/auth/register', userData)
      
      if (response.data.success) {
        const { user, doctor, token } = response.data.data
        
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            user,
            doctor: userData.role === 'doctor' ? (doctor || user) : null,
            token,
          },
        })
        
        toast.success(response.data.message || `${userData.role === 'doctor' ? 'Doctor' : 'Patient'} registration successful!`)
        return { success: true }
      } else {
        dispatch({ type: 'LOGIN_FAILURE' })
        toast.error(response.data.message || 'Registration failed')
        return { success: false, message: response.data.message }
      }
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE' })
      const message = error.response?.data?.message || 'Registration failed'
      toast.error(message)
      return { success: false, message }
    }
  }

  const logout = () => {
    dispatch({ type: 'LOGOUT' })
    toast.success('Logged out successfully')
  }

  const updateUser = (userData) => {
    dispatch({
      type: 'UPDATE_USER',
      payload: userData,
    })
  }

  const value = {
    ...state,
    login,
    register,
    logout,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
