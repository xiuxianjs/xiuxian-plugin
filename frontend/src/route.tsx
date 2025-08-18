import React from 'react'
import { createHashRouter } from 'react-router-dom'
import App from '@/pages/App'
import Dashboard from '@/pages/Dashboard'
import ConfigManager from '@/pages/ConfigManager'
import Profile from '@/pages/Profile'
import UserManager from '@/pages/UserManager'
import AssociationManager from '@/pages/AssociationManager'
import NajieManager from '@/pages/NajieManager'
import RankingManager from '@/pages/RankingManager'
import DataQuery from '@/pages/DataQuery'
import CommandManager from '@/pages/CommandManager'
import TaskManager from '@/pages/TaskManager/App'
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
      },
      {
        path: '/users',
        element: <UserManager />
      },
      {
        path: '/associations',
        element: <AssociationManager />
      },
      {
        path: '/najie',
        element: <NajieManager />
      },
      {
        path: '/rankings',
        element: <RankingManager />
      },
      {
        path: '/data-query',
        element: <DataQuery />
      },
      {
        path: '/commands',
        element: <CommandManager />
      },
      {
        path: '/tasks',
        element: <TaskManager />
      }
    ]
  }
])
