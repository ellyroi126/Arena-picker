/**
 * Tournament bracket utilities
 */

/**
 * Creates a tournament bracket structure from contestants
 * @param {Array} contestants - Array of contestant objects
 * @returns {Array} - 2D array representing rounds and matches
 */
export const createTournamentBracket = (contestants) => {
  if (contestants.length < 2) return []

  const bracket = []
  let currentRound = []

  // First round: pair up all contestants
  const shuffled = [...contestants].sort(() => Math.random() - 0.5)

  for (let i = 0; i < shuffled.length; i += 2) {
    currentRound.push({
      fighter1: shuffled[i],
      fighter2: shuffled[i + 1] || null, // Handle odd number
      winner: null,
    })
  }

  bracket.push(currentRound)

  // Create subsequent rounds (empty for now)
  let numMatches = currentRound.length
  while (numMatches > 1) {
    numMatches = Math.ceil(numMatches / 2)
    const nextRound = []

    for (let i = 0; i < numMatches; i++) {
      nextRound.push({
        fighter1: null,
        fighter2: null,
        winner: null,
      })
    }

    bracket.push(nextRound)
  }

  return bracket
}

/**
 * Gets the next match that needs to be played
 * @param {Array} bracket - The tournament bracket
 * @returns {Object|null} - The next match or null if tournament is over
 */
export const getNextMatch = (bracket) => {
  for (let roundIndex = 0; roundIndex < bracket.length; roundIndex++) {
    const round = bracket[roundIndex]
    for (let matchIndex = 0; matchIndex < round.length; matchIndex++) {
      const match = round[matchIndex]
      // Check if match has both fighters and no winner yet
      if (match.fighter1 && match.fighter2 && !match.winner) {
        return { match, roundIndex, matchIndex }
      }
    }
  }
  return null // Tournament is complete
}

/**
 * Updates the bracket with a match result
 * @param {Array} bracket - The tournament bracket
 * @param {number} roundIndex - Index of the round
 * @param {number} matchIndex - Index of the match in the round
 * @param {Object} winner - The winning contestant
 * @returns {Array} - Updated bracket
 */
export const updateBracketWithWinner = (bracket, roundIndex, matchIndex, winner) => {
  const newBracket = JSON.parse(JSON.stringify(bracket)) // Deep clone

  // Set the winner for this match
  newBracket[roundIndex][matchIndex].winner = winner

  // If there's a next round, advance the winner
  if (roundIndex < newBracket.length - 1) {
    const nextRoundIndex = roundIndex + 1
    const nextMatchIndex = Math.floor(matchIndex / 2)
    const positionInNextMatch = matchIndex % 2 // 0 = fighter1, 1 = fighter2

    if (positionInNextMatch === 0) {
      newBracket[nextRoundIndex][nextMatchIndex].fighter1 = winner
    } else {
      newBracket[nextRoundIndex][nextMatchIndex].fighter2 = winner
    }
  }

  return newBracket
}

/**
 * Gets the current round number and total rounds
 * @param {Array} bracket - The tournament bracket
 * @returns {Object} - { currentRound, totalRounds }
 */
export const getTournamentProgress = (bracket) => {
  let currentRound = 0

  for (let i = 0; i < bracket.length; i++) {
    const round = bracket[i]
    const hasIncompleteMatch = round.some(
      match => match.fighter1 && match.fighter2 && !match.winner
    )

    if (hasIncompleteMatch) {
      currentRound = i + 1
      break
    }

    // If all matches in this round are complete, move to next
    const allComplete = round.every(match => match.winner || !match.fighter1 || !match.fighter2)
    if (allComplete && i < bracket.length - 1) {
      currentRound = i + 2
    }
  }

  return {
    currentRound: currentRound || bracket.length,
    totalRounds: bracket.length,
  }
}

/**
 * Checks if the tournament is complete
 * @param {Array} bracket - The tournament bracket
 * @returns {boolean} - True if tournament is complete
 */
export const isTournamentComplete = (bracket) => {
  if (bracket.length === 0) return false

  // Check if the final match has a winner
  const finalRound = bracket[bracket.length - 1]
  return finalRound[0].winner !== null
}

/**
 * Gets the tournament champion
 * @param {Array} bracket - The tournament bracket
 * @returns {Object|null} - The champion or null if tournament not complete
 */
export const getTournamentChampion = (bracket) => {
  if (!isTournamentComplete(bracket)) return null

  const finalRound = bracket[bracket.length - 1]
  return finalRound[0].winner
}
