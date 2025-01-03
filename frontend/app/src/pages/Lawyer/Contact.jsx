import React, { useEffect, useState } from 'react';
import Header from './componants/Header';
import './stylesAdmin.css';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import Sidebar from './componants/sideBar';
import emailjs from '@emailjs/browser';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { TextField, Button, MenuItem, FormControl, InputLabel, Select, FormHelperText } from '@mui/material';

function Contact() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [emailError, setEmailError] = useState('');
  const [subject, setSubject] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');

  useEffect(() => {
    const checkAdminPermission = async () => {
      const email = Cookies.get('email');
      if (!email) {
        navigate('/', { replace: true });
        return;
      }
      try {
        const response = await axios.post('http://localhost:6500/check-permission', { email });
        if (response.data.data.premission !== "lawyer") {
          navigate('/', { replace: true });
        }
        setName(response.data.data.full_name);
      } catch (error) {
        console.error('Error checking lawyer permission:', error);
        navigate('/', { replace: true });
      }
    };
    checkAdminPermission();
  }, [navigate]);

  const clearForm = () => {
    setSelectedClient('');
    setSubject('');
    setDescription('');
    setAiPrompt('');
  };

  useEffect(() => {
    emailjs.init(process.env.REACT_APP_EMAILJSINIT);
  }, []);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get(`http://localhost:6500/clients/${Cookies.get("email")}`);
        setClients(response.data.clients);
      } catch (error) {
        console.error("Couldn't fetch clients", error);
      }
    };
    fetchClients();
  }, []);

  const handleGenerateMessage = async () => {
    if (!aiPrompt.trim()) {
      toast.error('הזן את הבקשה שלך כדי ליצור הודעה עם AI', {
        position: 'top-right',
        autoClose: 2000,
        theme: 'colored',
      });
      return;
    }

    try {
      const response = await axios.post('http://localhost:6500/generate-message', {
        prompt: aiPrompt,
      });

      setDescription(response.data.message);
    } catch (error) {
      console.error('Error generating message:', error);
      toast.error('יצירת הודעה נכשלה', {
        position: 'top-right',
        autoClose: 2000,
        theme: 'colored',
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedClient) {
      setEmailError("בחר לקוח");
      return;
    }
    setEmailError("");

    if (!subject.trim()) {
      toast.error('מלא את הנושא כדי לשלוח את ההודעה', { position: 'top-right', autoClose: 2000, theme: 'colored' });
      return;
    }

    if (!description.trim()) {
      toast.error('מלא את תוכן ההודעה כדי לשלוח את ההודעה', { position: 'top-right', autoClose: 2000, theme: 'colored' });
      return;
    }

    try {
      const selectedClientObj = JSON.parse(selectedClient);
      const serviceId = "bstorecontact";
      const templateId = "order_c";
      const templateParams = {
        subject: subject,
        message: `Dear ${selectedClientObj.full_name},\n${description}\n`,
        email: selectedClientObj.email,
        name: selectedClientObj.full_name
      };

      await emailjs.send(serviceId, templateId, templateParams);
      toast.success('ההודעה נשלחה בהצלחה', { position: 'top-right', autoClose: 2000, theme: 'colored' });
      setTimeout(() => clearForm(), 4000);
    } catch (error) {
      console.error("Error while sending email:", error);
      toast.error('שליחת המייל נכשלה. נסה שנית', { position: 'top-right', autoClose: 2000, theme: 'colored' });
    }
  };

  return (
    <>
  <ToastContainer />
  <div
    className="grid-container"
    style={{ backgroundColor: "#DDD0C8" }}
  >
    <Header />
    <Sidebar />
    <main
      className="main-container"
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <form
        style={{
          background: "#323232",
          borderRadius: "8px",
          maxWidth: "100%",
          width: "80%",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "50px", 
        }}
      >
        {/* Client Selection */}
        <div style={{ width: "600px" }}>
          <FormControl fullWidth required>
            <InputLabel
              id="client-label"
              sx={{
                color: "#9e9ea4",
                textAlign: "center",
              }}
            >
              בחר לקוח
            </InputLabel>
            <Select
              labelId="client-label"
              id="client"
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              sx={{
                backgroundColor: "#FFFFFF",
                fontSize: "20px",
                textAlign: "center",
              }}
            >
              {clients.length > 0 ? (
                clients.map((client) => (
                  <MenuItem
                    key={client.email}
                    value={JSON.stringify(client)}
                    sx={{ textAlign: "center" }}
                  >
                    {client.full_name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No clients available</MenuItem>
              )}
            </Select>
          </FormControl>
        </div>

        {/* Subject */}
        <div style={{ width: "600px" }}>
          <TextField
            label="נושא"
            fullWidth
            InputLabelProps={{
              sx: {
                textAlign: "center",
                color: "#9e9ea4",
                fontWeight: "bold",
              },
            }}
            InputProps={{
              sx: {
                textAlign: "center",
                backgroundColor: "#FFFFFF",
                fontSize: "20px",
              },
            }}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>

        {/* AI Prompt */}
        <div style={{ width: "600px" }}>
          <TextField
            label="AI-בקשה ל "
            multiline
            rows={2}
            fullWidth
            InputLabelProps={{
              sx: {
                textAlign: "center",
                color: "#9e9ea4",
                fontWeight: "bold",
              },
            }}
            InputProps={{
              sx: {
                textAlign: "center",
                backgroundColor: "#FFFFFF",
                fontSize: "20px",
              },
            }}
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
          />
          <Button
            variant="contained"
            color="secondary"
            sx={{ marginTop: "20px", width: "100%" }}
            onClick={handleGenerateMessage}
          >
            צור הודעה עם בינה מלאכותית
          </Button>
        </div>

        {/* Description */}
        <div style={{ width: "600px" }}>
          <TextField
            label="תוכן ההודעה"
            multiline
            rows={4}
            fullWidth
            InputLabelProps={{
              sx: {
                textAlign: "center",
                color: "#9e9ea4",
                fontWeight: "bold",
              },
            }}
            InputProps={{
              sx: {
                textAlign: "center",
                backgroundColor: "#FFFFFF",
                fontSize: "20px",
              },
            }}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Send Button */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ width: "600px" }}
          onClick={handleSubmit}
        >
          שלח הודעה
        </Button>
      </form>
    </main>
  </div>
</>

  );
}

export default Contact;
