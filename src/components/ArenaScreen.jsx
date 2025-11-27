import { useState, useEffect, useRef } from 'react'
import './ArenaScreen.css'
import TournamentBracket from './TournamentBracket'
import DamageNumber from './DamageNumber'
import AttackEffect from './AttackEffect'
import {
  createTournamentBracket,
  getNextMatch,
  updateBracketWithWinner,
  getTournamentProgress,
  getTournamentChampion,
} from '../utils/tournamentUtils'

function ArenaScreen({ contestants, settings, onBattleEnd }) {
  const [fighters, setFighters] = useState([])
  const [battleLog, setBattleLog] = useState([])
  const [isAnimating, setIsAnimating] = useState(null) // Store fighter ID being attacked
  const [attackingFighter, setAttackingFighter] = useState(null) // Fighter lunging forward
  const [bracket, setBracket] = useState([])
  const [currentMatchInfo, setCurrentMatchInfo] = useState(null)
  const [damageNumbers, setDamageNumbers] = useState([])
  const [attackEffects, setAttackEffects] = useState([])
  const [screenShake, setScreenShake] = useState(false)
  const battleLogRef = useRef(null)
  const arenaRef = useRef(null)
  const fighterRefs = useRef({})

  const isTournamentMode = settings.mode === 'tournament'
  const isFreeForAllMode = settings.mode === 'freeforall'

  // Initialize battle
  useEffect(() => {
    if (isTournamentMode) {
      // Initialize tournament bracket
      const newBracket = createTournamentBracket(contestants)
      setBracket(newBracket)

      // Get first match
      const nextMatch = getNextMatch(newBracket)
      if (nextMatch) {
        setCurrentMatchInfo(nextMatch)
        initializeFighters(nextMatch.match.fighter1, nextMatch.match.fighter2)
      }
    } else if (isFreeForAllMode) {
      // Free For All mode - all contestants fight at once
      const allFighters = contestants.map(c => ({
        ...c,
        hp: settings.startingHP,
        maxHP: settings.startingHP,
        isAlive: true,
      }))
      setFighters(allFighters)
      addLog(`⚔️ FREE FOR ALL! ${allFighters.length} contestants enter the arena!`)
      addLog(`🔥 Only one will remain standing!`)
    }
  }, [contestants, settings, isTournamentMode, isFreeForAllMode])

  const initializeFighters = (fighter1, fighter2) => {
    const initialFighters = [fighter1, fighter2].map(f => ({
      ...f,
      hp: settings.startingHP,
      maxHP: settings.startingHP,
      isAlive: true,
    }))
    setFighters(initialFighters)
    addLog(`⚔️ Battle begins! ${fighter1.name} vs ${fighter2.name}`)
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
    }, settings.battleSpeed)

    return () => clearTimeout(timer)
  }, [fighters, settings.battleSpeed])

  const handleTournamentWinner = (winner) => {
    // Update bracket with winner
    const updatedBracket = updateBracketWithWinner(
      bracket,
      currentMatchInfo.roundIndex,
      currentMatchInfo.matchIndex,
      winner
    )
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
          setBattleLog([]) // Clear log for new match
          setCurrentMatchInfo(nextMatch)
          const progress = getTournamentProgress(updatedBracket)
          addLog(`📊 Round ${progress.currentRound} of ${progress.totalRounds}`)
          initializeFighters(nextMatch.match.fighter1, nextMatch.match.fighter2)
        }
      }, 2000)
    }
  }

  const performAttack = () => {
    const aliveFighters = fighters.filter(f => f.isAlive)

    if (aliveFighters.length < 2) return

    // Randomly select attacker and defender from alive fighters
    const attackerIndex = Math.floor(Math.random() * aliveFighters.length)
    let defenderIndex = Math.floor(Math.random() * aliveFighters.length)

    // Make sure attacker and defender are different
    while (defenderIndex === attackerIndex && aliveFighters.length > 1) {
      defenderIndex = Math.floor(Math.random() * aliveFighters.length)
    }

    const attacker = aliveFighters[attackerIndex]
    const defender = aliveFighters[defenderIndex]

    // Generate attack with critical hit chance
    const attack = generateAttack()
    const isCritical = Math.random() < 0.15 // 15% crit chance
    let damage = attack.damage

    if (isCritical) {
      damage = Math.floor(damage * 1.5) // Critical hits deal 50% more damage
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

        // Remove damage number after animation
        setTimeout(() => {
          setDamageNumbers(prev => prev.filter(d => d.id !== damageId))
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
    }
  }

  const generateAttack = () => {
    const attacks = [
      { name: 'Quick Jab', damage: getRandomDamage(5, 15), icon: '👊', type: 'melee' },
      { name: 'Power Slash', damage: getRandomDamage(10, 25), icon: '⚔️', type: 'melee' },
      { name: 'Fireball', damage: getRandomDamage(15, 30), icon: '🔥', type: 'magic' },
      { name: 'Thunder Strike', damage: getRandomDamage(12, 28), icon: '⚡', type: 'magic' },
      { name: 'Ice Spike', damage: getRandomDamage(8, 20), icon: '❄️', type: 'magic' },
      { name: 'Poison Dart', damage: getRandomDamage(6, 18), icon: '☠️', type: 'ranged' },
      { name: 'Heavy Smash', damage: getRandomDamage(20, 35), icon: '💥', type: 'heavy' },
      { name: 'Shadow Strike', damage: getRandomDamage(10, 22), icon: '🌑', type: 'magic' },
    ]
    return attacks[Math.floor(Math.random() * attacks.length)]
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
          // Free For All - Grid layout with all fighters
          <div className="ffa-arena">
            <div className="fighters-grid">
              {fighters.map((fighter) => (
                <div
                  key={fighter.id}
                  ref={el => fighterRefs.current[fighter.id] = el}
                  className={`ffa-fighter
                    ${!fighter.isAlive ? 'eliminated' : ''}
                    ${isAnimating === fighter.id ? 'hit-reaction' : ''}
                    ${attackingFighter === fighter.id ? 'attacking' : ''}`}
                >
                  <div
                    className="ffa-avatar"
                    style={{ backgroundColor: fighter.logo ? 'transparent' : fighter.color }}
                  >
                    {fighter.logo ? (
                      <img src={fighter.logo} alt={fighter.name} />
                    ) : (
                      fighter.name.charAt(0).toUpperCase()
                    )}
                    {!fighter.isAlive && <div className="skull-overlay">💀</div>}
                  </div>
                  <div className="ffa-info">
                    <div className="ffa-name">{fighter.name}</div>
                    <div className="hp-bar-container">
                      <div
                        className="hp-bar"
                        style={{
                          width: `${getHPPercentage(fighter.hp, fighter.maxHP)}%`,
                          backgroundColor: getHPColor(getHPPercentage(fighter.hp, fighter.maxHP))
                        }}
                      />
                    </div>
                    <div className="hp-text">
                      {fighter.hp} / {fighter.maxHP} HP
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Tournament mode - Side-scrolling fighter layout
          <div className="battle-stage platformer-arena">
            {/* Arena background layers */}
            <div className="arena-bg-layer far-bg"></div>
            <div className="arena-bg-layer mid-bg"></div>
            <div className="arena-floor"></div>

            {/* Fighter 1 - Left side */}
            {fighters[0] && (
              <div
                ref={el => fighterRefs.current[fighters[0].id] = el}
                className={`fighter fighter-left
                  ${isAnimating === fighters[0].id ? 'hit-reaction' : ''}
                  ${attackingFighter === fighters[0].id ? 'attacking' : ''}`}
              >
                <div
                  className="fighter-avatar"
                  style={{ backgroundColor: fighters[0].logo ? 'transparent' : fighters[0].color }}
                >
                  {fighters[0].logo ? (
                    <img src={fighters[0].logo} alt={fighters[0].name} />
                  ) : (
                    fighters[0].name.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="fighter-info">
                  <div className="fighter-name">{fighters[0].name}</div>
                  <div className="hp-bar-container">
                    <div
                      className="hp-bar"
                      style={{
                        width: `${getHPPercentage(fighters[0].hp, fighters[0].maxHP)}%`,
                        backgroundColor: getHPColor(getHPPercentage(fighters[0].hp, fighters[0].maxHP))
                      }}
                    />
                  </div>
                  <div className="hp-text">
                    {fighters[0].hp} / {fighters[0].maxHP} HP
                  </div>
                </div>
              </div>
            )}

            <div className="vs-text">VS</div>

            {/* Fighter 2 - Right side */}
            {fighters[1] && (
              <div
                ref={el => fighterRefs.current[fighters[1].id] = el}
                className={`fighter fighter-right
                  ${isAnimating === fighters[1].id ? 'hit-reaction' : ''}
                  ${attackingFighter === fighters[1].id ? 'attacking' : ''}`}
              >
                <div
                  className="fighter-avatar"
                  style={{ backgroundColor: fighters[1].logo ? 'transparent' : fighters[1].color }}
                >
                  {fighters[1].logo ? (
                    <img src={fighters[1].logo} alt={fighters[1].name} />
                  ) : (
                    fighters[1].name.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="fighter-info">
                  <div className="fighter-name">{fighters[1].name}</div>
                  <div className="hp-bar-container">
                    <div
                      className="hp-bar"
                      style={{
                        width: `${getHPPercentage(fighters[1].hp, fighters[1].maxHP)}%`,
                        backgroundColor: getHPColor(getHPPercentage(fighters[1].hp, fighters[1].maxHP))
                      }}
                    />
                  </div>
                  <div className="hp-text">
                    {fighters[1].hp} / {fighters[1].maxHP} HP
                  </div>
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
