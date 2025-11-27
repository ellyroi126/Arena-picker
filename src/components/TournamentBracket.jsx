import './TournamentBracket.css'

function TournamentBracket({ bracket, currentMatch }) {
  const renderMatch = (match, roundIndex, matchIndex) => {
    if (!match) return null

    const isCurrentMatch = currentMatch &&
      match.fighter1?.id === currentMatch.fighter1?.id &&
      match.fighter2?.id === currentMatch.fighter2?.id

    const fighter1Won = match.winner?.id === match.fighter1?.id
    const fighter2Won = match.winner?.id === match.fighter2?.id

    return (
      <div
        key={`${roundIndex}-${matchIndex}`}
        className={`bracket-match ${isCurrentMatch ? 'current-match' : ''} ${match.winner ? 'completed' : ''}`}
      >
        <div className={`bracket-fighter ${fighter1Won ? 'winner' : ''} ${match.winner && !fighter1Won ? 'loser' : ''}`}>
          {match.fighter1 && (
            <>
              <div
                className="bracket-avatar"
                style={{ backgroundColor: match.fighter1.color }}
              >
                {match.fighter1.logo ? (
                  <img src={match.fighter1.logo} alt={match.fighter1.name} />
                ) : (
                  match.fighter1.name.charAt(0).toUpperCase()
                )}
              </div>
              <span className="bracket-name">{match.fighter1.name}</span>
              {fighter1Won && <span className="winner-badge">👑</span>}
            </>
          )}
          {!match.fighter1 && <span className="bracket-name tbd">TBD</span>}
        </div>

        <div className="bracket-vs">VS</div>

        <div className={`bracket-fighter ${fighter2Won ? 'winner' : ''} ${match.winner && !fighter2Won ? 'loser' : ''}`}>
          {match.fighter2 && (
            <>
              <div
                className="bracket-avatar"
                style={{ backgroundColor: match.fighter2.color }}
              >
                {match.fighter2.logo ? (
                  <img src={match.fighter2.logo} alt={match.fighter2.name} />
                ) : (
                  match.fighter2.name.charAt(0).toUpperCase()
                )}
              </div>
              <span className="bracket-name">{match.fighter2.name}</span>
              {fighter2Won && <span className="winner-badge">👑</span>}
            </>
          )}
          {!match.fighter2 && <span className="bracket-name tbd">TBD</span>}
        </div>
      </div>
    )
  }

  return (
    <div className="tournament-bracket pixel-container">
      <h3>Tournament Bracket</h3>
      <div className="bracket-container">
        {bracket.map((round, roundIndex) => (
          <div key={roundIndex} className="bracket-round">
            <div className="round-label">
              {roundIndex === bracket.length - 1 ? 'FINAL' :
               roundIndex === bracket.length - 2 ? 'SEMI-FINALS' :
               `ROUND ${roundIndex + 1}`}
            </div>
            <div className="round-matches">
              {round.map((match, matchIndex) => renderMatch(match, roundIndex, matchIndex))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TournamentBracket
