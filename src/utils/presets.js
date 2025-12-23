/**
 * Premade contestant presets for different genres
 */

export const PRESETS = {
  restaurants: {
    name: 'Fast Food Restaurants',
    icon: '🍔',
    contestants: [
      'McDonald\'s',
      'Burger King',
      'Wendy\'s',
      'Taco Bell',
      'KFC',
      'Subway',
      'Chick-fil-A',
      'Popeyes',
      'Chipotle',
      'Five Guys',
      'In-N-Out Burger',
      'Shake Shack',
      'Panda Express',
      'Domino\'s',
      'Pizza Hut',
      'Papa John\'s',
    ]
  },
  casualDining: {
    name: 'Casual Dining',
    icon: '🍽️',
    contestants: [
      'Applebee\'s',
      'Chili\'s',
      'Olive Garden',
      'Red Lobster',
      'Outback Steakhouse',
      'Buffalo Wild Wings',
      'TGI Friday\'s',
      'Cheesecake Factory',
      'Texas Roadhouse',
      'Cracker Barrel',
      'Red Robin',
      'P.F. Chang\'s',
    ]
  },
  coffee: {
    name: 'Coffee Chains',
    icon: '☕',
    contestants: [
      'Starbucks',
      'Dunkin\'',
      'Peet\'s Coffee',
      'Tim Hortons',
      'Caribou Coffee',
      'The Coffee Bean',
      'Dutch Bros',
      'Panera Bread',
    ]
  },
  videoGames: {
    name: 'Popular Video Games',
    icon: '🎮',
    contestants: [
      'Minecraft',
      'Fortnite',
      'Call of Duty',
      'League of Legends',
      'Grand Theft Auto V',
      'The Legend of Zelda',
      'Super Mario',
      'Elden Ring',
      'God of War',
      'Red Dead Redemption',
      'Cyberpunk 2077',
      'Assassin\'s Creed',
      'Overwatch',
      'Counter-Strike',
      'Valorant',
      'Apex Legends',
    ]
  },
  nintendoGames: {
    name: 'Nintendo Games',
    icon: '🎮',
    contestants: [
      'Super Mario Bros',
      'The Legend of Zelda',
      'Pokémon',
      'Mario Kart',
      'Animal Crossing',
      'Super Smash Bros',
      'Splatoon',
      'Metroid',
      'Kirby',
      'Donkey Kong',
      'Fire Emblem',
      'Luigi\'s Mansion',
    ]
  },
  rpgGames: {
    name: 'RPG Games',
    icon: '⚔️',
    contestants: [
      'Final Fantasy',
      'The Witcher 3',
      'Skyrim',
      'Dark Souls',
      'Elden Ring',
      'Persona 5',
      'Dragon Quest',
      'Mass Effect',
      'Baldur\'s Gate 3',
      'Chrono Trigger',
      'Kingdom Hearts',
      'Fallout',
    ]
  },
}

/**
 * Get all preset categories
 * @returns {Array} Array of preset categories with metadata
 */
export const getPresetCategories = () => {
  return Object.entries(PRESETS).map(([key, preset]) => ({
    id: key,
    name: preset.name,
    icon: preset.icon,
    count: preset.contestants.length,
  }))
}

/**
 * Get contestants from a specific preset
 * @param {string} presetId - The preset identifier
 * @returns {Array} Array of contestant names
 */
export const getPresetContestants = (presetId) => {
  return PRESETS[presetId]?.contestants || []
}

/**
 * Get a random selection from a preset
 * @param {string} presetId - The preset identifier
 * @param {number} count - Number of contestants to select
 * @returns {Array} Array of randomly selected contestant names
 */
export const getRandomFromPreset = (presetId, count = 8) => {
  const contestants = getPresetContestants(presetId)
  const shuffled = [...contestants].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(count, contestants.length))
}
