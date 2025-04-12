// src/contexts/AppContext.tsx
import React, { createContext, useContext, useState } from "react";
import { User } from "../types/webRTCMessages";

interface AppContextType {
  clients: User[];
  setClients: React.Dispatch<React.SetStateAction<User[]>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [clients, setClients] = useState<User[]>([]);

  return (
    <AppContext.Provider value={{ clients, setClients }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
};
