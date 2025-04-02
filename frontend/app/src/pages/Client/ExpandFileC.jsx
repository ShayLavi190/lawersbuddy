import React, { useEffect, useState } from "react";
import Header from "../Lawyer/componants/Header";
import Sidebar from "../Lawyer/componants/sideBar";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import {HiCalendar } from "react-icons/hi";

const ExpandFileC = () => {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const [fileData, setFileData] = useState(null);
  const [tempMissions, setTempMissions] = useState({});
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };
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
    const fetchFileData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:6500/files/case/${caseId}`
        );
        setFileData(response.data.file);
        const initialTempMissions = {};
        response.data.file.importantDates.forEach((date) => {
          initialTempMissions[date.date] = "";
        });
        setTempMissions(initialTempMissions);
        const linksResponse = await axios.get(`http://localhost:6500/files/share-links/${caseId}`);
        if (linksResponse.data.success) {
          setFileData((prev) => ({
            ...prev,
            tempLinks: linksResponse.data.links,
          }));
        }
      } catch (error) {
        toast.error("שגיאה בטעינת הדף", {
          position: "top-right",
          autoClose: 2500,
          theme: "colored",
        });
      }
    
    };
    fetchFileData();
  }, [caseId]);
  if (!fileData) {
    return <div>Loading...</div>;
  }

  return (
    <>
  <ToastContainer />
  <div className="grid-container" style={{ backgroundColor: "#DDD0C8" }}>
    <Header OpenSidebar={OpenSidebar} />
    <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />

    <main className="main-container" role="main" aria-label="עמוד פרטי תיק">
      {/* פרטי תיק */}
      <section aria-labelledby="case-details-title" style={{ padding: "20px", backgroundColor: "#323232", borderRadius: "10px" }}>
        <h1 id="case-details-title" style={{ direction: "rtl", color: "#FFF" }}>
          תיק מספר: {fileData.caseId}
        </h1>
        <h3 style={{ direction: "rtl", color: "#FFF" }}>נושא התיק: {fileData.caseTitle}</h3>
        <h4 style={{ direction: "rtl", color: "#FFF" }}>סטטוס: {fileData.status}</h4>
        <h4 style={{ direction: "rtl", color: "#FFF" }}>בית משפט: {fileData.courtName}</h4>
        <h4 style={{ direction: "rtl", color: "#FFF" }}>שופטים: {fileData.judges.join(", ")}</h4>
        <h4 style={{ direction: "rtl", color: "#FFF" }}>
          עורכי דין - תובע: {fileData.attorneys.plaintiff}, נתבע: {fileData.attorneys.defendant}
        </h4>
        <h4 style={{ direction: "rtl", color: "#FFF" }}>
          החלטה סופית: {fileData.finalDecision || "טרם הוזן"}
        </h4>
      </section>

      {/* מסמכים */}
      <section aria-labelledby="documents-section" style={{ padding: "20px", backgroundColor: "#323232", borderRadius: "10px", marginTop: "20px" }}>
        <h1 id="documents-section" style={{ textAlign: "center", color: "#FFF" }}>מסמכים</h1>
        {fileData.tempLinks && fileData.tempLinks.length > 0 ? (
          <ul style={{ listStyle: "none", padding: "0", color: "#FFF" }}>
            {fileData.tempLinks.map((doc, index) => (
              <li key={index} style={{ margin: "10px 0" }}>
                {doc.link.endsWith(".pdf") ? (
                  <iframe
                    src={doc.link}
                    title={`תצוגת מסמך ${doc.fileName}`}
                    width="100%"
                    height="500px"
                    style={{ border: "none", backgroundColor: "#FFF" }}
                    aria-label={`מסמך PDF בשם ${doc.fileName}`}
                  />
                ) : (
                  <a
                    href={doc.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#1E90FF", textDecoration: "none" }}
                    aria-label={`הורד קובץ ${doc.fileName}`}
                  >
                    {doc.fileName}
                  </a>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ textAlign: "center", color: "#FFF" }}>אין מסמכים זמינים</p>
        )}
      </section>

      {/* תאריכים חשובים */}
      <section aria-labelledby="important-dates-section" style={{ padding: "20px", backgroundColor: "#323232", borderRadius: "10px", marginTop: "20px" }}>
        <h1 id="important-dates-section" style={{ textAlign: "center", color: "#FFF" }}>תאריכים חשובים</h1>
        <div style={{ position: "relative", margin: "20px 0", paddingLeft: "50px" }}>
          {fileData.importantDates.map((importantDate, index) => (
            <div
              key={index}
              role="region"
              aria-label={`אירוע: ${importantDate.event}`}
              style={{
                display: "flex",
                alignItems: "flex-start",
                marginBottom: "40px",
                position: "relative",
              }}
            >
              {/* קו אנכי */}
              {index < fileData.importantDates.length - 1 && (
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    left: "25px",
                    top: "25px",
                    height: "calc(100% + 15px)",
                    width: "2px",
                    backgroundColor: "#C4C4C4",
                    zIndex: 0,
                  }}
                ></div>
              )}

              {/* עיגול עם אייקון */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#C4C4C4",
                  borderRadius: "50%",
                  width: "50px",
                  height: "50px",
                  zIndex: 1,
                  marginRight: "20px",
                  position: "relative",
                }}
                aria-hidden="true"
              >
                <HiCalendar style={{ color: "#FFF", fontSize: "24px" }} />
              </div>

              {/* תוכן האירוע */}
              <div style={{ flex: 1, color: "#FFF" }}>
                <h3>{importantDate.event}</h3>
                <p style={{ color: "#CCC" }}>
                  {new Date(importantDate.date).toLocaleDateString("he-IL")}
                </p>

                <ul style={{ padding: "0 0 0 15px", color: "#CCC" }}>
                  {importantDate.missions?.length > 0 ? (
                    importantDate.missions.map((mission, idx) => (
                      <li
                        key={idx}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "40px",
                          marginBottom: "10px",
                        }}
                      >
                        {/* כפתור לביצוע פעולה כלשהי */}
                        <span style={{ width: '300px' }}>
                          {mission.text}
                        </span>
                      </li>
                    ))
                  ) : (
                    <li style={{ color: "#AAA" }} aria-label="אין משימות">אין משימות</li>
                  )}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  </div>
</>

  );
  
};


export default ExpandFileC;
