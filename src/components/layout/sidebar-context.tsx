'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SidebarContextValue {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  toggleCollapsed: () => void;
  toggleMobile: () => void;
  closeMobile: () => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('sidebar-collapsed');
    if (stored !== null) setIsCollapsed(JSON.parse(stored) as boolean);
  }, []);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleCollapsed = () => {
    setIsCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('sidebar-collapsed', JSON.stringify(next));
      return next;
    });
  };

  return (
    <SidebarContext.Provider
      value={{
        isCollapsed,
        isMobileOpen,
        toggleCollapsed,
        toggleMobile: () => setIsMobileOpen(prev => !prev),
        closeMobile: () => setIsMobileOpen(false),
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error('useSidebar must be used within SidebarProvider');
  return ctx;
}
