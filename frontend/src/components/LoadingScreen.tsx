import React, { useState, createContext, useContext } from 'react';
import { Spin } from 'antd';

interface LoadingContextProps {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoadingContext = createContext<LoadingContextProps>({
  loading: false,
  setLoading: () => {},
});

const LoadingScreen: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      <div className="loading-spinner">
        {loading && (
          <div className="spinner-overlay">
            <Spin size="large" />
          </div>
        )}
       {children}
      </div>
    </LoadingContext.Provider>
  );
};

const useLoading = (): LoadingContextProps => useContext(LoadingContext);

export { LoadingScreen, useLoading };
