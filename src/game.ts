import { Card, Rank, Suit } from './handEvaluator';

export interface Player {
  id: string;
  name: string;
  chips: number;
  hand: Card[];
  currentBet: number;
  folded: boolean;
  isBot: boolean;
}

export interface GameState {
  players: Player[];
  communityCards: Card[];
  pot: number;
  currentPlayerIndex: number;
  deck: Card[];
  phase: 'preflop' | 'flop' | 'turn' | 'river' | 'showdown' | 'ended';
  dealer: number;
  smallBlind: number;
  bigBlind: number;
}

const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
const ranks: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

function createDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({ suit, rank });
    }
  }
  return deck;
}

function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function createGame(existingChips?: { player: number; bot: number }): GameState {
  const deck = shuffleDeck(createDeck());
  
  const players: Player[] = [
    {
      id: 'player',
      name: 'Player',
      chips: existingChips?.player ?? 1000,
      hand: [],
      currentBet: 0,
      folded: false,
      isBot: false
    },
    {
      id: 'bot',
      name: 'Bot',
      chips: existingChips?.bot ?? 1000,
      hand: [],
      currentBet: 0,
      folded: false,
      isBot: true
    }
  ];

  return {
    players,
    communityCards: [],
    pot: 0,
    currentPlayerIndex: 0,
    deck,
    phase: 'preflop',
    dealer: 0,
    smallBlind: 10,
    bigBlind: 20
  };
}

export function dealHands(game: GameState): void {
  // Deal 2 cards to each player
  for (let i = 0; i < 2; i++) {
    for (const player of game.players) {
      if (game.deck.length > 0) {
        player.hand.push(game.deck.pop()!);
      }
    }
  }
}

export function postBlinds(game: GameState): void {
  const smallBlindPlayer = game.players[(game.dealer + 1) % 2];
  const bigBlindPlayer = game.players[(game.dealer + 2) % 2];
  
  smallBlindPlayer.currentBet = game.smallBlind;
  smallBlindPlayer.chips -= game.smallBlind;
  
  bigBlindPlayer.currentBet = game.bigBlind;
  bigBlindPlayer.chips -= game.bigBlind;
  
  game.pot = game.smallBlind + game.bigBlind;
  game.currentPlayerIndex = (game.dealer + 1) % 2; // Small blind acts first preflop
}

export function dealFlop(game: GameState): void {
  if (game.phase === 'preflop') {
    game.deck.pop(); // Burn card
    for (let i = 0; i < 3; i++) {
      if (game.deck.length > 0) {
        game.communityCards.push(game.deck.pop()!);
      }
    }
    game.phase = 'flop';
    game.currentPlayerIndex = (game.dealer + 1) % 2;
  }
}

export function dealTurn(game: GameState): void {
  if (game.phase === 'flop') {
    game.deck.pop(); // Burn card
    if (game.deck.length > 0) {
      game.communityCards.push(game.deck.pop()!);
    }
    game.phase = 'turn';
    game.currentPlayerIndex = (game.dealer + 1) % 2;
  }
}

export function dealRiver(game: GameState): void {
  if (game.phase === 'turn') {
    game.deck.pop(); // Burn card
    if (game.deck.length > 0) {
      game.communityCards.push(game.deck.pop()!);
    }
    game.phase = 'river';
    game.currentPlayerIndex = (game.dealer + 1) % 2;
  }
}

export function getMaxBet(game: GameState): number {
  return Math.max(...game.players.map(p => p.currentBet));
}

export function canCheck(game: GameState, playerId: string): boolean {
  const player = game.players.find(p => p.id === playerId);
  if (!player) return false;
  
  const maxBet = getMaxBet(game);
  return player.currentBet === maxBet;
}

export function playerAction(
  game: GameState,
  playerId: string,
  action: 'fold' | 'check' | 'call' | 'bet' | 'raise',
  amount?: number
): boolean {
  const playerIndex = game.players.findIndex(p => p.id === playerId);
  if (playerIndex === -1 || playerIndex !== game.currentPlayerIndex) {
    return false;
  }

  const player = game.players[playerIndex];
  const maxBet = getMaxBet(game);

  switch (action) {
    case 'fold':
      player.folded = true;
      game.phase = 'ended';
      break;
      
    case 'check':
      if (player.currentBet !== maxBet) return false;
      break;
      
    case 'call':
      const callAmount = maxBet - player.currentBet;
      if (player.chips < callAmount) return false;
      player.chips -= callAmount;
      player.currentBet = maxBet;
      game.pot += callAmount;
      break;
      
    case 'bet':
    case 'raise':
      if (!amount || amount <= 0) return false;
      const totalBet = player.currentBet + amount;
      if (totalBet <= maxBet || player.chips < amount) return false;
      player.chips -= amount;
      player.currentBet += amount;
      game.pot += amount;
      break;
      
    default:
      return false;
  }

  // Move to next player
  game.currentPlayerIndex = (game.currentPlayerIndex + 1) % game.players.length;
  
  return true;
}

export function isRoundComplete(game: GameState): boolean {
  const activePlayers = game.players.filter(p => !p.folded);
  if (activePlayers.length <= 1) return true;
  
  const maxBet = getMaxBet(game);
  return activePlayers.every(p => p.currentBet === maxBet);
}

export function advancePhase(game: GameState): void {
  // Reset current bets for next round
  game.players.forEach(p => p.currentBet = 0);
  
  switch (game.phase) {
    case 'preflop':
      dealFlop(game);
      break;
    case 'flop':
      dealTurn(game);
      break;
    case 'turn':
      dealRiver(game);
      break;
    case 'river':
      game.phase = 'showdown';
      break;
  }
}
