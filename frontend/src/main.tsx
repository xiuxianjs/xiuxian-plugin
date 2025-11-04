import { createRoot } from 'react-dom/client';
import '@/input.scss';
import route from '@/route';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { PermissionProvider } from '@/contexts/PermissionContext';

createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <PermissionProvider>
      <RouterProvider router={route} />
    </PermissionProvider>
  </AuthProvider>
);
