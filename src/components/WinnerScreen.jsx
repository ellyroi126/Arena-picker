import './WinnerScreen.css'

function WinnerScreen({ winner, onReset }) {
  return (
    <div className="winner-screen">
      <div className="winner-container pixel-container">
        <div className="trophy">🏆</div>
        <h1 className="winner-title">VICTORY!</h1>
        <div
          className="winner-avatar"
          style={{ backgroundColor: winner.logo ? 'transparent' : winner.color }}
        >
          {winner.logo ? (
            <img
              src={winner.logo}
              alt={winner.name}
              onError={(e) => {
                e.target.style.display = 'none'
                const parent = e.target.parentElement
                if (parent) {
                  parent.style.backgroundColor = winner.color
                  if (!parent.textContent || parent.textContent.trim() === '') {
                    parent.appendChild(document.createTextNode(winner.name.charAt(0).toUpperCase()))
                  }
                }
              }}
            />
          ) : (
            winner.name.charAt(0).toUpperCase()
          )}
        </div>
        <h2 className="winner-name">{winner.name}</h2>
        <p className="winner-subtitle">has conquered the arena!</p>

        <div className="winner-stats">
          <div className="stat-item">
            <div className="stat-label">Final HP</div>
            <div className="stat-value">{winner.hp}</div>
          </div>
        </div>

        <button className="pixel-button reset-button" onClick={onReset}>
          ⚔️ Battle Again ⚔️
        </button>
      </div>

      {/* Confetti effect */}
      <div className="confetti-container">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="confetti"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              backgroundColor: ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6'][Math.floor(Math.random() * 5)]
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default WinnerScreen
