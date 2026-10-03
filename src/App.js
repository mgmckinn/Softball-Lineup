/** @format */

import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import useLocalStorage from "./hooks/useLocalStorage";
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
  const [teamName, setTeamName] = useLocalStorage(
    "sharedTeamName",
    "Sunny D's Team",
  );
  const [isEditingTeamName, setIsEditingTeamName] = useState(false);
  const [teamNameInput, setTeamNameInput] = useState(teamName);

  useEffect(() => {
    setTeamNameInput(teamName);
  }, [teamName]);

  const handleTeamNameClick = () => {
    setTeamNameInput(teamName);
    setIsEditingTeamName(true);
  };

  const handleTeamNameSave = () => {
    const newName = teamNameInput.trim();
    if (newName) {
      setTeamName(newName);
    } else {
      setTeamNameInput(teamName);
    }
    setIsEditingTeamName(false);
  };

  const handleTeamNameKeyPress = (e) => {
    if (e.key === "Enter") {
      handleTeamNameSave();
    } else if (e.key === "Escape") {
      setIsEditingTeamName(false);
    }
  };

  return (
    <Router
      basename={ROUTER_BASENAME}
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}>
      <div className='App'>
        <Sidebar
          teamName={teamName}
          isEditingTeamName={isEditingTeamName}
          teamNameInput={teamNameInput}
          onTeamNameClick={handleTeamNameClick}
          onTeamNameSave={handleTeamNameSave}
          onTeamNameInputChange={(e) => setTeamNameInput(e.target.value)}
          onTeamNameKeyPress={handleTeamNameKeyPress}
        />
        <OfflineIndicator />
        <Routes>
          <Route
            path='/'
            element={
              <LineupGenerator
                teamName={teamName}
                setTeamName={setTeamName}
                isEditingTeamName={isEditingTeamName}
                teamNameInput={teamNameInput}
                onTeamNameClick={handleTeamNameClick}
                onTeamNameSave={handleTeamNameSave}
                onTeamNameInputChange={(e) => setTeamNameInput(e.target.value)}
                onTeamNameKeyPress={handleTeamNameKeyPress}
              />
            }
          />
          <Route
            path='/batting-order'
            element={
              <BattingOrder
                teamName={teamName}
                setTeamName={setTeamName}
                isEditingTeamName={isEditingTeamName}
                teamNameInput={teamNameInput}
                onTeamNameClick={handleTeamNameClick}
                onTeamNameSave={handleTeamNameSave}
                onTeamNameInputChange={(e) => setTeamNameInput(e.target.value)}
                onTeamNameKeyPress={handleTeamNameKeyPress}
              />
            }
          />
          <Route
            path='/rotation-log'
            element={
              <RotationLog
                teamName={teamName}
                setTeamName={setTeamName}
                isEditingTeamName={isEditingTeamName}
                teamNameInput={teamNameInput}
                onTeamNameClick={handleTeamNameClick}
                onTeamNameSave={handleTeamNameSave}
                onTeamNameInputChange={(e) => setTeamNameInput(e.target.value)}
                onTeamNameKeyPress={handleTeamNameKeyPress}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
