/**
 * Platform System for Multi-Level Arena
 * Generates random platforms at different heights with obstacles
 */

/**
 * Platform types with different properties
 */
export const PLATFORM_TYPES = {
  GROUND: { height: 0, color: '#2a3545', solid: true },
  LOW: { height: 25, color: '#3a4555', solid: true },
  MID: { height: 50, color: '#4a5565', solid: true },
  HIGH: { height: 75, color: '#5a6575', solid: true },
  FLOATING: { height: 60, color: '#6a7585', solid: true },
}

/**
 * Obstacle types
 */
export const OBSTACLE_TYPES = [
  { type: 'wall', icon: '🧱', width: 40, height: 60, color: '#7f8c8d' },
  { type: 'barrier', icon: '🚧', width: 50, height: 40, color: '#e67e22' },
  { type: 'pillar', icon: '🏛️', width: 30, height: 80, color: '#95a5a6' },
  { type: 'crate', icon: '📦', width: 45, height: 45, color: '#d35400' },
]

/**
 * Arena layout presets
 */
export const ARENA_PRESETS = {
  CLASSIC: 'classic',
  VERTICAL: 'vertical',
  SYMMETRICAL: 'symmetrical',
  CHAOTIC: 'chaotic',
  MINIMAL: 'minimal',
  RANDOM: 'random'
}

/**
 * Generate arena based on preset type
 */
const generatePresetArena = (arenaWidth, arenaHeight, numFighters, preset) => {
  const platforms = []
  const obstacles = []

  // Always have ground platform
  platforms.push({
    id: 'ground',
    x: 0,
    y: arenaHeight - 60,
    width: arenaWidth,
    height: 12,
    type: 'GROUND',
    ...PLATFORM_TYPES.GROUND
  })

  switch (preset) {
    case ARENA_PRESETS.CLASSIC:
      // Balanced mix of platforms
      platforms.push(
        { id: 'p1', x: 150, y: arenaHeight - 220, width: 200, height: 12, type: 'MID', ...PLATFORM_TYPES.MID },
        { id: 'p2', x: 650, y: arenaHeight - 220, width: 200, height: 12, type: 'MID', ...PLATFORM_TYPES.MID },
        { id: 'p3', x: 400, y: arenaHeight - 340, width: 200, height: 12, type: 'HIGH', ...PLATFORM_TYPES.HIGH }
      )
      obstacles.push(
        { id: 'o1', x: 450, y: arenaHeight - 120, ...OBSTACLE_TYPES[3] },
        { id: 'o2', x: 200, y: arenaHeight - 280, ...OBSTACLE_TYPES[0] }
      )
      break

    case ARENA_PRESETS.VERTICAL:
      // Stacked vertical platforms
      platforms.push(
        { id: 'p1', x: 100, y: arenaHeight - 160, width: 300, height: 12, type: 'LOW', ...PLATFORM_TYPES.LOW },
        { id: 'p2', x: 350, y: arenaHeight - 260, width: 300, height: 12, type: 'MID', ...PLATFORM_TYPES.MID },
        { id: 'p3', x: 100, y: arenaHeight - 360, width: 300, height: 12, type: 'HIGH', ...PLATFORM_TYPES.HIGH },
        { id: 'p4', x: 600, y: arenaHeight - 210, width: 250, height: 12, type: 'MID', ...PLATFORM_TYPES.MID }
      )
      obstacles.push(
        { id: 'o1', x: 500, y: arenaHeight - 320, ...OBSTACLE_TYPES[2] }
      )
      break

    case ARENA_PRESETS.SYMMETRICAL:
      // Mirror platforms
      platforms.push(
        { id: 'p1', x: 100, y: arenaHeight - 200, width: 180, height: 12, type: 'MID', ...PLATFORM_TYPES.MID },
        { id: 'p2', x: 720, y: arenaHeight - 200, width: 180, height: 12, type: 'MID', ...PLATFORM_TYPES.MID },
        { id: 'p3', x: 200, y: arenaHeight - 320, width: 150, height: 12, type: 'HIGH', ...PLATFORM_TYPES.HIGH },
        { id: 'p4', x: 650, y: arenaHeight - 320, width: 150, height: 12, type: 'HIGH', ...PLATFORM_TYPES.HIGH },
        { id: 'p5', x: 425, y: arenaHeight - 400, width: 150, height: 12, type: 'HIGH', ...PLATFORM_TYPES.HIGH }
      )
      obstacles.push(
        { id: 'o1', x: 150, y: arenaHeight - 120, ...OBSTACLE_TYPES[3] },
        { id: 'o2', x: 800, y: arenaHeight - 120, ...OBSTACLE_TYPES[3] }
      )
      break

    case ARENA_PRESETS.CHAOTIC:
      // Random scattered platforms
      for (let i = 0; i < 6; i++) {
        const types = ['LOW', 'MID', 'HIGH', 'FLOATING']
        const randomType = types[Math.floor(Math.random() * types.length)]
        const typeData = PLATFORM_TYPES[randomType]
        platforms.push({
          id: `p${i}`,
          x: Math.floor(Math.random() * 700) + 50,
          y: arenaHeight - 100 - Math.floor(Math.random() * 350),
          width: Math.floor(Math.random() * 100) + 120,
          height: 12,
          type: randomType,
          ...typeData
        })
      }
      for (let i = 0; i < 4; i++) {
        const obstacleType = OBSTACLE_TYPES[Math.floor(Math.random() * OBSTACLE_TYPES.length)]
        obstacles.push({
          id: `o${i}`,
          x: Math.floor(Math.random() * 900) + 50,
          y: arenaHeight - 100 - Math.floor(Math.random() * 300),
          ...obstacleType
        })
      }
      break

    case ARENA_PRESETS.MINIMAL:
      // Just 2-3 platforms
      platforms.push(
        { id: 'p1', x: 200, y: arenaHeight - 220, width: 250, height: 12, type: 'MID', ...PLATFORM_TYPES.MID },
        { id: 'p2', x: 550, y: arenaHeight - 220, width: 250, height: 12, type: 'MID', ...PLATFORM_TYPES.MID }
      )
      obstacles.push(
        { id: 'o1', x: 450, y: arenaHeight - 120, ...OBSTACLE_TYPES[3] }
      )
      break

    default: // RANDOM
      return null // Will use original random generation
  }

  return { platforms, obstacles }
}

