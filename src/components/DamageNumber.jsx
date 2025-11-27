import { useEffect, useState } from 'react'
import './DamageNumber.css'

function DamageNumber({ damage, x, y, isCritical, attackIcon, onComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onComplete) onComplete()
    }, 1000)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div
      className={`damage-number ${isCritical ? 'critical' : ''}`}
      style={{
        left: `${x}px`,
        top: `${y}px`,
      }}
    >
      <span className="damage-icon">{attackIcon}</span>
      <span className="damage-value">{damage}</span>
      {isCritical && <span className="critical-text">CRITICAL!</span>}
    </div>
  )
}

export default DamageNumber
