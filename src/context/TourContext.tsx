import React, { createContext, useContext, useState, ReactNode } from 'react';

interface TourContextType {
  run: boolean;
  stepIndex: number;
  steps: any[];
  startTour: () => void;
  stopTour: () => void;
  setStepIndex: (index: number) => void;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

export const TourProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  const startTour = () => {
    setRun(true);
    setStepIndex(0);
  };

  const stopTour = () => {
    setRun(false);
  };

  return (
    <TourContext.Provider
      value={{
        run,
        stepIndex,
        steps: [],
        startTour,
        stopTour,
        setStepIndex,
      }}
    >
      {children}
    </TourContext.Provider>
  );
};

export const useTour = () => {
  const context = useContext(TourContext);
  if (context === undefined) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return context;
};
