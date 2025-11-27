// Logo fetching utilities

// Known brand mappings with their logos
const KNOWN_BRANDS = {
  // Restaurants
  'mcdonalds': 'https://logo.clearbit.com/mcdonalds.com',
  'burger king': 'https://logo.clearbit.com/bk.com',
  'starbucks': 'https://logo.clearbit.com/starbucks.com',
  'subway': 'https://logo.clearbit.com/subway.com',
  'kfc': 'https://logo.clearbit.com/kfc.com',
  'pizza hut': 'https://logo.clearbit.com/pizzahut.com',
  'dominos': 'https://logo.clearbit.com/dominos.com',
  'taco bell': 'https://logo.clearbit.com/tacobell.com',
  'chipotle': 'https://logo.clearbit.com/chipotle.com',
  'wendys': 'https://logo.clearbit.com/wendys.com',
  'chick-fil-a': 'https://logo.clearbit.com/chick-fil-a.com',
  'dunkin': 'https://logo.clearbit.com/dunkindonuts.com',
  'papa johns': 'https://logo.clearbit.com/papajohns.com',
  'olive garden': 'https://logo.clearbit.com/olivegarden.com',
  'red lobster': 'https://logo.clearbit.com/redlobster.com',
  'outback': 'https://logo.clearbit.com/outback.com',
  'applebees': 'https://logo.clearbit.com/applebees.com',
  'buffalo wild wings': 'https://logo.clearbit.com/buffalowildwings.com',
  'cheesecake factory': 'https://logo.clearbit.com/thecheesecakefactory.com',
  'panera': 'https://logo.clearbit.com/panerabread.com',

  // Tech Companies
  'apple': 'https://logo.clearbit.com/apple.com',
  'google': 'https://logo.clearbit.com/google.com',
  'microsoft': 'https://logo.clearbit.com/microsoft.com',
  'amazon': 'https://logo.clearbit.com/amazon.com',
  'facebook': 'https://logo.clearbit.com/facebook.com',
  'meta': 'https://logo.clearbit.com/meta.com',
  'netflix': 'https://logo.clearbit.com/netflix.com',
  'twitter': 'https://logo.clearbit.com/twitter.com',
  'x': 'https://logo.clearbit.com/x.com',
  'tesla': 'https://logo.clearbit.com/tesla.com',
  'spotify': 'https://logo.clearbit.com/spotify.com',
  'uber': 'https://logo.clearbit.com/uber.com',
  'airbnb': 'https://logo.clearbit.com/airbnb.com',
  'slack': 'https://logo.clearbit.com/slack.com',
  'zoom': 'https://logo.clearbit.com/zoom.us',
  'discord': 'https://logo.clearbit.com/discord.com',
  'reddit': 'https://logo.clearbit.com/reddit.com',
  'linkedin': 'https://logo.clearbit.com/linkedin.com',
  'instagram': 'https://logo.clearbit.com/instagram.com',
  'tiktok': 'https://logo.clearbit.com/tiktok.com',
  'youtube': 'https://logo.clearbit.com/youtube.com',

  // Stores
  'walmart': 'https://logo.clearbit.com/walmart.com',
  'target': 'https://logo.clearbit.com/target.com',
  'costco': 'https://logo.clearbit.com/costco.com',
  'ikea': 'https://logo.clearbit.com/ikea.com',
  'best buy': 'https://logo.clearbit.com/bestbuy.com',
  'home depot': 'https://logo.clearbit.com/homedepot.com',
  'lowes': 'https://logo.clearbit.com/lowes.com',
}

/**
 * Attempts to fetch a logo for a given name
 * @param {string} name - The name to search for
 * @returns {Promise<string|null>} - URL to the logo or null if not found
 */
export const fetchLogo = async (name) => {
  if (!name) return null

  const normalizedName = name.toLowerCase().trim()

  // Check known brands first
  if (KNOWN_BRANDS[normalizedName]) {
    return KNOWN_BRANDS[normalizedName]
  }

  // Try partial matches
  for (const [brand, logo] of Object.entries(KNOWN_BRANDS)) {
    if (normalizedName.includes(brand) || brand.includes(normalizedName)) {
      return logo
    }
  }

  // Try to construct a domain from the name
  const domain = normalizedName.replace(/\s+/g, '') + '.com'
  const clearbitUrl = `https://logo.clearbit.com/${domain}`

  // Test if the logo exists
  try {
    const response = await fetch(clearbitUrl, { method: 'HEAD' })
    if (response.ok) {
      return clearbitUrl
    }
  } catch (error) {
    // Logo not found, return null
    console.log(`Logo not found for: ${name}`)
  }

  return null
}

/**
 * Validates if a URL is a valid image URL
 * @param {string} url - The URL to validate
 * @returns {Promise<boolean>} - True if valid image, false otherwise
 */
export const isValidImageUrl = async (url) => {
  if (!url) return false

  try {
    const response = await fetch(url, { method: 'HEAD' })
    const contentType = response.headers.get('content-type')
    return response.ok && contentType && contentType.startsWith('image/')
  } catch (error) {
    return false
  }
}

/**
 * Generate a placeholder logo using DiceBear API
 * @param {string} name - The name for the avatar
 * @param {string} style - Avatar style (pixel-art, identicon, shapes, etc.)
 * @returns {string} - URL to the generated avatar
 */
export const generatePlaceholderLogo = (name, style = 'pixel-art') => {
  const seed = encodeURIComponent(name)
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}&backgroundColor=transparent`
}

/**
 * Attempts to get the best logo for a contestant
 * Priority: Custom URL > Fetched Logo > Generated Placeholder
 * @param {string} name - The contestant name
 * @param {string} customUrl - Optional custom logo URL
 * @returns {Promise<string|null>} - Best available logo URL
 */
export const getBestLogo = async (name, customUrl = null) => {
  // If custom URL provided, validate and use it
  if (customUrl) {
    const isValid = await isValidImageUrl(customUrl)
    if (isValid) return customUrl
  }

  // Try to fetch from known sources
  const fetchedLogo = await fetchLogo(name)
  if (fetchedLogo) return fetchedLogo

  // Return null to use color-coded letter avatar instead
  // You can uncomment this to use generated placeholder:
  // return generatePlaceholderLogo(name)

  return null
}
