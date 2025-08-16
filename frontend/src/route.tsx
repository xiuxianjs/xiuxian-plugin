import React from 'react'
import { createHashRouter } from 'react-router-dom'
import App from '@/pages/App'
import Dashboard from '@/pages/Dashboard'
import ConfigManager from '@/pages/ConfigManager'
import Profile from '@/pages/Profile'
import Login from '@/pages/Login'
import ProtectedRoute from '@/components/ProtectedRoute'

export default createHashRouter([
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '/',
        element: <Dashboard />
      },
      {
        path: '/config',
        element: <ConfigManager />
      },
      {
        path: '/profile',
        element: <Profile />
      }
    ]
  }
])
