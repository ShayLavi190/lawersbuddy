import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast,Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from "./assets/logo.png";

function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  function setCookie(val, value, days) {
    const expires = new Date(
      Date.now() + days * 24 * 60 * 60 * 1000
    ).toUTCString();
    document.cookie = `${val}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
  }
  function getCookie(val) {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
      const [cookieName, cookieValue] = cookie.split("=");
      if (cookieName === val) {
        return decodeURIComponent(cookieValue);
      }
    }
    return null;
  }
  function deleteCookie(val) {
    document.cookie = `${val}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (email === "" || password === "") {
      return toast.warn('יש למלא את כלל השדות', {
        position: "top-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
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
        toast.error('שגיאה בנתונים שהתקבלו', {
          position: "top-right",
          autoClose: 2500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Slide,
        });
      }
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
      toast.error('שגיאה בהתחברות, נסה שוב מאוחר יותר', {
        position: "top-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
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
      <form onSubmit={handleSubmit} style={{color:'black'}}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img src={logo} style={{ width: "30%" }} alt="Example" />
          <h1 style={{ marginBottom: "20px",fontSize:'48px' }}>ברוך הבא למשפט חכם</h1>
        </div>
        <h1 className="titlee" style={{ fontSize: "40px" }}>
          התחברות
        </h1>
        <input
          type="email"
          placeholder="אימייל"
          name="email"
          value={email}
          onChange={handleEmailChange}
        />
        <input
          type="password"
          name="password"
          placeholder="סיסמה"
          value={password}
          onChange={handlePasswordChange}
        />
        <button>התחברות</button>
        <h1 style={{ marginTop: "50px", fontSize: "35px",   direction: "rtl" }}>
          שכחת את הסיסמה ?
        </h1>
        <button onClick={handleForgotPass}>לחץ כאן</button>
      </form>
      {message && <p>{message}</p>}
    </div>
    </>
  );
}

export default Login;
