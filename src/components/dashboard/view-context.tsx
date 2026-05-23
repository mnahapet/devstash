'use client';

import { createContext, useContext, useState } from 'react';

type ViewMode = 'list' | 'grid';

const ViewContext = createContext<{
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}>({ viewMode: 'list', setViewMode: () => {} });

export function ViewProvider({ children }: { children: React.ReactNode }) {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  return (
    <ViewContext.Provider value={{ viewMode, setViewMode }}>
      {children}
    </ViewContext.Provider>
  );
}

export const useView = () => useContext(ViewContext);
