import React, { useContext } from "react";
import { AccessibilityContext } from "../Components/AccessibilityContext";

const AccessibilityToggle = () => {
  const {
    isHighContrast,
    isLargeText,
    toggleHighContrast,
    toggleLargeText,
  } = useContext(AccessibilityContext);

  return (
    <div style={{ position: "fixed", top: 10, right: 200, zIndex: 1000 }}>
      <button
        onClick={toggleHighContrast}
        style={{
          marginRight: "5vh",
          backgroundColor: isHighContrast ? "#000" : "#F2AB27",
          color: isHighContrast ? "#ff0" : "#000",
        }}
      >
        {isHighContrast ? "כבה ניגודיות גבוהה" : "הפעל ניגודיות גבוהה"}
      </button>

      <button
        onClick={toggleLargeText}
        style={{
          backgroundColor: isLargeText ? "#000" : "#04BF45",
          color: isLargeText ? "#fff" : "#000",
        }}
      >
        {isLargeText ? "הקטן טקסט" : "הגדל טקסט"}
      </button>
    </div>
  );
};

export default AccessibilityToggle;
