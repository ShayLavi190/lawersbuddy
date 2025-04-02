import React, { useEffect, useState } from "react";
import Header from './componants/Header';
import Sidebar from './componants/sideBar';
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import "./stylesAdmin.css";
import "./Customers_table.css";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { toast, Slide } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Clients = () => {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [people, setPeople] = useState([]);
  const [nameQuery, setNameQuery] = useState("");
  const [idQuery, setidQuery] = useState(""); 
  const navigate = useNavigate();

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
        console.error("Error checking company permission:", error);
        navigate("/", { replace: true });
      }
    };
    checkAdminPermission();
  }, [navigate]);

  useEffect(() => {
    const fetchPeople = async () => {
      try {
        const response = await axios.get(
          `http://localhost:6500/clients/${Cookies.get("email")}`
        );
        setPeople(response.data.clients);
      } catch (error) {
        console.error("Error fetching people:", error);
      }
    };
    fetchPeople();
    console.log(people);
  }, []);

  const handleDelete = async (person) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div style={{ textAlign: 'center', padding: '20px', background: '#222831', borderRadius: '8px', color: '#fff' }}>
            <h1 style={{ marginBottom: '20px' }}>אזהרה</h1>
            <p style={{ marginBottom: '20px' }}>אתה בטוח שברצונך למחוק את לקוח זה ?</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <button
                onClick={async () => {
                  try {
                    const response = await axios.delete(`http://localhost:6500/person/${person._id}`);
                    if (response.status === 200) {
                      setPeople((people) => people.filter((p) => p._id !== person._id));
                      setTimeout(() => {
                        toast.success('לקוח נמחק בהצלחה', {
                          position: "top-right",
                          autoClose: 2500,
                          hideProgressBar: false,
                          closeOnClick: true,
                          pauseOnHover: true,
                          draggable: true,
                          progress: undefined,
                          theme: "colored",
                          transition: Slide,
                        });
                      }, 0);
                    } else {
                      toast.error(`שגיאת במחיקת לקוח: ${response.data.message}`, {
                        position: "top-right",
                        autoClose: 2500,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                        transition: Slide,
                      });
                    }
                  } catch (error) {
                    console.error("Error deleting person: ", error);
                    toast.error("שגיאה במחיקת לקוח", {
                      position: "top-right",
                      autoClose: 2500,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                      theme: "colored",
                      transition: Slide,
                    });
                  } finally {
                    onClose();
                  }
                }}
                style={{
                  backgroundColor: '#059212',
                  color: 'white',
                  padding: '10px 20px',
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: '5px',
                }}
              >
               מחק
              </button>
              <button
                onClick={() => {
                  toast.info('מחיקה הלקוח בוטלה', {
                    position: "top-right",
                    autoClose: 2500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    transition: Slide,
                  });
                  onClose();
                }}
                style={{
                  backgroundColor: '#C40C0C',
                  color: 'white',
                  padding: '10px 20px',
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: '5px',
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
  const handeleMeet = async (person) => {
    navigate("/meetingLawyer", { state: { person } });
  };

  const handleNameSearch = (event) => {
    setNameQuery(event.target.value);
  };

  const handleidSearch = (event) => {
    setidQuery(event.target.value);
  };

  const filteredPeople = people.filter((person) => {
    const matchesName =
      person.full_name && person.full_name.toLowerCase().includes(nameQuery.toLowerCase());
    const matchesId = person.id && person.id.includes(idQuery);
    return matchesName && matchesId;
  });
  const displayedPeople =
  nameQuery.trim() !== "" || idQuery.trim() !== ""
    ? filteredPeople
    : people;
  return (
<div className="grid-container" style={{ backgroundColor: "#DDD0C8" }}>
  <Header OpenSidebar={OpenSidebar} />
  <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />

  <main className="main-container" role="main" aria-label="רשימת לקוחות">
    <div className="search-bars" style={{ width: '95%', marginLeft: '15px', marginBottom: '15px' }}>
      <input
        type="text"
        placeholder="Search by name"
        value={nameQuery}
        onChange={handleNameSearch}
        aria-label="חיפוש לפי שם"
      />
      <input
        type="text"
        placeholder="Search by ID"
        value={idQuery}
        onChange={handleidSearch}
        aria-label="חיפוש לפי תעודת זהות"
      />
    </div>

    <div
      className="table-container"
      role="region"
      aria-labelledby="clients-table-title"
      style={{ margin: "0", padding: "0", width: "100%", overflowX: "auto" }}
    >
      <h2 id="clients-table-title" className="visually-hidden">טבלת לקוחות</h2>

      <table
        className="customers-table"
        role="table"
        aria-label="טבלת לקוחות עם שם, מייל, תעודת זהות, ארץ ואפשרויות פעולה"
        style={{ width: "100%", tableLayout: "fixed", borderCollapse: "collapse" }}
      >
        <thead>
          <tr>
            <th scope="col" style={{ backgroundColor: "#323232", color: "white", textAlign: 'center' }}>שם מלא</th>
            <th scope="col" style={{ backgroundColor: "#323232", color: "white", textAlign: 'center' }}>מייל</th>
            <th scope="col" style={{ backgroundColor: "#323232", color: "white", textAlign: 'center' }}>תעודת זהות</th>
            <th scope="col" style={{ backgroundColor: "#323232", color: "white", textAlign: 'center' }}>ארץ</th>
            <th scope="col" style={{ backgroundColor: "#323232", color: "white", textAlign: 'center' }}>קביעת פגישה</th>
            <th scope="col" style={{ backgroundColor: "#323232", color: "white", textAlign: 'center' }}>מחיקה</th>
          </tr>
        </thead>
        <tbody>
          {displayedPeople.length > 0 ? (
            displayedPeople.map((person) => (
              <tr
                key={person._id}
                tabIndex={0}
                role="row"
                aria-label={`שם: ${person.full_name}, מייל: ${person.email}, תעודת זהות: ${person.id}, ארץ: ${person.country}`}
                style={{
                  backgroundColor: "whitesmoke",
                  color: "black",
                  textAlign: "center",
                }}
              >
                <td role="cell">{person.full_name}</td>
                <td role="cell">{person.email}</td>
                <td role="cell">{person.id}</td>
                <td role="cell">{person.country}</td>
                <td role="cell">
                  <button
                    onClick={() => handeleMeet(person)}
                    aria-label={`קבע פגישה עם ${person.full_name}`}
                    style={{
                      backgroundColor: "#4CAF50",
                      color: "white",
                      border: "none",
                      padding: "5px 10px",
                      cursor: "pointer",
                    }}
                  >
                    קביעת פגישה
                  </button>
                </td>
                <td role="cell">
                  <button
                    className="delete"
                    onClick={() => handleDelete(person)}
                    aria-label={`מחק את ${person.full_name}`}
                    style={{
                      backgroundColor: "#C40C0C",
                      color: "white",
                      border: "none",
                      padding: "5px 10px",
                      cursor: "pointer",
                    }}
                  >
                    מחיקה
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center", padding: "10px" }}>
                No clients found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </main>
</div>

  );
};

export default Clients;
