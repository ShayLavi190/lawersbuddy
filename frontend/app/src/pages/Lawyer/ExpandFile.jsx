import React, { useEffect, useState } from "react";
import Header from "./componants/Header";
import Sidebar from "./componants/sideBar";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import { Button } from "flowbite-react";
import { HiArrowNarrowRight, HiCalendar } from "react-icons/hi";
const ExpandFile = () => {
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

  const handleAddMission = async (date) => {
    const mission = tempMissions[date];
    if (!mission.trim()) {
      toast.error("יש למלא את תוכן המשימה", {
        position: "top-right",
        autoClose: 2000,
        theme: "colored",
      });
      return;
    }
  
    try {
      const response = await axios.put(
        `http://localhost:6500/files/${fileData.caseId}/missions`,
        { date, mission }
      );
  
      if (response.status === 200) {
        setFileData(response.data.file); 
        setTempMissions((prev) => ({ ...prev, [date]: "" })); 
      }
    } catch (error) {
      console.error("Error adding mission:", error);
      toast.error("שגיאה בשמירת המשימה", {
        position: "top-right",
        autoClose: 2500,
        theme: "colored",
      });
    }
  };
  
  const handleTempMissionChange = (date, value) => {
    setTempMissions((prev) => ({
      ...prev,
      [date]: value,
    }));
  };

  if (!fileData) {
    return <div>Loading...</div>;
  }

const handleMarkMission = async (date, mission) => {
  try {
    const response = await axios.put(
      `http://localhost:6500/files/${fileData.caseId}/missions/update`,
      { date, mission, action: "mark" }
    );

    if (response.status === 200) {
      setFileData(response.data.file); 
    }
  } catch (error) {
    console.error("Error marking mission as done:", error);
    toast.error("שגיאה בעידכון המשימה", {
      position: "top-right",
      autoClose: 2500,
      theme: "colored",
    });
  }
};

const handleDeleteMission = async (date, mission) => {
  try {
    const response = await axios.put(
      `http://localhost:6500/files/${fileData.caseId}/missions/update`,
      { date, mission, action: "delete" }
    );

    if (response.status === 200) {
      setFileData(response.data.file); 
    }
  } catch (error) {
    console.error("Error deleting mission:", error);
    toast.error("שגיאה במחיקת המשימה", {
      position: "top-right",
      autoClose: 2500,
      theme: "colored",
    });
  }
};

  return (
    <>
      <ToastContainer />
      <div className="grid-container" style={{ backgroundColor: "#DDD0C8" }}>
        <Header OpenSidebar={OpenSidebar} />
        <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
        <main className="main-container">
          <div style={{ padding: "20px", backgroundColor: "#323232", borderRadius: "10px" }}>
            <h1 style={{ direction: "rtl", color: "#FFF" }}>{`תיק מספר: ${fileData.caseId}`}</h1>
            <h3 style={{ direction: "rtl", color: "#FFF" }}>{`נושא התיק: ${fileData.caseTitle}`}</h3>
            <h4 style={{ direction: "rtl", color: "#FFF" }}>{`סטטוס: ${fileData.status}`}</h4>
            <h4 style={{ direction: "rtl", color: "#FFF" }}>{`בית משפט: ${fileData.courtName}`}</h4>
            <h4 style={{ direction: "rtl", color: "#FFF" }}>{`שופטים: ${fileData.judges.join(", ")}`}</h4>
            <h4 style={{ direction: "rtl", color: "#FFF" }}>{`עורכי דין - תובע: ${fileData.attorneys.plaintiff}, נתבע: ${fileData.attorneys.defendant}`}</h4>
            <h4 style={{ direction: "rtl", color: "#FFF" }}>{`החלטה סופית: ${fileData.finalDecision || "טרם הוזן"}`}</h4>
          </div>
          {/* Documents Section */}
          <div style={{ padding: "20px", backgroundColor: "#323232", borderRadius: "10px", marginTop: "20px" }}>
            <h1 style={{ textAlign: "center", color: "#FFF" }}>מסמכים</h1>
            {fileData.tempLinks && fileData.tempLinks.length > 0 ? (
              <ul style={{ listStyle: "none", padding: "0", color: "#FFF" }}>
                {fileData.tempLinks.map((doc, index) => (
                  <li key={index} style={{ margin: "10px 0" }}>
                    {doc.link.endsWith(".pdf") ? (
                      <iframe
                        src={doc.link}
                        title={doc.fileName}
                        width="100%"
                        height="500px"
                        style={{
                          border: "none",
                          backgroundColor: "#FFF",
                        }}
                      />
                    ) : (
                      <a
                        href={doc.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#1E90FF", textDecoration: "none" }}
                      >
                        {doc.fileName}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ textAlign: "center", color: "#FFF" }}>אין מסמכים</p>
            )}
          </div>
          <div style={{ padding: "20px", backgroundColor: "#323232", borderRadius: "10px", marginTop: "20px" }}>
            <h1 style={{ textAlign: "center", color: "#FFF" }}>תאריכים חשובים</h1>
            <div style={{ position: "relative", margin: "20px 0", paddingLeft: "50px" }}>
              {fileData.importantDates.map((importantDate, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    marginBottom: "40px",
                    position: "relative",
                  }}
                >
                  {/* Vertical Line */}
                  {index < fileData.importantDates.length - 1 && (
                    <div
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
  
                  {/* Circle with Icon */}
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
                  >
                    <HiCalendar style={{ color: "#FFF", fontSize: "24px" }} />
                  </div>
  
                  {/* Date and Event */}
                  <div style={{ flex: 1, color: "#FFF" }}>
                    <h3 style={{ margin: "0" }}>{importantDate.event}</h3>
                    <p style={{ color: "#CCC", margin: "5px 0" }}>
                      {new Date(importantDate.date).toLocaleDateString("he-IL")}
                    </p>
                    {/* Missions */}
                    <ul style={{ padding: "0 0 0 15px", color: "#CCC" }}>
                    {importantDate.missions?.length > 0 ? (
                      importantDate.missions.map((mission, idx) => (
                        <li
                          key={idx}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "left",
                            gap: "40px",
                            marginBottom: "10px",
                          }}
                        >
                          {/* Checkbox and Mission Text */}
                          <div style={{ display: "flex", alignItems: "center", gap: "40px" }}>
                            <input
                              type="checkbox"
                              checked={mission.completed || false}
                              onChange={() => handleMarkMission(importantDate.date, mission.text)}
                              style={{ cursor: "pointer" }}
                            />
                            <span style={{ textDecoration: mission.completed ? "line-through" : "none" , width:'300px'}}>
                              {mission.text}
                            </span>
                          </div>
                          {/* Delete Button */}
                          <Button
                            variant="contained"
                            color="primary"
                            style={{
                              backgroundColor: "red",
                              padding: "5px 15px",
                              fontWeight: "bold",
                              borderRadius: "5px",
                            }}
                            size="sm"
                            onClick={() => handleDeleteMission(importantDate.date, mission.text)}
                          >
                            מחיקה
                          </Button>
                        </li>
                      ))
                    ) : (
                      <li style={{ color: "#AAA" }}>No missions</li>
                    )}
                  </ul>
                    {/* Input and Add Button */}
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "10px" }}>
                      <input
                        type="text"
                        placeholder="Add a mission"
                        value={tempMissions[importantDate.date] || ""}
                        onChange={(e) =>
                          handleTempMissionChange(importantDate.date, e.target.value)
                        }
                        style={{
                          padding: "5px",
                          border: "1px solid gray",
                          borderRadius: "5px",
                          color: "#000",
                        }}
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleAddMission(importantDate.date)}
                        style={{
                          backgroundColor: "#1976D2",
                          padding: "5px 15px",
                          fontWeight: "bold",
                          borderRadius: "5px",
                        }}
                      >
                        הוסף משימה
                        <HiArrowNarrowRight style={{ marginLeft: "5px" }} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  );
  
};


export default ExpandFile;
