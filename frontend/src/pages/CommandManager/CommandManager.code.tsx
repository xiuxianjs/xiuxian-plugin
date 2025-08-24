import { useState, useEffect, useCallback } from 'react'
import { message } from 'antd'
import { useAuth } from '@/contexts/AuthContext'
import { getCommandsAPI, updateCommandStatusAPI } from '@/api/auth'

interface CommandNode {
  name: string
  isDir: boolean
  isFile: boolean
  path: string[]
  status?: boolean
}

export const useCommandManagerCode = () => {
  const { user } = useAuth()
  const [currentItems, setCurrentItems] = useState<CommandNode[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPath, setCurrentPath] = useState<string[]>([])

  // 获取指令列表
  const fetchCommands = useCallback(
    async (path: string[] = []) => {
      if (!user) return

      // 防止重复调用
      if (loading) return

      setLoading(true)
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          message.error('未找到登录令牌')
          return
        }

        const result = await getCommandsAPI(token, path)

        if (result.success && result.data) {
          const commands = result.data
          const nodes: CommandNode[] = commands.map(item => ({
            name: item.name,
            isDir: item.isDir,
            isFile: item.isFile,
            path: [...path, item.name],
            status: item.status
          }))

          setCurrentItems(nodes)
          setCurrentPath(path)
        } else {
          message.error(result.message || '获取指令列表失败')
        }
      } catch (error) {
        console.error('获取指令列表失败:', error)
        message.error('获取指令列表失败')
      } finally {
        setLoading(false)
      }
    },
    [user, loading]
  )

  // 进入目录
  const handleEnterDirectory = useCallback(
    (path: string[]) => {
      fetchCommands(path)
    },
    [fetchCommands]
  )

  // 返回上级目录
  const handleBackToParent = useCallback(() => {
    if (currentPath.length > 0) {
      const parentPath = currentPath.slice(0, -1)
      fetchCommands(parentPath)
    }
  }, [currentPath, fetchCommands])

  // 跳转到指定路径
  const handleNavigateToPath = useCallback(
    (path: string[]) => {
      fetchCommands(path)
    },
    [fetchCommands]
  )

  // 切换指令状态
  const handleToggleStatus = useCallback(
    async (path: string[], status: boolean) => {
      if (!user) return

      try {
        const token = localStorage.getItem('token')
        if (!token) {
          message.error('未找到登录令牌')
          return
        }

        const result = await updateCommandStatusAPI(token, path, status)

        if (result.success) {
          message.success(`指令 ${status ? '启用' : '禁用'} 成功`)
          // 更新本地状态
          updateCommandStatus(path, status)
        } else {
          message.error(result.message || '更新指令状态失败')
        }
      } catch (error) {
        console.error('更新指令状态失败:', error)
        message.error('更新指令状态失败')
      }
    },
    [user]
  )

  // 更新本地指令状态
  const updateCommandStatus = useCallback((path: string[], status: boolean) => {
    setCurrentItems(prevItems => {
      return prevItems.map(item => {
        if (item.path.join('/') === path.join('/')) {
          return { ...item, status }
        }
        return item
      })
    })
  }, [])

  // 刷新当前目录
  const handleRefresh = useCallback(() => {
    if (loading) return
    fetchCommands(currentPath)
  }, [currentPath, loading, fetchCommands])

  // 初始化
  useEffect(() => {
    if (user) {
      fetchCommands()
    }
  }, [user])

  return {
    currentItems,
    loading,
    currentPath,
    handleEnterDirectory,
    handleBackToParent,
    handleNavigateToPath,
    handleToggleStatus,
    handleRefresh
  }
}
