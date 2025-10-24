/**
 * Client-side Card Renderer
 * Companion to cardRenderer.ts for browser use
 * Sprite sheet: 720px × 319px (13 columns × 5 rows)
 * Card cell: 55.38px × 63.8px
 */

// Card sprite dimensions (actual)
const CARD_WIDTH = 55.38;
const CARD_HEIGHT = 63.8;

// Card position map (matches server-side module)
const CARD_MAP = {
  // Row 1 - Hearts: A♥ through K♥ plus Joker
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
  
  // Row 2 - Diamonds
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
  
  // Row 3 - Spades
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
  
  // Row 4 - Clubs
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
  
  // Card backs - Row 5
  'BACK': { x: 0, y: CARD_HEIGHT * 4 }
};

/**
 * Convert game card object to card code
 * @param {Object} card - Card object with suit and rank
 * @returns {string} Card code like "2H", "KS"
 */
function cardToCode(card) {
  if (!card || !card.suit || !card.rank) {
    return 'BACK';
  }
  
  const suitMap = {
    'hearts': 'H',
    'diamonds': 'D',
    'clubs': 'C',
    'spades': 'S'
  };
  
  return `${card.rank}${suitMap[card.suit]}`;
}

/**
 * Get sprite position for a card code
 * @param {string} code - Card code like "2H", "KS", or "BACK"
 * @returns {Object} Position with x, y coordinates
 */
function getCardPosition(code) {
  const position = CARD_MAP[code.toUpperCase()];
  
  if (!position) {
    console.warn(`Card code ${code} not found, using back`);
    return CARD_MAP['BACK'];
  }
  
  return position;
}

/**
 * Create a card DOM element with sprite positioning
 * @param {Object} card - Card object with suit and rank
 * @param {boolean} isFaceDown - Whether to show card back
 * @param {string} size - Size variant: 'sm', 'md', 'lg', 'xl'
 * @param {boolean} animate - Whether to animate card entrance
 * @returns {HTMLElement} Card div element
 */
function createCardElement(card, isFaceDown = false, size = 'md', animate = false) {
  const cardDiv = document.createElement('div');
  
  // Base card class
  cardDiv.className = `card card-${size}`;
  
  // Add animation if requested
  if (animate) {
    cardDiv.className += ' card-deal';
  }
  
  // Determine card code
  const code = isFaceDown ? 'BACK' : cardToCode(card);
  const position = getCardPosition(code);
  
  // Set background position
  cardDiv.style.backgroundPosition = `-${position.x}px -${position.y}px`;
  
  // Add accessible label
  if (isFaceDown) {
    cardDiv.setAttribute('aria-label', 'Face down card');
    cardDiv.className += ' card-face-down card-static';
  } else if (card) {
    const suitNames = {
      'hearts': 'Hearts',
      'diamonds': 'Diamonds',
      'clubs': 'Clubs',
      'spades': 'Spades'
    };
    cardDiv.setAttribute('aria-label', `${card.rank} of ${suitNames[card.suit]}`);
  }
  
  return cardDiv;
}

/**
 * Render multiple cards into a container
 * @param {string} containerId - ID of container element
 * @param {Array} cards - Array of card objects
 * @param {boolean} isFaceDown - Whether to show all cards face down
 * @param {string} size - Size variant
 * @param {boolean} animate - Whether to animate cards
 */
function renderCards(containerId, cards, isFaceDown = false, size = 'md', animate = false) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container ${containerId} not found`);
    return;
  }
  
  // Clear existing cards
  container.innerHTML = '';
  
  // Add card hand class if not present
  if (!container.classList.contains('card-hand')) {
    container.classList.add('card-hand');
  }
  
  // Render each card
  cards.forEach((card, index) => {
    // Stagger animation delay
    const cardElement = createCardElement(card, isFaceDown, size, animate);
    
    if (animate) {
      cardElement.style.animationDelay = `${index * 0.1}s`;
    }
    
    container.appendChild(cardElement);
  });
}

/**
 * Update a card element to flip it face up
 * @param {HTMLElement} cardElement - Card element to flip
 * @param {Object} card - Card data to show
 */
function flipCard(cardElement, card) {
  cardElement.classList.add('card-flip');
  
  setTimeout(() => {
    const code = cardToCode(card);
    const position = getCardPosition(code);
    cardElement.style.backgroundPosition = `-${position.x}px -${position.y}px`;
    cardElement.classList.remove('card-face-down', 'card-static');
    
    const suitNames = {
      'hearts': 'Hearts',
      'diamonds': 'Diamonds',
      'clubs': 'Clubs',
      'spades': 'Spades'
    };
    cardElement.setAttribute('aria-label', `${card.rank} of ${suitNames[card.suit]}`);
  }, 250);
  
  setTimeout(() => {
    cardElement.classList.remove('card-flip');
  }, 500);
}

// Export functions for use in HTML script
window.CardRenderer = {
  createCardElement,
  renderCards,
  flipCard,
  cardToCode,
  getCardPosition
};
