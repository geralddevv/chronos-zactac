import { createContext, useContext, useState, useCallback } from "react";

const RefreshContext = createContext();

export const RefreshProvider = ({ children }) => {
  const [coupons, setCoupons] = useState([]);
  const [resetSignal, setResetSignal] = useState(false);

  const handleRefresh = useCallback(() => {
    setCoupons([]);
    setResetSignal(Math.random()); // always unique key
  }, []);

  return (
    <RefreshContext.Provider
      value={{
        coupons,
        setCoupons,
        resetSignal,
        handleRefresh,
      }}
    >
      {children}
    </RefreshContext.Provider>
  );
};

export const useRefresh = () => useContext(RefreshContext);
