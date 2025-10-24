/**
 * Card Renderer Module
 * Handles card rendering using sprite sheet positioning
 * Sprite sheet: /assets/poker-cards.png
 * Actual dimensions: 720px × 319px
 * Layout: 13 columns × 5 rows
 * Card dimensions: 55.38px × 63.8px per card
 * 
 * Row 1: A♥ 2♥ 3♥ 4♥ 5♥ 6♥ 7♥ 8♥ 9♥ 10♥ J♥ Q♥ K♥ (13 cards)
 * Row 2: A♦ 2♦ 3♦ 4♦ 5♦ 6♦ 7♦ 8♦ 9♦ 10♦ J♦ Q♦ K♦ (13 cards)
 * Row 3: A♠ 2♠ 3♠ 4♠ 5♠ 6♠ 7♠ 8♠ 9♠ 10♠ J♠ Q♠ K♠ (13 cards)
 * Row 4: A♣ 2♣ 3♣ 4♣ 5♣ 6♣ 7♣ 8♣ 9♣ 10♣ J♣ Q♣ K♣ (13 cards)
 * Row 5: Card backs × 8 (different colors)
 */

const CARD_WIDTH = 55.38;  // Width of each card in pixels
const CARD_HEIGHT = 63.8;   // Height of each card in pixels

export interface CardPosition {
  x: number;
  y: number;
}

export type CardCode = string; // e.g., "2H", "KS", "AC"

// Map of card codes to sprite positions
const CARD_MAP: Record<string, CardPosition> = {
  // Row 1 - Hearts: A♥ 2♥ 3♥ 4♥ 5♥ 6♥ 7♥ 8♥ 9♥ 10♥ J♥ Q♥ K♥
  'AH': { x: 0, y: 0 },
  '2H': { x: CARD_WIDTH * 1, y: 0 },
  '3H': { x: CARD_WIDTH * 2, y: 0 },
  '4H': { x: CARD_WIDTH * 3, y: 0 },
  '5H': { x: CARD_WIDTH * 4, y: 0 },
  '6H': { x: CARD_WIDTH * 5, y: 0 },
  '7H': { x: CARD_WIDTH * 6, y: 0 },
  '8H': { x: CARD_WIDTH * 7, y: 0 },
  '9H': { x: CARD_WIDTH * 8, y: 0 },
  '10H': { x: CARD_WIDTH * 9, y: 0 },
  'JH': { x: CARD_WIDTH * 10, y: 0 },
  'QH': { x: CARD_WIDTH * 11, y: 0 },
  'KH': { x: CARD_WIDTH * 12, y: 0 },
  
  // Row 2 - Diamonds: A♦ 2♦ 3♦ 4♦ 5♦ 6♦ 7♦ 8♦ 9♦ 10♦ J♦ Q♦ K♦
  'AD': { x: 0, y: CARD_HEIGHT },
  '2D': { x: CARD_WIDTH * 1, y: CARD_HEIGHT },
  '3D': { x: CARD_WIDTH * 2, y: CARD_HEIGHT },
  '4D': { x: CARD_WIDTH * 3, y: CARD_HEIGHT },
  '5D': { x: CARD_WIDTH * 4, y: CARD_HEIGHT },
  '6D': { x: CARD_WIDTH * 5, y: CARD_HEIGHT },
  '7D': { x: CARD_WIDTH * 6, y: CARD_HEIGHT },
  '8D': { x: CARD_WIDTH * 7, y: CARD_HEIGHT },
  '9D': { x: CARD_WIDTH * 8, y: CARD_HEIGHT },
  '10D': { x: CARD_WIDTH * 9, y: CARD_HEIGHT },
  'JD': { x: CARD_WIDTH * 10, y: CARD_HEIGHT },
  'QD': { x: CARD_WIDTH * 11, y: CARD_HEIGHT },
  'KD': { x: CARD_WIDTH * 12, y: CARD_HEIGHT },
  
  // Row 3 - Spades: A♠ 2♠ 3♠ 4♠ 5♠ 6♠ 7♠ 8♠ 9♠ 10♠ J♠ Q♠ K♠
  'AS': { x: 0, y: CARD_HEIGHT * 2 },
  '2S': { x: CARD_WIDTH * 1, y: CARD_HEIGHT * 2 },
  '3S': { x: CARD_WIDTH * 2, y: CARD_HEIGHT * 2 },
  '4S': { x: CARD_WIDTH * 3, y: CARD_HEIGHT * 2 },
  '5S': { x: CARD_WIDTH * 4, y: CARD_HEIGHT * 2 },
  '6S': { x: CARD_WIDTH * 5, y: CARD_HEIGHT * 2 },
  '7S': { x: CARD_WIDTH * 6, y: CARD_HEIGHT * 2 },
  '8S': { x: CARD_WIDTH * 7, y: CARD_HEIGHT * 2 },
  '9S': { x: CARD_WIDTH * 8, y: CARD_HEIGHT * 2 },
  '10S': { x: CARD_WIDTH * 9, y: CARD_HEIGHT * 2 },
  'JS': { x: CARD_WIDTH * 10, y: CARD_HEIGHT * 2 },
  'QS': { x: CARD_WIDTH * 11, y: CARD_HEIGHT * 2 },
  'KS': { x: CARD_WIDTH * 12, y: CARD_HEIGHT * 2 },
  
  // Row 4 - Clubs: A♣ 2♣ 3♣ 4♣ 5♣ 6♣ 7♣ 8♣ 9♣ 10♣ J♣ Q♣ K♣
  'AC': { x: 0, y: CARD_HEIGHT * 3 },
  '2C': { x: CARD_WIDTH * 1, y: CARD_HEIGHT * 3 },
  '3C': { x: CARD_WIDTH * 2, y: CARD_HEIGHT * 3 },
  '4C': { x: CARD_WIDTH * 3, y: CARD_HEIGHT * 3 },
  '5C': { x: CARD_WIDTH * 4, y: CARD_HEIGHT * 3 },
  '6C': { x: CARD_WIDTH * 5, y: CARD_HEIGHT * 3 },
  '7C': { x: CARD_WIDTH * 6, y: CARD_HEIGHT * 3 },
  '8C': { x: CARD_WIDTH * 7, y: CARD_HEIGHT * 3 },
  '9C': { x: CARD_WIDTH * 8, y: CARD_HEIGHT * 3 },
  '10C': { x: CARD_WIDTH * 9, y: CARD_HEIGHT * 3 },
  'JC': { x: CARD_WIDTH * 10, y: CARD_HEIGHT * 3 },
  'QC': { x: CARD_WIDTH * 11, y: CARD_HEIGHT * 3 },
  'KC': { x: CARD_WIDTH * 12, y: CARD_HEIGHT * 3 },
  
  // Row 5 - Card backs (8 different colored backs)
  'BACK': { x: 0, y: CARD_HEIGHT * 4 },
  'BACK_RED': { x: 0, y: CARD_HEIGHT * 4 },
  'BACK_RED2': { x: CARD_WIDTH, y: CARD_HEIGHT * 4 },
  'BACK_GREEN': { x: CARD_WIDTH * 2, y: CARD_HEIGHT * 4 },
  'BACK_GREEN2': { x: CARD_WIDTH * 3, y: CARD_HEIGHT * 4 },
  'BACK_BLUE': { x: CARD_WIDTH * 4, y: CARD_HEIGHT * 4 },
  'BACK_BLUE2': { x: CARD_WIDTH * 5, y: CARD_HEIGHT * 4 },
  'BACK_PINK': { x: CARD_WIDTH * 6, y: CARD_HEIGHT * 4 },
  'BACK_PINK2': { x: CARD_WIDTH * 7, y: CARD_HEIGHT * 4 },
};

