import React, { lazy } from 'react'
import { createHashRouter } from 'react-router-dom'
const CurrencyManager = lazy(() => import('@/pages/CurrencyManager/App'))
const ProtectedRoute = lazy(() => import('@/components/ProtectedRoute'))
const Login = lazy(() => import('@/pages/Login'))
const TaskManager = lazy(() => import('@/pages/TaskManager/App'))
const CommandManager = lazy(() => import('@/pages/CommandManager'))
const DataQuery = lazy(() => import('@/pages/DataQuery'))
const AssociationManager = lazy(() => import('@/pages/AssociationManager'))
const NajieManager = lazy(() => import('@/pages/NajieManager'))
const RankingManager = lazy(() => import('@/pages/RankingManager'))
const UserManager = lazy(() => import('@/pages/UserManager'))
const Profile = lazy(() => import('@/pages/Profile'))
const ConfigManager = lazy(() => import('@/pages/ConfigManager'))
const Dashboard = lazy(() => import('@/pages/Dashboard'))
const App = lazy(() => import('@/pages/App'))

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
        path: '/currency',
        element: <CurrencyManager />
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
