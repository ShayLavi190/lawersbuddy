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

      <main className="main-container" role="main" aria-label="רשימת פגישות">
        <div className="table-container" role="region" aria-labelledby="meetings-heading">
          <h2 id="meetings-heading" className="visually-hidden">טבלת פגישות עתידיות</h2>

          <table
            className="customers-table"
            role="table"
            aria-label="טבלת פגישות בין עורכי דין ללקוחות"
          >
            <thead>
              <tr>
                <th scope="col" style={{ backgroundColor: '#323232', textAlign: 'center' }}>
                  עורך דין
                </th>
                <th scope="col" style={{ backgroundColor: '#323232', textAlign: 'center' }}>
                  תיאור
                </th>
                <th scope="col" style={{ backgroundColor: '#323232', textAlign: 'center' }}>
                  תאריך
                </th>
                <th scope="col" style={{ backgroundColor: '#323232', textAlign: 'center' }}>
                  שעה
                </th>
                <th scope="col" style={{ backgroundColor: '#323232', textAlign: 'center' }}>
                  מיקום
                </th>
              </tr>
            </thead>

            <tbody>
              {meetings.map((meeting, index) => (
                <tr
                  key={meeting.caseId || index}
                  tabIndex={0}
                  aria-label={`פגישה עם עורך הדין ${meeting.lawyer}, תיאור: ${meeting.info}, בתאריך ${meeting.date}, בשעה ${meeting.time}, במיקום ${meeting.location}`}
                  style={{ backgroundColor: 'whitesmoke', color: 'black' }}
                >
                  <td style={{ textAlign: 'center', padding: '10px' }}>{meeting.lawyer}</td>
                  <td style={{
                    textAlign: 'center',
                    padding: '10px',
                    height: 'auto',
                    wordWrap: 'break-word',
                    whiteSpace: 'normal',
                    maxWidth: '1000px',
                  }}>
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
