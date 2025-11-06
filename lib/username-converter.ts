/**
 * Smart username converter: Khmer name to Latin username
 * Converts full names to valid login usernames
 * Examples:
 *   "សុខា" → "sukha"
 *   "សម្រាប់ សុខា" → "somrap_sukha"
 *   "Samnang Khouth" → "samnang_khouth"
 *   "Khmer English Mix" → "khmer_english_mix"
 */

// Khmer to Latin transliteration mapping
const KHMER_TO_LATIN_MAP: { [key: string]: string } = {
  // ក, ខ, គ, ឃ
  'ក': 'k', 'ខ': 'kh', 'គ': 'g', 'ឃ': 'kh',
  // ង, ច, ឆ, ជ, ឈ
  'ង': 'ng', 'ច': 'c', 'ឆ': 'ch', 'ជ': 'j', 'ឈ': 'ch',
  // ញ, ដ, ឋ, ឌ, ឍ
  'ញ': 'ny', 'ដ': 'd', 'ឋ': 'th', 'ឌ': 'd', 'ឍ': 'th',
  // ន, ប, ផ, ព, ភ
  'ន': 'n', 'ប': 'p', 'ផ': 'ph', 'ព': 'p', 'ភ': 'ph',
  // ម, យ, រ, ល, វ
  'ម': 'm', 'យ': 'y', 'រ': 'r', 'ល': 'l', 'វ': 'v',
  // ស, ហ, អ
  'ស': 's', 'ហ': 'h', 'អ': 'a',
  // Vowels: ា, ិ, ឹ, ឺ, ុ, ូ, ួ, ើ, ឿ, ៀ
  'ា': 'a', 'ិ': 'i', 'ឹ': 'i', 'ឺ': 'ei', 'ុ': 'u', 'ូ': 'u', 'ួ': 'ua',
  'ើ': 'ae', 'ឿ': 'ue', 'ៀ': 'ie',
  // Other vowels (ligatures)
  'ាំ': 'am', 'ាៃ': 'ai', 'ាច': 'ach',
  // Common vowel combinations
  'ឋ': 'th', 'ឌ': 'd',
};

/**
 * Convert Khmer text to Latin characters
 * @param khmerText The Khmer text to convert
 * @returns Latin representation of the Khmer text
 */
export function khmerToLatin(khmerText: string): string {
  if (!khmerText) return '';

  let result = '';
  for (const char of khmerText) {
    result += KHMER_TO_LATIN_MAP[char] || char;
  }
  return result;
}

/**
 * Normalize text for username: lowercase, replace spaces with underscores
 * @param text The text to normalize
 * @returns Normalized username-safe text
 */
export function normalizeUsername(text: string): string {
  if (!text) return '';

  // Convert to lowercase
  let normalized = text.toLowerCase().trim();

  // Remove accents and special characters, keep only alphanumeric and spaces
  normalized = normalized
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[ýÿ]/g, 'y')
    .replace(/[ñ]/g, 'n')
    .replace(/[ç]/g, 'c')
    .replace(/[^a-z0-9\s_-]/g, ''); // Keep only alphanumeric, spaces, underscores, hyphens

  // Replace multiple spaces with single underscore
  normalized = normalized.replace(/\s+/g, '_');

  // Replace multiple underscores with single underscore
  normalized = normalized.replace(/_+/g, '_');

  // Remove leading/trailing underscores
  normalized = normalized.replace(/^_+|_+$/g, '');

  return normalized;
}

/**
 * Convert full name (Khmer or English) to username
 * Smart function that:
 * - Converts Khmer to Latin
 * - Normalizes to alphanumeric + underscores
 * - Replaces spaces with underscores
 * - Handles both Khmer and English names
 *
 * @param fullName The person's full name
 * @returns Generated username
 * @example
 * nameToUsername("សុខា") → "sukha"
 * nameToUsername("សម្រាប់ សុខា") → "somrap_sukha"
 * nameToUsername("Samnang Khouth") → "samnang_khouth"
 */
export function nameToUsername(fullName: string): string {
  if (!fullName || fullName.trim().length === 0) {
    return '';
  }

  // Step 1: Check if it contains Khmer characters
  const khmerRegex = /[\u1780-\u17FF]/g; // Unicode range for Khmer
  const hasKhmer = khmerRegex.test(fullName);

  let latinized = fullName;

  if (hasKhmer) {
    // If it contains Khmer, convert Khmer characters to Latin
    latinized = '';
    for (const char of fullName) {
      if (/[\u1780-\u17FF]/.test(char)) {
        // Khmer character - convert it
        latinized += khmerToLatin(char);
      } else {
        // Not Khmer - keep as is
        latinized += char;
      }
    }
  }

  // Step 2: Normalize the text
  const username = normalizeUsername(latinized);

  // Step 3: Ensure it's not empty and meets minimum requirements
  if (username.length === 0) {
    // Fallback if conversion resulted in empty string
    return 'user_' + Date.now().toString().slice(-6);
  }

  if (username.length < 3) {
    // Pad if too short
    return username + '_' + Math.random().toString(36).substring(2, 5);
  }

  return username;
}

/**
 * Generate a unique username by appending a counter if needed
 * @param baseUsername The base username to start with
 * @param existingUsernames Set of existing usernames to check against
 * @returns A unique username
 */
export function generateUniqueUsername(
  baseUsername: string,
  existingUsernames: Set<string>
): string {
  if (!existingUsernames.has(baseUsername)) {
    return baseUsername;
  }

  // Append numbers until we find a unique one
  for (let i = 1; i <= 999; i++) {
    const candidateUsername = `${baseUsername}${i}`;
    if (!existingUsernames.has(candidateUsername)) {
      return candidateUsername;
    }
  }

  // Fallback: use timestamp
  return `${baseUsername}_${Date.now()}`;
}

/**
 * Validate username format
 * @param username The username to validate
 * @returns True if valid, false otherwise
 */
export function isValidUsername(username: string): boolean {
  if (!username || username.length < 3) return false;
  if (username.length > 50) return false;
  // Allow only alphanumeric, underscores, and hyphens
  return /^[a-z0-9_-]+$/.test(username);
}
