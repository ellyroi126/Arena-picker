/**
 * Sound Effects System
 * Uses Web Audio API to generate simple sound effects
 */

class SoundEffects {
  constructor() {
    this.audioContext = null
    this.enabled = localStorage.getItem('soundEnabled') !== 'false'
    this.initAudioContext()
  }

  initAudioContext() {
    if (this.enabled && !this.audioContext) {
      try {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
      } catch (e) {
        console.warn('Web Audio API not supported')
        this.enabled = false
      }
    }
  }

  setEnabled(enabled) {
    this.enabled = enabled
    localStorage.setItem('soundEnabled', enabled.toString())
    if (enabled) {
      this.initAudioContext()
    }
  }

  playSound(type, frequency, duration, volume = 0.3) {
    if (!this.enabled || !this.audioContext) return

    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)

    oscillator.type = type
    oscillator.frequency.value = frequency
    gainNode.gain.value = volume

    oscillator.start()
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration)
    oscillator.stop(this.audioContext.currentTime + duration)
  }

  // Attack sounds
  hit() {
    this.playSound('square', 200, 0.1, 0.2)
  }

  criticalHit() {
    this.playSound('sawtooth', 300, 0.15, 0.3)
    setTimeout(() => this.playSound('sine', 500, 0.1, 0.2), 50)
  }

  magicAttack() {
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        this.playSound('sine', 400 + i * 200, 0.1, 0.15)
      }, i * 50)
    }
  }

  heavyAttack() {
    this.playSound('sawtooth', 100, 0.2, 0.3)
  }

  rangedAttack() {
    this.playSound('triangle', 600, 0.08, 0.15)
  }

  // Victory/Defeat sounds
  victory() {
    const notes = [262, 330, 392, 523] // C, E, G, C
    notes.forEach((freq, i) => {
      setTimeout(() => {
        this.playSound('sine', freq, 0.3, 0.2)
      }, i * 150)
    })
  }

  defeat() {
    this.playSound('sawtooth', 200, 0.5, 0.2)
    setTimeout(() => this.playSound('sawtooth', 150, 0.5, 0.2), 200)
  }

  // Jump sound
  jump() {
    this.playSound('sine', 300, 0.1, 0.1)
    setTimeout(() => this.playSound('sine', 400, 0.1, 0.1), 50)
  }
}

// Create singleton instance
const soundEffects = new SoundEffects()

export default soundEffects
