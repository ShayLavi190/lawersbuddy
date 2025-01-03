import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";

const ForgotPassword = () => {
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  emailjs.init(process.env.REACT_APP_EMAILJSINIT2);

  const generateRandomCode = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}[]|;:<>,.?/~";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
  };

  const passwordContainsSymbols = (password) => {
    const symbols = [
      "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "_", "+", "-", "=",
      "[", "]", "{", "}", ";", ":", "'", '"', "\\", "|", ",", ".", "<", ">",
      "/", "?",
    ];
    return symbols.some((symbol) => password.includes(symbol));
  };

  const passwordContainsNumbers = (password) => {
    const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    return numbers.some((number) => password.includes(number));
  };

  const handleSendConfirmationCode = async (e) => {
    e.preventDefault();
    try {
      const user = await axios.get(`http://localhost:6500/${email}`);
      if (!user) {
        toast.error('המשתמש לא נמצא', {
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
        return;
      }

      const generatedCode = generateRandomCode();
      setConfirmationCode(generatedCode);

      const serviceId = "service_lxiaq84";
      const templateId = "template_en7libv";
      emailjs.send(serviceId, templateId, {
        email: email,
        code: generatedCode,
      });

      toast.info('קוד האימות נשלח אלייך, בדוק את תיבת הדואר שלך', {
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

    } catch (error) {
      console.error("Error fetching user data: ", error);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (code !== confirmationCode) {
      toast.error('הקוד שגוי', {
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
      return;
    }

    if (password.length < 8) {
      toast.error('הסיסמה חייבת להיות באורך של שמונה תווים לפחות', {
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
      return;
    }

    if (!passwordContainsSymbols(password)) {
      toast.error('הסיסמה חייבת להכיל סימן אחד לפחות', {
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
      return;
    }

    if (!passwordContainsNumbers(password)) {
      toast.error('הסיסמה חייבת להכיל ספרות', {
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
      return;
    }
    try {
      await axios.put(`http://localhost:6500/user/${email}`, { password });
      
      toast.success('הסיסמה עודכנה בהצלחה', {
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
        setTimeout(() => {
        navigate("/");
      }, 2500); 
  
    } catch (error) {
      console.error("Error updating password: ", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") setEmail(value);
    else if (name === "code") setCode(value);
    else if (name === "password") setPassword(value);
  };

  return (
    <>
      <ToastContainer />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100vw",
          backgroundColor: "#222222",
        }}
      >
        <form
          onSubmit={handleSendConfirmationCode}
          style={{
            backgroundColor: "white",
            padding: "3rem",
            borderRadius: "12px",
            boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
            width: "400px",
            textAlign: "center",
          }}
        >
          <input
            type="text"
            placeholder="הזן את כתובת המייל שלך"
            onChange={handleChange}
            name="email"
            value={email}
            style={{ marginBottom: "1.5rem", padding: "1rem", width: "100%" }}
          />
          <button
            type="submit"
            style={{ padding: "0.75rem 1.5rem", marginBottom: "1.5rem" }}
          >
            שלח קוד אימות
          </button>
        </form>

        <form
          onSubmit={handleSignIn}
          style={{
            backgroundColor: "white",
            padding: "3rem",
            borderRadius: "12px",
            boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
            width: "400px",
            textAlign: "center",
            marginTop: "20px",
          }}
        >
          <input
            type="text"
            placeholder="קוד אימות"
            onChange={handleChange}
            name="code"
            value={code}
            style={{ marginBottom: "1.5rem", padding: "1rem", width: "100%" }}
          />
          <input
            type="password"
            placeholder="הזן סיסמה חדש"
            onChange={handleChange}
            name="password"
            value={password}
            style={{ marginBottom: "1.5rem", padding: "1rem", width: "100%" }}
          />
          <button
            type="submit"
            style={{ padding: "0.75rem 1.5rem" }}
          >
            שנה סיסמה
          </button>
        </form>
      </div>
    </>
  );
};

export default ForgotPassword;
