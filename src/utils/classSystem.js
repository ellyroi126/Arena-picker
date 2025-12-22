/**
 * Fighter Class System
 * Each fighter gets randomly assigned a class with unique stats and abilities
 */

export const FIGHTER_CLASSES = [
  // Melee Warriors
  {
    name: 'Swordsman',
    icon: '⚔️',
    color: '#e74c3c',
    stats: { hpBonus: 10, attackBonus: 5, speed: 1.0 },
    abilities: ['Power Slash', 'Quick Strike'],
    attackRange: 150, // increased from 80
    aiStrategy: 'aggressive' // chase enemies, seek close combat
  },
  {
    name: 'Berserker',
    icon: '🪓',
    color: '#c0392b',
    stats: { hpBonus: 20, attackBonus: 10, speed: 0.8 },
    abilities: ['Heavy Smash', 'Rage Strike'],
    attackRange: 140, // increased from 70
    aiStrategy: 'aggressive'
  },
  {
    name: 'Paladin',
    icon: '🛡️',
    color: '#f39c12',
    stats: { hpBonus: 25, attackBonus: 3, speed: 0.9 },
    abilities: ['Holy Strike', 'Divine Shield'],
    attackRange: 150, // increased from 80
    aiStrategy: 'defensive' // hold position, protect
  },
  {
    name: 'Dual Wielder',
    icon: '⚔️⚔️',
    color: '#e67e22',
    stats: { hpBonus: 5, attackBonus: 8, speed: 1.2 },
    abilities: ['Twin Strike', 'Blade Dance'],
    attackRange: 145, // increased from 75
    aiStrategy: 'aggressive'
  },
  {
    name: 'Brawler',
    icon: '👊',
    color: '#d35400',
    stats: { hpBonus: 15, attackBonus: 6, speed: 1.1 },
    abilities: ['Combo Punch', 'Uppercut'],
    attackRange: 120, // increased from 60
    aiStrategy: 'aggressive'
  },
  {
    name: 'Lancer',
    icon: '🔱',
    color: '#c44569',
    stats: { hpBonus: 10, attackBonus: 7, speed: 1.0 },
    abilities: ['Piercing Thrust', 'Sweep'],
    attackRange: 180, // increased from 100 - longer reach
    aiStrategy: 'aggressive'
  },

  // Agile/Ranged
  {
    name: 'Assassin',
    icon: '🗡️',
    color: '#34495e',
    stats: { hpBonus: -5, attackBonus: 12, speed: 1.5 },
    abilities: ['Backstab', 'Shadow Strike'],
    attackRange: 140, // increased from 70
    aiStrategy: 'flanker' // circle enemies, attack from behind
  },
  {
    name: 'Ranger',
    icon: '🏹',
    color: '#27ae60',
    stats: { hpBonus: 0, attackBonus: 8, speed: 1.3 },
    abilities: ['Arrow Shot', 'Multi-Shot'],
    attackRange: 400, // increased from 300 - long range
    aiStrategy: 'sniper' // seek high ground, keep distance
  },
  {
    name: 'Rogue',
    icon: '🃏',
    color: '#16a085',
    stats: { hpBonus: 0, attackBonus: 7, speed: 1.4 },
    abilities: ['Sneak Attack', 'Poison Dart'],
    attackRange: 220, // increased from 150
    aiStrategy: 'kiting' // hit and run, maintain distance
  },
  {
    name: 'Nightblade',
    icon: '🌙',
    color: '#2c3e50',
    stats: { hpBonus: 5, attackBonus: 10, speed: 1.3 },
    abilities: ['Shadow Strike', 'Dark Blade'],
    attackRange: 160, // increased from 90
    aiStrategy: 'flanker'
  },
  {
    name: 'Gunner',
    icon: '🔫',
    color: '#95a5a6',
    stats: { hpBonus: 0, attackBonus: 9, speed: 1.1 },
    abilities: ['Rapid Fire', 'Headshot'],
    attackRange: 450, // increased from 350 - very long range
    aiStrategy: 'sniper'
  },
  {
    name: 'Dancer',
    icon: '💃',
    color: '#e91e63',
    stats: { hpBonus: -5, attackBonus: 5, speed: 1.6 },
    abilities: ['Blade Dance', 'Whirl'],
    attackRange: 150, // increased from 80
    aiStrategy: 'flanker'
  },

  // Mages/Casters
  {
    name: 'Mage',
    icon: '🧙',
    color: '#9b59b6',
    stats: { hpBonus: -10, attackBonus: 15, speed: 0.9 },
    abilities: ['Fireball', 'Magic Missile'],
    attackRange: 350, // increased from 250
    aiStrategy: 'caster' // maintain medium distance, prefer high ground
  },
  {
    name: 'Elementalist',
    icon: '🌊',
    color: '#3498db',
    stats: { hpBonus: -5, attackBonus: 12, speed: 1.0 },
    abilities: ['Lightning', 'Ice Spike'],
    attackRange: 320, // increased from 220
    aiStrategy: 'caster'
  },
  {
    name: 'Necromancer',
    icon: '💀',
    color: '#8e44ad',
    stats: { hpBonus: 0, attackBonus: 10, speed: 0.8 },
    abilities: ['Death Bolt', 'Curse'],
    attackRange: 300, // increased from 200
    aiStrategy: 'caster'
  },
  {
    name: 'Arcanist',
    icon: '✨',
    color: '#a29bfe',
    stats: { hpBonus: -5, attackBonus: 13, speed: 1.0 },
    abilities: ['Arcane Blast', 'Magic Nova'],
    attackRange: 330, // increased from 230
    aiStrategy: 'caster'
  },
  {
    name: 'Witch Doctor',
    icon: '🦴',
    color: '#6c5ce7',
    stats: { hpBonus: 5, attackBonus: 8, speed: 0.9 },
    abilities: ['Voodoo', 'Poison Cloud'],
    attackRange: 260, // increased from 180
    aiStrategy: 'caster'
  },
  {
    name: 'Demolitionist',
    icon: '💣',
    color: '#fd79a8',
    stats: { hpBonus: 10, attackBonus: 14, speed: 0.7 },
    abilities: ['Explosion', 'Grenade'],
    attackRange: 380, // increased from 280
    aiStrategy: 'sniper' // throw explosives from distance
  },

  // Support/Hybrid
  {
    name: 'Priest',
    icon: '✝️',
    color: '#ecf0f1',
    stats: { hpBonus: 15, attackBonus: 3, speed: 0.9 },
    abilities: ['Holy Light', 'Smite'],
    attackRange: 220, // increased from 150
    aiStrategy: 'defensive'
  },
  {
    name: 'Acolyte',
    icon: '📿',
    color: '#bdc3c7',
    stats: { hpBonus: 10, attackBonus: 5, speed: 1.0 },
    abilities: ['Prayer', 'Divine Bolt'],
    attackRange: 230, // increased from 160
    aiStrategy: 'defensive'
  },
  {
    name: 'Monk',
    icon: '🙏',
    color: '#f39c12',
    stats: { hpBonus: 10, attackBonus: 7, speed: 1.2 },
    abilities: ['Palm Strike', 'Meditation'],
    attackRange: 160, // increased from 90
    aiStrategy: 'balanced' // mix of offense and defense
  },
  {
    name: 'Taoist',
    icon: '☯️',
    color: '#1abc9c',
    stats: { hpBonus: 5, attackBonus: 8, speed: 1.1 },
    abilities: ['Yin Yang', 'Chi Blast'],
    attackRange: 210, // increased from 140
    aiStrategy: 'balanced'
  },

  // Tech/Special
  {
    name: 'Mechanic',
    icon: '🔧',
    color: '#7f8c8d',
    stats: { hpBonus: 15, attackBonus: 6, speed: 0.8 },
    abilities: ['Turret', 'Wrench Throw'],
    attackRange: 280, // increased from 200
    aiStrategy: 'defensive' // set up and defend position
  },
  {
    name: 'Oathkeeper',
    icon: '⚖️',
    color: '#16a085',
    stats: { hpBonus: 20, attackBonus: 5, speed: 0.9 },
    abilities: ['Oath Strike', 'Justice'],
    attackRange: 170, // increased from 100
    aiStrategy: 'defensive'
  },
]

