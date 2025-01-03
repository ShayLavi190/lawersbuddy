import React, { useEffect, useState } from "react";
import Header from "../Lawyer/componants/Header";
import Sidebar from "../Lawyer/componants/sideBar";
import DataTablef from "../Lawyer/componants/Table";
import TableDates from "../Lawyer/componants/TableDates";
import {BsCheckCircle, BsArrowRepeat, BsCash } from "react-icons/bs";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import "../Lawyer/stylesAdmin.css";

function HomeC() {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [ProcessesnumberO, setProcessesnumberO] = useState(0);
  const [ProcessesnumberC, setProcessesnumberC] = useState(0);
  const [MoneyCollected, setMoneyCollected] = useState(0);
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
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
    const fetchFiles = async () => {
      const email = Cookies.get("email");
      try {
        const response = await axios.get(`http://localhost:6500/filesClient/${email}`);
        setFiles(response.data.files);
        const openCases = response.data.files.filter((file) => file.status === "פתוח" || file.status === "בערעור").length;
        const closedCases = response.data.files.filter((file) => file.status === "סגור").length;
        setProcessesnumberO(openCases);
        setProcessesnumberC(closedCases);
        const totalMoney = response.data.files.reduce((sum, file) => sum + (file.payed || 0), 0);
        setMoneyCollected(totalMoney);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };
    fetchFiles();
  }, []);

  useEffect(() => {
    const email = Cookies.get("email");
  
    const fetchAppointments = async () => {
      try {  
        const response = await axios.get(`http://localhost:6500/meetingsClient/${email}`);
        const now = new Date();
        const oneWeekAhead = new Date();
        oneWeekAhead.setDate(now.getDate() + 7);
        now.setHours(0, 0, 0, 0);
        oneWeekAhead.setHours(23, 59, 59, 999);
        const formattedAppointments = response.data.meetings
              .map((appointment, index) => ({
                id: index,
                client: appointment.client,
                date: appointment.date,
                time: appointment.time,
                location: appointment.location,
                appointmentDate: new Date(`${appointment.date}T00:00:00`),
              }))
              .filter((appointment) => {
                const isWithinRange =
                  appointment.appointmentDate > now &&
                  appointment.appointmentDate <= oneWeekAhead;

                return isWithinRange;
              });
        setAppointments(formattedAppointments); 
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };
  
    fetchAppointments();
  }, []);
  
  
  return (
    <div className="grid-container">
      <Header OpenSidebar={() => setOpenSidebarToggle(!openSidebarToggle)} />
      <Sidebar
        openSidebarToggle={openSidebarToggle}
        OpenSidebar={() => setOpenSidebarToggle(!openSidebarToggle)}
      />
      <main className="main-container" style={{ backgroundColor: "#DDD0C8" }}>
        {/* Cards Section */}
        <div className="main-cards" style={{marginLeft:'260px',marginBottom:'50px'}}>
          <div className="card" style={{ backgroundColor: "#99775C", direction: "rtl"}}>
            <div className="card-inner">
              <h3>תיקים פתוחים</h3>
              <BsArrowRepeat className="card_icon" />
            </div>
            <h1>{ProcessesnumberO}</h1>
          </div>
          <div className="card" style={{ backgroundColor: "#99775C", direction: "rtl" }}>
            <div className="card-inner">
              <h3>תיקים סגורים</h3>
              <BsCheckCircle className="card_icon" />
            </div>
            <h1>{ProcessesnumberC}</h1>
          </div>
          <div className="card" style={{ backgroundColor: "#99775C", direction: "rtl" }}>
            <div className="card-inner">
              <h3 style={{ direction: "rtl" }}>תשלומים שבוצעו</h3>
              <BsCash className="card_icon" style={{ direction: "ltr" }} />
            </div>
            <h1>{MoneyCollected}</h1>
          </div>
        </div>
          {/* Data Table */}
          <div>
            <h3
              style={{
                textAlign: "center",
                fontSize: "25px",
                color: "#323232",
                marginBottom: "20px",
              }}
            >
              תיקים
            </h3>
            <DataTablef rows={files} />
          </div>
          <div>
            <h3
              style={{
                textAlign: "center",
                fontSize: "25px",
                color: "#323232",
                marginBottom: "20px",
              }}
            >
              פגישות קרובות
            </h3>
            <TableDates rows={appointments} />
          </div>
      </main>
    </div>
  );
}

export default HomeC;
