import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { token } from '../../api/token'
import client from '../../api/axios'
import '../styles.css'

export default function App() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()

  const handleLogin = () => {
    console.log('handleLogin')

    // 构建请求数据
    const tData = {
      username,
      password
    }

    const uArr = tData.username.split('')
    if (uArr.length < 6 || uArr.length > 18) {
      alert('账号或密码非法长度！')
      return
    }
    const pArr = tData.password.split('')
    if (pArr.length < 6 || pArr.length > 18) {
      alert('账号或密码非法长度！')
      return
    }

    client
      .login(tData)
      .then((res) => {
        console.log('res', res)
        if (res.code == 5000) {
          alert('服务器错误，请稍后重试。。。')
        } else if (res.code == 4000) {
          alert('账号或密码错误！')
        } else if (res.code == 2000) {
          token.set(res.data.token)
          if (token.isLogin()) {
            navigate('/')
          } else {
            alert('状态失效')
          }
        } else {
          alert('未知错误')
        }
      })
      .catch(() => {
        alert('服务器繁忙，请稍后重试。。。')
      })
  }

  const handleKeyDown = (key) => {
    if (key === 'Enter') handleLogin()
  }

  return (
    <div className="com">
      <main className="comMain">
        {/* <img className="comMainLogo" src={logoSvg} /> */}
        <div className="comMainLogin">
          <div className="header">
            <h1 className="title">欢迎使用 修仙管理系统</h1>
          </div>
          <input
            type="text"
            className="input"
            placeholder="用户名"
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e.key)}
          />
          <input
            type="password"
            className="input"
            placeholder="密码"
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e.key)}
          />
          <button className="loginButton" onClick={handleLogin}>
            登录
          </button>
          <div className="registerLink">
            还没有账号？
            <a href="/logon">前往注册</a>
          </div>
        </div>
      </main>
    </div>
  )
}
