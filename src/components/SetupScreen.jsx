import { useState, useEffect } from 'react'
import './SetupScreen.css'
import { getBestLogo } from '../utils/logoFetcher'
import { getPresetCategories, getPresetContestants, getRandomFromPreset } from '../utils/presets'
import HelpModal from './HelpModal'
import StatsModal from './StatsModal'
import Tooltip from './Tooltip'

function SetupScreen({ onStartBattle, initialContestants = [] }) {
  const [contestants, setContestants] = useState(initialContestants)
  const [inputValue, setInputValue] = useState('')
  const [isLoadingLogo, setIsLoadingLogo] = useState(false)
  const [isHelpOpen, setIsHelpOpen] = useState(false)
  const [isStatsOpen, setIsStatsOpen] = useState(false)
  const [showPresets, setShowPresets] = useState(false)
  const [settings, setSettings] = useState({
    battleSpeed: 1500, // Default to Very Slow (rescaled)
    startingHP: 100,
    mode: 'freeforall',
    arenaPreset: 'random', // New: arena layout preset
  })

  // Update contestants if initialContestants changes
  useEffect(() => {
    if (initialContestants.length > 0) {
      setContestants(initialContestants)
    }
  }, [initialContestants])

  const addContestant = async (e) => {
    e.preventDefault()
    if (inputValue.trim() && contestants.length < 16) {
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

  const clearAllContestants = () => {
    setContestants([])
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

  const loadPreset = async (presetId, random = false) => {
    if (contestants.length >= 16) return

    setIsLoadingLogo(true)

    const names = random
      ? getRandomFromPreset(presetId, 16 - contestants.length)
      : getPresetContestants(presetId).slice(0, 16 - contestants.length)

    const newContestants = []
    for (const name of names) {
      const logo = await getBestLogo(name)
      newContestants.push({
        id: Date.now() + Math.random(),
        name: name,
        hp: settings.startingHP,
        maxHP: settings.startingHP,
        logo: logo,
        color: generateRandomColor(),
      })
    }

    setContestants([...contestants, ...newContestants])
    setIsLoadingLogo(false)
    setShowPresets(false)
  }

  return (
    <div className="setup-screen">
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      <StatsModal isOpen={isStatsOpen} onClose={() => setIsStatsOpen(false)} />

      <div className="setup-container pixel-container">
        <div className="title-row">
          <h1 className="title pixel-text">
            ⚔️ ARENA PICKER ⚔️
          </h1>
          <div className="header-buttons">
            <Tooltip content="View battle stats & leaderboard" position="left">
              <button
                className="stats-button pixel-button"
                onClick={() => setIsStatsOpen(true)}
              >
                📊
              </button>
            </Tooltip>
            <Tooltip content="View game guide and class info" position="left">
              <button
                className="help-button pixel-button"
                onClick={() => setIsHelpOpen(true)}
              >
                ❓
              </button>
            </Tooltip>
          </div>
        </div>
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
            disabled={contestants.length >= 16 || isLoadingLogo}
          >
            {isLoadingLogo ? 'Loading...' : 'Add'}
          </button>
        </form>

        {/* Preset Selection */}
        <div className="preset-section">
          <button
            className="pixel-button preset-toggle-btn"
            onClick={() => setShowPresets(!showPresets)}
            disabled={contestants.length >= 16 || isLoadingLogo}
          >
            {showPresets ? '✕ Hide Presets' : '⚡ Quick Fill with Presets'}
          </button>

          {showPresets && (
            <div className="preset-grid">
              {getPresetCategories().map((category) => (
                <div key={category.id} className="preset-card">
                  <div className="preset-header">
                    <span className="preset-icon">{category.icon}</span>
                    <span className="preset-name">{category.name}</span>
                    <span className="preset-count">({category.count})</span>
                  </div>
                  <div className="preset-actions">
                    <Tooltip content="Add all from this category" position="top">
                      <button
                        className="pixel-button preset-btn"
                        onClick={() => loadPreset(category.id, false)}
                        disabled={isLoadingLogo}
                      >
                        Add All
                      </button>
                    </Tooltip>
                    <Tooltip content="Add 8 random from this category" position="top">
                      <button
                        className="pixel-button preset-btn"
                        onClick={() => loadPreset(category.id, true)}
                        disabled={isLoadingLogo}
                      >
                        Random 8
                      </button>
                    </Tooltip>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="contestants-list">
          <div className="contestants-header">
            <h3>Contestants ({contestants.length}/16)</h3>
            {contestants.length > 0 && (
              <button
                className="pixel-button clear-all-btn"
                onClick={clearAllContestants}
              >
                🗑️ Clear All
              </button>
            )}
          </div>
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
            <label>Arena Layout:</label>
            <select
              className="pixel-input"
              value={settings.arenaPreset}
              onChange={(e) => setSettings({ ...settings, arenaPreset: e.target.value })}
            >
              <option value="random">🎲 Random</option>
              <option value="classic">⚔️ Classic</option>
              <option value="vertical">📏 Vertical Tower</option>
              <option value="symmetrical">⚖️ Symmetrical</option>
              <option value="chaotic">💥 Chaotic</option>
              <option value="minimal">📐 Minimal</option>
            </select>
          </div>

          <div className="setting-item">
            <label>Battle Speed:</label>
            <select
              className="pixel-input"
              value={settings.battleSpeed}
              onChange={(e) => setSettings({ ...settings, battleSpeed: Number(e.target.value) })}
            >
              <option value="300">Ultra Fast (0.3s)</option>
              <option value="600">Fast (0.6s)</option>
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
