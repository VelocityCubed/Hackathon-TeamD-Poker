import { GameState, getMaxBet, playerAction } from './game';
import { evaluateHand, Card, compareHands } from './handEvaluator';

export function getBotAction(game: GameState): { action: 'fold' | 'check' | 'call' | 'bet' | 'raise'; amount?: number } {
  const bot = game.players.find(p => p.isBot);
  if (!bot || bot.folded) {
    return { action: 'fold' };
  }

  const maxBet = getMaxBet(game);
  const callAmount = maxBet - bot.currentBet;
  
  // Simple bot strategy
  const handStrength = evaluateBotHand(bot.hand, game.communityCards);
  const random = Math.random();
  
  // Very weak hand - fold if need to call
  if (handStrength < 0.3) {
    if (callAmount > 0) {
      return { action: 'fold' };
    }
    return { action: 'check' };
  }
  
  // Weak hand - check or call small bets
  if (handStrength < 0.5) {
    if (callAmount === 0) {
      return { action: 'check' };
    }
    if (callAmount <= bot.chips * 0.1) {
      return { action: 'call' };
    }
    return { action: 'fold' };
  }
  
  // Medium hand - call or small raise
  if (handStrength < 0.7) {
    if (callAmount === 0) {
      if (random > 0.6) {
        const raiseAmount = Math.min(game.bigBlind * 2, bot.chips);
        return { action: 'bet', amount: raiseAmount };
      }
      return { action: 'check' };
    }
    if (callAmount <= bot.chips * 0.2) {
      return { action: 'call' };
    }
    return { action: 'fold' };
  }
  
  // Strong hand - raise or call
  if (callAmount === 0) {
    const raiseAmount = Math.min(game.bigBlind * 3, bot.chips);
    return { action: 'bet', amount: raiseAmount };
  }
  
  if (random > 0.3) {
    const raiseAmount = Math.min(callAmount * 2, bot.chips - callAmount);
    if (raiseAmount > 0) {
      return { action: 'call' }; // Simplified - just call for now
    }
  }
  
  return { action: 'call' };
}

function evaluateBotHand(hand: Card[], communityCards: Card[]): number {
  if (hand.length === 0) return 0;
  
  // Pre-flop evaluation
  if (communityCards.length === 0) {
    return evaluatePreFlop(hand);
  }
  
  // Post-flop evaluation - use best 5-card combination
  const allCards = [...hand, ...communityCards];
  if (allCards.length < 5) return 0.3;
  
  const bestHand = findBestHand(allCards);
  const handRank = bestHand.rank;
  
  // Normalize hand rank to 0-1 scale
  return (handRank + 1) / 10;
}

function evaluatePreFlop(hand: Card[]): number {
  if (hand.length !== 2) return 0.3;
  
  const [card1, card2] = hand;
  const values: Record<string, number> = {
    '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
    '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14
  };
  
  const val1 = values[card1.rank];
  const val2 = values[card2.rank];
  const isPair = val1 === val2;
  const isSuited = card1.suit === card2.suit;
  const highCard = Math.max(val1, val2);
  
  if (isPair) {
    return 0.5 + (highCard / 28); // Pairs are good
  }
  
  if (isSuited && highCard >= 11) {
    return 0.6;
  }
  
  if (highCard >= 13) {
    return 0.55; // High cards
  }
  
  return 0.3 + (highCard / 50);
}

function findBestHand(cards: Card[]) {
  if (cards.length === 5) {
    return evaluateHand(cards);
  }
  
  // Generate all 5-card combinations
  const combinations = getCombinations(cards, 5);
  let bestHand = evaluateHand(combinations[0]);
  
  for (const combo of combinations) {
    const handResult = evaluateHand(combo);
    if (compareHands(handResult, bestHand) > 0) {
      bestHand = handResult;
    }
  }
  
  return bestHand;
}

function getCombinations(array: Card[], size: number): Card[][] {
  if (size > array.length) return [];
  if (size === array.length) return [array];
  if (size === 1) return array.map(item => [item]);
  
  const combinations: Card[][] = [];
  
  for (let i = 0; i <= array.length - size; i++) {
    const head = array[i];
    const tailCombos = getCombinations(array.slice(i + 1), size - 1);
    for (const combo of tailCombos) {
      combinations.push([head, ...combo]);
    }
  }
  
  return combinations;
}

export function executeBotTurn(game: GameState): void {
  const bot = game.players.find(p => p.isBot);
  if (!bot || bot.folded || game.currentPlayerIndex !== game.players.indexOf(bot)) {
    return;
  }
  
  const botAction = getBotAction(game);
  playerAction(game, bot.id, botAction.action, botAction.amount);
}
