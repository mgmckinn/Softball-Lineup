/** @format */

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import OfflineIndicator from "./components/OfflineIndicator";
import LineupGenerator from "./components/LineupGenerator";
import BattingOrder from "./components/BattingOrder";
import RotationLog from "./components/RotationLog";
import "./App.css";

const APP_VERSION = "2.1-softball"; // Updated version for softball positions

// Run version check immediately before component mount
const storedVersion = localStorage.getItem("appVersion");
if (storedVersion !== APP_VERSION) {
  // Clear ALL localStorage data to ensure fresh start
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key !== "appVersion") {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach((key) => localStorage.removeItem(key));
  localStorage.setItem("appVersion", APP_VERSION);
  console.log("Updated to version", APP_VERSION, "- cleared all old data");
}

function App() {
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
