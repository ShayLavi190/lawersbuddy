import React, { useEffect, useState, useContext } from "react";
import "./styles.css";
import "./animation.css";
import Login from "./Login";
import Register from "./Register";
import { useLocation } from "react-router-dom";
import { AccessibilityContext } from "../Components/AccessibilityContext";

function FirstPage() {
  const location = useLocation();
  const { isHighContrast, isLargeText } = useContext(AccessibilityContext);

  useEffect(() => {
    window.history.pushState(null, document.title, window.location.href);
    window.addEventListener("popstate", function (event) {
      window.history.pushState(null, document.title, window.location.href);
    });
  }, [location]);

  const [type, setType] = useState("signIn");

  const handleOnClick = (text) => {
    if (text !== type) {
      setType(text);
    }
  };

  const containerClass =
    "container " + (type === "signUp" ? "right-panel-active" : "");

  return (
    <div className="App" role="main">
      <div className={containerClass} id="container" aria-live="polite">
        <Register aria-hidden={type !== "signUp"} />
        <Login aria-hidden={type !== "signIn"} />

        <div className="overlay-container" aria-hidden="false">
          <div className="overlay">
            {/* צד שמאל - התחברות */}
            <div
              className="overlay-panel overlay-left"
              aria-labelledby="signin-title"
              aria-describedby="signin-desc"
            >
              <h1
                id="signin-title"
                style={{ fontSize: isLargeText ? "60px" : "48px" }}
              >
                ברוך שובך
              </h1>
              <p id="signin-desc">
                להתחברות יש לעבור למסך ההתחברות ולהזין את פרטיך
              </p>
              <button
                className="ghost"
                id="signIn"
                onClick={() => handleOnClick("signIn")}
                aria-label="מעבר למסך התחברות"
                style={{
                  border: "1px solid #202020",
                  backgroundColor: "#191919",
                }}
              >
                התחברות
              </button>
            </div>

            {/* צד ימין - הרשמה */}
            <div
              className="overlay-panel overlay-right"
              aria-labelledby="signup-title"
              aria-describedby="signup-desc"
            >
              <h1 id="signup-title" style={{ fontSize: "48px" }}>
                שלום משתמש יקר
              </h1>
              <p id="signup-desc">
                אם אינך רשום עוד למערכת, לחץ על הכפתור כדי להירשם
              </p>
              <button
                className="signUpBtn ghost"
                id="signUp"
                onClick={() => handleOnClick("signUp")}
                aria-label="מעבר למסך הרשמה"
                style={{
                  border: "1px solid #202020",
                  backgroundColor: "#191919",
                }}
              >
                הרשמה
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FirstPage;
