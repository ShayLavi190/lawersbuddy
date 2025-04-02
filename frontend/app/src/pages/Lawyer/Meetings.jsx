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

  <main className="main-container" role="main" aria-label="רשימת פגישות לניהול">
    <div className="table-container" role="region" aria-labelledby="meetings-table-title">
      <h2 id="meetings-table-title" className="visually-hidden">טבלת פגישות עם אפשרויות עריכה ומחיקה</h2>

      <table
        className="customers-table"
        role="table"
        aria-label="טבלת פגישות הכוללת עורך דין, תיאור, תאריך, שעה, מיקום ואפשרות עריכה ומחיקה"
      >
        <thead>
          <tr>
            <th scope="col" style={{ backgroundColor: '#323232', textAlign: 'center' }}>עורך דין</th>
            <th scope="col" style={{ backgroundColor: '#323232', textAlign: 'center' }}>תיאור</th>
            <th scope="col" style={{ backgroundColor: '#323232', textAlign: 'center' }}>תאריך</th>
            <th scope="col" style={{ backgroundColor: '#323232', textAlign: 'center' }}>שעה</th>
            <th scope="col" style={{ backgroundColor: '#323232', textAlign: 'center' }}>מיקום</th>
            <th scope="col" style={{ backgroundColor: '#323232', textAlign: 'center' }}></th>
          </tr>
        </thead>

        <tbody>
          {meetings.map((meeting) => (
            <tr
              key={meeting._id}
              tabIndex={0}
              aria-label={`פגישה עם עו"ד ${meeting.lawyer}, תיאור: ${meeting.info}, בתאריך ${meeting.date} בשעה ${meeting.time} במקום ${meeting.location}`}
              style={{ backgroundColor: 'whitesmoke', color: 'black' }}
            >
              <td>{meeting.lawyer}</td>
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
              <td style={{ textAlign: 'center' }}>
                <button
                  aria-label={`עריכת הפגישה עם עו"ד ${meeting.lawyer} בתאריך ${meeting.date}`}
                  onClick={() => handleEdit(meeting._id)}
                  className="edit-button"
                  style={{ alignItems: 'center', padding: '10px', marginLeft: '10px' }}
                >
                  עריכה
                </button>
                <button
                  aria-label={`מחיקת הפגישה עם עו"ד ${meeting.lawyer} בתאריך ${meeting.date}`}
                  onClick={() => handleDelete(meeting._id)}
                  className="delete-button"
                  style={{ alignItems: 'center', padding: '10px', backgroundColor: 'red' }}
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
        style={{ width: '600px', marginLeft: '370px', marginTop: '50px' }}
        onClick={addNewFile}
        aria-label="צור פגישה חדשה"
      >
        צור פגישה חדשה  
      </Button>
    </div>
  </main>
</div>

  );
}

export default Meetings;
