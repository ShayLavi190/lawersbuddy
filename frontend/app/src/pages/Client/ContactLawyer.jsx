import React, { useEffect, useState,useContext } from 'react';
import Header from '../Lawyer/componants/Header';
import '../Lawyer/stylesAdmin.css';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import Sidebar from '../Lawyer/componants/sideBar';
import emailjs from '@emailjs/browser';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TextField, Button } from '@mui/material';
import { AccessibilityContext } from "../Components/AccessibilityContext";

function ContactLawyer() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState("");
  const [selectedClient, setSelectedClient] = useState('');
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const { isHighContrast } = useContext(AccessibilityContext);

  useEffect(() => {
    const checkAdminPermission = async () => {
      const email = Cookies.get('email');
      if (!email) {
        navigate('/', { replace: true });
        return;
      }
      try {
        const response = await axios.post('http://localhost:6500/check-permission', { email });
        if (response.data.data.premission !== "client") {
          navigate('/', { replace: true });
        }
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
    emailjs.init(process.env.REACT_APP_EMAILJSINIT2);
  }, []);

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        let lawyer = await axios.get(`http://localhost:6500/lawyer/${Cookies.get('email')}`);
        setEmail(lawyer.data.lawyer.email);
        setName(lawyer.data.lawyer.full_name);
      } catch (error) {
        console.error("Couldn't fetch clients", error);
      }
    };
    fetchEmail();
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

    if (!subject.trim()) {
      toast.error('מלא את הנושא כדי לשלוח את ההודעה', { position: 'top-right', autoClose: 2000, theme: 'colored' });
      return;
    }

    if (!description.trim()) {
      toast.error('מלא את תוכן ההודעה כדי לשלוח את ההודעה', { position: 'top-right', autoClose: 2000, theme: 'colored' });
      return;
    }

    try {
      const serviceId = "service_lxiaq84";
      const templateId = "template_kzggrep";
      const templateParams = {
        subject: subject,
        message: `Dear ${name},\n${description}\n`,
        email: email,
        name: name
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
  <div className='grid-container' style={{ backgroundColor: "#DDD0C8" }}>
    <Header />
    <Sidebar />
    <main
      className='main-container'
      style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
      role="main"
      aria-label="טופס שליחת הודעה"
    >
      <form
        role="form"
        aria-labelledby="form-title"
        style={{
          background: '#263043',
          borderRadius: '0.5%',
          maxWidth: '100%',
          width: '80%',
          backgroundColor: "#323232",
          textAlign: 'center'
        }}
        onSubmit={handleSubmit}
      >
        <h2 id="form-title" style={{ color: "#fff", fontSize: "28px", marginBottom: "30px" }}>
          טופס שליחת הודעה
        </h2>

        {/* Subject */}
        <div className='form-group' style={{ marginBottom: '40px', width: '600px' }}>
          <TextField
            id="subject"
            label="נושא"
            fullWidth
            inputProps={{
              'aria-required': true,
              'aria-label': 'שדה נושא ההודעה'
            }}
            InputLabelProps={{
              style: { color: '#9e9ea4', fontWeight: 'bold' }
            }}
            InputProps={{
              style: {
                backgroundColor: isHighContrast ? "black" : "whitesmoke",
                fontSize: '20px'
              }
            }}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            sx={{ width: '100%', marginBottom: '40px' }}
          />
        </div>

        {/* AI Prompt */}
        <div className='form-group' style={{ marginBottom: '40px', width: '600px' }}>
          <TextField
            id="aiPrompt"
            label="בקשה ל-AI"
            multiline
            rows={2}
            fullWidth
            inputProps={{
              'aria-label': 'בקשת עזרה מבינה מלאכותית'
            }}
            InputLabelProps={{
              style: { color: '#9e9ea4', fontWeight: 'bold' }
            }}
            InputProps={{
              style: {
                backgroundColor: isHighContrast ? "black" : "whitesmoke",
                fontSize: '20px'
              }
            }}
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            sx={{ width: '100%', marginBottom: '20px' }}
          />
          <Button
            variant="contained"
            color="secondary"
            style={{ width: '600px' }}
            onClick={handleGenerateMessage}
            aria-label="צור הודעה עם בינה מלאכותית"
          >
            צור הודעה עם בינה מלאכותית
          </Button>
        </div>

        {/* Description */}
        <div className='form-group' style={{ marginBottom: '40px', width: '600px' }}>
          <TextField
            id="description"
            label="תוכן ההודעה"
            multiline
            rows={4}
            fullWidth
            inputProps={{
              'aria-required': true,
              'aria-label': 'תוכן ההודעה'
            }}
            InputLabelProps={{
              style: { color: '#9e9ea4', fontWeight: 'bold' }
            }}
            InputProps={{
              style: {
                backgroundColor: isHighContrast ? "black" : "whitesmoke",
                fontSize: '20px'
              }
            }}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ width: '100%', marginBottom: '40px' }}
          />
        </div>

        {/* Send Button */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          style={{ width: '600px' }}
          aria-label="שלח את ההודעה"
        >
          שלח הודעה
        </Button>
      </form>
    </main>
  </div>
</>

  );
}

export default ContactLawyer;
