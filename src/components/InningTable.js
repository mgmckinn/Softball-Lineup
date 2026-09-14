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
  positionInputMode = "write-in",
  positionOptions = [],
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

  const getRowPositionOptions = (positionValue) => {
    const current = (positionValue || "").trim();
    if (!current || positionOptions.includes(current)) {
      return positionOptions;
    }
    return [...positionOptions, current];
  };

  return (
    <table className='table table-bordered inning-table'>
      <thead>
        <tr>
          <th colSpan='2' className='inning-title-cell'>
            <div className='inning-title-wrap'>
              <span className='inning-badge'>Inning {inningNumber}</span>
              <span className='inning-subtitle'>Drag to reorder players</span>
            </div>
          </th>
        </tr>
        <tr>
          <th className='column-label position-label'>
            <span className='label-kicker'>Defense</span>
            Position
          </th>
          <th className='column-label player-label'>
            <span className='label-kicker'>Batting</span>
            Player
          </th>
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
            {positionInputMode === "dropdown" ? (
              <td className='position-select-cell'>
                <select
                  className='position-select'
                  aria-label='Choose position'
                  value={positions[index] || ""}
                  onChange={(e) => handlePositionEdit(index, e.target.value)}>
                  <option value=''></option>
                  {getRowPositionOptions(positions[index]).map((position) => (
                    <option key={position} value={position}>
                      {position}
                    </option>
                  ))}
                </select>
              </td>
            ) : (
              <td
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) =>
                  handlePositionEdit(index, e.target.textContent.trim())
                }
                className='editable-position'>
                {positions[index]}
              </td>
            )}
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
