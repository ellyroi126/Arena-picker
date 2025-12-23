import { useState, useEffect, useRef } from 'react'
import './ArenaScreen.css'
import TournamentBracket from './TournamentBracket'
import DamageNumber from './DamageNumber'
import AttackEffect from './AttackEffect'
import ParticleEffect from './ParticleEffect'
import {
  createTournamentBracket,
  getNextMatch,
  updateBracketWithWinner,
  getTournamentProgress,
  getTournamentChampion,
  processByeMatches,
} from '../utils/tournamentUtils'
import { assignRandomClass, getClassAttack } from '../utils/classSystem'
import { generateArenaLayout, getRandomPlatformPosition } from '../utils/platformSystem'
import soundEffects from '../utils/soundEffects'
import { saveBattleResult } from '../utils/battleHistory'

function ArenaScreen({ contestants, settings, onBattleEnd }) {
  const [fighters, setFighters] = useState([])
  const [battleLog, setBattleLog] = useState([])
  const [isAnimating, setIsAnimating] = useState(null) // Store fighter ID being attacked
  const [attackingFighter, setAttackingFighter] = useState(null) // Fighter lunging forward
  const [bracket, setBracket] = useState([])
  const [currentMatchInfo, setCurrentMatchInfo] = useState(null)
  const [damageNumbers, setDamageNumbers] = useState([])
  const [attackEffects, setAttackEffects] = useState([])
  const [particleEffects, setParticleEffects] = useState([]) // New: particle effects
  const [screenShake, setScreenShake] = useState(false)
  const [arenaLayout, setArenaLayout] = useState(null)
  const [fighterPositions, setFighterPositions] = useState({})
  const [movingFighters, setMovingFighters] = useState({}) // Track fighters currently moving
  const [fighterDirections, setFighterDirections] = useState({}) // Track which way fighters are facing
  const [battleSpeed, setBattleSpeed] = useState(settings.battleSpeed) // Dynamic battle speed
  const [battleStartTime, setBattleStartTime] = useState(null) // Track battle duration
  const battleLogRef = useRef(null)
  const arenaRef = useRef(null)
  const fighterRefs = useRef({})

  // New smooth movement system using refs for 60fps updates
  const fighterVelocities = useRef({}) // Velocity for each fighter
  const animationFrameId = useRef(null)
  const lastFrameTime = useRef(Date.now())

  const isTournamentMode = settings.mode === 'tournament'
  const isFreeForAllMode = settings.mode === 'freeforall'

  // Battle Speed Hotkeys
  useEffect(() => {
    const handleKeyPress = (e) => {
      const speedMap = {
        '1': 300,  // Ultra Fast
        '2': 600,  // Fast
        '3': 1000, // Normal
        '4': 1500, // Slow
        '5': 2000  // Very Slow
      }

      if (speedMap[e.key]) {
        setBattleSpeed(speedMap[e.key])
        const speedNames = {
          '1': 'Ultra Fast',
          '2': 'Fast',
          '3': 'Normal',
          '4': 'Slow',
          '5': 'Very Slow'
        }
        addLog(`⚡ Battle speed changed to ${speedNames[e.key]}`)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  // Initialize battle
  useEffect(() => {
    // Track battle start time
    setBattleStartTime(Date.now())

    // Generate arena layout with preset from settings
    const numFighters = isFreeForAllMode ? contestants.length : 2
    const layout = generateArenaLayout(1000, 500, numFighters, settings.arenaPreset || 'random')
    setArenaLayout(layout)

    if (isTournamentMode) {
      // Initialize tournament bracket
      let newBracket = createTournamentBracket(contestants)

      // Process bye matches (auto-advance fighters with no opponent)
      newBracket = processByeMatches(newBracket)
      setBracket(newBracket)

      // Check if tournament is already complete (only 1 contestant)
      const champion = getTournamentChampion(newBracket)
      if (champion) {
        addLog(`🏆 ${champion.name} is the TOURNAMENT CHAMPION! 🏆`)
        setTimeout(() => onBattleEnd(champion), 2000)
        return
      }

      // Get first match
      const nextMatch = getNextMatch(newBracket)
      if (nextMatch) {
        setCurrentMatchInfo(nextMatch)
        initializeFighters(nextMatch.match.fighter1, nextMatch.match.fighter2, layout.spawnPositions.slice(0, 2))
      } else {
        // No valid matches - tournament is complete
        const finalChampion = getTournamentChampion(newBracket)
        if (finalChampion) {
          addLog(`🏆 ${finalChampion.name} is the TOURNAMENT CHAMPION! 🏆`)
          setTimeout(() => onBattleEnd(finalChampion), 2000)
        }
      }
    } else if (isFreeForAllMode) {
      // Free For All mode - all contestants fight at once
      const allFighters = contestants.map((c, index) => {
        const fighterWithStats = {
          ...c,
          hp: settings.startingHP,
          maxHP: settings.startingHP,
          isAlive: true,
        }
        return assignRandomClass(fighterWithStats)
      })
      setFighters(allFighters)

      // Set initial positions from spawn positions
      const positions = {}
      allFighters.forEach((fighter, index) => {
        const spawn = layout.spawnPositions[index]
        positions[fighter.id] = { x: spawn.x, y: spawn.y }
      })
      setFighterPositions(positions)

      addLog(`⚔️ FREE FOR ALL! ${allFighters.length} contestants enter the arena!`)
      addLog(`🔥 Only one will remain standing!`)
    }
  }, [contestants, settings, isTournamentMode, isFreeForAllMode])

  const initializeFighters = (fighter1, fighter2, spawnPositions) => {
    const initialFighters = [fighter1, fighter2].map((f, index) => {
      const fighterWithStats = {
        ...f,
        hp: settings.startingHP,
        maxHP: settings.startingHP,
        isAlive: true,
      }
      return assignRandomClass(fighterWithStats)
    })
    setFighters(initialFighters)

    // Set initial positions from spawn positions
    if (spawnPositions && spawnPositions.length >= 2) {
      const positions = {}
      initialFighters.forEach((fighter, index) => {
        const spawn = spawnPositions[index]
        positions[fighter.id] = { x: spawn.x, y: spawn.y }
      })
      setFighterPositions(positions)
    }

    addLog(`⚔️ Battle begins! ${initialFighters[0].class.icon} ${fighter1.name} (${initialFighters[0].class.name}) vs ${initialFighters[1].class.icon} ${fighter2.name} (${initialFighters[1].class.name})`)
  }

  // Auto-scroll battle log
  useEffect(() => {
    if (battleLogRef.current) {
      battleLogRef.current.scrollTop = battleLogRef.current.scrollHeight
    }
  }, [battleLog])

  // Battle system
  useEffect(() => {
    if (fighters.length === 0) return

    const aliveFighters = fighters.filter(f => f.isAlive)

    // Check if battle is over
    if (aliveFighters.length === 1) {
      const winner = aliveFighters[0]
      addLog(`💀 All others have been defeated!`)
      addLog(`👑 ${winner.name} WINS!`)

      // Play victory sound
      soundEffects.victory()

      // Save battle result to history
      if (battleStartTime) {
        const battleDuration = Math.floor((Date.now() - battleStartTime) / 1000)
        saveBattleResult(winner, fighters, settings, battleDuration)
      }

      if (isTournamentMode && currentMatchInfo) {
        handleTournamentWinner(winner)
      } else {
        setTimeout(() => onBattleEnd(winner), 2000)
      }
      return
    }

    if (aliveFighters.length === 0) {
      // This shouldn't happen, but just in case
      return
    }

    // Continue battle
    const timer = setTimeout(() => {
      performAttack()
    }, battleSpeed)

    return () => clearTimeout(timer)
  }, [fighters, battleSpeed])

  // SMOOTH 60FPS MOVEMENT SYSTEM using requestAnimationFrame
  useEffect(() => {
    if (!arenaLayout || fighters.length === 0 || Object.keys(fighterPositions).length === 0) return

    const aliveFighters = fighters.filter(f => f.isAlive)
    if (aliveFighters.length === 0) return

    // Initialize velocities for all fighters
    aliveFighters.forEach(fighter => {
      if (!fighterVelocities.current[fighter.id]) {
        fighterVelocities.current[fighter.id] = {
          vx: 0, // Horizontal velocity (pixels per second)
          vy: 0, // Vertical velocity
          targetX: null,
          targetY: null,
          targetPlatform: null,
          isJumping: false,
          moveTimer: 0, // Time until next movement decision
        }
      }
    })

    // Smooth animation loop at 60fps
    const animate = () => {
      const now = Date.now()
      const deltaTime = (now - lastFrameTime.current) / 1000 // Convert to seconds
      lastFrameTime.current = now

      const newPositions = { ...fighterPositions }
      const newDirections = { ...fighterDirections }
      const newMovingStates = { ...movingFighters }

      aliveFighters.forEach(fighter => {
        const vel = fighterVelocities.current[fighter.id]
        const currentPos = fighterPositions[fighter.id]

        if (!vel || !currentPos) return

        // Decrease movement timer
        vel.moveTimer -= deltaTime

        // Make new movement decision every 0.6-1.2 seconds (constant repositioning)
        if (vel.moveTimer <= 0 && !vel.isJumping) {
          vel.moveTimer = 0.6 + Math.random() * 0.6

          // Find current platform
          const currentPlatform = arenaLayout.platforms.find(p =>
            Math.abs(p.y - (currentPos.y + 100)) < 20
          )

          if (!currentPlatform) return

          // Get all alive enemies for strategic positioning
          const enemies = aliveFighters.filter(f => f.id !== fighter.id)
          const closestEnemy = enemies.length > 0 ? enemies.reduce((closest, enemy) => {
            const enemyPos = fighterPositions[enemy.id]
            if (!enemyPos) return closest

            const dist = Math.hypot(enemyPos.x - currentPos.x, enemyPos.y - currentPos.y)
            const closestDist = closest ? Math.hypot(fighterPositions[closest.id].x - currentPos.x, fighterPositions[closest.id].y - currentPos.y) : Infinity

            return dist < closestDist ? enemy : closest
          }, null) : null

          // STRATEGIC AI BASED ON CLASS
          const strategy = fighter.aiStrategy || 'balanced'
          const attackRange = fighter.attackRange || 100

          let targetPlatform = null
          let targetX = null
          let targetY = null
          let shouldMove = true

          if (closestEnemy && fighterPositions[closestEnemy.id]) {
            const enemyPos = fighterPositions[closestEnemy.id]
            const distToEnemy = Math.hypot(enemyPos.x - currentPos.x, enemyPos.y - currentPos.y)
            const enemyPlatform = arenaLayout.platforms.find(p =>
              Math.abs(p.y - (enemyPos.y + 100)) < 20
            )

            switch (strategy) {
              case 'aggressive': // Melee - chase enemies, get close
                if (distToEnemy > attackRange * 0.8) {
                  // Too far - move toward enemy
                  if (enemyPlatform && enemyPlatform.id !== currentPlatform.id) {
                    // Jump to enemy's platform
                    targetPlatform = enemyPlatform
                    targetX = enemyPos.x + (Math.random() * 100 - 50) // Near enemy
                    targetY = enemyPlatform.y - 100
                  } else {
                    // Walk toward enemy on same platform
                    const direction = enemyPos.x > currentPos.x ? 1 : -1
                    vel.vx = (80 + Math.random() * 40) * direction // Fast approach
                    vel.vy = 0
                    newDirections[fighter.id] = direction > 0 ? 'right' : 'left'
                    newMovingStates[fighter.id] = 'walking'
                  }
                } else {
                  // In range - keep attacking position
                  const direction = enemyPos.x > currentPos.x ? 1 : -1
                  vel.vx = (30 + Math.random() * 20) * direction // Small adjustments
                  vel.vy = 0
                  newDirections[fighter.id] = direction > 0 ? 'right' : 'left'
                  newMovingStates[fighter.id] = 'walking'
                }
                break

              case 'sniper': // Rangers, Gunners - seek high ground, keep distance
                const highestPlatform = arenaLayout.platforms.reduce((highest, p) =>
                  p.y < (highest?.y || Infinity) ? p : highest, null
                )

                if (highestPlatform && currentPlatform.id !== highestPlatform.id && distToEnemy < attackRange * 1.2) {
                  // Move to high ground
                  targetPlatform = highestPlatform
                  targetX = highestPlatform.x + Math.random() * (highestPlatform.width - 100) + 50
                  targetY = highestPlatform.y - 100
                } else if (distToEnemy < attackRange * 0.7) {
                  // Too close - retreat
                  const awayDirection = enemyPos.x > currentPos.x ? -1 : 1
                  vel.vx = (60 + Math.random() * 40) * awayDirection
                  vel.vy = 0
                  newDirections[fighter.id] = awayDirection > 0 ? 'right' : 'left'
                  newMovingStates[fighter.id] = 'walking'
                } else {
                  // Good position - small adjustments
                  vel.vx = (20 + Math.random() * 20) * (Math.random() < 0.5 ? -1 : 1)
                  vel.vy = 0
                  newDirections[fighter.id] = enemyPos.x > currentPos.x ? 'right' : 'left'
                  newMovingStates[fighter.id] = 'walking'
                }
                break

              case 'caster': // Mages - maintain medium distance, prefer elevation
                const optimalDist = attackRange * 0.6
                if (distToEnemy < optimalDist * 0.7) {
                  // Too close - back away
                  const awayDirection = enemyPos.x > currentPos.x ? -1 : 1
                  vel.vx = (50 + Math.random() * 30) * awayDirection
                  vel.vy = 0
                  newDirections[fighter.id] = awayDirection > 0 ? 'right' : 'left'
                  newMovingStates[fighter.id] = 'walking'
                } else if (distToEnemy > optimalDist * 1.5 && enemyPlatform) {
                  // Too far - get closer
                  if (enemyPlatform.id !== currentPlatform.id) {
                    targetPlatform = enemyPlatform
                    targetX = enemyPos.x + (Math.random() * 200 - 100)
                    targetY = enemyPlatform.y - 100
                  } else {
                    const towardDirection = enemyPos.x > currentPos.x ? 1 : -1
                    vel.vx = (40 + Math.random() * 30) * towardDirection
                    vel.vy = 0
                    newDirections[fighter.id] = towardDirection > 0 ? 'right' : 'left'
                    newMovingStates[fighter.id] = 'walking'
                  }
                } else {
                  // Good range - circle around
                  vel.vx = (30 + Math.random() * 20) * (Math.random() < 0.5 ? -1 : 1)
                  vel.vy = 0
                  newDirections[fighter.id] = enemyPos.x > currentPos.x ? 'right' : 'left'
                  newMovingStates[fighter.id] = 'walking'
                }
                break

              case 'flanker': // Assassins - circle enemies, attack from sides
                const angle = Math.atan2(enemyPos.y - currentPos.y, enemyPos.x - currentPos.x)
                const circleRadius = attackRange * 0.8
                const circleX = enemyPos.x + Math.cos(angle + Math.PI / 2) * circleRadius
                const circleY = enemyPos.y + Math.sin(angle + Math.PI / 2) * circleRadius

                const circlePlatform = arenaLayout.platforms.find(p =>
                  Math.abs(p.y - (circleY + 100)) < 30
                )

                if (circlePlatform && circlePlatform.id !== currentPlatform.id) {
                  targetPlatform = circlePlatform
                  targetX = circleX
                  targetY = circlePlatform.y - 100
                } else {
                  // Circle on same platform
                  const circleDir = Math.random() < 0.5 ? -1 : 1
                  vel.vx = (70 + Math.random() * 40) * circleDir
                  vel.vy = 0
                  newDirections[fighter.id] = circleDir > 0 ? 'right' : 'left'
                  newMovingStates[fighter.id] = 'walking'
                }
                break

              case 'kiting': // Hit and run - maintain distance, constantly reposition
                if (distToEnemy < attackRange * 0.8) {
                  // Back away
                  const awayDir = enemyPos.x > currentPos.x ? -1 : 1
                  vel.vx = (70 + Math.random() * 40) * awayDir
                  vel.vy = 0
                  newDirections[fighter.id] = awayDir > 0 ? 'right' : 'left'
                  newMovingStates[fighter.id] = 'walking'
                } else {
                  // Keep moving around
                  vel.vx = (50 + Math.random() * 30) * (Math.random() < 0.5 ? -1 : 1)
                  vel.vy = 0
                  newDirections[fighter.id] = enemyPos.x > currentPos.x ? 'right' : 'left'
                  newMovingStates[fighter.id] = 'walking'
                }
                break

              case 'defensive': // Tanks, Priests - hold position, minor adjustments
                // Stay mostly in place, small movements
                vel.vx = (20 + Math.random() * 20) * (Math.random() < 0.5 ? -1 : 1)
                vel.vy = 0
                newDirections[fighter.id] = enemyPos.x > currentPos.x ? 'right' : 'left'
                newMovingStates[fighter.id] = 'walking'
                break

              case 'balanced': // Monks, Taoists - adapt to situation
              default:
                if (distToEnemy > attackRange * 0.9) {
                  // Move closer
                  const towardDir = enemyPos.x > currentPos.x ? 1 : -1
                  vel.vx = (60 + Math.random() * 30) * towardDir
                  vel.vy = 0
                  newDirections[fighter.id] = towardDir > 0 ? 'right' : 'left'
                  newMovingStates[fighter.id] = 'walking'
                } else if (distToEnemy < attackRange * 0.4) {
                  // Back up a bit
                  const awayDir = enemyPos.x > currentPos.x ? -1 : 1
                  vel.vx = (40 + Math.random() * 30) * awayDir
                  vel.vy = 0
                  newDirections[fighter.id] = awayDir > 0 ? 'right' : 'left'
                  newMovingStates[fighter.id] = 'walking'
                } else {
                  // Good range
                  const direction = enemyPos.x > currentPos.x ? 1 : -1
                  vel.vx = (40 + Math.random() * 20) * direction
                  vel.vy = 0
                  newDirections[fighter.id] = direction > 0 ? 'right' : 'left'
                  newMovingStates[fighter.id] = 'walking'
                }
                break
            }

            // Execute platform jump if target was set
            if (targetPlatform && targetX !== null) {
              vel.targetPlatform = targetPlatform
              vel.targetX = targetX
              vel.targetY = targetY
              vel.isJumping = true

              const dx = targetX - currentPos.x
              const dy = targetY - currentPos.y
              const jumpDuration = 0.6

              vel.vx = dx / jumpDuration
              vel.vy = dy / jumpDuration

              newDirections[fighter.id] = dx > 0 ? 'right' : 'left'
              newMovingStates[fighter.id] = 'jumping'

              soundEffects.jump()

              setTimeout(() => {
                vel.isJumping = false
                vel.vx = 0
                vel.vy = 0
                vel.targetX = null
                vel.targetY = null
                delete newMovingStates[fighter.id]
              }, jumpDuration * 1000)
            } else if (vel.vx !== 0) {
              // Stop walking after 0.5-1 seconds
              const walkDuration = 0.5 + Math.random() * 0.5
              setTimeout(() => {
                if (!vel.isJumping) {
                  vel.vx = 0
                  delete newMovingStates[fighter.id]
                }
              }, walkDuration * 1000)
            }
          } else {
            // No enemies - idle or explore randomly
            const direction = Math.random() < 0.5 ? -1 : 1
            vel.vx = (30 + Math.random() * 30) * direction
            vel.vy = 0
            newDirections[fighter.id] = direction > 0 ? 'right' : 'left'
            newMovingStates[fighter.id] = 'walking'

            setTimeout(() => {
              if (!vel.isJumping) {
                vel.vx = 0
                delete newMovingStates[fighter.id]
              }
            }, 1000)
          }
        }

        // Apply velocity to position (smooth physics)
        if (!vel.isJumping && vel.vx !== 0) {
          // Walking on platform
          const currentPlatform = arenaLayout.platforms.find(p =>
            Math.abs(p.y - (currentPos.y + 100)) < 20
          )

          if (currentPlatform) {
            let newX = currentPos.x + (vel.vx * deltaTime)

            // Keep within platform bounds
            newX = Math.max(currentPlatform.x + 50, Math.min(currentPlatform.x + currentPlatform.width - 50, newX))

            newPositions[fighter.id] = {
              ...currentPos,
              x: newX,
              y: currentPos.y
            }
          }
        } else if (vel.isJumping) {
          // Jumping between platforms
          const newX = currentPos.x + (vel.vx * deltaTime)
          const newY = currentPos.y + (vel.vy * deltaTime)

          newPositions[fighter.id] = {
            ...currentPos,
            x: newX,
            y: newY
          }
        }
      })

      setFighterPositions(newPositions)
      setFighterDirections(newDirections)
      setMovingFighters(newMovingStates)

      // Continue animation loop
      animationFrameId.current = requestAnimationFrame(animate)
    }

    // Start animation loop
    lastFrameTime.current = Date.now()
    animationFrameId.current = requestAnimationFrame(animate)

    // Cleanup
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
    }
  }, [arenaLayout, fighters, fighterPositions, fighterDirections, movingFighters])

  const handleTournamentWinner = (winner) => {
    // Update bracket with winner
    let updatedBracket = updateBracketWithWinner(
      bracket,
      currentMatchInfo.roundIndex,
      currentMatchInfo.matchIndex,
      winner
    )

    // Process any bye matches that may have been created
    updatedBracket = processByeMatches(updatedBracket)
    setBracket(updatedBracket)

    // Check if tournament is complete
    const champion = getTournamentChampion(updatedBracket)
    if (champion) {
      addLog(`🏆 ${champion.name} is the TOURNAMENT CHAMPION! 🏆`)
      setTimeout(() => onBattleEnd(champion), 3000)
    } else {
      // Get next match
      setTimeout(() => {
        const nextMatch = getNextMatch(updatedBracket)
        if (nextMatch) {
          // Clear previous match state
          setFighters([])
          setFighterPositions({})
          setMovingFighters({})
          setBattleLog([])

          // Small delay to ensure state clears
          setTimeout(() => {
            setCurrentMatchInfo(nextMatch)
            const progress = getTournamentProgress(updatedBracket)
            addLog(`📊 Round ${progress.currentRound} of ${progress.totalRounds}`)

            // Generate new arena layout for the next match with same preset
            const newLayout = generateArenaLayout(1000, 500, 2, settings.arenaPreset || 'random')
            setArenaLayout(newLayout)

            // Initialize fighters with new spawn positions
            initializeFighters(nextMatch.match.fighter1, nextMatch.match.fighter2, newLayout.spawnPositions.slice(0, 2))
          }, 100)
        } else {
          // No more matches, tournament must be complete
          const finalChampion = getTournamentChampion(updatedBracket)
          if (finalChampion) {
            addLog(`🏆 ${finalChampion.name} is the TOURNAMENT CHAMPION! 🏆`)
            setTimeout(() => onBattleEnd(finalChampion), 3000)
          }
        }
      }, 2000)
    }
  }

  const performAttack = () => {
    const aliveFighters = fighters.filter(f => f.isAlive)

    if (aliveFighters.length < 2) return

    // Randomly select attacker
    const attackerIndex = Math.floor(Math.random() * aliveFighters.length)
    const attacker = aliveFighters[attackerIndex]

    // Find valid targets within attack range, with their distances
    const potentialTargets = aliveFighters
      .map((f, idx) => {
        if (idx === attackerIndex) return null // Can't attack self

        const attackerPos = fighterPositions[attacker.id]
        const targetPos = fighterPositions[f.id]

        if (!attackerPos || !targetPos) return null

        // Calculate distance
        const distance = Math.hypot(targetPos.x - attackerPos.x, targetPos.y - attackerPos.y)

        // Check if in attack range
        const attackRange = attacker.attackRange || 100
        if (distance <= attackRange) {
          return { fighter: f, distance }
        }
        return null
      })
      .filter(target => target !== null)

    // Select target - prefer closest enemy
    let defender
    if (potentialTargets.length > 0) {
      // Sort by distance and pick the closest
      potentialTargets.sort((a, b) => a.distance - b.distance)
      defender = potentialTargets[0].fighter
    } else {
      // Fallback: attack any other fighter (out of range attack for stuck situations)
      let defenderIndex = Math.floor(Math.random() * aliveFighters.length)
      while (defenderIndex === attackerIndex && aliveFighters.length > 1) {
        defenderIndex = Math.floor(Math.random() * aliveFighters.length)
      }
      defender = aliveFighters[defenderIndex]
    }

    // Generate attack using class abilities
    const attack = getClassAttack(attacker.class)
    const isCritical = Math.random() < 0.15 // 15% crit chance

    // Base damage + attack bonus from class
    const baseDamage = getRandomDamage(10, 20)
    let damage = baseDamage + (attacker.attackBonus || 0)

    if (isCritical) {
      damage = Math.floor(damage * 1.5) // Critical hits deal 50% more damage
    }

    // Play attack sound based on type
    if (isCritical) {
      soundEffects.criticalHit()
    } else if (attack.type === 'magic') {
      soundEffects.magicAttack()
    } else if (attack.type === 'heavy') {
      soundEffects.heavyAttack()
    } else if (attack.type === 'ranged') {
      soundEffects.rangedAttack()
    } else {
      soundEffects.hit()
    }

    // Get fighter positions for visual effects
    const attackerEl = fighterRefs.current[attacker.id]
    const defenderEl = fighterRefs.current[defender.id]

    if (attackerEl && defenderEl && arenaRef.current) {
      const arenaRect = arenaRef.current.getBoundingClientRect()
      const attackerRect = attackerEl.getBoundingClientRect()
      const defenderRect = defenderEl.getBoundingClientRect()

      const fromX = attackerRect.left + attackerRect.width / 2 - arenaRect.left
      const fromY = attackerRect.top + attackerRect.height / 2 - arenaRect.top
      const toX = defenderRect.left + defenderRect.width / 2 - arenaRect.left
      const toY = defenderRect.top + defenderRect.height / 2 - arenaRect.top

      // Create attack effect (projectile)
      const effectId = Date.now() + Math.random()
      setAttackEffects(prev => [...prev, {
        id: effectId,
        fromX,
        fromY,
        toX,
        toY,
        icon: attack.icon,
        type: attack.type
      }])

      // Remove attack effect after animation
      setTimeout(() => {
        setAttackEffects(prev => prev.filter(e => e.id !== effectId))

        // Show damage number after projectile hits
        const damageId = Date.now() + Math.random()
        setDamageNumbers(prev => [...prev, {
          id: damageId,
          damage,
          x: toX,
          y: toY - 30,
          isCritical,
          icon: attack.icon
        }])

        // Add particle effect on hit
        const particleType = isCritical ? 'critical' : attack.type
        const particleId = Date.now() + Math.random() + 1000
        setParticleEffects(prev => [...prev, {
          id: particleId,
          x: toX,
          y: toY,
          type: particleType
        }])

        // Remove damage number and particles after animation
        setTimeout(() => {
          setDamageNumbers(prev => prev.filter(d => d.id !== damageId))
          setParticleEffects(prev => prev.filter(p => p.id !== particleId))
        }, 1000)
      }, 600)
    }

    // Screen shake on heavy hits
    if (damage >= 25 || isCritical) {
      setScreenShake(true)
      setTimeout(() => setScreenShake(false), 300)
    }

    // Trigger attack lunge animation
    setAttackingFighter(attacker.id)
    setTimeout(() => setAttackingFighter(null), 400)

    // Apply damage with knockback animation
    setIsAnimating(defender.id)
    setTimeout(() => setIsAnimating(null), 500)

    // Update fighters
    const newFighters = fighters.map(f => {
      if (f.id === defender.id) {
        const newHP = Math.max(0, f.hp - damage)
        return {
          ...f,
          hp: newHP,
          isAlive: newHP > 0
        }
      }
      return f
    })

    setFighters(newFighters)

    // Log the attack
    const criticalText = isCritical ? ' CRITICAL HIT!' : ''
    addLog(`${attack.icon} ${attacker.name} uses ${attack.name}! Deals ${damage} damage to ${defender.name}${criticalText}`)

    // Check if defender was eliminated
    const newHP = Math.max(0, defender.hp - damage)
    if (newHP === 0) {
      addLog(`💀 ${defender.name} has been eliminated!`)
      soundEffects.defeat() // Play defeat sound
    }
  }

  const getRandomDamage = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  const addLog = (message) => {
    setBattleLog(prev => [...prev, { id: Date.now() + Math.random(), text: message }])
  }

  const getHPPercentage = (hp, maxHP) => {
    return (hp / maxHP) * 100
  }

  const getHPColor = (percentage) => {
    if (percentage > 60) return 'var(--hp-green)'
    if (percentage > 30) return 'var(--hp-yellow)'
    return 'var(--hp-red)'
  }

  if (fighters.length === 0) {
    return <div className="arena-screen">Loading...</div>
  }

  return (
    <div className={`arena-screen ${screenShake ? 'screen-shake' : ''}`}>
      <div className="arena-container" ref={arenaRef}>
        {/* Render attack effects */}
        {attackEffects.map(effect => (
          <AttackEffect
            key={effect.id}
            fromX={effect.fromX}
            fromY={effect.fromY}
            toX={effect.toX}
            toY={effect.toY}
            icon={effect.icon}
            type={effect.type}
            onComplete={() => {}}
          />
        ))}

        {/* Render particle effects */}
        {particleEffects.map(effect => (
          <ParticleEffect
            key={effect.id}
            x={effect.x}
            y={effect.y}
            type={effect.type}
            onComplete={() => {}}
          />
        ))}

        {/* Render damage numbers */}
        {damageNumbers.map(dmg => (
          <DamageNumber
            key={dmg.id}
            damage={dmg.damage}
            x={dmg.x}
            y={dmg.y}
            isCritical={dmg.isCritical}
            attackIcon={dmg.icon}
            onComplete={() => {}}
          />
        ))}

        <div className="arena-header">
          <h2 className="arena-title">
            {isFreeForAllMode ? '⚔️ FREE FOR ALL ⚔️' : '⚔️ BATTLE ARENA ⚔️'}
          </h2>
          {isTournamentMode && currentMatchInfo && (
            <div className="tournament-info">
              <div className="round-counter">
                Round {getTournamentProgress(bracket).currentRound} / {getTournamentProgress(bracket).totalRounds}
              </div>
            </div>
          )}
          {isFreeForAllMode && (
            <div className="ffa-counter">
              {fighters.filter(f => f.isAlive).length} / {fighters.length} Alive
            </div>
          )}
        </div>

        {isTournamentMode && bracket.length > 0 && (
          <TournamentBracket
            bracket={bracket}
            currentMatch={currentMatchInfo ? currentMatchInfo.match : null}
          />
        )}

        {isFreeForAllMode ? (
          // Free For All - Multi-level platformer arena
          <div className="battle-stage platformer-arena ffa-platformer">
            {/* Arena background layers */}
            <div className="arena-bg-layer far-bg"></div>
            <div className="arena-bg-layer mid-bg"></div>

            {/* Render platforms */}
            {arenaLayout && arenaLayout.platforms.map(platform => (
              <div
                key={platform.id}
                className="arena-platform"
                style={{
                  position: 'absolute',
                  left: `${platform.x}px`,
                  top: `${platform.y}px`,
                  width: `${platform.width}px`,
                  height: `${platform.height}px`,
                  background: `linear-gradient(180deg, ${platform.color} 0%, var(--bg-dark) 100%)`,
                  borderTop: platform.id === 'ground' ? '3px solid var(--accent-primary)' : '2px solid var(--border-color)',
                  boxShadow: platform.id === 'ground' ? '0 -4px 20px rgba(233, 69, 96, 0.3)' : 'none',
                }}
              />
            ))}

            {/* Render obstacles */}
            {arenaLayout && arenaLayout.obstacles.map(obstacle => (
              <div
                key={obstacle.id}
                className="arena-obstacle"
                style={{
                  position: 'absolute',
                  left: `${obstacle.x}px`,
                  top: `${obstacle.y}px`,
                  width: `${obstacle.width}px`,
                  height: `${obstacle.height}px`,
                  backgroundColor: obstacle.color,
                  border: '2px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                }}
              >
                {obstacle.icon}
              </div>
            ))}

            {/* Render all FFA fighters on platforms */}
            {fighters.map((fighter) => fighterPositions[fighter.id] && (
              <div
                key={fighter.id}
                ref={el => fighterRefs.current[fighter.id] = el}
                className={`fighter fighter-sprite ffa-fighter-sprite
                  ${!fighter.isAlive ? 'eliminated' : ''}
                  ${isAnimating === fighter.id ? 'hit-reaction' : ''}
                  ${attackingFighter === fighter.id ? 'attacking' : ''}
                  ${movingFighters[fighter.id] === 'jumping' ? 'jumping' : ''}
                  ${movingFighters[fighter.id] === 'walking' ? 'walking' : ''}
                  ${fighterDirections[fighter.id] === 'left' ? 'facing-left' : 'facing-right'}`}
                style={{
                  left: `${fighterPositions[fighter.id].x}px`,
                  top: `${fighterPositions[fighter.id].y}px`,
                  '--jump-height': movingFighters[fighter.id] === 'jumping' ? `${fighterPositions[fighter.id].jumpHeight || 60}px` : '0px',
                }}
              >
                <div
                  className="sprite-avatar"
                  style={{ backgroundColor: fighter.logo ? 'transparent' : fighter.color }}
                >
                  {fighter.logo ? (
                    <img
                      src={fighter.logo}
                      alt={fighter.name}
                      onError={(e) => {
                        e.target.style.display = 'none'
                        e.target.parentElement.style.backgroundColor = fighter.color
                        e.target.parentElement.innerHTML = fighter.name.charAt(0).toUpperCase() + (e.target.parentElement.querySelector('.skull-overlay-mini') ? '<div class="skull-overlay-mini">💀</div>' : '')
                      }}
                    />
                  ) : (
                    fighter.name.charAt(0).toUpperCase()
                  )}
                  {!fighter.isAlive && <div className="skull-overlay-mini">💀</div>}
                </div>
                <div className="sprite-info">
                  <div className="sprite-class-badge" style={{ backgroundColor: fighter.class?.color || 'var(--accent-secondary)' }}>
                    {fighter.class?.icon}
                  </div>
                  <div className="sprite-hp-bar">
                    <div
                      className="sprite-hp-fill"
                      style={{
                        width: `${getHPPercentage(fighter.hp, fighter.maxHP)}%`,
                        backgroundColor: getHPColor(getHPPercentage(fighter.hp, fighter.maxHP))
                      }}
                    />
                  </div>
                  <div className="sprite-name-tooltip">{fighter.name} - {fighter.class?.name}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Tournament mode - Multi-level platformer arena
          <div className="battle-stage platformer-arena">
            {/* Arena background layers */}
            <div className="arena-bg-layer far-bg"></div>
            <div className="arena-bg-layer mid-bg"></div>

            {/* Render platforms */}
            {arenaLayout && arenaLayout.platforms.map(platform => (
              <div
                key={platform.id}
                className="arena-platform"
                style={{
                  position: 'absolute',
                  left: `${platform.x}px`,
                  top: `${platform.y}px`,
                  width: `${platform.width}px`,
                  height: `${platform.height}px`,
                  background: `linear-gradient(180deg, ${platform.color} 0%, var(--bg-dark) 100%)`,
                  borderTop: platform.id === 'ground' ? '3px solid var(--accent-primary)' : '2px solid var(--border-color)',
                  boxShadow: platform.id === 'ground' ? '0 -4px 20px rgba(233, 69, 96, 0.3)' : 'none',
                }}
              />
            ))}

            {/* Render obstacles */}
            {arenaLayout && arenaLayout.obstacles.map(obstacle => (
              <div
                key={obstacle.id}
                className="arena-obstacle"
                style={{
                  position: 'absolute',
                  left: `${obstacle.x}px`,
                  top: `${obstacle.y}px`,
                  width: `${obstacle.width}px`,
                  height: `${obstacle.height}px`,
                  backgroundColor: obstacle.color,
                  border: '2px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                }}
              >
                {obstacle.icon}
              </div>
            ))}

            {/* Fighter 1 - Dynamic position */}
            {fighters[0] && fighterPositions[fighters[0].id] && (
              <div
                ref={el => fighterRefs.current[fighters[0].id] = el}
                className={`fighter fighter-sprite
                  ${isAnimating === fighters[0].id ? 'hit-reaction' : ''}
                  ${attackingFighter === fighters[0].id ? 'attacking' : ''}
                  ${movingFighters[fighters[0].id] === 'jumping' ? 'jumping' : ''}
                  ${movingFighters[fighters[0].id] === 'walking' ? 'walking' : ''}
                  ${fighterDirections[fighters[0].id] === 'left' ? 'facing-left' : 'facing-right'}`}
                style={{
                  left: `${fighterPositions[fighters[0].id].x}px`,
                  top: `${fighterPositions[fighters[0].id].y}px`,
                  '--jump-height': movingFighters[fighters[0].id] === 'jumping' ? `${fighterPositions[fighters[0].id].jumpHeight || 60}px` : '0px',
                }}
              >
                <div
                  className="sprite-avatar"
                  style={{ backgroundColor: fighters[0].logo ? 'transparent' : fighters[0].color }}
                >
                  {fighters[0].logo ? (
                    <img
                      src={fighters[0].logo}
                      alt={fighters[0].name}
                      onError={(e) => {
                        e.target.style.display = 'none'
                        e.target.parentElement.style.backgroundColor = fighters[0].color
                        e.target.parentElement.textContent = fighters[0].name.charAt(0).toUpperCase()
                      }}
                    />
                  ) : (
                    fighters[0].name.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="sprite-info">
                  <div className="sprite-class-badge" style={{ backgroundColor: fighters[0].class?.color || 'var(--accent-secondary)' }}>
                    {fighters[0].class?.icon}
                  </div>
                  <div className="sprite-hp-bar">
                    <div
                      className="sprite-hp-fill"
                      style={{
                        width: `${getHPPercentage(fighters[0].hp, fighters[0].maxHP)}%`,
                        backgroundColor: getHPColor(getHPPercentage(fighters[0].hp, fighters[0].maxHP))
                      }}
                    />
                  </div>
                  <div className="sprite-name-tooltip">{fighters[0].name} - {fighters[0].class?.name}</div>
                </div>
              </div>
            )}

            <div className="vs-text">VS</div>

            {/* Fighter 2 - Dynamic position */}
            {fighters[1] && fighterPositions[fighters[1].id] && (
              <div
                ref={el => fighterRefs.current[fighters[1].id] = el}
                className={`fighter fighter-sprite
                  ${isAnimating === fighters[1].id ? 'hit-reaction' : ''}
                  ${attackingFighter === fighters[1].id ? 'attacking' : ''}
                  ${movingFighters[fighters[1].id] === 'jumping' ? 'jumping' : ''}
                  ${movingFighters[fighters[1].id] === 'walking' ? 'walking' : ''}
                  ${fighterDirections[fighters[1].id] === 'left' ? 'facing-left' : 'facing-right'}`}
                style={{
                  left: `${fighterPositions[fighters[1].id].x}px`,
                  top: `${fighterPositions[fighters[1].id].y}px`,
                  '--jump-height': movingFighters[fighters[1].id] === 'jumping' ? `${fighterPositions[fighters[1].id].jumpHeight || 60}px` : '0px',
                }}
              >
                <div
                  className="sprite-avatar"
                  style={{ backgroundColor: fighters[1].logo ? 'transparent' : fighters[1].color }}
                >
                  {fighters[1].logo ? (
                    <img
                      src={fighters[1].logo}
                      alt={fighters[1].name}
                      onError={(e) => {
                        e.target.style.display = 'none'
                        e.target.parentElement.style.backgroundColor = fighters[1].color
                        e.target.parentElement.textContent = fighters[1].name.charAt(0).toUpperCase()
                      }}
                    />
                  ) : (
                    fighters[1].name.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="sprite-info">
                  <div className="sprite-class-badge" style={{ backgroundColor: fighters[1].class?.color || 'var(--accent-secondary)' }}>
                    {fighters[1].class?.icon}
                  </div>
                  <div className="sprite-hp-bar">
                    <div
                      className="sprite-hp-fill"
                      style={{
                        width: `${getHPPercentage(fighters[1].hp, fighters[1].maxHP)}%`,
                        backgroundColor: getHPColor(getHPPercentage(fighters[1].hp, fighters[1].maxHP))
                      }}
                    />
                  </div>
                  <div className="sprite-name-tooltip">{fighters[1].name} - {fighters[1].class?.name}</div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="battle-log-container pixel-container">
          <h3>Battle Log</h3>
          <div className="battle-log" ref={battleLogRef}>
            {battleLog.map((log) => (
              <div key={log.id} className="log-entry">
                {log.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ArenaScreen
