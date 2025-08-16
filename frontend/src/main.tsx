import React from 'react'
import { createRoot } from 'react-dom/client'
import '@/input.scss'
import route from '@/route'
import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'

createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <RouterProvider router={route} />
  </AuthProvider>
)
