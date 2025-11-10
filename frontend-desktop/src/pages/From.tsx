import { Button, Input, Switch } from '@alemonjs/react-ui'
import { useEffect, useState } from 'react'

export default function Form() {
  const [formData, setFormData] = useState({
    botId: '',
    open_give: false,
    close_captcha: false,
    open_task: true,
    close_proactive_message: false
  })

  useEffect(() => {
    if (!window.createDesktopAPI) return
    const API = window.createDesktopAPI()
    // 获取消息
    API.postMessage({
      type: 'get.config'
    })
    // 监听消息
    API.onMessage(e => {
      if (e.type === 'post.config') {
        const db = e.data ?? {}
        setFormData({
          ...db,
        })
      }
    })
  }, [])

  const handleChange = (e: { name: string; value: any; type: string }) => {
    const { name, value, type } = e
    const checked = type === 'checkbox' ? value : undefined
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleSubmit = () => {
    const API = window.createDesktopAPI()
    API.postMessage({
      type: 'save.config',
      data: formData
    })
  }

  return (
    <form
      onSubmit={e => {
        e.preventDefault()
        handleSubmit()
      }}
      className="py-4 space-y-4"
    >
      <div className="border-t pt-4 mt-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">修仙配置</h3>
        <div className="mb-4">
          <label
            htmlFor="botId"
            className="block text-sm font-medium text-gray-700"
          >
            机器人账号 (多机器人部署时必填)
          </label>
          <Input
            type="text"
            id="botId"
            name="botId"
            placeholder="请输入机器人账号"
            value={formData.botId}
            onChange={e => handleChange(e.target)}
            className="mt-1 block w-full p-2 border rounded-md focus:outline-none focus:ring"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="open_give"
            className="block text-sm font-medium text-gray-700"
          >
            赠送功能 (包括普通赠送和一键赠送，默认关闭)
          </label>
          <Switch
            value={formData.open_give}
            onChange={value =>
              handleChange({
                name: 'open_give',
                value: value,
                type: 'checkbox'
              })
            }
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="close_captcha"
            className="block text-sm font-medium text-gray-700"
          >
            关闭验证码 (关闭人机验证，默认开启验证)
          </label>
          <Switch
            value={formData.close_captcha}
            onChange={value =>
              handleChange({
                name: 'close_captcha',
                value: value,
                type: 'checkbox'
              })
            }
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="open_task"
            className="block text-sm font-medium text-gray-700"
          >
            定时任务 (默认开启)
          </label>
          <Switch
            value={formData.open_task}
            onChange={value =>
              handleChange({
                name: 'open_task',
                value: value,
                type: 'checkbox'
              })
            }
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="close_proactive_message"
            className="block text-sm font-medium text-gray-700"
          >
            关闭主动消息 (用于主动消息被限制的平台，默认开启主动消息)
          </label>
          <Switch
            value={formData.close_proactive_message}
            onChange={value =>
              handleChange({
                name: 'close_proactive_message',
                value: value,
                type: 'checkbox'
              })
            }
          />
        </div>
      </div>
      <Button
        type="submit"
        className="w-full p-2 rounded-md transition duration-200"
      >
        保存
      </Button>
    </form>
  )
}
