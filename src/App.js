/** @format */

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import OfflineIndicator from "./components/OfflineIndicator";
import LineupGenerator from "./components/LineupGenerator";
import BattingOrder from "./components/BattingOrder";
import RotationLog from "./components/RotationLog";
import "./App.css";

function App() {
  return (
    <Router
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
