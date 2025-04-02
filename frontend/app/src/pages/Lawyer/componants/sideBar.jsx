import React, { useEffect } from "react";
import {
  BsGrid1X2Fill,
  BsFillPlusCircleFill,
  BsXDiamondFill,
  BsGraphUp,
  BsPeopleFill,
  BsEnvelopeFill,
  BsBank,
} from "react-icons/bs";
import { FaIdCard } from "react-icons/fa6";
import logo from "../../Login/assets/logo.png";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import  "./sideBar.css";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation(); 


  useEffect(() => {
    const fetchPermission = async () => {
      try {
        const email = Cookies.get("email");
        const response = await axios.post(
          "http://localhost:6500/check-permission",
          { email }
        );
        const premission = response.data.data.premission;

        if (premission === "client") {
          setMenuItems([
            { path: "/homeClient", icon: BsGrid1X2Fill, label: "דף בית" },
            { path: "/meetingClient", icon: BsPeopleFill, label: "פגישות" },
            { path: "/filesClient", icon: BsBank, label: "תיקים" },
            { path: "/contactLawyer", icon: BsEnvelopeFill, label: "שליחת מיילים" },
          ]);
        } else {
          setMenuItems([
            { path: "/homeLawyer", icon: BsGrid1X2Fill, label: "דף בית" },
            { path: "/clientsLawyer", icon: FaIdCard, label: "לקוחות" },
            { path: "/meetings", icon: BsPeopleFill, label: " פגישות" },
            { path: "/filesLawyer", icon: BsBank, label: "תיקים" },
            { path: "/contactAdmin", icon: BsEnvelopeFill, label: "שליחת מיילים" },
          ]);
        }
      } catch (error) {
        console.error("Error fetching permission:", error);
      }
    };

    fetchPermission();
  }, []);

  const iconColors = {
    "/homeLawyer": "#007bff",
    "/clientsLawyer": "#D4AF37",
    "/meetingLawyer": "#dc3545",
    "/filesLawyer": "#4CAF50",
    "/Clients": "#D4AF37",
    "/contactAdmin": "#17a2b8",
    "/homeClient": "#007bff",
    "/meetings": "#D4AF37",
    "/filesClient": "#dc3545",
    "/contactLawyer": "#4CAF50",
    "/meetingClient":"#D4AF37"
  };

  const [menuItems, setMenuItems] = React.useState([]);

  return (
    <aside
      id="sidebar"
      style={{backgroundColor:'#323232'}}
    >
      <div className="sidebar-title" >
        <div className="sidebar-brand" style={{marginLeft:'2.2rem'}}>
          <div>
            <img
              src={logo}
              style={{
                width: "6rem",
                marginLeft: "1rem",
                marginBottom: "1rem",
              }}
              alt="Example"
            />
          </div>
          <div style = {{fontSize: '30px', marginRight:'1rem'}}>
            משפט חכם
          </div>
        </div>
        <span
          className="icon close_icon"
          data-testid="close-icon"
        >
          X
        </span>
      </div>
      <ul className="sidebar-list">
      {menuItems.map((item, index) => {
        const isActive = location.pathname === item.path;
        const iconColor = iconColors[item.path] || "#white";

        return (
          <li
            className="sidebar-list-item"
            key={index}
            role="link"
            aria-label={`נווט אל ${item.label}`}
            tabIndex={0}
            data-testid={`link-${item.label.toLowerCase()}`}
            onClick={() => navigate(item.path, { replace: true })}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                navigate(item.path, { replace: true });
              }
            }}
            style={{ cursor: "pointer", marginLeft: "5px" }}
          >
            <item.icon
              className="icon"
              style={{ color: isActive ? iconColor : "#ffffff", marginRight: "12px" }}
              aria-hidden="true"
            />
            {item.label}
          </li>
        );
      })}
    </ul>

    </aside>
  );
}

export default Sidebar;
