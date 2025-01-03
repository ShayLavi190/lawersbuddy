import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import ForgotPassword from "./pages/Login/forgotpassword";
import FirstPage from "./pages/Login/FirstPage";
import Home from "./pages/Lawyer/Home";
import Clients from "./pages/Lawyer/Clients";
import Contact from "./pages/Lawyer/Contact";
import Files from "./pages/Lawyer/Files";
import EditFile from "./pages/Lawyer/EditFile";
import AddFile from "./pages/Lawyer/AddnewFile";
import Meeting from "./pages/Lawyer/Meeting";
import ExpandFile from "./pages/Lawyer/ExpandFile";
import HomeC from "./pages/Client/HomeC";
import FileC from "./pages/Client/FileC";
import ExpandFileC from "./pages/Client/ExpandFileC";
import MeetingsC from "./pages/Client/MeetingC";
import ContactLawyer from "./pages/Client/ContactLawyer";
import Meetings from "./pages/Lawyer/Meetings";
import EditMeet from "./pages/Lawyer/EditMeeting";

function App() {
  useEffect(() => {
    const viewportMeta = document.createElement("meta");
    viewportMeta.name = "viewport";
    viewportMeta.content = "width=device-width, initial-scale=1.0";

    document.head.appendChild(viewportMeta);

    return () => {
      document.head.removeChild(viewportMeta);
    };
  }, []);
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<FirstPage />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/homeLawyer" element={<Home />} />
          <Route path="/homeClient" element={<HomeC />} />
          <Route path="/clientsLawyer" element={<Clients />} />
          <Route path="/contactAdmin" element={<Contact />} />
          <Route path="/filesLawyer" element={<Files />} />
          <Route path="/AddFile" element={<AddFile />} />
          <Route path="/EditFile" element={<EditFile />} />
          <Route path="/EditMeeting" element={<EditMeet />} />
          <Route path="/meetingLawyer" element={<Meeting />} />
          <Route path="/meetings" element={<Meetings />} />
          <Route path="/expandFile/:caseId" element={<ExpandFile />} />
          <Route path="/filesClient" element={<FileC/>} />
          <Route path="/expandFileC/:caseId" element={<ExpandFileC />} />
          <Route path="/meetingClient" element={<MeetingsC/>} />
          <Route path="/contactLawyer" element={<ContactLawyer/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
