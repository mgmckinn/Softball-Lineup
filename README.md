<!-- @format -->

# Athletics Softball Lineup Manager - React PWA

A Progressive Web App (PWA) to help coaches manage softball team lineups with automatic rotation, batting order management, and position tracking.

## Features

- 🔄 **Automatic Lineup Rotation** - Generate unique lineups for multiple innings (1-6 innings)
- ⚾ **Batting Order Manager** - Create and customize batting orders with team colors and logos
- 🎯 **Drag & Drop** - Reorder players easily with drag-and-drop functionality
- ✏️ **Editable** - Edit player names and positions directly in the tables
- 💾 **Persistent Storage** - All data saved to localStorage automatically
- 📊 **Rotation History** - Track lineup history across multiple weeks/games
- 🖨️ **Printable** - Export lineups as PDF for game day
- 📱 **Progressive Web App** - Install on iOS, Android, or desktop for offline access
- 🌐 **Offline Support** - Works without internet connection after installation
- 🎨 **Athletics Theme** - Green and gold color scheme with dynamic animations

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

This creates an optimized production build in the `build/` folder ready for deployment.

### Installing as PWA

#### Desktop (ChGenerator

1. Select the number of innings (1-6) from the dropdown
2. Click "Generate Innings" to create randomized lineups
3. Drag players to reorder them within each inning
4. Click on positions or player names to edit them
5. Click "Save to Log" to save the current lineup to history
6. Click "Print Lineups" to print or save as PDF

### Batting Order Manager

1. Open the menu (☰) and select "Batting Order"
2. Add or edit player names in the lineup
3. Drag players to reorder the batting sequence
4. Customize team colors using the color picker
5. Upload team or sponsor logos
6. Generate random batting orders
7. Print the batting order card

### Rotation History

1. Open the menu (☰) and select "Rotation Log"
2. View all previously saved lineups organized by date
3. Generate new weeks of rotations
4. Reset the entire log if needed

#### Generating PWA Icons

Before deployment, generate app icons:

```bash
# Option 1: Using Python (requires Pillow)
pip3 install pillow
cd public
python3 generate-icons.py

# Option 2: Using online tool
# Upload your logo to https://realfavicongenerator.net/
# Download the generated icons to the public/ folder
```

## Usage

### Main Lineup Page

1. Select the number of innings (1-6) from the dropdown
2. Click "Generate Innings" to create randomized lineups
3. Drag players to reorder them within each inning
4. Click on positions or player names to edit them
5. Click "Save as PDF" to print or save the lineups
6. Click "View Rotation Log" to see historical lineups

### Rotation Log Page

- View all previously generate # Main lineup generation page
  │ ├── LineupGenerator.css
  │ ├── InningTable.js # Individual inning table component
  │ ├── InningTable.css
  │ ├── BattingOrder.js # Batting order manager
  │ ├── BattingOrder.css
  │ ├── RotationLog.js # Historical rotation log page
  │ ├── RotationLog.css
  │ ├── Sidebar.js # Hamburger menu navigation
  │ ├── Sidebar.css
  │ ├── OfflineIndicator.js # Connection status indicator
  │ └── OfflineIndicator.css
  ├── hooks/
  │ └── useLocalStorage.js # Custom hook for localStorage
  ├── utils/
  │ └── lineupUtils.js # Utility functions for lineup generation
  ├── App.js # Main app with routing
  ├── App.css
  ├── index.js # Entry point with service worker
  ├── index.css
  └── serviceWorkerRegistration.js # PWA service worker setup
  18\*\* - UI framework with hooks
- **React Router DOM 6** - Client-side routing
- **React-Sortablejs** - Drag-and-drop functionality
- **Bootstrap 5** - CSS framework for responsive layout
- **Service Workers** - PWA offline caching
- **LocalStorage API** - Client-side data persistence

## Browser Support

- ✅ Chrome (Desktop & Android)
- ✅ Safari (macOS & iOS)
- ✅ Edge (Desktop)
- ✅ Firefox (Desktop & Android)
- ✅ Samsung Internet

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

## License

This project is open source and available under the MIT License.
├── index.html # HTML template with PWA meta tags
├── manifest.json # PWA manifest
├── service-worker.js # Offline caching service worker
└── generate-icons.py # Script to generate PWA icons
│ └── useLocalStorage.js # Custom hook for localStorage
├── utils/
│ └── lineupUtils.js # Utility functions for lineup generation
├── App.js # Main app with routing
├── App.css
├── index.js # Entry point
└── index.css

public/
└── index.html # HTML template

````

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
````

## Original HTML Files

The original HTML files have been backed up as:

- `index.html.backup`
- `rotation-log.html.backup`

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License.
