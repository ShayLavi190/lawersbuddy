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

  <main className="main-container" role="main" aria-label="רשימת תיקים לניהול">
    <div
      className="table-container"
      role="region"
      aria-labelledby="files-table-title"
      style={{ margin: "0", padding: "0", width: "100%", overflowX: "auto" }}
    >
      <h2 id="files-table-title" className="visually-hidden">טבלת תיקים עם אפשרויות עריכה, מחיקה והרחבה</h2>

      <table
        className="customers-table"
        role="table"
        aria-label="טבלת תיקים הכוללת מספר, נושא, תאריך פתיחה, סטאטוס, סוג, תובע, נתבע, בית משפט, שופטים וכפתורי פעולה"
        style={{
          width: isLargeText ? "200%" : "100%",
          tableLayout: "fixed",
          borderCollapse: "collapse",
        }}
      >
        <colgroup>
          <col style={{ width: "10%" }} />
          <col style={{ width: "10%" }} />
          <col style={{ width: "9%" }} />
          <col style={{ width: "6%" }} />
          <col style={{ width: "6%" }} />
          <col style={{ width: "6%" }} />
          <col style={{ width: "10%" }} />
          <col style={{ width: "10%" }} />
          <col style={{ width: "10%" }} />
          <col style={{ width: isLargeText ? "50%" : "18%" }} />
        </colgroup>

        <thead>
          <tr>
            <th scope="col" style={{ backgroundColor: '#323232', textAlign: 'center' }}>מספר</th>
            <th scope="col" style={{ backgroundColor: '#323232', textAlign: 'center' }}>נושא</th>
            <th scope="col" style={{ backgroundColor: '#323232', textAlign: 'center' }}>תאריך פתיחה</th>
            <th scope="col" style={{ backgroundColor: '#323232', textAlign: 'center' }}>סטאטוס</th>
            <th scope="col" style={{ backgroundColor: '#323232', textAlign: 'center' }}>סוג</th>
            <th scope="col" style={{ backgroundColor: '#323232', textAlign: 'center' }}>תובע</th>
            <th scope="col" style={{ backgroundColor: '#323232', textAlign: 'center' }}>נתבע</th>
            <th scope="col" style={{ backgroundColor: '#323232', textAlign: 'center' }}>בית משפט</th>
            <th scope="col" style={{ backgroundColor: '#323232', textAlign: 'center' }}>שופטים</th>
            <th scope="col" style={{ backgroundColor: '#323232', textAlign: 'center' }}></th>
          </tr>
        </thead>

        <tbody>
          {files.map((file) => (
            <tr
              key={file.caseId}
              tabIndex={0}
              aria-label={`תיק מספר ${file.caseId}, נושא: ${file.caseTitle}, סטאטוס: ${file.status}, סוג: ${file.caseType}, תובע: ${file.plaintiff}, נתבע: ${file.defendant}, בית משפט: ${file.courtName}, שופטים: ${file.judges.join(', ')}`}
              style={{ backgroundColor: 'whitesmoke', color: 'black' }}
            >
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
                  aria-label={`ערוך את התיק בנושא ${file.caseTitle}`}
                  onClick={() => handleEdit(file)}
                  className="edit-button"
                >
                  עריכה
                </button>
                <button
                  aria-label={`מחק את התיק בנושא ${file.caseTitle}`}
                  onClick={() => handleDelete(file.caseId)}
                  className="delete-button"
                >
                  מחיקה
                </button>
                <button
                  aria-label={`הרחב את פרטי התיק בנושא ${file.caseTitle}`}
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
        style={{ width: '600px', marginLeft: '370px', marginTop: '50px' }}
        onClick={addNewFile}
        aria-label="הוסף תיק חדש"
      >
        הוסף תיק חדש
      </Button>
    </div>
  </main>
</div>

  );
}

export default Files;