/**
 * Convert game card format to card code
 * @param suit - hearts, diamonds, clubs, spades
 * @param rank - 2-10, J, Q, K, A
 * @returns CardCode like "2H", "KS", "AC"
 */
export function cardToCode(suit: string, rank: string): CardCode {
  const suitMap: Record<string, string> = {
    'hearts': 'H',
    'diamonds': 'D',
    'clubs': 'C',
    'spades': 'S'
  };
  
  return `${rank}${suitMap[suit]}`;
}

/**
 * Get sprite position for a card
 * @param code - Card code like "2H", "KS", or "BACK"
 * @returns Position object with x, y coordinates
 */
export function getCardPosition(code: CardCode): CardPosition {
  const position = CARD_MAP[code.toUpperCase()];
  
  if (!position) {
    console.warn(`Card code ${code} not found in map, using default back`);
    return CARD_MAP['BACK'];
  }
  
  return position;
}

/**
 * Create CSS background position string
 * @param code - Card code
 * @returns CSS background-position value
 */
export function getCardBackgroundPosition(code: CardCode): string {
  const pos = getCardPosition(code);
  return `-${pos.x}px -${pos.y}px`;
}

/**
 * Get card dimensions
 */
export function getCardDimensions() {
  return {
    width: CARD_WIDTH,
    height: CARD_HEIGHT
  };
}

// Export constants for use in other modules
export { CARD_WIDTH, CARD_HEIGHT, CARD_MAP };
