import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import Cookies from "js-cookie";
import {
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./componants/Header";
import Sidebar from "./componants/sideBar";
import "./editFile.css";
import { AccessibilityContext } from "../Components/AccessibilityContext";

function AddFile() {
  const navigate = useNavigate();
  const [caseId, setCaseId] = useState("");
  const [caseTitle, setCaseTitle] = useState("");
  const [openDate, setOpenDate] = useState("");
  const [status, setStatus] = useState("");
  const [caseType, setCaseType] = useState("");
  const [plaintiff, setPlaintiff] = useState("");
  const [defendant, setDefendant] = useState("");
  const [courtName, setCourtName] = useState("");
  const [judges, setJudges] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");
  const { isHighContrast } = useContext(AccessibilityContext);

  const clearForm = () => {
    setCaseId("");
    setCaseTitle("");
    setOpenDate("");
    setStatus("");
    setCaseType("");
    setPlaintiff("");
    setDefendant("");
    setCourtName("");
    setJudges("");
    setSelectedFiles([]);
    setSelectedClient("");
  };

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setSelectedFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: true, 
  });

  const validateFields = () => {
    if (
      !caseId ||
      !caseTitle ||
      !openDate ||
      !status ||
      !caseType ||
      !plaintiff ||
      !defendant ||
      !courtName ||
      !judges ||
      !selectedClient
    ) {
      toast.error("יש למלא את כל השדות", {
        position: "top-right",
        autoClose: 2000,
        theme: "colored",
      });
      return false;
    }

    if (selectedFiles.length === 0) {
      toast.error("יש לבחור מסמכים להעלאה", {
        position: "top-right",
        autoClose: 2000,
        theme: "colored",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFields()) {
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });

    formData.append("caseId", caseId);
    formData.append("caseTitle", caseTitle);
    formData.append("openDate", openDate);
    formData.append("status", status);
    formData.append("caseType", caseType);
    formData.append("plaintiff", plaintiff);
    formData.append("defendant", defendant);
    formData.append("courtName", courtName);
    formData.append("judges", judges.split(",").map((judge) => judge.trim()));
    formData.append("clientId", selectedClient);
    formData.append("lawyer", Cookies.get("id"));


    try {
      const response = await axios.post("http://localhost:6500/files", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        toast.success("התיק נוסף בהצלחה!", {
          position: "top-right",
          autoClose: 1500,
          theme: "colored",
        });
        setTimeout(() => {
          clearForm();
        }
        , 4000);
      }
    } catch (error) {
      console.error("Error while saving file:", error);
      toast.error("שגיאה בשמירת התיק. נסה שוב.", {
        position: "top-right",
        autoClose: 2000,
        theme: "colored",
      });
    }
  };

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const email = Cookies.get("email");
        const response = await axios.get(`http://localhost:6500/clients/${email}`);
        if (response.data.success) {
          setClients(response.data.clients);
        }
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };
    fetchClients();
  }, []);

  return (
    <>
      <ToastContainer />
      <div className="grid-container" style={{ backgroundColor: "#DDD0C8" }}>
        <Header />
        <Sidebar />
        <main
          className="main-container"
          style={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
          <form
            onSubmit={handleSubmit}
            style={{
              background: "#263043",
              borderRadius: "0.5%",
              maxWidth: "100%",
              width: "80%",
              backgroundColor: "#323232",
              textAlign: "center",
              gap: "13px",
              height: "100vh",
            }}
          >
            <div className="form-group" style={{ width: "600px" }}>
              <FormControl fullWidth required>
                <InputLabel id="client-select-label">בחר לקוח</InputLabel>
                <Select
                  labelId="client-select-label"
                  value={selectedClient}
                  onChange={(e) => setSelectedClient(e.target.value)}
                  style={{ backgroundColor: "whitesmoke", borderRadius: "5px" }}
                >
                  {clients.map((client) => (
                    <MenuItem key={client.id} value={client.id}>
                      {client.full_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className="form-group" style={{ width: "600px" }}>
              <TextField
                label="מספר תיק"
                fullWidth
                value={caseId}
                onChange={(e) => setCaseId(e.target.value)}
                required
                InputProps={{
                  style: { textAlign: "center", backgroundColor: "whitesmoke", borderRadius: "5px" },
                }}
              />
            </div>

            <div className="form-group" style={{ width: "600px" }}>
              <TextField
                label="כותרת תיק"
                fullWidth
                value={caseTitle}
                onChange={(e) => setCaseTitle(e.target.value)}
                required
                style={{ backgroundColor: "whitesmoke", borderRadius: "5px" }}
              />
            </div>

            <div className="form-group" style={{ width: "600px" }}>
              <TextField
                label="תאריך פתיחה"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={openDate}
                onChange={(e) => setOpenDate(e.target.value)}
                required
                style={{ backgroundColor: "whitesmoke", borderRadius: "5px" }}
              />
            </div>

            <div className="form-group" style={{ width: "600px" }}>
              <FormControl fullWidth required>
                <InputLabel id="status-label">סטטוס תיק</InputLabel>
                <Select
                  labelId="status-label"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  style={{ backgroundColor: "whitesmoke", borderRadius: "5px" }}
                >
                  <MenuItem value="פתוח">פתוח</MenuItem>
                  <MenuItem value="סגור">סגור</MenuItem>
                  <MenuItem value="בערעור">בערעור</MenuItem>
                </Select>
              </FormControl>
            </div>

            <div className="form-group" style={{ width: "600px" }}>
              <TextField
                label="סוג תיק"
                fullWidth
                value={caseType}
                onChange={(e) => setCaseType(e.target.value)}
                required
                style={{ backgroundColor: "whitesmoke", borderRadius: "5px" }}
              />
            </div>

            <div className="form-group" style={{ width: "600px" }}>
              <TextField
                label="תובע"
                fullWidth
                value={plaintiff}
                onChange={(e) => setPlaintiff(e.target.value)}
                required
                style={{ backgroundColor: "whitesmoke", borderRadius: "5px" }}
              />
            </div>

            <div className="form-group" style={{ width: "600px" }}>
              <TextField
                label="נתבע"
                fullWidth
                value={defendant}
                onChange={(e) => setDefendant(e.target.value)}
                required
                style={{ backgroundColor: "whitesmoke", borderRadius: "5px" }}
              />
            </div>

            <div className="form-group" style={{ width: "600px" }}>
              <TextField
                label="שם בית משפט"
                fullWidth
                value={courtName}
                onChange={(e) => setCourtName(e.target.value)}
                required
                style={{ backgroundColor: "whitesmoke", borderRadius: "5px" }}
              />
            </div>

            <div className="form-group" style={{ width: "600px" }}>
              <TextField
                label="שופטים (מופרדים בפסיקים)"
                fullWidth
                value={judges}
                onChange={(e) => setJudges(e.target.value)}
                required
                style={{ backgroundColor: "whitesmoke", borderRadius: "5px" }}
              />
            </div>
            <div className="form-group" style={{ width: "600px" }}>
            <div
              {...getRootProps()}
              style={{
                border: "2px dashed #ccc",
                padding: "20px",
                textAlign: "center",
                cursor: "pointer",
                backgroundColor: isHighContrast ? "black" : "whitesmoke",
                color: "black",
              }}
            >
              <input {...getInputProps()} />
              <p>הוסף מסמכים נלווים</p>
            </div>
            {selectedFiles.length > 0 && (
              <p style={{ color: "green" }}>
                {selectedFiles.map(
                  (file, index) => `${file.name} (${(file.size / 1024).toFixed(2)} KB)`
                ).join(" | ")}
              </p>
            )}
          </div>
            <Button type="submit" variant="contained" color="primary" style={{ width: "600px" }}>
              הוסף תיק
            </Button>
          </form>
        </main>
      </div>
    </>
  );
}

export default AddFile;
