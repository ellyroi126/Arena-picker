/**
 * Battle History & Stats Tracking System
 * Stores battle results in localStorage
 */

const STORAGE_KEY = 'arena_battle_history'
const MAX_HISTORY = 100 // Keep last 100 battles

export const saveBattleResult = (winner, contestants, settings, battleDuration) => {
  try {
    const history = getBattleHistory()

    const battleResult = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      winner: {
        id: winner.id,
        name: winner.name,
        class: winner.class?.name,
      },
      contestants: contestants.map(c => ({
        id: c.id,
        name: c.name,
        class: c.class?.name,
      })),
      settings: {
        mode: settings.mode,
        battleSpeed: settings.battleSpeed,
        startingHP: settings.startingHP,
        arenaPreset: settings.arenaPreset,
      },
      battleDuration, // in seconds
    }

    history.unshift(battleResult) // Add to beginning

    // Keep only last MAX_HISTORY battles
    if (history.length > MAX_HISTORY) {
      history.splice(MAX_HISTORY)
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(history))

    // Update contestant stats
    updateContestantStats(winner.name, contestants, winner)
  } catch (error) {
    console.error('Error saving battle result:', error)
  }
}

export const getBattleHistory = () => {
  try {
    const history = localStorage.getItem(STORAGE_KEY)
    return history ? JSON.parse(history) : []
  } catch (error) {
    console.error('Error loading battle history:', error)
    return []
  }
}

export const clearBattleHistory = () => {
  localStorage.removeItem(STORAGE_KEY)
  localStorage.removeItem('arena_contestant_stats')
}

// Contestant stats tracking
const STATS_KEY = 'arena_contestant_stats'

export const updateContestantStats = (winnerName, allContestants, winner) => {
  try {
    const stats = getContestantStats()

    allContestants.forEach(contestant => {
      const name = contestant.name
      if (!stats[name]) {
        stats[name] = {
          name,
          wins: 0,
          losses: 0,
          battles: 0,
          winRate: 0,
          favoriteClass: {},
        }
      }

      stats[name].battles++

      if (name === winnerName) {
        stats[name].wins++
      } else {
        stats[name].losses++
      }

      stats[name].winRate = (stats[name].wins / stats[name].battles * 100).toFixed(1)

      // Track class usage
      if (contestant.class) {
        const className = contestant.class.name
        stats[name].favoriteClass[className] = (stats[name].favoriteClass[className] || 0) + 1
      }
    })

    localStorage.setItem(STATS_KEY, JSON.stringify(stats))
  } catch (error) {
    console.error('Error updating stats:', error)
  }
}

export const getContestantStats = () => {
  try {
    const stats = localStorage.getItem(STATS_KEY)
    return stats ? JSON.parse(stats) : {}
  } catch (error) {
    console.error('Error loading stats:', error)
    return {}
  }
}

export const getTopContestants = (limit = 10) => {
  const stats = getContestantStats()
  const contestants = Object.values(stats)

  return contestants
    .filter(c => c.battles >= 3) // Minimum 3 battles
    .sort((a, b) => {
      // Sort by win rate, then by total wins
      if (b.winRate !== a.winRate) {
        return b.winRate - a.winRate
      }
      return b.wins - a.wins
    })
    .slice(0, limit)
}

export const getContestantRecord = (name) => {
  const stats = getContestantStats()
  return stats[name] || null
}

export const getHeadToHeadRecord = (name1, name2) => {
  const history = getBattleHistory()
  let wins1 = 0
  let wins2 = 0

  history.forEach(battle => {
    const contestantNames = battle.contestants.map(c => c.name)
    if (contestantNames.includes(name1) && contestantNames.includes(name2)) {
      if (battle.winner.name === name1) wins1++
      if (battle.winner.name === name2) wins2++
    }
  })

  return { name1, name2, wins1, wins2 }
}
