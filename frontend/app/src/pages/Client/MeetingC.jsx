import React, { useEffect, useState } from "react";
import Header from "../Lawyer/componants/Header";
import "../Lawyer/stylesAdmin.css";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Lawyer/componants/sideBar";
import "react-confirm-alert/src/react-confirm-alert.css";
import "react-toastify/dist/ReactToastify.css";

function MeetingsC() {
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState([]);
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

        if (response.data.data.premission !== "client") {
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
          `http://localhost:6500/meetingsClient/${Cookies.get("email")}`
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
              </tr>
            </thead>
            <tbody>
              {meetings.map((meeting) => (
                <tr key={meeting.caseId} style={{ backgroundColor: 'whitesmoke', color: 'black' }}>
                  <td style={{ textAlign: 'center', padding: '10px' }}>{meeting.lawyer}</td>
                  <td
                    style={{
                      textAlign: 'center',
                      padding: '10px',
                      height: 'auto',
                      wordWrap: 'break-word',
                      whiteSpace: 'normal',
                      maxWidth: '1000px', 
                    }}
                  >
                    {meeting.info}
                  </td>
                  <td style={{ textAlign: 'center', padding: '10px' }}>{meeting.date}</td>
                  <td style={{ textAlign: 'center', padding: '10px' }}>{meeting.time}</td>
                  <td style={{ textAlign: 'center', padding: '10px' }}>{meeting.location}</td>
                </tr>
              ))}
            </tbody>
          </table>     
        </div>
      </main>
    </div>
  );
}

export default MeetingsC;
