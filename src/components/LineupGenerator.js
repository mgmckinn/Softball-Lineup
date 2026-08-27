/** @format */

import React, { useState, useEffect } from "react";
import InningTable from "./InningTable";
import useLocalStorage from "../hooks/useLocalStorage";
import {
  generateUniqueInnings,
  getDefaultPositions,
  getDefaultPlayers,
} from "../utils/lineupUtils";
import "./LineupGenerator.css";

function LineupGenerator() {
  const [inningCount, setInningCount] = useState(6);
  const [innings, setInnings] = useState([]);
  const [customPositions, setCustomPositions] = useState([]);
  const [rotationLog, setRotationLog] = useLocalStorage("rotationLog", []);
  const [copiedInning, setCopiedInning] = useState(null);
  const [savedRotations, setSavedRotations] = useLocalStorage(
    "savedRotations",
    [],
  );
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [rotationName, setRotationName] = useState("");

  const defaultPositions = getDefaultPositions();
  const defaultPlayers = getDefaultPlayers();

  // Generate innings on initial load
  useEffect(() => {
    handleGenerateInnings(6);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGenerateInnings = (count = inningCount) => {
    const newInnings = generateUniqueInnings(defaultPlayers, count);
    setInnings(newInnings);

    // Initialize custom positions for each inning
    const positions = Array(count)
      .fill(null)
      .map(() => [...defaultPositions]);
    setCustomPositions(positions);

    // Save to log
    saveToLog(newInnings, positions);
  };

  const saveToLog = (inningsData, positionsData) => {
    const weekData = {
      week: rotationLog.length + 1,
      innings: inningsData.map((lineup, inningIdx) =>
        lineup.map((player, index) => ({
          position: positionsData[inningIdx]
            ? positionsData[inningIdx][index]
            : defaultPositions[index],
          player,
        })),
      ),
    };

    setRotationLog([...rotationLog, weekData]);
  };

  const handleLineupChange = (inningIndex, newLineup) => {
    const newInnings = [...innings];
    newInnings[inningIndex] = newLineup;
    setInnings(newInnings);
    saveToLog(newInnings, customPositions);
  };

  const handlePositionChange = (inningIndex, newPositions) => {
    const newCustomPositions = [...customPositions];
    newCustomPositions[inningIndex] = newPositions;
    setCustomPositions(newCustomPositions);
    saveToLog(innings, newCustomPositions);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyInning = (inningIndex) => {
    setCopiedInning({
      lineup: [...innings[inningIndex]],
      positions: [...customPositions[inningIndex]],
    });
  };

  const handlePasteInning = (inningIndex) => {
    if (!copiedInning) return;

    const newInnings = [...innings];
    const newCustomPositions = [...customPositions];

    newInnings[inningIndex] = [...copiedInning.lineup];
    newCustomPositions[inningIndex] = [...copiedInning.positions];

    setInnings(newInnings);
    setCustomPositions(newCustomPositions);
    saveToLog(newInnings, newCustomPositions);
  };

  const handleSaveRotation = () => {
    if (!rotationName.trim()) {
      alert("Please enter a name for this rotation!");
      return;
    }

    const newSavedRotation = {
      id: Date.now(),
      name: rotationName.trim(),
      date: new Date().toLocaleDateString(),
      innings: innings,
      positions: customPositions,
      inningCount: innings.length,
    };

    setSavedRotations([...savedRotations, newSavedRotation]);
    setRotationName("");
    setShowSaveModal(false);
    alert(`Rotation "${newSavedRotation.name}" saved successfully!`);
  };

  const handleLoadRotation = (rotationId) => {
    const rotation = savedRotations.find((r) => r.id === rotationId);
    if (rotation) {
      setInnings(rotation.innings);
      setCustomPositions(rotation.positions);
      setInningCount(rotation.inningCount);
    }
  };

  const handleDeleteRotation = (rotationId) => {
    const rotation = savedRotations.find((r) => r.id === rotationId);
    if (rotation && window.confirm(`Delete rotation "${rotation.name}"?`)) {
      setSavedRotations(savedRotations.filter((r) => r.id !== rotationId));
    }
  };

  return (
    <div className='lineup-container text-center'>
      <h1>Sunny D's Lineup Rotator</h1>
      <div className='no-print mb-3'>
        <select
          id='inningCount'
          className='form-select d-inline-block'
          style={{ width: "auto", marginRight: "10px" }}
          value={inningCount}
          onChange={(e) => setInningCount(parseInt(e.target.value))}>
          <option value='1'>1 Inning</option>
          <option value='2'>2 Innings</option>
          <option value='3'>3 Innings</option>
          <option value='4'>4 Innings</option>
          <option value='5'>5 Innings</option>
          <option value='6'>6 Innings</option>
        </select>
        <button
          className='btn btn-primary'
          onClick={() => handleGenerateInnings(inningCount)}>
          Generate Innings
        </button>
        <button className='btn btn-success' onClick={handlePrint}>
          Save as PDF
        </button>
        <button
          className='btn btn-info'
          onClick={() => setShowSaveModal(true)}
          style={{ marginLeft: "10px" }}>
          💾 Save Rotation
        </button>
      </div>

      {savedRotations.length > 0 && (
        <div className='no-print mb-3 saved-rotations-section'>
          <h4
            style={{
              color: "#000000",
              fontSize: "1.2rem",
              marginBottom: "10px",
              fontWeight: "700",
            }}>
            Saved Rotations
          </h4>
          <div className='saved-rotations-list'>
            {savedRotations.map((rotation) => (
              <div key={rotation.id} className='saved-rotation-item'>
                <span className='rotation-info'>
                  <strong>{rotation.name}</strong>
                  <small>
                    {" "}
                    ({rotation.inningCount} innings - {rotation.date})
                  </small>
                </span>
                <div className='rotation-actions'>
                  <button
                    className='btn btn-sm btn-primary'
                    onClick={() => handleLoadRotation(rotation.id)}>
                    Load
                  </button>
                  <button
                    className='btn btn-sm btn-danger'
                    onClick={() => handleDeleteRotation(rotation.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showSaveModal && (
        <div className='no-print save-modal'>
          <div className='save-modal-content'>
            <h3>Save Current Rotation</h3>
            <input
              type='text'
              className='form-control'
              placeholder='Enter rotation name (e.g., "Week 1 - Opening Day")'
              value={rotationName}
              onChange={(e) => setRotationName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSaveRotation()}
              autoFocus
            />
            <div className='modal-buttons'>
              <button className='btn btn-success' onClick={handleSaveRotation}>
                Save
              </button>
              <button
                className='btn btn-secondary'
                onClick={() => {
                  setShowSaveModal(false);
                  setRotationName("");
                }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className='innings-container'>
        {innings.map((lineup, index) => (
          <div key={index} className='inning-block'>
            <div className='inning-actions no-print'>
              <button
                className='btn btn-sm btn-outline-light'
                onClick={() => handleCopyInning(index)}
                title='Copy this inning'>
                📋 Copy
              </button>
              <button
                className='btn btn-sm btn-outline-light'
                onClick={() => handlePasteInning(index)}
                disabled={!copiedInning}
                title='Paste copied inning here'>
                📄 Paste
              </button>
            </div>
            <InningTable
              inningNumber={index + 1}
              lineup={lineup}
              positions={customPositions[index] || defaultPositions}
              onLineupChange={(newLineup) =>
                handleLineupChange(index, newLineup)
              }
              onPositionChange={(newPositions) =>
                handlePositionChange(index, newPositions)
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default LineupGenerator;
