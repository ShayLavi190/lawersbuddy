import React, { useEffect, useState } from 'react';
import Header from './componants/Header';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from './componants/sideBar';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './stylesAdmin.css';
import emailjs from '@emailjs/browser';


import { TextField, Button, MenuItem, FormControl, InputLabel, Select, FormHelperText } from '@mui/material';

function Meeting() {
  const navigate = useNavigate();
  const location = useLocation();
  const passedClient = location.state?.person;
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [emailError, setEmailError] = useState('');
  const [meetingLocation, setMeetingLocation] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

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

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get(`http://localhost:6500/clients/${Cookies.get("email")}`);
        setClients(response.data.clients);
        if (passedClient) {
          setSelectedClient(JSON.stringify(passedClient));
        }
      } catch (error) {
        console.error("Couldn't fetch clients", error);
      }
    };
    fetchClients();
  }, []);
  useEffect(() => {
    emailjs.init(process.env.REACT_APP_EMAILJSINIT);
  }, []);
  const handleGenerateMessage = async () => {
    if (!selectedClient || !appointmentDate || !appointmentTime) {
      toast.error('יש מלא את כלל השדות לפני בקשה של הכנת הודעה', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        transition: Slide,
      });
      return;
    }

    setIsGenerating(true);
    try {
      const selectedClientObj = JSON.parse(selectedClient);
      const prompt = `
        Generate a meeting message for client ${selectedClientObj.full_name}.
        The meeting is scheduled for ${appointmentDate} at ${appointmentTime} at ${meetingLocation || "the office"}.
      `;

      const response = await axios.post('http://localhost:6500/generate-message', { prompt });

      if (response.data.message) {
        setDescription(response.data.message);
      }
    } catch (error) {
      console.error("Error generating AI message:", error);
      toast.error('שגיאה ביצירת הודעה בבינה מלאכותית. בבקשה נסה שנית', {
        position: "top-right",
        autoClose: 2000,
        theme: "colored",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedClient) {
      setEmailError("בחר לקוח");
      return;
    }
    setEmailError("");

    try {
      const selectedClientObj = JSON.parse(selectedClient);

      const response = await axios.post("http://localhost:6500/meeting", {
        client: selectedClientObj.id,
        date: appointmentDate,
        time: appointmentTime,
        location: meetingLocation,
        info: description,
        lawyer: name,
      });
        const serviceId = "bstorecontact";
        const templateId = "template_n389dr4";
        const templateParams = {
          subject: 'פגישה חדשה נקבעה',
          message: description,
          email: selectedClientObj.email,
        };
  
        await emailjs.send(serviceId, templateId, templateParams);
      
      if (response.data.success) {
        await toast.success('הפגישה נקבעה בהצלחה', {
          position: "top-right",
          autoClose: 2000,
          theme: "colored",
        });
        setTimeout(() => {
          clearForm();
        }, 5000);
      }
    } catch (error) {
      console.error("Error while saving meeting:", error);
      toast.error('שגיאה בשמירת פגישה, נסה שנית', {
        position: "top-right",
        autoClose: 2000,
        theme: "colored",
      });
    }
  };

  const clearForm = () => {
    setSelectedClient('');
    setAppointmentDate('');
    setAppointmentTime('');
    setMeetingLocation('');
    setDescription('');
  };

  return (
    <>
      <ToastContainer />
      <div className='grid-container' style={{ backgroundColor: "#DDD0C8" }}>
        <Header />
        <Sidebar />
        <main className='main-container' style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <form
            style={{
              background: '#263043',
              borderRadius: '0.5%',
              maxWidth: '100%',
              width: '80%',
              backgroundColor: "#323232",
              textAlign: 'center'
            }}
          >
            <div className='form-group' style={{ width: '600px' }}>
              <FormControl fullWidth variant="outlined" required sx={{ width: '100%' }}>
              <InputLabel
                id="client-label"
                sx={{
                  color: '#9e9ea4',
                  fontWeight: 'bold',
                  display: 'flex',
                  justifyContent: 'center',
                  width: '100%',
                  textAlign: 'center',
                }}
              >
              בחר לקוח
            </InputLabel>
            <Select
              labelId="client-label"
              id="client"
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              label="בחר לקוח"
              sx={{
                backgroundColor: '#FFFFFF',
                fontSize: '20px',
                width: '100%',
                textAlign: 'center',
                '& .MuiSelect-select': {
                  textAlign: 'center',
                },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    '& .MuiMenuItem-root': {
                      textAlign: 'center',
                    },
                  },
                },
              }}
            >
              {clients.length > 0 ? (
                clients.map((client) => (
                  <MenuItem
                    key={client.email}
                    value={JSON.stringify(client)}
                    sx={{ textAlign: 'center' }}
                  >
                    {client.full_name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled sx={{ textAlign: 'center' }}>No clients available</MenuItem>
              )}
            </Select>
                <FormHelperText style={{ color: '#9e9ea4', fontWeight: 'bold',fontSize:'15px', marginBottom: '20px' }}>
                  בחר לקוח שאיתו תרצה לקבוע פגישה
                </FormHelperText>
              </FormControl>
            </div>
            <div className='form-group' style={{ marginBottom: '20px', width: '600px' }}>
            <TextField
              label="תאריך פגישה"
              type="date"
              fullWidth
              InputLabelProps={{
                shrink: true,
                style: { color: '#9e9ea4', fontWeight: 'bold' }
              }}
              InputProps={{
                sx: {
                  '& .MuiInputBase-input': {
                    textAlign: 'center',
                    backgroundColor: '#FFFFFF',
                    fontSize: '20px',
                  },
                },
              }}
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              required
              sx={{ width: '100%', marginBottom: '20px' }}
            />
            </div>
            <div className='form-group' style={{ marginBottom: '20px', width: '600px' }}>
              <TextField
                label="זמן הפגישה"
                type="time"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                  style: { color: '#9e9ea4', fontWeight: 'bold' }
                }}
                InputProps={{
                  sx: {
                    '& .MuiInputBase-input': {
                      textAlign: 'center',
                      backgroundColor: '#FFFFFF',
                      fontSize: '20px',
                    },
                  },
                }}
                value={appointmentTime}
                onChange={(e) => setAppointmentTime(e.target.value)}
                required
                sx={{ width: '100%', marginBottom: '20px' }}
              />
            </div>
            <div className='form-group' style={{ marginBottom: '20px', width: '600px', margin: '0 auto' }}>
              <TextField
                label="מיקום הפגישה"
                fullWidth
                InputLabelProps={{
                  style: {
                    color: '#9e9ea4',
                    fontWeight: 'bold',
                    display: 'flex',
                    justifyContent: 'center',
                    width: '100%', 
                  },
                }}
                InputProps={{
                  style: {
                    backgroundColor: '#FFFFFF',
                    fontSize: '20px',
                    textAlign: 'center', 
                  },
                }}
                value={meetingLocation}
                onChange={(e) => setMeetingLocation(e.target.value)}
                sx={{ width: '100%', marginBottom: '40px' }}
              />
            </div>

            <div className='form-group' style={{ marginBottom: '20px', width: '600px', margin: '0 auto' }}>
              <TextField
                label="תוכן ההודעה"
                multiline
                rows={4}
                fullWidth
                InputLabelProps={{
                  style: {
                    color: '#9e9ea4',
                    fontWeight: 'bold',
                    display: 'flex',
                    justifyContent: 'center',
                    width: '100%',
                  },
                }}
                InputProps={{
                  style: {
                    backgroundColor: '#FFFFFF',
                    fontSize: '20px',
                    textAlign: 'center',
                  },
                }}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                sx={{ width: '100%', marginBottom: '20px' }}
              />
              <Button
                variant="contained"
                color="secondary"
                onClick={handleGenerateMessage}
                disabled={isGenerating}
                style={{ marginTop: '10px',marginBottom: '20px' }}
              >
                {isGenerating ? 'Generating...' : 'Generate AI Message'}
              </Button>
            </div>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{ width: '600px' }}
              onClick={handleSubmit}
            >
              קבע פגישה
            </Button>
          </form>
        </main>
      </div>
    </>
  );
}

export default Meeting;
