import React, { useEffect, useState,useContext } from "react";
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
import { AccessibilityContext } from "../Components/AccessibilityContext";

function Files() {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const {isLargeText } = useContext(AccessibilityContext);
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
      try {
        const response = await axios.get(
          `http://localhost:6500/files/${Cookies.get("email")}`
        );
        setFiles(response.data.files || []);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };
    fetchFiles();
  }, []);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  const handleDelete = async (caseId) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div style={{ textAlign: "center", padding: "20px", background: "#222831", borderRadius: "8px", color: "#fff" }}>
            <h1 style={{ marginBottom: "20px" }}>אזהרה</h1>
            <p style={{ marginBottom: "20px" }}>אתה בטוח שברצונך למחוק את תיק זה ?</p>
            <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
              <button
                onClick={async () => {
                  try {
                    const response = await axios.delete(
                      `http://localhost:6500/file/${encodeURIComponent(caseId)}`
                    );
                    if (response.status === 200) {
                      setFiles(files.filter((file) => file.caseId !== caseId));
                      toast.success("מחיקה הקובץ בוצעה בהצלחה", {
                        position: "top-right",
                        autoClose: 2500,
                        theme: "colored",
                        transition: Slide,
                      });
                    } else {
                      toast.error(`שגיאה במחיקת התיק ${response.data.message}`, {
                        position: "top-right",
                        autoClose: 2500,
                        theme: "colored",
                        transition: Slide,
                      });
                    }
                  } catch (error) {
                    console.error("Error deleting file:", error);
                    toast.error("שגיאה במחיקת התיק", {
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
    navigate("/AddFile");
  };
  const handleEdit = (file) => {
    navigate("/EditFile", { state: { file } });
  };
const handleExpand = (file) => {
  navigate(`/expandFile/${file.caseId}`);
};

  return (
    <div className="grid-container" style={{ backgroundColor: "#DDD0C8" }}>
      <Header OpenSidebar={OpenSidebar} />
      <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
      <main className="main-container">
        <div className="table-container"            
            style={{
              margin: "0", 
              padding: "0",
              width: "100%",
              overflowX: "auto",
            }}>
          <table className="customers-table" 
              style={{
                width: isLargeText ? "200%": "100%", 
                tableLayout: "fixed", 
                borderCollapse: "collapse",
              }}>
              <colgroup>
                <col style={{ width: "10%"}} /> 
                <col style={{ width: "10%" }} /> 
                <col style={{ width: "9%" }} /> 
                <col style={{ width: "6%" }} /> 
                <col style={{ width: "6%" }} /> 
                <col style={{ width: "6%" }} /> 
                <col style={{ width: "10%" }} /> 
                <col style={{ width: "10%" }} />
                <col style={{ width: "10%" }} />
                <col style={{ width: isLargeText ? "50%":"18%" }} /> 
              </colgroup>
            <thead>
              <tr>
                <th style={{backgroundColor:'#323232',textAlign:'center'}}>מספר</th>
                <th style={{backgroundColor:'#323232',textAlign:'center'}}>נושא</th>
                <th style={{backgroundColor:'#323232',textAlign:'center'}}>תאריך פתיחה</th>
                <th style={{backgroundColor:'#323232',textAlign:'center'}}>סטאטוס</th>
                <th style={{backgroundColor:'#323232',textAlign:'center'}}>סוג</th>
                <th style={{backgroundColor:'#323232',textAlign:'center'}}>תובע</th>
                <th style={{backgroundColor:'#323232',textAlign:'center'}}>נתבע</th>
                <th style={{backgroundColor:'#323232',textAlign:'center'}}>בית משפט</th>
                <th style={{backgroundColor:'#323232',textAlign:'center'}}>שופטים</th>
                <th style={{backgroundColor:'#323232',textAlign:'center'}}></th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => (
                <tr key={file.caseId} style={{backgroundColor:'whitesmoke', color:'black'}}>
                  <td>{file.caseId}</td>
                  <td>{file.caseTitle}</td>
                  <td>{new Date(file.openDate).toLocaleDateString()}</td>
                  <td>{file.status}</td>
                  <td>{file.caseType}</td>
                  <td>{file.plaintiff}</td>
                  <td>{file.defendant}</td>
                  <td>{file.courtName}</td>
                  <td>{file.judges.join(", ")}</td>
                  <td>
                    <button
                      aria-label={`Edit ${file.caseTitle}`}
                      onClick={() => handleEdit(file)}
                      className="edit-button"
                    >
                      עריכה
                    </button>
                    <button
                      aria-label={`Delete ${file.caseTitle}`}
                      onClick={() => handleDelete(file.caseId)}
                      className="delete-button"
                    >
                      מחיקה
                    </button>
                    <button
                      aria-label={`Expand ${file.caseTitle}`}
                      onClick={() => handleExpand(file)}
                      className="delete-button"
                    >
                      הרחב
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Button
          type="submit"
          variant="contained"
          color="primary"
          style={{ width: '600px', marginLeft:'370px',marginTop:'50px' }}
          onClick={addNewFile}
        >
          הוסף תיק חדש
        </Button>        
        </div>
      </main>
    </div>
  );
}

export default Files;
