# 🎮 Arena Picker - Battle Royale Decision Maker

A fun, pixel-art styled web application where your choices battle it out in a gladiator arena! Perfect for deciding on restaurants, movies, games, or anything else.

## ✨ Features

### Fully Implemented:
- ⚔️ **Advanced Battle System** - Real-time combat with visual effects
  - 8 different attack types with unique animations
  - 💥 **Floating damage numbers** that pop up on hit
  - ⚡ **Attack projectiles** flying between fighters
  - ✨ **Critical hits** (15% chance, 50% more damage)
  - 📺 **Screen shake** on heavy hits
  - 🎭 **Idle animations** - fighters bob and pulse while waiting
  - 🔥 **Hit flash effects** when damage is dealt
  - 🎯 **Attack type system** - melee, magic, ranged, and heavy attacks
- 🎨 **Pixel Art Styling** - Retro gaming aesthetic with crisp pixel graphics
- 🔥 **Free For All Mode** - All contestants battle at once, last one standing wins!
  - Grid display showing all fighters simultaneously
  - Random attacks between any fighters
  - Eliminated fighters stay visible with skull overlay
  - Real-time "Alive" counter
- 🏆 **Tournament Bracket Mode** - Full tournament system with bracket visualization
  - Multiple rounds with automatic progression
  - Visual bracket display showing all matches
  - Semi-finals and finals tracking
  - Real-time bracket updates as matches complete
- 🖼️ **Logo Fetching** - Automatic logo detection for 50+ popular brands
  - Restaurants (McDonald's, Starbucks, KFC, etc.)
  - Tech companies (Apple, Google, Microsoft, etc.)
  - Stores (Walmart, Target, Best Buy, etc.)
  - Smart fallback to color-coded initials
- ⚙️ **Customizable Settings**:
  - Battle speed (0.5s - 2s between attacks)
  - Starting HP (50 - 200)
  - Mode selection (Free For All / Tournament)
- 🎭 **Dynamic Avatars** - Logo images or color-coded initials
- 📊 **Battle Log** - Real-time combat log with attack details
- 🏆 **Victory Screen** - Celebratory winner announcement with confetti

### Coming Soon:
- 🎵 **Sound Effects** - Retro game sounds for attacks and victories
- 📸 **Screenshot Sharing** - Share your battle results

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to the local server URL (typically `http://localhost:5173`)

### Build for Production

```bash
npm run build
npm run preview
```

## 🎮 How to Use

1. **Add Contestants**: Enter names of restaurants, movies, or any choices (2-8 contestants)
2. **Configure Settings**: Choose battle speed, starting HP, and mode
3. **Choose Mode**:
   - **Free For All**: All contestants fight at once in a battle royale
   - **Tournament**: Bracket-style competition with multiple rounds
4. **Start Battle**: Watch your choices fight it out!
5. **View Results**: See the winner and battle again

## 🛠️ Tech Stack

- **Vite** - Fast build tool and dev server
- **React 18** - UI framework with hooks
- **Vanilla CSS** - Lightweight pixel-art styling
- **No external dependencies** - Pure React implementation

## 📁 Project Structure

```
restaurant-arena-picker/
├── src/
│   ├── components/
│   │   ├── SetupScreen.jsx         # Contestant input & settings
│   │   ├── SetupScreen.css
│   │   ├── ArenaScreen.jsx         # Battle system & combat
│   │   ├── ArenaScreen.css
│   │   ├── TournamentBracket.jsx   # Tournament bracket display
│   │   ├── TournamentBracket.css
│   │   ├── WinnerScreen.jsx        # Victory celebration
│   │   └── WinnerScreen.css
│   ├── utils/
│   │   ├── logoFetcher.js          # Logo fetching utilities
│   │   └── tournamentUtils.js      # Tournament bracket logic
│   ├── App.jsx                     # Main app component
│   ├── App.css
│   ├── main.jsx                    # Entry point
│   └── index.css                   # Global pixel-art styles
├── public/
├── index.html
├── package.json
└── vite.config.js
```

## 🎨 Customization

### Color Palette
Edit CSS variables in `src/index.css`:
```css
:root {
  --bg-dark: #1a1a2e;
  --accent-primary: #e94560;
  --accent-secondary: #f39c12;
  /* ... */
}
```

### Attack Skills
Add more attacks in `ArenaScreen.jsx`:
```javascript
const attacks = [
  { name: 'Your Attack', damage: getRandomDamage(10, 25), icon: '⚡' },
  // Add more...
]
```

### Adding Custom Logos
To add more brand logos, edit `src/utils/logoFetcher.js`:
```javascript
const KNOWN_BRANDS = {
  'your brand': 'https://logo.clearbit.com/yourbrand.com',
  // Add more...
}
```

## 🤝 Contributing

This is a fun personal project, but feel free to fork and customize it for your own use!

## 📝 License

MIT License - Feel free to use this for any purpose!

## 🎉 Credits

Built with ❤️ using React and Vite
Pixel art styling inspired by classic 8-bit games
