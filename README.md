<!-- @format -->

# Softball Lineup Rotator - React App

A React application to help coaches manage softball team lineups with automatic rotation and position tracking.

## Features

- 🔄 **Automatic Lineup Rotation** - Generate unique lineups for multiple innings (1-6 innings)
- 🎯 **Drag & Drop** - Reorder players easily with drag-and-drop functionality
- ✏️ **Editable** - Edit player names and positions directly in the tables
- 💾 **Persistent Storage** - All data saved to localStorage automatically
- 📊 **Rotation History** - Track lineup history across multiple weeks/games
- 🖨️ **Printable** - Export lineups as PDF for game day
- 📱 **Responsive** - Works on desktop, tablet, and mobile devices

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/mgmckinn/Softball-Lineup.git
   cd Softball-Lineup
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

## Usage

### Main Lineup Page

1. Select the number of innings (1-6) from the dropdown
2. Click "Generate Innings" to create randomized lineups
3. Drag players to reorder them within each inning
4. Click on positions or player names to edit them
5. Click "Save as PDF" to print or save the lineups
6. Click "View Rotation Log" to see historical lineups

### Rotation Log Page

- View all previously generated lineups organized by week
- Generate new weeks of lineups
- Reset the entire log if needed
- Return to the main lineup generator

## Project Structure

```
src/
├── components/
│   ├── LineupGenerator.js    # Main lineup generation page
│   ├── LineupGenerator.css
│   ├── InningTable.js         # Individual inning table component
│   ├── InningTable.css
│   ├── RotationLog.js         # Historical rotation log page
│   └── RotationLog.css
├── hooks/
│   └── useLocalStorage.js     # Custom hook for localStorage
├── utils/
│   └── lineupUtils.js         # Utility functions for lineup generation
├── App.js                     # Main app with routing
├── App.css
├── index.js                   # Entry point
└── index.css

public/
└── index.html                 # HTML template
```

## Technologies Used

- **React** - UI framework
- **React Router** - Client-side routing
- **React-Sortablejs** - Drag-and-drop functionality
- **Bootstrap 5** - Styling and layout
- **localStorage** - Data persistence

## Customization

To customize player names and positions, edit the default values in:

**`src/utils/lineupUtils.js`**:

```javascript
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

export function getDefaultPositions() {
  return ["P", "1B", "2B", "3B", "SS", "LF", "CF", "RF", "OF", "OF"];
}
```

## Original HTML Files

The original HTML files have been backed up as:

- `index.html.backup`
- `rotation-log.html.backup`

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License.
