"use client";

import { createContext, useContext, useRef } from "react";
import Toaster from "@/components/ui/toast";

const ToasterContext = createContext(null);

export const useToaster = () => {
  const context = useContext(ToasterContext);
  if (!context) {
    throw new Error("useToaster must be used within a ToasterProvider");
  }
  return context;
};

export const ToasterProvider = ({ children }) => {
  const toasterRef = useRef(null);

  return (
    <ToasterContext.Provider value={toasterRef}>
      <Toaster ref={toasterRef} />
      {children}
    </ToasterContext.Provider>
  );
};
