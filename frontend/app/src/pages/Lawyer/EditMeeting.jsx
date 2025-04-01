import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "./componants/Header";
import Sidebar from "./componants/sideBar";
import "./stylesAdmin.css";
import Cookies from "js-cookie";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AccessibilityContext } from "../Components/AccessibilityContext";

const EditMeet = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { meeting } = location.state;
  const [editedMeeting, setEditedMeeting] = useState({ ...meeting });
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
    const fetchMeeting = async () => {
      try {
        const response = await axios.get(
          `http://localhost:6500/meet/${meeting}`
        );
        setEditedMeeting(response.data.meeting);
      } catch (error) {
        console.error("Error fetching meeting:", error);
      }
    };
    fetchMeeting();
  }, [meeting]);
  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedMeeting({ ...editedMeeting, [name]: value });
  };

  const handleSave = async () => {
    if (
      !editedMeeting.client ||
      !editedMeeting.date ||
      !editedMeeting.time ||
      !editedMeeting.info ||
      !editedMeeting.location ||
      !editedMeeting.lawyer
    ) {
      toast.error("יש למלא את כל השדות", {
        position: "top-right",
        autoClose: 2500,
        theme: "colored",
        transition: Slide,
      });
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:6500/meet/${meeting}`,
        editedMeeting
      );

      if (response.status === 200) {
        toast.success("הפגישה עודכנה בהצלחה", {
          position: "top-right",
          autoClose: 2500,
          theme: "colored",
          transition: Slide,
        });
        setTimeout(() => {
          navigate("/meetings");
        }, 1500);
      }
    } catch (error) {
      console.error("Error updating meeting:", error);
      toast.error("שגיאה בשמירת הפגישה", {
        position: "top-right",
        autoClose: 2500,
        theme: "colored",
      });
    }
  };

  const handleCancel = () => {
    navigate("/meetings");
  };

  return (
    <>
      <ToastContainer />
      <div className="grid-container" style={{ backgroundColor: "#DDD0C8" }}>
        <Header OpenSidebar={OpenSidebar} />
        <Sidebar
          openSidebarToggle={openSidebarToggle}
          OpenSidebar={OpenSidebar}
        />
        <main className="main-container">
          <div style={{ padding: "20px" }}>
            <form
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                backgroundColor: "#323232",
                padding: "20px",
                borderRadius: "10px",
              }}
            >
              <label>לקוח</label>
              <input
                type="text"
                name="client"
                value={editedMeeting.client || ""}
                onChange={handleChange}
                style={{ textAlign: "center" }}
              />

              <label>תאריך</label>
              <input
                type="date"
                name="date"
                value={editedMeeting.date?.split("T")[0] || ""}
                onChange={handleChange}
                style={{ textAlign: "center" }}
              />

              <label>שעה</label>
              <input
                type="time"
                name="time"
                value={editedMeeting.time || ""}
                onChange={handleChange}
                style={{ textAlign: "center" }}
              />

              <label>פרטים</label>
              <textarea
                name="info"
                value={editedMeeting.info || ""}
                onChange={handleChange}
                style={{ textAlign: "center", width: "100%", height: "200px", backgroundColor:isHighContrast ? "#000" :"white" , color:isHighContrast ? "#ffff00" : "black"}}
              ></textarea>

              <label>מיקום</label>
              <input
                type="text"
                name="location"
                value={editedMeeting.location || ""}
                onChange={handleChange}
                style={{ textAlign: "center" }}
              />

              <label>עורך דין</label>
              <input
                type="text"
                name="lawyer"
                value={editedMeeting.lawyer || ""}
                onChange={handleChange}
                style={{ textAlign: "center" }}
              />

              <div style={{ marginBottom: "20px", textAlign: "center" }}>
                <button
                  type="button"
                  onClick={handleSave}
                  style={{
                    padding: "10px",
                    backgroundColor: "green",
                    width: "100px",
                    color: "white",
                    border: "none",
                    marginRight: "10px",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  שמירה
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  style={{
                    padding: "10px",
                    backgroundColor: "red",
                    width: "100px",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  ביטול
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </>
  );
};

export default EditMeet;
