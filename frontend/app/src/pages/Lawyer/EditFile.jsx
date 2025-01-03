import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "./componants/Header";
import Sidebar from "./componants/sideBar";
import { useDropzone } from "react-dropzone";
import "./stylesAdmin.css";
import Cookies from "js-cookie";
import { Select, MenuItem, FormControl, InputLabel, Button } from "@mui/material";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditFile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { file } = location.state;
  const [editedFile, setEditedFile] = useState({ ...file });
  const [newDocuments, setNewDocuments] = useState([]);
  const [documentsToDelete, setDocumentsToDelete] = useState([]);
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
    setEditedFile({ ...file });
  }, [file]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      setNewDocuments((prev) => [...prev, ...acceptedFiles]);
    },
  });

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedFile({ ...editedFile, [name]: value });
  };

  const handleImportantDateChange = (index, field, value) => {
    const updatedDates = [...editedFile.importantDates];
    updatedDates[index][field] = value;
    setEditedFile({ ...editedFile, importantDates: updatedDates });
  };

  const addImportantDate = () => {
    const updatedDates = [...editedFile.importantDates, { event: "", date: "" }];
    setEditedFile({ ...editedFile, importantDates: updatedDates });
  };

  const removeImportantDate = (index) => {
    const updatedDates = editedFile.importantDates.filter(
      (_, i) => i !== index
    );
    setEditedFile({ ...editedFile, importantDates: updatedDates });
  };

  const handleDeleteDocument = (document) => {
    setDocumentsToDelete((prev) => [...prev, document]);
    setEditedFile((prev) => ({
      ...prev,
      files: prev.files.filter((doc) => doc._id !== document._id),
    }));
  };

  const handleSave = async () => {
    const { _id, ...updatedFile } = editedFile;
    const hasEmptyImportantDates = updatedFile.importantDates.some(
      (date) => !date.event || !date.date
    );

    if (hasEmptyImportantDates) {
      toast.error("יש למלא את כל השדות של התאריכים החשובים", {
        position: "top-right",
        autoClose: 2500,
        theme: "colored",
        transition: Slide,
      });
      return;
    }

    try {
      for (const doc of documentsToDelete) {
        await axios.post(`http://localhost:6500/files/delete-document`, {
          dropboxPath: doc.dropboxPath,
          caseId: updatedFile.caseId,
        });
      }
      if (newDocuments.length > 0) {
        const formData = new FormData();
        newDocuments.forEach((doc) => formData.append("files", doc));
        formData.append("caseId", updatedFile.caseId);

        const uploadResponse = await axios.post(
          `http://localhost:6500/files/upload-documents`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        updatedFile.files = [...updatedFile.files, ...uploadResponse.data.files];
      }
      const response = await axios.put(
        `http://localhost:6500/files/${updatedFile.caseId}`,
        updatedFile
      );

      if (response.status === 200) {
        toast.success("התיק עודכן בהצלחה", {
          position: "top-right",
          autoClose: 2500,
          theme: "colored",
          transition: Slide,
        });
        setTimeout(() => navigate("/filesLawyer"), 1500);
      }
    } catch (error) {
      console.error("Error updating file:", error);
      toast.error("שגיאה בשמירת התיק", {
        position: "top-right",
        autoClose: 2500,
        theme: "colored",
      });
    }
  };

  const handleCancel = () => {
    navigate("/filesLawyer");
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
            <form style={{ display: "flex", flexDirection: "column", gap: "20px", backgroundColor: "#323232" }}>
              <label style={{ marginTop: "20px" }}>מספר תיק</label>
              <input
                type="text"
                name="caseId"
                style={{ textAlign: "center" }}
                value={editedFile.caseId}
                disabled
              />

              <label>נושא התיק</label>
              <input
                type="text"
                name="caseTitle"
                style={{ textAlign: "center" }}
                value={editedFile.caseTitle}
                onChange={handleChange}
              />

              <label>שם עורך דין</label>
              <input
                type="text"
                name="lawyer"
                style={{ textAlign: "center" }}
                value={editedFile.lawyer}
                onChange={handleChange}
              />

              <label>תאריך פתיחה</label>
              <input
                type="date"
                name="openDate"
                value={editedFile.openDate?.split("T")[0]}
                onChange={handleChange}
                style={{ textAlign: "center" }}
              />

              <label>סטאטוס</label>
              <FormControl fullWidth>
                <InputLabel id="status-label">סטאטוס</InputLabel>
                <Select
                  labelId="status-label"
                  name="status"
                  value={editedFile.status}
                  onChange={handleChange}
                  style={{ backgroundColor: "white", height: "42px", width: "100%", textAlign: "center" }}
                >
                  <MenuItem value="פתוח">פתוח</MenuItem>
                  <MenuItem value="סגור">סגור</MenuItem>
                  <MenuItem value="בערעור">בערעור</MenuItem>
                </Select>
              </FormControl>

              <label>סוג התיק</label>
              <input
                type="text"
                name="caseType"
                style={{ textAlign: "center" }}
                value={editedFile.caseType}
                onChange={handleChange}
              />

              <label>תובע</label>
              <input
                type="text"
                name="plaintiff"
                style={{ textAlign: "center" }}
                value={editedFile.plaintiff}
                onChange={handleChange}
              />

              <label>נתבע</label>
              <input
                type="text"
                name="defendant"
                style={{ textAlign: "center" }}
                value={editedFile.defendant}
                onChange={handleChange}
              />

              <label>בית משפט</label>
              <input
                type="text"
                name="courtName"
                style={{ textAlign: "center" }}
                value={editedFile.courtName}
                onChange={handleChange}
              />

              <label>שופטים</label>
              <input
                type="text"
                name="judges"
                value={editedFile.judges.join(", ")}
                onChange={(e) =>
                  setEditedFile({
                    ...editedFile,
                    judges: e.target.value.split(",").map((j) => j.trim()),
                  })
                }
                style={{ textAlign: "center" }}
              />

              <label>מסמכים קיימים</label>
              {editedFile.files.map((doc) => (
                <div key={doc._id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span>{doc.fileName}</span>
                  <button
                    type="button"
                    onClick={() => handleDeleteDocument(doc)}
                    style={{
                      padding: "5px 10px",
                      backgroundColor: "red",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    מחק
                  </button>
                </div>
              ))}

              <label>העלה מסמכים חדשים</label>
              <div
                {...getRootProps()}
                style={{
                  border: "2px dashed #ccc",
                  padding: "20px",
                  textAlign: "center",
                  cursor: "pointer",
                  backgroundColor: "whitesmoke",
                }}
              >
                <input {...getInputProps()} />
                <p style={{color:'black'}}>גרור ושחרר מסמכים כאן</p>
              </div>
              {newDocuments.map((doc, index) => (
                <p key={index} style={{ color: "green" }}>
                  {doc.name} ({(doc.size / 1024).toFixed(2)} KB)
                </p>
              ))}

              <h3 style={{ textAlign: "center" }}>תאריכים חשובים</h3>
              {editedFile.importantDates.map((date, index) => (
                <div
                  key={index}
                  style={{
                    marginBottom: "20px",
                    textAlign: "center",
                  }}
                >
                  <div style={{ marginBottom: "10px" }}>
                    <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                      אירוע
                    </label>
                    <input
                      type="text"
                      value={date.event}
                      onChange={(e) =>
                        handleImportantDateChange(index, "event", e.target.value)
                      }
                      style={{
                        textAlign: "center",
                        display: "block",
                        margin: "0 auto",
                        width: "600px",
                        backgroundColor: "#FFFFFF",
                        fontSize: "16px",
                        padding: "8px",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: "10px" }}>
                    <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                      תאריך
                    </label>
                    <input
                      type="date"
                      value={date.date?.split("T")[0]}
                      onChange={(e) =>
                        handleImportantDateChange(index, "date", e.target.value)
                      }
                      style={{
                        textAlign: "center",
                        display: "block",
                        margin: "0 auto",
                        width: "600px",
                        backgroundColor: "#FFFFFF",
                        fontSize: "16px",
                        padding: "8px",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                      }}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => removeImportantDate(index)}
                    style={{
                      padding: "10px",
                      backgroundColor: "red",
                      width: "600px",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                      display: "block",
                      margin: "10px auto",
                      fontSize: "16px",
                    }}
                  >
                    הסר
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addImportantDate}
                style={{
                  padding: "10px",
                  backgroundColor: "green",
                  width: "600px",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  display: "block",
                  margin: "20px auto",
                  fontSize: "16px",
                }}
              >
                הוסף תאריך
              </button>

              <label>החלטה סופית</label>
              <input
                type="text"
                name="finalDecision"
                style={{ textAlign: "center" }}
                value={editedFile.finalDecision || ""}
                onChange={handleChange}
              />

              <label>עלות</label>
              <input
                type="number"
                name="costs"
                style={{ textAlign: "center" }}
                value={editedFile.costs || ""}
                onChange={handleChange}
              />

              <label>שולם</label>
              <input
                type="number"
                name="payed"
                style={{ textAlign: "center" }}
                value={editedFile.payed || ""}
                onChange={handleChange}
              />

              <div style={{ marginBottom: "20px" }}>
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

export default EditFile;
