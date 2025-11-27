import { useState } from 'react'
import './App.css'
import SetupScreen from './components/SetupScreen'
import ArenaScreen from './components/ArenaScreen'
import WinnerScreen from './components/WinnerScreen'

function App() {
  const [gameState, setGameState] = useState('setup') // setup, battle, winner
  const [contestants, setContestants] = useState([])
  const [settings, setSettings] = useState({
    battleSpeed: 1000, // ms between attacks
    startingHP: 100,
    mode: 'single', // single or tournament
  })
  const [winner, setWinner] = useState(null)

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
    setContestants([])
    setWinner(null)
  }

  return (
    <div className="app">
      {gameState === 'setup' && (
        <SetupScreen onStartBattle={startBattle} />
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
