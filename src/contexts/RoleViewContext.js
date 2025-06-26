'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';

const RoleViewContext = createContext();

export function RoleViewProvider({ roles = [], children }) {
  const resolveDefaultRole = useCallback(() => {
    if (roles.includes('seller_private') || roles.includes('seller_business')) return 'seller';
    if (roles.includes('agent')) return 'agent';
    return 'buyer';
  }, [roles]);

  const [roleView, setRoleView] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('roleView');

      if (
        stored &&
        ['buyer', 'seller', 'agent'].includes(stored) &&
        (
          stored === 'seller'
            ? roles.includes('seller_private') || roles.includes('seller_business')
            : roles.includes(stored)
        )
      ) {
        return stored;
      }
    }

    return resolveDefaultRole();
  });

  useEffect(() => {
    if (roleView === 'seller' && !(roles.includes('seller_private') || roles.includes('seller_business'))) {
      setRoleView(resolveDefaultRole());
    } else if (!roles.includes(roleView)) {
      setRoleView(resolveDefaultRole());
    }
  }, [roles, roleView, resolveDefaultRole]);

  useEffect(() => {
    if (roleView) {
      localStorage.setItem('roleView', roleView);
    }
  }, [roleView]);

  return (
    <RoleViewContext.Provider value={{ roleView, setRoleView, roles }}>
      {children}
    </RoleViewContext.Provider>
  );
}

export const useRoleView = () => useContext(RoleViewContext);