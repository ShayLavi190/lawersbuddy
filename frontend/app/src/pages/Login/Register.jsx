import React from "react";
import { useEffect } from 'react';
import axios from "axios";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Register() {
  const [lawyers, setLawyers] = React.useState([]); 
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
      <form onSubmit={handleOnSubmit} style={{color:'black'}}>
        <h1 className="titleb" style={{ fontSize: "48px" }}>
          צור משתמש חדש
        </h1>
        <input
          type="text"
          name="name"
          value={state.name}
          onChange={handleChange}
          placeholder="שם מלא"
        />
        <input
          type="email"
          name="email"
          value={state.email}
          onChange={handleChange}
          placeholder="אימייל"
        />
        <input
          type="password"
          name="password"
          value={state.password}
          onChange={handleChange}
          placeholder="סיסמה"
        />
        <input
          type="text"
          name="country"
          value={state.country}
          onChange={handleChange}
          placeholder="ארץ"
        />
        <input
          type="text"
          name="id"
          value={state.id}
          onChange={handleChange}
          placeholder="תעודת זהות"
        />
        <FormControl
          fullWidth
          style={{ marginBottom: "10px", marginTop: "10px" }}
        >
          <InputLabel style={{ color: "black" }} id="sector-select-label">
            עורך דין
          </InputLabel>
          <Select
              labelId="lawyer-select-label"
              id="lawyer-select"
              value={state.lawyer}
              label="Lawyer"
              name="lawyer"
              onChange={handleChange}
              style={{ color: "black" }}
            >
              {lawyers.map((lawyer, index) => (
                <MenuItem key={index} value={lawyer.full_name}>
                  {lawyer.full_name}
                </MenuItem>
              ))}
            </Select>
        </FormControl>
        <button type="submit">הרשמה</button>
      </form>
    </div>
    </>
  );
}

export default Register;
