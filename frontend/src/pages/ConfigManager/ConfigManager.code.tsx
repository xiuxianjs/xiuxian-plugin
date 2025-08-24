import React, { useState, useEffect } from 'react'
import { getConfig, saveConfig } from '@/api/auth/config'
import { message } from 'antd'

export const useConfigManagerCode = () => {
  const [config, setConfig] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('CD配置')
  const [jsonConfig, setJsonConfig] = useState('')
  const [open, setOpen] = useState(false)

  const loadConfig = async () => {
    setLoading(true)
    try {
      const result = await getConfig('xiuxian')
      if (result) {
        const configData =
          (result.data as Record<string, any>) ||
          (result as unknown as Record<string, any>)
        setConfig(configData)
        setJsonConfig(JSON.stringify(configData, null, 2))
      }
    } catch (error) {
      console.error('加载配置失败:', error)
      message.error('加载配置失败')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (values: Record<string, any>) => {
    setLoading(true)
    try {
      await saveConfig('xiuxian', values)
      message.success('配置保存成功')
      loadConfig()
    } catch (error) {
      console.error('保存配置失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleConfigChange = (key: string, value: unknown) => {
    if (!config) return

    const keys = key.split('.')
    const newConfig = { ...config }
    let current = newConfig as Record<string, unknown>

    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {}
      }
      current = current[keys[i]] as Record<string, unknown>
    }

    current[keys[keys.length - 1]] = value
    setConfig(newConfig)
    setJsonConfig(JSON.stringify(newConfig, null, 2))
  }

  const getConfigValue = (key: string): unknown => {
    if (!config) return undefined
    const keys = key.split('.')
    let value: unknown = config
    for (const k of keys) {
      value = (value as Record<string, unknown>)?.[k]
    }
    return value
  }

  useEffect(() => {
    loadConfig()
  }, [])

  return {
    config,
    loading,
    activeTab,
    setActiveTab,
    jsonConfig,
    setJsonConfig,
    message,
    loadConfig,
    handleSave,
    handleConfigChange,
    getConfigValue,
    open,
    setOpen
  }
}
