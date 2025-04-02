// src/context/AccessibilityContext.jsx
import React, { createContext, useState, useEffect } from "react";

export const AccessibilityContext = createContext();

export const AccessibilityProvider = ({ children }) => {
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isLargeText, setIsLargeText] = useState(false);

  useEffect(() => {
    const high = localStorage.getItem("highContrast") === "true";
    const large = localStorage.getItem("largeText") === "true";

    setIsHighContrast(high);
    setIsLargeText(large);

    document.body.classList.toggle("high-contrast", high);
    document.body.classList.toggle("large-text", large);
  }, []);

  const toggleHighContrast = () => {
    const updated = !isHighContrast;
    setIsHighContrast(updated);
    localStorage.setItem("highContrast", updated);
    document.body.classList.toggle("high-contrast", updated);
  };

  const toggleLargeText = () => {
    const updated = !isLargeText;
    setIsLargeText(updated);
    localStorage.setItem("largeText", updated);
    document.body.classList.toggle("large-text", updated);
  };

  return (
    <AccessibilityContext.Provider
      value={{
        isHighContrast,
        isLargeText,
        toggleHighContrast,
        toggleLargeText,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};
