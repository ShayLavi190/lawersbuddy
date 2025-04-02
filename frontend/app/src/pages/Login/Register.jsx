import React from "react";
import { useEffect,useContext } from 'react';
import axios from "axios";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AccessibilityContext } from "../Components/AccessibilityContext";

function Register() {
  const [lawyers, setLawyers] = React.useState([]); 
  const { isHighContrast } = useContext(AccessibilityContext);

  useEffect(() => {
    const fetchLawyers = async () => {
      try {
        const response = await axios.get("http://localhost:6500/allusers/Lawyer");
        if (response.data && response.data.lawyers) {
          setLawyers(response.data.lawyers);
        } else {
          console.error("Unexpected response format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching lawyers:", error);
      }
    };
    fetchLawyers();
  }, []);
  
  const [state, setState] = React.useState({
    name: "",
    email: "",
    password: "",
    country: "",
    id: "",
    lawyer: "",
  });
  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setState({
      ...state,
      [name]: value,
    });
  };
  const passwordContainsSymbols = (password) => {
    const symbols = [
      "!",
      "@",
      "#",
      "$",
      "%",
      "^",
      "&",
      "*",
      "(",
      ")",
      "_",
      "+",
      "-",
      "=",
      "[",
      "]",
      "{",
      "}",
      ";",
      ":",
      "'",
      '"',
      "\\",
      "|",
      ",",
      ".",
      "<",
      ">",
      "/",
      "?",
    ];
    return symbols.some((symbol) => password.includes(symbol));
  };
  const passwordContainsnNumbers = (password) => {
    const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    return numbers.some((number) => password.includes(number));
  };
  const handleOnSubmit = async (evt) => {
    evt.preventDefault();
    if(!state.name || !state.email || !state.password || !state.country || !state.id) return toast.error("מלא את כלל השדות", {
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
    if((state.password.length < 8) ) return toast.error("הסיסמה חייבת להכיל מעל לשמונה תווים", {
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
    if(!passwordContainsSymbols(state.password)) return toast.error("הסיסמה חייבת להכיל סימן אחד לפחות", {
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
    if(!passwordContainsnNumbers(state.password)) return toast.error("הסיסמה חייבת להכיל ספרות", {
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
    try{const user = await axios.get(`http://localhost:6500/${state.email}`);
    if(user) return toast.warn('המשתמש כבר קיים במערכת. עבור למסך ההתחברות', {
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
    catch (error) {

      console.error("Error:", error);

    }
    try {
      const response = await axios.post("http://localhost:6500/register", {
        full_name: state.name,
        email: state.email,
        password: state.password,
        country: state.country,
        id: state.id,
        lawyer: state.lawyer,
      });
      setState({
        name: "",
        email: "",
        password: "",
        country: "",
        id: "",
        lawyer: "",
      });
      if(response.status === 200) return
      toast.success('המשתמש נוצר בהצלחה', {
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
      console.error("Error:", error);
    }
  };

  return (
    <>
    <div className="form-container sign-up-container">
      <form
        onSubmit={handleOnSubmit}
        style={{ color: "black" }}
        aria-labelledby="register-form-title"
        role="form"
      >
        <h1 id="register-form-title" className="titleb" style={{ fontSize: "48px" }}>
          צור משתמש חדש
        </h1>

        <label htmlFor="name" className="visually-hidden">שם מלא</label>
        <input
          id="name"
          type="text"
          name="name"
          value={state.name}
          onChange={handleChange}
          placeholder="שם מלא"
          required
          aria-required="true"
          aria-label="שם מלא"
        />

        <label htmlFor="email" className="visually-hidden">אימייל</label>
        <input
          id="email"
          type="email"
          name="email"
          value={state.email}
          onChange={handleChange}
          placeholder="אימייל"
          required
          aria-required="true"
          aria-label="כתובת אימייל"
        />

        <label htmlFor="password" className="visually-hidden">סיסמה</label>
        <input
          id="password"
          type="password"
          name="password"
          value={state.password}
          onChange={handleChange}
          placeholder="סיסמה"
          required
          aria-required="true"
          aria-label="סיסמה עם 8 תווים לפחות כולל סימנים וספרות"
        />

        <label htmlFor="country" className="visually-hidden">ארץ</label>
        <input
          id="country"
          type="text"
          name="country"
          value={state.country}
          onChange={handleChange}
          placeholder="ארץ"
          required
          aria-required="true"
          aria-label="ארץ מגורים"
        />

        <label htmlFor="id" className="visually-hidden">תעודת זהות</label>
        <input
          id="id"
          type="text"
          name="id"
          value={state.id}
          onChange={handleChange}
          placeholder="תעודת זהות"
          required
          aria-required="true"
          aria-label="מספר תעודת זהות"
        />

        <FormControl
          fullWidth
          style={{ marginBottom: "10px", marginTop: "10px" }}
          aria-labelledby="lawyer-select-label"
        >
          <InputLabel
            id="lawyer-select-label"
            sx={{ color: isHighContrast ? "#ffff00" : "#000000" }}
          >
            עורך דין
          </InputLabel>

          <Select
            labelId="lawyer-select-label"
            id="lawyer-select"
            value={state.lawyer}
            label="Lawyer"
            name="lawyer"
            onChange={handleChange}
            inputProps={{
              "aria-label": "בחר עורך דין מתוך הרשימה",
              required: true,
            }}
            sx={{
              color: isHighContrast ? "#ffff00" : "#000000",
              backgroundColor: isHighContrast ? "#111" : "inherit",
              border: isHighContrast ? "1px solid #ffff00" : "none",
            }}
          >
            {lawyers.map((lawyer, index) => (
              <MenuItem
                key={index}
                value={lawyer.full_name}
                sx={{
                  color: isHighContrast ? "#ffff00" : "#000000",
                  backgroundColor: isHighContrast ? "#000" : "inherit",
                }}
              >
                {lawyer.full_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <button type="submit" aria-label="שלח טופס הרשמה">הרשמה</button>
      </form>
    </div>
    </>
  );
}

export default Register;
