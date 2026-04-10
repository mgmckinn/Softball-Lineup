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
          <th colSpan='2'>Inning {inningNumber}</th>
        </tr>
        <tr>
          <th>Position</th>
          <th>Player</th>
        </tr>
      </thead>
      <tbody>
        <ReactSortable
          list={sortableItems}
          setList={handleDragEnd}
          tag='tbody'
          animation={150}>
          {sortableItems.map((item, index) => (
            <tr key={item.id} data-index={index}>
              <td
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) =>
                  handlePositionEdit(index, e.target.textContent.trim())
                }
                className='editable-position'>
                {positions[index]}
              </td>
              <td
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) =>
                  handlePlayerEdit(index, e.target.textContent.trim())
                }
                className='draggable-player'>
                <span className='drag-handle'>{item.player}</span>
              </td>
            </tr>
          ))}
        </ReactSortable>
      </tbody>
    </table>
  );
}

export default InningTable;
