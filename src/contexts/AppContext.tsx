import React, { createContext, useContext, useState } from 'react';

interface AppContextType {
  currentSubject: string;
  setCurrentSubject: (subject: string) => void;
  studentData: any;
  setStudentData: (data: any) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSubject, setCurrentSubject] = useState('Mathematics');
  const [studentData, setStudentData] = useState(null);

  return (
    <AppContext.Provider value={{
      currentSubject,
      setCurrentSubject,
      studentData,
      setStudentData,
    }}>
      {children}
    </AppContext.Provider>
  );
};