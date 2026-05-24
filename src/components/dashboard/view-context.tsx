'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type ViewMode = 'list' | 'grid';

const STORAGE_KEY = 'devstash:viewMode';

const ViewContext = createContext<{
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}>({ viewMode: 'list', setViewMode: () => {} });

export function ViewProvider({ children }: { children: React.ReactNode }) {
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'grid' || stored === 'list') setViewMode(stored);
  }, []);

  function handleSetViewMode(mode: ViewMode) {
    setViewMode(mode);
    localStorage.setItem(STORAGE_KEY, mode);
  }

  return (
    <ViewContext.Provider value={{ viewMode, setViewMode: handleSetViewMode }}>
      {children}
    </ViewContext.Provider>
  );
}

export const useView = () => useContext(ViewContext);
