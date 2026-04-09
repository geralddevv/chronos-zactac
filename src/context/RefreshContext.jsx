import { createContext, useContext, useState, useCallback } from "react";

const RefreshContext = createContext();

export const RefreshProvider = ({ children }) => {
  const [labels, setLabels] = useState([]);
  const [resetSignal, setResetSignal] = useState(false);

  const handleRefresh = useCallback(() => {
    setLabels([]);
    setResetSignal(Math.random()); // always unique key
  }, []);

  return (
    <RefreshContext.Provider
      value={{
        labels,
        setLabels,
        resetSignal,
        handleRefresh,
      }}
    >
      {children}
    </RefreshContext.Provider>
  );
};

export const useRefresh = () => useContext(RefreshContext);
