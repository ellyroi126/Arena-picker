# 🎮 Arena Picker - Platformer Battle Royale Decision Maker

A fun, pixel-art styled web application where your choices battle it out in a **multi-level platformer arena**! Perfect for deciding on restaurants, movies, games, or anything else. Watch them **dash, jump between platforms, and battle across multiple levels** with unique character classes in an action-packed arena!

## ✨ Features

### Fully Implemented:
- 🎭 **Random Class System** - Each fighter gets a unique class!
  - 23 different classes: Swordsman, Berserker, Paladin, Dual Wielder, Brawler, Lancer, Assassin, Ranger, Rogue, Nightblade, Gunner, Dancer, Mage, Elementalist, Necromancer, Arcanist, Witch Doctor, Demolitionist, Priest, Acolyte, Monk, Taoist, Mechanic, Oathkeeper
  - Each class has unique stats (HP bonus, attack bonus, speed multiplier)
  - Class-specific abilities and attack styles (melee, magic, ranged, heavy)
  - Classes displayed with icons and names during battles
- 💾 **Persistent Contestant List** - Your choices are saved after each battle!
  - No need to re-type contestants when running multiple battles
  - Easily modify, add, or remove contestants between battles
  - **Clear All button** for quick reset when starting fresh
  - Supports up to 16 contestants (increased from 8)
- 🏗️ **Multi-Level Platformer Arena** - Dynamic arena generation!
  - Randomized platforms at different heights (ground, low, mid, high, floating)
  - 3-6 platforms generated per arena for variety
  - Obstacles and high grounds (walls 🧱, barriers 🚧, pillars 🏛️, crates 📦)
  - Fighters spawn across different platforms
  - **Dynamic movement** - fighters jump between platforms during combat (30% chance per turn)
  - Applied to BOTH tournament and free-for-all modes!
- ⚔️ **Advanced Battle System** - Real-time combat with visual effects
  - Class-based attacks with unique animations
  - 💥 **Floating damage numbers** that pop up on hit
  - ⚡ **Attack projectiles** flying between fighters
  - ✨ **Critical hits** (15% chance, 50% more damage)
  - 📺 **Screen shake** on heavy hits
  - 🎭 **Idle animations** - fighters bob and pulse while waiting
  - 🔥 **Hit flash effects** when damage is dealt
  - 🎯 **Attack type system** - melee, magic, ranged, and heavy attacks
- 🎮 **Platformer-Style Arena** - Side-scrolling fighting game layout!
  - **Multi-level platforms** with obstacles
  - **Smooth natural walking** - sprites patrol platforms at a natural pace
  - **4-8px incremental steps** every 150ms for fluid motion
  - **No teleporting** - fighters only walk on their current platform
  - **Linear transitions** - perfectly synchronized 150ms transitions
  - **Continuous patrol** - fighters actively roam (90% movement rate)
  - **Dash forward animations** when attacking
  - **Knockback animations** when hit (fly back with air time)
  - **Background layers** for depth and atmosphere
  - **Proper spawn distribution** across multiple platforms
- 🎨 **Pixel Art Styling** - Retro gaming aesthetic with crisp pixel graphics
- 🔥 **Free For All Mode** - All contestants battle at once in multi-level arena!
  - Fighters positioned across different platforms
  - Random attacks between any fighters
  - Eliminated fighters stay visible with skull overlay
  - Real-time "Alive" counter
  - Full platformer arena with obstacles
- 🏆 **Tournament Bracket Mode** - Full tournament system with bracket visualization
  - Multiple rounds with automatic progression
  - Visual bracket display showing all matches
  - Semi-finals and finals tracking
  - Real-time bracket updates as matches complete
  - Multi-level platformer arena for each match
- 🖼️ **Logo Fetching** - Automatic logo detection for 50+ popular brands
  - Restaurants (McDonald's, Starbucks, KFC, etc.)
  - Tech companies (Apple, Google, Microsoft, etc.)
  - Stores (Walmart, Target, Best Buy, etc.)
  - Smart fallback to color-coded initials
- ⚙️ **Customizable Settings**:
  - Battle speed (0.3s - 2s between attacks, default: 1.5s Slow)
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

1. **Add Contestants**: Enter names of restaurants, movies, or any choices (2-16 contestants)
2. **Configure Settings**: Choose battle speed, starting HP, and mode
3. **Choose Mode**:
   - **Free For All**: All contestants fight at once in a battle royale
   - **Tournament**: Bracket-style competition with multiple rounds
4. **Start Battle**: Watch your choices fight it out!
5. **View Results**: See the winner and battle again (your choices will be saved!)
6. **Modify & Re-run**: Add or remove contestants and start a new battle

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
│   │   ├── ArenaScreen.jsx         # Battle system & multi-level arena
│   │   ├── ArenaScreen.css
│   │   ├── TournamentBracket.jsx   # Tournament bracket display
│   │   ├── TournamentBracket.css
│   │   ├── DamageNumber.jsx        # Floating damage numbers
│   │   ├── DamageNumber.css
│   │   ├── AttackEffect.jsx        # Attack projectile animations
│   │   ├── AttackEffect.css
│   │   ├── WinnerScreen.jsx        # Victory celebration
│   │   └── WinnerScreen.css
│   ├── utils/
│   │   ├── logoFetcher.js          # Logo fetching utilities
│   │   ├── tournamentUtils.js      # Tournament bracket logic
│   │   ├── classSystem.js          # Fighter class system (23 classes)
│   │   └── platformSystem.js       # Multi-level arena generation
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

### Fighter Classes
Add more classes in `src/utils/classSystem.js`:
```javascript
export const FIGHTER_CLASSES = [
  {
    name: 'Your Class',
    icon: '⚔️',
    color: '#e74c3c',
    stats: { hpBonus: 10, attackBonus: 5, speed: 1.0 },
    abilities: ['Ability 1', 'Ability 2']
  },
  // Add more...
]
```

### Arena Platforms
Customize platform generation in `src/utils/platformSystem.js`:
```javascript
export const PLATFORM_TYPES = {
  GROUND: { height: 0, color: '#2a3545', solid: true },
  // Add custom platform types...
}
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
