import { useState } from 'react'
import './SetupScreen.css'
import { getBestLogo } from '../utils/logoFetcher'

function SetupScreen({ onStartBattle }) {
  const [contestants, setContestants] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isLoadingLogo, setIsLoadingLogo] = useState(false)
  const [settings, setSettings] = useState({
    battleSpeed: 1000,
    startingHP: 100,
    mode: 'freeforall',
  })

  const addContestant = async (e) => {
    e.preventDefault()
    if (inputValue.trim() && contestants.length < 8) {
      setIsLoadingLogo(true)

      // Fetch logo for the contestant
      const logo = await getBestLogo(inputValue.trim())

      const newContestant = {
        id: Date.now(),
        name: inputValue.trim(),
        hp: settings.startingHP,
        maxHP: settings.startingHP,
        logo: logo,
        color: generateRandomColor(),
      }
      setContestants([...contestants, newContestant])
      setInputValue('')
      setIsLoadingLogo(false)
    }
  }

  const removeContestant = (id) => {
    setContestants(contestants.filter(c => c.id !== id))
  }

  const generateRandomColor = () => {
    const colors = [
      '#e74c3c', '#3498db', '#2ecc71', '#f39c12',
      '#9b59b6', '#1abc9c', '#e67e22', '#34495e'
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  const handleStartBattle = () => {
    if (contestants.length >= 2) {
      onStartBattle(contestants, settings)
    }
  }

  return (
    <div className="setup-screen">
      <div className="setup-container pixel-container">
        <h1 className="title pixel-text">
          ⚔️ ARENA PICKER ⚔️
        </h1>
        <p className="subtitle">Enter your choices and let them battle!</p>

        <form onSubmit={addContestant} className="input-section">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter restaurant, movie, game, etc..."
            className="pixel-input"
            maxLength={30}
          />
          <button
            type="submit"
            className="pixel-button"
            disabled={contestants.length >= 8 || isLoadingLogo}
          >
            {isLoadingLogo ? 'Loading...' : 'Add'}
          </button>
        </form>

        <div className="contestants-list">
          <h3>Contestants ({contestants.length}/8)</h3>
          {contestants.length === 0 && (
            <p className="empty-message">No contestants yet. Add at least 2!</p>
          )}
          {contestants.map((contestant) => (
            <div key={contestant.id} className="contestant-item">
              <div
                className="contestant-avatar"
                style={{ backgroundColor: contestant.logo ? 'transparent' : contestant.color }}
              >
                {contestant.logo ? (
                  <img src={contestant.logo} alt={contestant.name} />
                ) : (
                  contestant.name.charAt(0).toUpperCase()
                )}
              </div>
              <span className="contestant-name">{contestant.name}</span>
              <button
                className="remove-btn"
                onClick={() => removeContestant(contestant.id)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <div className="settings-section">
          <h3>Battle Settings</h3>

          <div className="setting-item">
            <label>Battle Mode:</label>
            <select
              className="pixel-input"
              value={settings.mode}
              onChange={(e) => setSettings({ ...settings, mode: e.target.value })}
            >
              <option value="freeforall">Free For All</option>
              <option value="tournament">Tournament Bracket</option>
            </select>
          </div>

          <div className="setting-item">
            <label>Battle Speed:</label>
            <select
              className="pixel-input"
              value={settings.battleSpeed}
              onChange={(e) => setSettings({ ...settings, battleSpeed: Number(e.target.value) })}
            >
              <option value="500">Fast (0.5s)</option>
              <option value="1000">Normal (1s)</option>
              <option value="1500">Slow (1.5s)</option>
              <option value="2000">Very Slow (2s)</option>
            </select>
          </div>

          <div className="setting-item">
            <label>Starting HP:</label>
            <select
              className="pixel-input"
              value={settings.startingHP}
              onChange={(e) => setSettings({ ...settings, startingHP: Number(e.target.value) })}
            >
              <option value="50">50 HP</option>
              <option value="100">100 HP</option>
              <option value="150">150 HP</option>
              <option value="200">200 HP</option>
            </select>
          </div>
        </div>

        <button
          className="pixel-button start-button"
          onClick={handleStartBattle}
          disabled={contestants.length < 2}
        >
          ⚔️ Start Battle! ⚔️
        </button>
      </div>
    </div>
  )
}

export default SetupScreen
