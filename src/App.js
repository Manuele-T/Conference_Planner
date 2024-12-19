import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import TalksList from "./component/TalksList";
import SpeechesOfInterest from "./component/SpeechesOfInterest";
import SpeechesToAttend from "./component/SpeechesToAttend";

function App() {
  return (
    <BrowserRouter>
      <div style={{ padding: "10px", display: "flex", gap: "15px", borderBottom: "1px solid #ccc" }}>
        <Link to="/" style={{ textDecoration: "none", fontWeight: "bold" }}>Talks</Link>
        <Link to="/speeches-of-interest" style={{ textDecoration: "none", fontWeight: "bold" }}>Speeches of Interest</Link>
        <Link to="/speeches-to-attend" style={{ textDecoration: "none", fontWeight: "bold" }}>Your Schedule</Link>
      </div>
      <Routes>
        <Route path="/" element={<TalksList />} />
        <Route path="/speeches-of-interest" element={<SpeechesOfInterest />} />
        <Route path="/speeches-to-attend" element={<SpeechesToAttend />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
