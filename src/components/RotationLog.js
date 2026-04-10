/** @format */

import React from "react";
import { useNavigate } from "react-router-dom";
import useLocalStorage from "../hooks/useLocalStorage";
import {
  shuffle,
  getDefaultPositions,
  getDefaultPlayers,
} from "../utils/lineupUtils";
import "./RotationLog.css";

function RotationLog() {
  const navigate = useNavigate();
  const [rotationLog, setRotationLog] = useLocalStorage("rotationLog", []);

  const defaultPositions = getDefaultPositions();
  const defaultPlayers = getDefaultPlayers();

  const resetLog = () => {
    if (
      window.confirm("Are you sure you want to reset the entire rotation log?")
    ) {
      setRotationLog([]);
    }
  };

  const lineupsEqual = (a, b) => {
    if (!a || !b || a.length !== b.length) return false;
    return a.every(
      (item, idx) =>
        item.player === b[idx].player && item.position === b[idx].position,
    );
  };

  const weeksEqual = (a, b) => {
    if (!a || !b || a.innings.length !== b.innings.length) return false;
    return a.innings.every((inning, idx) =>
      lineupsEqual(inning, b.innings[idx]),
    );
  };

  const generateNewLineup = () => {
    let newWeek,
      attempts = 0,
      maxAttempts = 30;

    do {
      // Generate 6 unique inning lineups for the week
      let usedLineups = [];
      let innings = [];

      for (let i = 0; i < 6; i++) {
        let inningLineup,
          inningAttempts = 0;

        do {
          const shuffledPlayers = shuffle(defaultPlayers);
          inningLineup = defaultPositions.map((position, idx) => ({
            position: position,
            player: shuffledPlayers[idx],
          }));
          inningAttempts++;
        } while (
          usedLineups.some((lu) => lineupsEqual(lu, inningLineup)) &&
          inningAttempts < 20
        );

        usedLineups.push(inningLineup);
        innings.push(inningLineup);
      }

      newWeek = {
        week: rotationLog.length + 1,
        innings: innings,
      };
      attempts++;
    } while (
      rotationLog.some((weekEntry) => weeksEqual(weekEntry, newWeek)) &&
      attempts < maxAttempts
    );

    setRotationLog([...rotationLog, newWeek]);
  };

  return (
    <div className='container'>
      <h1 className='text-center mb-4'>Softball Rotation Log</h1>
      <div className='text-center mb-4'>
        <button
          className='btn btn-outline-primary me-2'
          onClick={() => navigate("/")}>
          ← Back to Lineup
        </button>
        <button className='btn btn-danger me-2' onClick={resetLog}>
          Reset Log
        </button>
        <button className='btn btn-outline-primary' onClick={generateNewLineup}>
          Generate New Week
        </button>
      </div>
      <div id='logContainer'>
        {rotationLog.length === 0 ? (
          <p>No rotation data available.</p>
        ) : (
          rotationLog.map((weekEntry, weekIdx) => (
            <div key={weekIdx} className='inning-block'>
              <h4>Week {weekEntry.week}</h4>
              {weekEntry.innings.map((inning, inningIdx) => (
                <div key={inningIdx}>
                  <h6>Inning {inningIdx + 1}</h6>
                  <table className='table table-bordered'>
                    <thead>
                      <tr>
                        <th>Position</th>
                        <th>Player</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inning.map((lineup, lineupIdx) => (
                        <tr key={lineupIdx}>
                          <td>{lineup.position}</td>
                          <td>{lineup.player}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default RotationLog;
