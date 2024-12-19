import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import TalksList from "./component/TalksList";
import SpeechesOfInterest from "./component/SpeechesOfInterest";

function App() {
  return (
    <BrowserRouter>
      <div style={{ padding: "10px", display: "flex", gap: "15px", borderBottom: "1px solid #ccc" }}>
        {/* Navigation Links */}
        <Link to="/" style={{ textDecoration: "none", fontWeight: "bold" }}>
          Talks
        </Link>
        <Link to="/speeches-of-interest" style={{ textDecoration: "none", fontWeight: "bold" }}>
          Speeches of Interest
        </Link>
      </div>
      <Routes>
        <Route path="/" element={<TalksList />} />
        <Route path="/speeches-of-interest" element={<SpeechesOfInterest />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;