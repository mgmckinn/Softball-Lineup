/** @format */

import React from "react";
import { ReactSortable } from "react-sortablejs";
import "./InningTable.css";

function InningTable({
  inningNumber,
  lineup,
  positions,
  onLineupChange,
  onPositionChange,
}) {
  const handleDragEnd = (newLineup) => {
    // Extract just the player names from the sorted items
    const playerNames = newLineup.map((item) => item.player);
    onLineupChange(playerNames);
  };

  const handlePositionEdit = (index, newPosition) => {
    const newPositions = [...positions];
    newPositions[index] = newPosition;
    onPositionChange(newPositions);
  };

  const handlePlayerEdit = (index, newPlayer) => {
    const newLineup = [...lineup];
    newLineup[index] = newPlayer;
    onLineupChange(newLineup);
  };

  // Convert lineup array to array of objects for ReactSortable
  const sortableItems = lineup.map((player, index) => ({
    id: `${inningNumber}-${index}`,
    player: player,
  }));

  return (
    <table className='table table-bordered inning-table'>
      <thead>
        <tr>
          <th colSpan='2'>
            Inning {inningNumber}
            <div
              style={{
                fontSize: "0.7rem",
                fontWeight: "normal",
                marginTop: "4px",
                opacity: "0.8",
              }}>
              (Drag players to reorder)
            </div>
          </th>
        </tr>
        <tr>
          <th>Position</th>
          <th>Player</th>
        </tr>
      </thead>
      <ReactSortable
        list={sortableItems}
        setList={handleDragEnd}
        tag='tbody'
        animation={150}
        ghostClass='sortable-ghost'
        dragClass='sortable-drag'>
        {sortableItems.map((item, index) => (
          <tr key={item.id} data-index={index} className='draggable-row'>
            <td
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) =>
                handlePositionEdit(index, e.target.textContent.trim())
              }
              className='editable-position'>
              {positions[index]}
            </td>
            <td className='player-cell'>
              <span className='drag-handle draggable-player'>☰</span>
              <span
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) =>
                  handlePlayerEdit(index, e.target.textContent.trim())
                }
                className='player-name'>
                {item.player}
              </span>
            </td>
          </tr>
        ))}
      </ReactSortable>
    </table>
  );
}

export default InningTable;
