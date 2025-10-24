export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';

export interface Card {
  suit: Suit;
  rank: Rank;
}

export enum HandRank {
  HighCard = 0,
  OnePair = 1,
  TwoPair = 2,
  ThreeOfAKind = 3,
  Straight = 4,
  Flush = 5,
  FullHouse = 6,
  FourOfAKind = 7,
  StraightFlush = 8,
  RoyalFlush = 9
}

export interface HandResult {
  rank: HandRank;
  description: string;
  value: number[];
}

const rankValues: Record<Rank, number> = {
  '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
  '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14
};

function getRankValue(rank: Rank): number {
  return rankValues[rank];
}

function sortByRank(cards: Card[]): Card[] {
  return [...cards].sort((a, b) => getRankValue(b.rank) - getRankValue(a.rank));
}

function getRankCounts(cards: Card[]): Map<number, number> {
  const counts = new Map<number, number>();
  cards.forEach(card => {
    const value = getRankValue(card.rank);
    counts.set(value, (counts.get(value) || 0) + 1);
  });
  return counts;
}

function isFlush(cards: Card[]): boolean {
  const suit = cards[0].suit;
  return cards.every(card => card.suit === suit);
}

function isStraight(cards: Card[]): boolean {
  const sorted = sortByRank(cards);
  const values = sorted.map(c => getRankValue(c.rank));
  
  // Check for regular straight
  for (let i = 0; i < values.length - 1; i++) {
    if (values[i] - values[i + 1] !== 1) {
      // Check for Ace-low straight (A-2-3-4-5)
      if (values[0] === 14 && values[1] === 5 && values[2] === 4 && values[3] === 3 && values[4] === 2) {
        return true;
      }
      return false;
    }
  }
  return true;
}

export function evaluateHand(cards: Card[]): HandResult {
  if (cards.length !== 5) {
    throw new Error('Hand must contain exactly 5 cards');
  }

  const sorted = sortByRank(cards);
  const rankCounts = getRankCounts(cards);
  const counts = Array.from(rankCounts.values()).sort((a, b) => b - a);
  const flush = isFlush(cards);
  const straight = isStraight(cards);
  
  const values = sorted.map(c => getRankValue(c.rank));
  const sortedByCount = Array.from(rankCounts.entries())
    .sort((a, b) => {
      if (b[1] !== a[1]) return b[1] - a[1];
      return b[0] - a[0];
    })
    .map(([value]) => value);

  // Royal Flush
  if (flush && straight && values[0] === 14 && values[4] === 10) {
    return { rank: HandRank.RoyalFlush, description: 'Royal Flush', value: [10] };
  }

  // Straight Flush
  if (flush && straight) {
    return { rank: HandRank.StraightFlush, description: 'Straight Flush', value: [values[0]] };
  }

  // Four of a Kind
  if (counts[0] === 4) {
    return { rank: HandRank.FourOfAKind, description: 'Four of a Kind', value: sortedByCount };
  }

  // Full House
  if (counts[0] === 3 && counts[1] === 2) {
    return { rank: HandRank.FullHouse, description: 'Full House', value: sortedByCount };
  }

  // Flush
  if (flush) {
    return { rank: HandRank.Flush, description: 'Flush', value: values };
  }

  // Straight
  if (straight) {
    // Handle Ace-low straight
    if (values[0] === 14 && values[1] === 5) {
      return { rank: HandRank.Straight, description: 'Straight', value: [5] };
    }
    return { rank: HandRank.Straight, description: 'Straight', value: [values[0]] };
  }

  // Three of a Kind
  if (counts[0] === 3) {
    return { rank: HandRank.ThreeOfAKind, description: 'Three of a Kind', value: sortedByCount };
  }

  // Two Pair
  if (counts[0] === 2 && counts[1] === 2) {
    return { rank: HandRank.TwoPair, description: 'Two Pair', value: sortedByCount };
  }

  // One Pair
  if (counts[0] === 2) {
    return { rank: HandRank.OnePair, description: 'One Pair', value: sortedByCount };
  }

  // High Card
  return { rank: HandRank.HighCard, description: 'High Card', value: values };
}

export function compareHands(hand1: HandResult, hand2: HandResult): number {
  if (hand1.rank !== hand2.rank) {
    return hand1.rank - hand2.rank;
  }
  
  for (let i = 0; i < Math.min(hand1.value.length, hand2.value.length); i++) {
    if (hand1.value[i] !== hand2.value[i]) {
      return hand1.value[i] - hand2.value[i];
    }
  }
  
  return 0;
}
