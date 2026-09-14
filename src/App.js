/** @format */

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import OfflineIndicator from "./components/OfflineIndicator";
import LineupGenerator from "./components/LineupGenerator";
import BattingOrder from "./components/BattingOrder";
import RotationLog from "./components/RotationLog";
import "./App.css";

const APP_VERSION = "2.1-softball";
const ROUTER_BASENAME =
  process.env.NODE_ENV === "production" ? "/Softball-Lineup" : "/";

// Run version check immediately before component mount
const storedVersion = localStorage.getItem("appVersion");
if (storedVersion !== APP_VERSION) {
  // Keep existing data so batting order and saved rotations remain persistent.
  localStorage.setItem("appVersion", APP_VERSION);
  console.log("Updated to version", APP_VERSION, "- preserved existing data");
}

function App() {
  return (
    <Router
      basename={ROUTER_BASENAME}
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}>
      <div className='App'>
        <Sidebar />
        <OfflineIndicator />
        <Routes>
          <Route path='/' element={<LineupGenerator />} />
          <Route path='/batting-order' element={<BattingOrder />} />
          <Route path='/rotation-log' element={<RotationLog />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
