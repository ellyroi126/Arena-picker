import { useEffect, useState } from 'react'
import './ParticleEffect.css'

function ParticleEffect({ x, y, type, onComplete }) {
  const [particles, setParticles] = useState([])

  useEffect(() => {
    // Generate particles based on type
    const particleCount = type === 'critical' ? 20 : 10
    const newParticles = []

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount
      const speed = type === 'critical' ? 80 + Math.random() * 40 : 50 + Math.random() * 30
      const size = type === 'critical' ? 6 + Math.random() * 4 : 4 + Math.random() * 3

      newParticles.push({
        id: i,
        x: 0,
        y: 0,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size,
        color: type === 'critical' ? '#ff0000' : getParticleColor(type),
        life: 1.0
      })
    }

    setParticles(newParticles)

    // Clean up after animation
    const timer = setTimeout(() => {
      if (onComplete) onComplete()
    }, 800)

    return () => clearTimeout(timer)
  }, [type])

  const getParticleColor = (effectType) => {
    switch (effectType) {
      case 'magic': return '#9b59b6'
      case 'fire': return '#e74c3c'
      case 'ice': return '#3498db'
      case 'lightning': return '#f1c40f'
      case 'poison': return '#2ecc71'
      case 'holy': return '#ecf0f1'
      case 'dark': return '#2c3e50'
      default: return '#e94560'
    }
  }

  return (
    <div className="particle-container" style={{ left: `${x}px`, top: `${y}px` }}>
      {particles.map(particle => (
        <div
          key={particle.id}
          className="particle"
          style={{
            '--vx': `${particle.vx}px`,
            '--vy': `${particle.vy}px`,
            '--size': `${particle.size}px`,
            backgroundColor: particle.color,
          }}
        />
      ))}
    </div>
  )
}

export default ParticleEffect
