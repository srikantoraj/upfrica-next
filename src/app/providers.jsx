// /app/providers.jsx
'use client';

import { Provider } from 'react-redux';
import { store } from './store/store';
import { AuthProvider } from '@/contexts/AuthContext'; // ✅ Import your AuthProvider

export default function Providers({ children }) {
  return (
    <Provider store={store}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </Provider>
  );
}
