/** @format */

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LineupGenerator from "./components/LineupGenerator";
import RotationLog from "./components/RotationLog";
import "./App.css";

function App() {
  return (
    <Router>
      <div className='App'>
        <Routes>
          <Route path='/' element={<LineupGenerator />} />
          <Route path='/rotation-log' element={<RotationLog />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
