import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  PropsWithChildren
} from 'react'
import { loginAPI, logoutAPI, verifyTokenAPI } from '@/api/auth'
import { AuthContextType, User } from '@/types/types'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 检查本地存储中的登录状态
    const checkAuth = async () => {
      const savedUser = localStorage.getItem('user')
      const savedToken = localStorage.getItem('token')

      if (savedUser && savedToken) {
        try {
          // 验证token
          const tokenResult = await verifyTokenAPI(savedToken)

          if (tokenResult.valid && tokenResult.user) {
            setUser(tokenResult.user)
          } else {
            // token无效，清除本地存储
            localStorage.removeItem('user')
            localStorage.removeItem('token')
          }
        } catch (error) {
          console.error('验证用户信息失败:', error)
          localStorage.removeItem('user')
          localStorage.removeItem('token')
        }
      }
      setLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (username: string, password: string) => {
    try {
      const result = await loginAPI({ username, password })

      if (result.success && result.user && result.token) {
        setUser(result.user)
        localStorage.setItem('user', JSON.stringify(result.user))
        localStorage.setItem('token', result.token)
        return { success: true }
      } else {
        return { success: false, message: result.message }
      }
    } catch (error) {
      console.error('登录失败:', error)
      return { success: false, message: '登录失败' }
    }
  }

  const logout = async () => {
    try {
      const token = localStorage.getItem('token')
      if (token) {
        await logoutAPI(token)
      }
    } catch (error) {
      console.error('登出失败:', error)
    } finally {
      setUser(null)
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    }
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    loading
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