/**
 * Generates a random arena layout with platforms and obstacles
 * @param {number} arenaWidth - Width of the arena in pixels
 * @param {number} arenaHeight - Height of the arena in pixels
 * @param {number} numFighters - Number of fighters to create positions for
 * @param {string} preset - Arena layout preset (optional)
 * @returns {Object} - Arena configuration with platforms, obstacles, and spawn positions
 */
export const generateArenaLayout = (arenaWidth = 1000, arenaHeight = 500, numFighters = 2, preset = ARENA_PRESETS.RANDOM) => {
  let platforms = []
  let obstacles = []
  const spawnPositions = []

  // Try to use preset first
  const presetArena = generatePresetArena(arenaWidth, arenaHeight, numFighters, preset)

  if (presetArena) {
    platforms = presetArena.platforms
    obstacles = presetArena.obstacles
  } else {
    // Original random generation logic
    // Always have a ground platform
    platforms.push({
      id: 'ground',
      x: 0,
      y: arenaHeight - 60,
      width: arenaWidth,
      height: 12,
      type: 'GROUND',
      ...PLATFORM_TYPES.GROUND
    })

    // Generate random number of platforms (3-6 for variety)
    const numPlatforms = Math.floor(Math.random() * 4) + 3

    for (let i = 0; i < numPlatforms; i++) {
      const platformTypes = ['LOW', 'MID', 'HIGH', 'FLOATING']
      const randomType = platformTypes[Math.floor(Math.random() * platformTypes.length)]
      const typeData = PLATFORM_TYPES[randomType]

      // Random width between 150-300px
      const width = Math.floor(Math.random() * 150) + 150
      // Random x position, ensuring it fits in arena
      const x = Math.floor(Math.random() * (arenaWidth - width - 100)) + 50
      // Calculate y based on height from bottom
      const y = arenaHeight - 60 - typeData.height - 50

      platforms.push({
        id: `platform-${i}`,
        x,
        y,
        width,
        height: 12,
        type: randomType,
        ...typeData
      })
    }

    // Generate obstacles (2-4 per arena)
    const numObstacles = Math.floor(Math.random() * 3) + 2

    for (let i = 0; i < numObstacles; i++) {
      const obstacleType = OBSTACLE_TYPES[Math.floor(Math.random() * OBSTACLE_TYPES.length)]

      // Place obstacles on platforms
      const platform = platforms[Math.floor(Math.random() * platforms.length)]
      const x = platform.x + Math.floor(Math.random() * (platform.width - obstacleType.width))
      const y = platform.y - obstacleType.height

      obstacles.push({
        id: `obstacle-${i}`,
        x,
        y,
        ...obstacleType
      })
    }
  }

  // Generate spawn positions for fighters
  // Distribute fighters across different platforms
  for (let i = 0; i < numFighters; i++) {
    const platformIndex = i % Math.min(platforms.length, 4) // Use up to 4 different platforms
    const platform = platforms[platformIndex]

    // Spread fighters across platform width
    const spacing = platform.width / (Math.ceil(numFighters / 4) + 1)
    const localIndex = Math.floor(i / 4)
    const x = platform.x + spacing * (localIndex + 1)
    const y = platform.y - 100 // Position fighter above platform

    spawnPositions.push({
      id: `spawn-${i}`,
      x,
      y,
      platformId: platform.id,
      platformY: platform.y
    })
  }

  // Shuffle spawn positions for randomness
  for (let i = spawnPositions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [spawnPositions[i], spawnPositions[j]] = [spawnPositions[j], spawnPositions[i]]
  }

  return {
    platforms,
    obstacles,
    spawnPositions,
    arenaWidth,
    arenaHeight
  }
}

/**
 * Gets a random platform position for fighter movement
 * @param {Array} platforms - Array of platform objects
 * @returns {Object} - Random platform with x, y coordinates
 */
export const getRandomPlatformPosition = (platforms) => {
  const platform = platforms[Math.floor(Math.random() * platforms.length)]
  const x = platform.x + Math.floor(Math.random() * (platform.width - 100)) + 50
  const y = platform.y - 100

  return { x, y, platformId: platform.id }
}

/**
 * Checks if a position collides with an obstacle
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {Array} obstacles - Array of obstacle objects
 * @returns {boolean} - True if collision detected
 */
export const checkObstacleCollision = (x, y, obstacles) => {
  return obstacles.some(obstacle => {
    return (
      x >= obstacle.x &&
      x <= obstacle.x + obstacle.width &&
      y >= obstacle.y &&
      y <= obstacle.y + obstacle.height
    )
  })
}
