import { createContext, useContext, useState, type ReactNode } from "react";
import LoaderOverlay from "../ui/loader-overlay";

type AppContextType = {
  loading: boolean;
  setLoading: (loading: boolean) => void;
};

const AppContext = createContext<AppContextType>(null as any);

function AppProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  return (
    <AppContext.Provider
      value={{
        loading,
        setLoading,
      }}
    >
      {loading && <LoaderOverlay />}
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

export default AppProvider;
