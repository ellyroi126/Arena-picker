import { useEffect } from 'react'
import './AttackEffect.css'

function AttackEffect({ fromX, fromY, toX, toY, icon, type, onComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onComplete) onComplete()
    }, 900)
    return () => clearTimeout(timer)
  }, [onComplete])

  const distance = Math.sqrt(Math.pow(toX - fromX, 2) + Math.pow(toY - fromY, 2))
  const angle = Math.atan2(toY - fromY, toX - fromX) * (180 / Math.PI)

  // Calculate arc control point (for curved trajectory)
  const midX = (fromX + toX) / 2
  const midY = (fromY + toY) / 2
  const arcHeight = distance * 0.15 // Arc height is 15% of distance

  // Perpendicular offset for arc
  const offsetX = -(toY - fromY) * arcHeight / distance
  const offsetY = (toX - fromX) * arcHeight / distance

  const controlX = midX + offsetX
  const controlY = midY + offsetY

  // Render different effects based on attack type
  const renderMeleeEffect = () => (
    <>
      {/* Wind-up at attacker */}
      <div className="melee-windup">
        <div className="windup-circle"></div>
        <div className="windup-circle windup-circle-2"></div>
      </div>

      {/* Slash effect traveling */}
      <div className="melee-slash-travel">
        <div className="slash-arc"></div>
        <div className="slash-trail"></div>
      </div>

      {/* Impact at target */}
      <div className="melee-impact">
        <div className="impact-ring"></div>
        <div className="impact-ring impact-ring-2"></div>
        <div className="impact-sparks">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="spark" style={{ '--spark-angle': `${i * 45}deg` }}></div>
          ))}
        </div>
      </div>
    </>
  )

  const renderMagicEffect = () => (
    <>
      {/* Charge-up at attacker */}
      <div className="magic-charge">
        <div className="charge-orb"></div>
        <div className="charge-particles">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="charge-particle" style={{ '--charge-angle': `${i * 60}deg` }}></div>
          ))}
        </div>
      </div>

      {/* Projectile traveling */}
      <div className="magic-projectile">
        <div className="magic-orb">
          <div className="orb-core"></div>
          <div className="orb-glow"></div>
        </div>
        <div className="magic-trail-container">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="magic-trail-particle" style={{ '--trail-delay': `${i * 0.03}s` }}></div>
          ))}
        </div>
      </div>

      {/* Impact at target */}
      <div className="magic-impact">
        <div className="magic-explosion"></div>
        <div className="magic-waves">
          <div className="magic-wave"></div>
          <div className="magic-wave magic-wave-2"></div>
        </div>
        {[...Array(12)].map((_, i) => (
          <div key={i} className="magic-spark" style={{ '--magic-angle': `${i * 30}deg` }}></div>
        ))}
      </div>
    </>
  )

  const renderRangedEffect = () => (
    <>
      {/* Draw back at attacker */}
      <div className="ranged-drawback">
        <div className="drawback-glow"></div>
      </div>

      {/* Projectile traveling */}
      <div className="ranged-projectile-container">
        <div className="ranged-arrow">
          <div className="arrow-head"></div>
          <div className="arrow-shaft"></div>
          <div className="arrow-fletching"></div>
        </div>
        <div className="ranged-trail">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="trail-segment" style={{ '--trail-delay': `${i * 0.04}s` }}></div>
          ))}
        </div>
      </div>

      {/* Impact at target */}
      <div className="ranged-impact">
        <div className="impact-flash"></div>
        <div className="impact-ripple"></div>
      </div>
    </>
  )

  const renderHeavyEffect = () => (
    <>
      {/* Wind-up at attacker */}
      <div className="heavy-windup">
        <div className="heavy-charge"></div>
        <div className="heavy-charge-ring"></div>
      </div>

      {/* Projectile traveling */}
      <div className="heavy-projectile-container">
        <div className="heavy-boulder">
          <div className="boulder-core"></div>
          <div className="boulder-cracks"></div>
        </div>
        <div className="heavy-distortion"></div>
      </div>

      {/* Impact at target */}
      <div className="heavy-impact">
        <div className="heavy-explosion"></div>
        <div className="shockwave-ring"></div>
        <div className="shockwave-ring shockwave-ring-2"></div>
        <div className="debris-container">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="debris" style={{ '--debris-angle': `${i * 36}deg` }}></div>
          ))}
        </div>
      </div>
    </>
  )

  return (
    <div
      className={`attack-effect attack-${type}`}
      style={{
        '--from-x': `${fromX}px`,
        '--from-y': `${fromY}px`,
        '--to-x': `${toX}px`,
        '--to-y': `${toY}px`,
        '--control-x': `${controlX}px`,
        '--control-y': `${controlY}px`,
        '--angle': `${angle}deg`,
        '--distance': `${distance}px`,
      }}
    >
      {type === 'melee' && renderMeleeEffect()}
      {type === 'magic' && renderMagicEffect()}
      {type === 'ranged' && renderRangedEffect()}
      {type === 'heavy' && renderHeavyEffect()}
    </div>
  )
}

export default AttackEffect
