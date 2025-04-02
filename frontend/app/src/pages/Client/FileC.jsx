import React, { useEffect, useState } from "react";
import Header from "../Lawyer/componants/Header";
import "../Lawyer/stylesAdmin.css";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Lawyer/componants/sideBar";

function FileC() {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
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
      try {
        const response = await axios.get(
          `http://localhost:6500/filesClient/${Cookies.get("email")}`
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

  const handleExpand = (file) => {
    navigate(`/expandFileC/${file.caseId}`);
  };

  return (
<div className="grid-container" style={{ backgroundColor: "#DDD0C8" }}>
  <Header OpenSidebar={OpenSidebar} />
  <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
  <main className="main-container" role="main" aria-label="ניהול תיקים">
    <div
      className="table-container"
      role="region"
      aria-labelledby="files-table-title"
      style={{
        margin: "0",
        padding: "0",
        width: "100%",
        overflowX: "auto",
      }}
    >
      <h2 id="files-table-title" className="visually-hidden">טבלת תיקים</h2>

      <table
        className="customers-table"
        role="table"
        aria-label="טבלת תיקים עם מידע על מספר, נושא, תאריך פתיחה, סטאטוס ובית משפט"
        style={{
          width: "100%",
          tableLayout: "fixed",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr role="row">
            <th role="columnheader" scope="col" style={{ backgroundColor: "#323232", textAlign: "center" }}>
              מספר
            </th>
            <th role="columnheader" scope="col" style={{ backgroundColor: "#323232", textAlign: "center" }}>
              נושא
            </th>
            <th role="columnheader" scope="col" style={{ backgroundColor: "#323232", textAlign: "center" }}>
              תאריך פתיחה
            </th>
            <th role="columnheader" scope="col" style={{ backgroundColor: "#323232", textAlign: "center" }}>
              סטאטוס
            </th>
            <th role="columnheader" scope="col" style={{ backgroundColor: "#323232", textAlign: "center" }}>
              בית משפט
            </th>
            <th role="columnheader" scope="col" style={{ backgroundColor: "#323232", textAlign: "center" }}>
              שופטים
            </th>
            <th role="columnheader" scope="col" style={{ backgroundColor: "#323232", textAlign: "center" }}>
              רחב
            </th>
          </tr>
        </thead>

        <tbody>
          {files.map((file) => (
            <tr key={file.caseId} role="row" style={{ backgroundColor: "whitesmoke", color: "black" }}>
              <td role="cell" style={{ textAlign: "center" }}>{file.caseId}</td>
              <td role="cell" style={{ textAlign: "center" }}>{file.caseTitle}</td>
              <td role="cell" style={{ textAlign: "center" }}>
                {new Date(file.openDate).toLocaleDateString()}
              </td>
              <td role="cell" style={{ textAlign: "center" }}>{file.status}</td>
              <td role="cell" style={{ textAlign: "center" }}>{file.courtName}</td>
              <td role="cell" style={{ textAlign: "center" }}>{file.judges.join(", ")}</td>
              <td role="cell" style={{ textAlign: "center" }}>
                <button
                  aria-label={`הרחבת פרטי התיק ${file.caseTitle}`}
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
    </div>
  </main>
</div>

  );
}

export default FileC;
