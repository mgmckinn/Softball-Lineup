/** @format */

// Fisher-Yates shuffle algorithm
export function shuffle(array) {
  let arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Generate unique innings avoiding duplicate lineups
export function generateUniqueInnings(players, count) {
  let innings = [];
  let usedLineups = [];

  for (let inning = 1; inning <= count; inning++) {
    let valid = false;
    let tries = 0;
    let shuffled;

    while (!valid && tries < 100) {
      shuffled = shuffle(players);
      if (
        !usedLineups.some((lineup) =>
          lineup.every((p, idx) => p === shuffled[idx]),
        )
      ) {
        valid = true;
        usedLineups.push([...shuffled]);
      }
      tries++;
    }
    innings.push([...shuffled]);
  }

  return innings;
}

// Save innings to rotation log
export function saveToLog(innings, positions, log, setLog) {
  const weekData = {
    week: log.length + 1,
    innings: innings.map((lineup, inningIdx) =>
      lineup.map((player, index) => ({
        position: positions[inningIdx]
          ? positions[inningIdx][index]
          : getDefaultPositions()[index],
        player,
      })),
    ),
  };

  const updatedLog = [...log, weekData];
  setLog(updatedLog);
  return updatedLog;
}

// Default positions
export function getDefaultPositions() {
  return ["P", "1B", "2B", "3B", "SS", "LF", "CF", "RF", "OF", "OF"];
}

// Default players
export function getDefaultPlayers() {
  return [
    "Holden",
    "Daniel",
    "Emmett",
    "Lennon",
    "Lewis",
    "Kase",
    "Nick",
    "Wade",
    "Wyatt",
    "Max",
  ];
}
