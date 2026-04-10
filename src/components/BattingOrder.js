/** @format */

import React, { useState, useEffect } from "react";
import { ReactSortable } from "react-sortablejs";
import "./BattingOrder.css";

function BattingOrder() {
  const defaultPlayers = [
    "Daniel",
    "Emmett",
    "Henry Lennon",
    "Henry Lewis",
    "Holden",
    "Kase",
    "Nicholas",
    "Wade",
    "Wyatt",
    "Max",
  ];

  const [players, setPlayers] = useState(
    defaultPlayers.map((name, index) => ({ id: index + 1, name })),
  );
  const [newName, setNewName] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#1b5e20");
  const [textColor, setTextColor] = useState("#ffd700");
  const [sponsorLogo, setSponsorLogo] = useState(null);
  const [teamLogo, setTeamLogo] = useState(null);

  const addName = () => {
    const playerName = newName.trim();
    if (playerName) {
      setPlayers([
        ...players,
        { id: players.length + Date.now(), name: playerName },
      ]);
      setNewName("");
    }
  };

  const removeName = (id) => {
    const player = players.find((p) => p.id === id);
    if (player && window.confirm(`Remove ${player.name}?`)) {
      setPlayers(players.filter((p) => p.id !== id));
    }
  };

  const generateOrder = () => {
    const shuffled = [...players];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setPlayers(shuffled);
  };

  const handleSponsorLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSponsorLogo(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTeamLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setTeamLogo(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addName();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className='batting-order-page'>
      <div className='no-print controls-section'>
        <div className='control-group'>
          <h2>Team Colors</h2>
          <div className='color-picker-group'>
            <label htmlFor='primary-color'>Background:</label>
            <input
              type='color'
              id='primary-color'
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
            />
            <label htmlFor='text-color'>Text:</label>
            <input
              type='color'
              id='text-color'
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
            />
          </div>
        </div>

        <div className='control-group'>
          <h2>Upload Logos</h2>
          <div className='logo-upload-group'>
            <label htmlFor='sponsor-logo-upload' className='upload-label'>
              Sponsor Logo
            </label>
            <input
              type='file'
              id='sponsor-logo-upload'
              accept='image/*'
              onChange={handleSponsorLogoUpload}
            />
            <label htmlFor='team-logo-upload' className='upload-label'>
              Team Logo
            </label>
            <input
              type='file'
              id='team-logo-upload'
              accept='image/*'
              onChange={handleTeamLogoUpload}
            />
          </div>
        </div>

        <div className='control-group'>
          <h2>Add Player</h2>
          <div className='add-player-group'>
            <input
              type='text'
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder='Enter player name'
              className='player-input'
            />
            <button onClick={addName} className='btn btn-primary'>
              Add Player
            </button>
          </div>
        </div>
      </div>

      <h1 className='batting-title'>Athletics Batting Order</h1>

      <div className='batting-container'>
        <div className='logos-container'>
          {sponsorLogo && (
            <img
              src={sponsorLogo}
              alt='Sponsor Logo'
              className='batting-logo'
            />
          )}
          {teamLogo && (
            <img src={teamLogo} alt='Team Logo' className='batting-logo' />
          )}
        </div>

        <ReactSortable
          list={players}
          setList={setPlayers}
          tag='ol'
          className='player-list'
          animation={150}>
          {players.map((player) => (
            <li
              key={player.id}
              className='player-item'
              style={{
                backgroundColor: primaryColor,
                color: textColor,
              }}
              onClick={() => removeName(player.id)}
              title='Click to remove'>
              {player.name}
            </li>
          ))}
        </ReactSortable>

        <div className='no-print action-buttons'>
          <button onClick={generateOrder} className='btn btn-success'>
            Generate Random Order
          </button>
          <button onClick={handlePrint} className='btn btn-primary'>
            Print Batting Order
          </button>
        </div>
      </div>
    </div>
  );
}

export default BattingOrder;
