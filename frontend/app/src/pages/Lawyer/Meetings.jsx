import React, { useEffect, useState } from "react";
import Header from "./componants/Header";
import "./stylesAdmin.css";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Sidebar from "./componants/sideBar";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {Button} from '@mui/material';

function Meetings() {
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedMeet, setSelectedMeet] = useState(null);
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  useEffect(() => {
    const checkAdminPermission = async () => {
      const email = Cookies.get("email");

      if (!email) {
        navigate("/", { replace: true });
        return;
      }
      try {
        const response = await axios.post(
          "http://localhost:6500/check-permission",
          { email }
        );

        if (response.data.data.premission !== "lawyer") {
          navigate("/", { replace: true });
        }
      } catch (error) {
        console.error("Error checking admin permission:", error);
        navigate("/", { replace: true });
      }
    };
    checkAdminPermission();
  }, [navigate]);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const response = await axios.get(
          `http://localhost:6500/meetings/${Cookies.get("email")}`
        );
        setMeetings(response.data.meetings || []);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };
    fetchMeetings();
  }, []);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  const handleDelete = async (_id) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div style={{ textAlign: "center", padding: "20px", background: "#222831", borderRadius: "8px", color: "#fff" }}>
            <h1 style={{ marginBottom: "20px" }}>אזהרה</h1>
            <p style={{ marginBottom: "20px" }}>אתה בטוח שברצונך למחוק את הקובץ ?</p>
            <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
              <button
                onClick={async () => {
                  try {
                    const response = await axios.delete(
                      `http://localhost:6500/meet/${_id}`
                    );
                    if (response.status === 200) {
                      setMeetings(meetings.filter((meet) => meet._id !== _id));
                      toast.success("הפגישה נמחקה בהצלחה", {
                        position: "top-right",
                        autoClose: 2500,
                        theme: "colored",
                        transition: Slide,
                      });
                    } else {
                      toast.error(`שגיאה במחיקת הפגישה ${response.data.message}`, {
                        position: "top-right",
                        autoClose: 2500,
                        theme: "colored",
                        transition: Slide,
                      });
                    }
                  } catch (error) {
                    console.error("Error deleting file:", error);
                    toast.error("שגיאה במחיקת הפגישה", {
                      position: "top-right",
                      autoClose: 2500,
                      theme: "colored",
                      transition: Slide,
                    });
                  } finally {
                    onClose();
                  }
                }}
                style={{
                  backgroundColor: "#059212",
                  color: "white",
                  padding: "10px 20px",
                  border: "none",
                  cursor: "pointer",
                  borderRadius: "5px",
                }}
              >
               כן, מחק
              </button>
              <button
                onClick={onClose}
                style={{
                  backgroundColor: "#C40C0C",
                  color: "white",
                  padding: "10px 20px",
                  border: "none",
                  cursor: "pointer",
                  borderRadius: "5px",
                }}
              >
                בטל
              </button>
            </div>
          </div>
        );
      },
      closeOnClickOutside: false,
    });
  };
  const  addNewFile = () => {
    navigate("/meetingLawyer");
  };
  const handleEdit = (meeting) => {
    navigate("/editMeeting", { state: { meeting } });
  };
  

  return (
    <div className="grid-container" style={{ backgroundColor: "#DDD0C8" }}>
      <Header OpenSidebar={OpenSidebar} />
      <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
      <main className="main-container">
      <div className="table-container">
          <table className="customers-table">
            <thead>
              <tr>
                <th style={{backgroundColor:'#323232',textAlign:'center'}}>עורך דין</th>
                <th style={{backgroundColor:'#323232',textAlign:'center'}}>תיאור</th>
                <th style={{backgroundColor:'#323232',textAlign:'center'}}>תאריך</th>
                <th style={{backgroundColor:'#323232',textAlign:'center'}}>שעה</th>
                <th style={{backgroundColor:'#323232',textAlign:'center'}}>מיקום</th>
                <th style={{backgroundColor:'#323232',textAlign:'center'}}></th>

              </tr>
            </thead>
            <tbody>
              {meetings.map((meeting) => (
                <tr key={meeting._id} style={{ backgroundColor: 'whitesmoke', color: 'black' }}>
                  <td style={{ textAlign: 'center', padding: '10px' }}>{meeting.lawyer}</td>
                  <td
                    style={{
                      textAlign: 'center',
                      padding: '10px', 
                      height: 'auto',
                      wordWrap: 'break-word',
                      whiteSpace: 'normal',
                      maxWidth: '850px', 
                    }}
                  >
                    {meeting.info}
                  </td>
                  <td style={{ textAlign: 'center', padding: '10px' }}>{meeting.date}</td>
                  <td style={{ textAlign: 'center', padding: '10px' }}>{meeting.time}</td>
                  <td style={{ textAlign: 'center', padding: '10px' }}>{meeting.location}</td>
                  <td>
                    <button
                      aria-label={`Edit ${meeting._id}`}
                      onClick={() => handleEdit(meeting._id)}
                      className="edit-button"
                      style={{ alignItems: 'center', padding: '10px',marginLeft:'10px' }}
                    >
                      עריכה
                    </button>
                    <button
                      aria-label={`Delete ${meeting._id}`}
                      onClick={() => handleDelete(meeting._id)}
                      className="delete-button"
                      style={{ alignItems: 'center', padding: '10px',backgroundColor:'red' }}
                    >
                      מחיקה
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>     
        </div>
        <div>
          <Button
          type="submit"
          variant="contained"
          color="primary"
          style={{ width: '600px', marginLeft:'370px',marginTop:'50px' }}
          onClick={addNewFile}
        >
        צור פגישה חדשה  
        </Button>        
        </div>
      </main>
    </div>
  );
}

export default Meetings;