/**
 * Assigns a random class to a fighter
 * @param {Object} fighter - The fighter object
 * @returns {Object} - Fighter with class assigned
 */
export const assignRandomClass = (fighter) => {
  const randomClass = FIGHTER_CLASSES[Math.floor(Math.random() * FIGHTER_CLASSES.length)]

  return {
    ...fighter,
    class: randomClass,
    // Apply stat bonuses
    maxHP: fighter.maxHP + randomClass.stats.hpBonus,
    hp: fighter.hp + randomClass.stats.hpBonus,
    attackBonus: randomClass.stats.attackBonus,
    speedMultiplier: randomClass.stats.speed,
    attackRange: randomClass.attackRange, // Add attack range
    aiStrategy: randomClass.aiStrategy, // Add AI strategy
  }
}

/**
 * Gets a class-appropriate attack for a fighter
 * @param {Object} fighterClass - The fighter's class
 * @returns {Object} - Attack object
 */
export const getClassAttack = (fighterClass) => {
  const abilityName = fighterClass.abilities[Math.floor(Math.random() * fighterClass.abilities.length)]

  // Determine attack type based on class
  let type = 'melee'
  if (['Mage', 'Elementalist', 'Necromancer', 'Arcanist', 'Witch Doctor'].includes(fighterClass.name)) {
    type = 'magic'
  } else if (['Ranger', 'Gunner', 'Demolitionist'].includes(fighterClass.name)) {
    type = 'ranged'
  } else if (['Berserker', 'Brawler'].includes(fighterClass.name)) {
    type = 'heavy'
  }

  return {
    name: abilityName,
    icon: fighterClass.icon,
    type: type,
  }
}
