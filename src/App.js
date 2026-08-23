/** @format */

import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import OfflineIndicator from "./components/OfflineIndicator";
import LineupGenerator from "./components/LineupGenerator";
import BattingOrder from "./components/BattingOrder";
import RotationLog from "./components/RotationLog";
import "./App.css";

const APP_VERSION = "2.0"; // Updated version for softball positions

function App() {
  useEffect(() => {
    // Check if we need to clear old data
    const storedVersion = localStorage.getItem("appVersion");
    if (storedVersion !== APP_VERSION) {
      // Clear old rotation log data when version changes
      localStorage.removeItem("rotationLog");
      localStorage.setItem("appVersion", APP_VERSION);
      console.log("Updated to version", APP_VERSION, "- cleared old data");
    }
  }, []);

  return (
    <Router
      basename='/Softball-Lineup'
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
