import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from "./assets/logo.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const setCookie = (val, value, days) => {
    const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `${val}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
  };

  const deleteCookie = (val) => {
    document.cookie = `${val}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  };

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return toast.warn("יש למלא את כלל השדות", {
        position: "top-right",
        autoClose: 2500,
        theme: "colored",
        transition: Slide,
      });
    }

    try {
      const response = await axios.post("http://localhost:6500/login", { email, password });

      if (response.data.success) {
        const user = response.data.data;
        setCookie("email", email, 30);

        if (user.premission === "lawyer") {
          setCookie("id", user.id, 30);
          navigate("/homeLawyer", { replace: true });
        } else if (user.premission === "client") {
          navigate("/homeClient", { replace: true });
        }
      } else {
        deleteCookie("email");
        toast.error("שגיאה בנתונים שהתקבלו", {
          position: "top-right",
          autoClose: 2500,
          theme: "colored",
          transition: Slide,
        });
      }
    } catch (error) {
      toast.error("שגיאה בהתחברות, נסה שוב מאוחר יותר", {
        position: "top-right",
        autoClose: 2500,
        theme: "colored",
        transition: Slide,
      });
    }
  };

  const handleForgotPass = () => {
    navigate("/forgotpassword", { replace: true });
  };

  return (
    <>
      <ToastContainer />
      <div className="form-container sign-in-container">
        <form
          onSubmit={handleSubmit}
          role="form"
          aria-labelledby="form-title"
          aria-describedby="form-description"
          style={{ color: 'black' }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img src={logo} style={{ width: "30%" }} alt="לוגו משפט חכם" />
            <h1 id="form-title" style={{ marginBottom: "20px", fontSize: '48px' }}>
              ברוך הבא למשפט חכם
            </h1>
          </div>

          <p id="form-description" className="sr-only">
            טופס התחברות למערכת. הזן את כתובת האימייל והסיסמה שלך.
          </p>

          <h2 style={{ fontSize: "40px" }}>התחברות</h2>

          <label htmlFor="email">אימייל</label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="אימייל"
            value={email}
            onChange={handleEmailChange}
            required
            aria-required="true"
          />

          <label htmlFor="password">סיסמה</label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="סיסמה"
            value={password}
            onChange={handlePasswordChange}
            required
            aria-required="true"
          />

          <button type="submit" aria-label="התחבר למערכת">התחברות</button>

          <h2 style={{ marginTop: "50px", fontSize: "35px", direction: "rtl" }}>
            שכחת את הסיסמה?
          </h2>

          <button
            type="button"
            onClick={handleForgotPass}
            aria-label="עבור לשחזור סיסמה"
          >
            לחץ כאן
          </button>
        </form>

        {message && <p role="alert">{message}</p>}
      </div>
    </>
  );
}

export default Login;
