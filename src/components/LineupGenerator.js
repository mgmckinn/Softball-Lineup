/** @format */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InningTable from "./InningTable";
import useLocalStorage from "../hooks/useLocalStorage";
import {
  generateUniqueInnings,
  getDefaultPositions,
  getDefaultPlayers,
} from "../utils/lineupUtils";
import "./LineupGenerator.css";

function LineupGenerator() {
  const navigate = useNavigate();
  const [inningCount, setInningCount] = useState(6);
  const [innings, setInnings] = useState([]);
  const [customPositions, setCustomPositions] = useState([]);
  const [rotationLog, setRotationLog] = useLocalStorage("rotationLog", []);

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

  return (
    <div className='container text-center'>
      <h1>Athletics Lineup Rotator</h1>
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
          className='btn btn-outline-light'
          onClick={() => navigate("/rotation-log")}>
          View Rotation Log
        </button>
      </div>
      <div className='innings-container'>
        {innings.map((lineup, index) => (
          <InningTable
            key={index}
            inningNumber={index + 1}
            lineup={lineup}
            positions={customPositions[index] || defaultPositions}
            onLineupChange={(newLineup) => handleLineupChange(index, newLineup)}
            onPositionChange={(newPositions) =>
              handlePositionChange(index, newPositions)
            }
          />
        ))}
      </div>
    </div>
  );
}

export default LineupGenerator;
