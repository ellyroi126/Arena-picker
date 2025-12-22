import './HelpModal.css'
import { FIGHTER_CLASSES } from '../utils/classSystem'

function HelpModal({ isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <div className="help-modal-overlay" onClick={onClose}>
      <div className="help-modal pixel-container" onClick={(e) => e.stopPropagation()}>
        <div className="help-modal-header">
          <h2>📖 Game Guide</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="help-modal-content">
          <section className="help-section">
            <h3>⚔️ How to Play</h3>
            <p>1. Add 2-16 contestants (restaurants, movies, games, etc.)</p>
            <p>2. Choose battle mode: Free For All or Tournament</p>
            <p>3. Adjust battle speed and starting HP</p>
            <p>4. Watch them battle in the platformer arena!</p>
          </section>

          <section className="help-section">
            <h3>🎮 Controls & Features</h3>
            <p><strong>Battle Speed Hotkeys:</strong></p>
            <p>• <kbd>1</kbd> = Ultra Fast • <kbd>2</kbd> = Fast • <kbd>3</kbd> = Normal</p>
            <p>• <kbd>4</kbd> = Slow • <kbd>5</kbd> = Very Slow</p>
            <p><strong>Theme:</strong> Toggle with sun/moon button (top-right)</p>
          </section>

          <section className="help-section">
            <h3>🗡️ Fighter Classes</h3>
            <div className="class-grid">
              {FIGHTER_CLASSES.map((cls, index) => (
                <div key={index} className="class-item">
                  <div className="class-icon" style={{ backgroundColor: cls.color }}>
                    {cls.icon}
                  </div>
                  <div className="class-info">
                    <strong>{cls.name}</strong>
                    <div className="class-stats">
                      <span className="stat-badge hp">HP: {cls.stats.hpBonus > 0 ? '+' : ''}{cls.stats.hpBonus}</span>
                      <span className="stat-badge atk">ATK: +{cls.stats.attackBonus}</span>
                      <span className="stat-badge spd">SPD: {cls.stats.speed}x</span>
                    </div>
                    <div className="class-abilities">
                      {cls.abilities.join(', ')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="help-section">
            <h3>💡 Tips</h3>
            <p>• Fighters are randomly assigned classes with unique abilities</p>
            <p>• Higher attack = more damage, but lower HP = glass cannon</p>
            <p>• Fighters move on platforms and attack with visual effects</p>
            <p>• Your contestant list persists between battles</p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default HelpModal
