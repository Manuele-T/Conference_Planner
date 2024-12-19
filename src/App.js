import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TalksList from "./component/TalksList";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TalksList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
