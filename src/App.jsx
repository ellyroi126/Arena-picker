import { useState, useEffect } from 'react'
import './App.css'
import SetupScreen from './components/SetupScreen'
import ArenaScreen from './components/ArenaScreen'
import WinnerScreen from './components/WinnerScreen'

function App() {
  const [gameState, setGameState] = useState('setup') // setup, battle, winner
  const [contestants, setContestants] = useState([])
  const [settings, setSettings] = useState({
    battleSpeed: 1500, // ms between attacks (default: Slow)
    startingHP: 100,
    mode: 'single', // single or tournament
  })
  const [winner, setWinner] = useState(null)
  const [theme, setTheme] = useState(() => {
    // Load theme from localStorage or default to 'dark'
    return localStorage.getItem('theme') || 'dark'
  })

  // Apply theme to document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  const startBattle = (newContestants, newSettings) => {
    setContestants(newContestants)
    setSettings(newSettings)
    setGameState('battle')
  }

  const handleBattleEnd = (winningContestant) => {
    setWinner(winningContestant)
    setGameState('winner')
  }

  const resetGame = () => {
    setGameState('setup')
    // Keep contestants so users don't have to re-enter them
    setWinner(null)
  }

  return (
    <div className="app">
      {/* Theme Toggle Button - Always visible */}
      <button
        className="theme-toggle-btn"
        onClick={toggleTheme}
        title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>

      {gameState === 'setup' && (
        <SetupScreen onStartBattle={startBattle} initialContestants={contestants} />
      )}

      {gameState === 'battle' && (
        <ArenaScreen
          contestants={contestants}
          settings={settings}
          onBattleEnd={handleBattleEnd}
        />
      )}

      {gameState === 'winner' && (
        <WinnerScreen winner={winner} onReset={resetGame} />
      )}
    </div>
  )
}

export default App
