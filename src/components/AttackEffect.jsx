import { useEffect } from 'react'
import './AttackEffect.css'

function AttackEffect({ fromX, fromY, toX, toY, icon, type, onComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onComplete) onComplete()
    }, 800)
    return () => clearTimeout(timer)
  }, [onComplete])

  const distance = Math.sqrt(Math.pow(toX - fromX, 2) + Math.pow(toY - fromY, 2))
  const angle = Math.atan2(toY - fromY, toX - fromX) * (180 / Math.PI)

  return (
    <div
      className={`attack-effect attack-${type}`}
      style={{
        left: `${fromX}px`,
        top: `${fromY}px`,
        '--target-x': `${toX - fromX}px`,
        '--target-y': `${toY - fromY}px`,
        '--rotation': `${angle}deg`,
      }}
    >
      <span className="attack-icon">{icon}</span>
      <div className="attack-trail"></div>
    </div>
  )
}

export default AttackEffect
