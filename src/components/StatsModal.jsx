import { useState } from 'react'
import './StatsModal.css'
import { getBattleHistory, getTopContestants, clearBattleHistory, getContestantRecord } from '../utils/battleHistory'

function StatsModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('leaderboard') // leaderboard, history, records

  if (!isOpen) return null

  const history = getBattleHistory()
  const topContestants = getTopContestants(15)

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all battle history and stats?')) {
      clearBattleHistory()
      window.location.reload()
    }
  }

  const formatDate = (isoString) => {
    const date = new Date(isoString)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
  }

  return (
    <div className="stats-modal-overlay" onClick={onClose}>
      <div className="stats-modal pixel-container" onClick={(e) => e.stopPropagation()}>
        <div className="stats-modal-header">
          <h2>📊 Battle Statistics</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="stats-tabs">
          <button
            className={`tab-btn ${activeTab === 'leaderboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('leaderboard')}
          >
            🏆 Leaderboard
          </button>
          <button
            className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            📜 History
          </button>
        </div>

        <div className="stats-modal-content">
          {activeTab === 'leaderboard' && (
            <div className="leaderboard-tab">
              {topContestants.length === 0 ? (
                <p className="empty-message">No battles yet! Start fighting to see stats.</p>
              ) : (
                <div className="leaderboard-list">
                  {topContestants.map((contestant, index) => {
                    const favClass = Object.entries(contestant.favoriteClass || {})
                      .sort(([, a], [, b]) => b - a)[0]

                    return (
                      <div key={contestant.name} className="leaderboard-item">
                        <div className="rank">#{index + 1}</div>
                        <div className="contestant-info">
                          <strong>{contestant.name}</strong>
                          <div className="stats-row">
                            <span className="stat">W: {contestant.wins}</span>
                            <span className="stat">L: {contestant.losses}</span>
                            <span className="stat win-rate">{contestant.winRate}%</span>
                            {favClass && <span className="stat fav-class">Fav: {favClass[0]}</span>}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="history-tab">
              {history.length === 0 ? (
                <p className="empty-message">No battle history yet!</p>
              ) : (
                <>
                  <div className="history-list">
                    {history.slice(0, 50).map((battle) => (
                      <div key={battle.id} className="history-item">
                        <div className="battle-date">{formatDate(battle.timestamp)}</div>
                        <div className="battle-info">
                          <strong>🏆 {battle.winner.name}</strong>
                          {battle.winner.class && <span className="class-badge">({battle.winner.class})</span>}
                        </div>
                        <div className="battle-details">
                          {battle.settings.mode === 'freeforall' ? 'Free For All' : 'Tournament'} •
                          {' '}{battle.contestants.length} contestants
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="pixel-button clear-history-btn" onClick={handleClearHistory}>
                    🗑️ Clear All History
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default StatsModal
