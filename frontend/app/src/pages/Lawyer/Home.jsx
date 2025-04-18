import React, { useEffect, useState, useContext } from "react";
import Header from "./componants/Header";
import Sidebar from "./componants/sideBar";
import DataTablef from "./componants/Table";
import TableDates from "./componants/TableDates";
import { BsPeopleFill, BsCheckCircle, BsArrowRepeat, BsCash } from "react-icons/bs";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import "./stylesAdmin.css";
import { AccessibilityContext } from "../Components/AccessibilityContext";

function Home() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [files, setFiles] = useState([]);
  const [Usersnumber, setUsersnumber] = useState(0);
  const [ProcessesnumberO, setProcessesnumberO] = useState(0);
  const [ProcessesnumberC, setProcessesnumberC] = useState(0);
  const [MoneyCollected, setMoneyCollected] = useState(0);
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const { isHighContrast } = useContext(AccessibilityContext);

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
    const fetchFiles = async () => {
      const email = Cookies.get("email");
      try {
        const response = await axios.get(`http://localhost:6500/files/${email}`);
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
    const fetchUsers = async () => {
      const email = Cookies.get("email");
      try {
        const response = await axios.get(`http://localhost:6500/clients/${email}`);
        setUsers(response.data.clients);
        setUsersnumber(response.data.clients.length); 
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const email = Cookies.get("email");
  
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(`http://localhost:6500/meetings/${email}`);
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
  <main className="main-container" style={{ backgroundColor: "#DDD0C8" }} role="main">
    {/* Cards Section */}
    <section
      className="main-cards"
      aria-label="סטטיסטיקות כלליות"
    >
      <div
        className="card"
        style={{ backgroundColor: "#99775C", direction: "rtl" }}
        tabIndex={0}
        aria-label={`כמות תיקים פתוחים: ${ProcessesnumberO}`}
      >
        <div className="card-inner">
          <h3>תיקים פתוחים</h3>
          <BsArrowRepeat className="card_icon" />
        </div>
        <h1>{ProcessesnumberO}</h1>
      </div>

      <div
        className="card"
        style={{ backgroundColor: "#99775C", direction: "rtl" }}
        tabIndex={0}
        aria-label={`כמות תיקים סגורים: ${ProcessesnumberC}`}
      >
        <div className="card-inner">
          <h3>תיקים סגורים</h3>
          <BsCheckCircle className="card_icon" />
        </div>
        <h1>{ProcessesnumberC}</h1>
      </div>

      <div
        className="card"
        style={{ backgroundColor: "#99775C", direction: "rtl" }}
        tabIndex={0}
        aria-label={`כמות לקוחות: ${Usersnumber}`}
      >
        <div className="card-inner">
          <h3>לקוחות</h3>
          <BsPeopleFill className="card_icon" />
        </div>
        <h1>{Usersnumber}</h1>
      </div>

      <div
        className="card"
        style={{ backgroundColor: "#99775C", direction: "rtl" }}
        tabIndex={0}
        aria-label={`סכום תשלומים שבוצעו: ${MoneyCollected} ש"ח`}
      >
        <div className="card-inner">
          <h3 style={{ direction: "rtl" }}>תשלומים שבוצעו</h3>
          <BsCash className="card_icon" style={{ direction: "ltr" }} />
        </div>
        <h1>{MoneyCollected}</h1>
      </div>
    </section>

    {/* Data Table */}
    <section aria-labelledby="cases-heading">
      <h3
        id="cases-heading"
        style={{
          textAlign: "center",
          fontSize: "25px",
          marginBottom: "20px",
        }}
      >
        תיקים
      </h3>
      <DataTablef rows={files} />
    </section>

    <section aria-labelledby="meetings-heading">
      <h3
        id="meetings-heading"
        style={{
          textAlign: "center",
          fontSize: "25px",
          marginBottom: "20px",
        }}
      >
        פגישות קרובות
      </h3>
      <TableDates rows={appointments} />
    </section>
  </main>
</div>
  );
}

export default Home;
