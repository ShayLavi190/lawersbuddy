import React, { useEffect, useState } from "react";
import "./styles.css";
import "./animation.css";
import Login from "./Login";
import Register from "./Register";
import { useLocation } from "react-router-dom";
function FirstPage() {
  const location = useLocation();

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
      return;
    }
  };
  const containerClass =
    "container " + (type === "signUp" ? "right-panel-active" : "");
  return (
    <div className="App">
      <div className={containerClass} id="container">
        <Register />
        <Login />
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1 style={{ fontSize: "48px" }}>ברוך שובך</h1>
              <p>
                להתחברות יש לעבור למסך ההתחברות ולהזין את פרטיך
              </p>
              <button
                className="ghost"
                id="signIn"
                onClick={() => handleOnClick("signIn")}
                style={{
                  border: "1px solid #202020",
                  backgroundColor: "#191919",
                }}
              >
                התחברות
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1 style={{ fontSize: "48px" }}>שלום משתמש יקר</h1>
              <p>אם אינך רשום עוד למערכת, לחץ על הכפתור כדי להירשם</p>
              <button
                className="signUpBtn ghost"
                id="signUp"
                onClick={() => handleOnClick("signUp")}
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
