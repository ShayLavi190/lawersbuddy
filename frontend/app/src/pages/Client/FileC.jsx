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
      <main className="main-container">
        <div
          className="table-container"
          style={{
            margin: "0",
            padding: "0",
            width: "100%",
            overflowX: "auto",
          }}
        >
          <table
            className="customers-table"
            style={{
              width: "100%",
              tableLayout: "fixed",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr>
                <th style={{ backgroundColor: "#323232", textAlign: "center" }}>מספר</th>
                <th style={{ backgroundColor: "#323232", textAlign: "center" }}>נושא</th>
                <th style={{ backgroundColor: "#323232", textAlign: "center" }}>תאריך פתיחה</th>
                <th style={{ backgroundColor: "#323232", textAlign: "center" }}>סטאטוס</th>
                <th style={{backgroundColor:'#323232',textAlign:'center'}}>בית משפט</th>
                <th style={{ backgroundColor: "#323232", textAlign: "center" }}>שופטים</th>
                <th style={{ backgroundColor: "#323232", textAlign: "center" }}>רחב</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => (
                <tr key={file.caseId} style={{ backgroundColor: "whitesmoke", color: "black" }}>
                  <td style={{ textAlign: "center" }}>{file.caseId}</td>
                  <td style={{ textAlign: "center" }}>{file.caseTitle}</td>
                  <td style={{ textAlign: "center" }}>
                    {new Date(file.openDate).toLocaleDateString()}
                  </td>
                  <td style={{ textAlign: "center" }}>{file.status}</td>
                  <td style={{ textAlign: "center" }}>{file.courtName}</td>
                  <td style={{ textAlign: "center" }}>{file.judges.join(", ")}</td>
                  <td style={{ textAlign: "center" }}>
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
        </div>
      </main>
    </div>
  );
}

export default FileC;
