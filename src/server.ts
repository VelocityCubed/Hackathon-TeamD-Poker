import express, { Request, Response } from 'express';
import path from 'path';
import {
  createGame,
  dealHands,
  postBlinds,
  playerAction,
  isRoundComplete,
  advancePhase,
  GameState,
  canCheck,
  getMaxBet
} from './game';
import { executeBotTurn } from './bot';
import { evaluateHand, compareHands, Card } from './handEvaluator';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));
app.use('/assets', express.static(path.join(__dirname, '../assets')));

let currentGame: GameState | null = null;

// Initialize new game (fresh start with 1000 chips)
app.post('/api/game/new', (req: Request, res: Response) => {
  currentGame = createGame();
  dealHands(currentGame);
  postBlinds(currentGame);
  
  // If it's bot's turn after blinds, execute bot turn
  if (currentGame.currentPlayerIndex === 1) {
    setTimeout(() => {
      if (currentGame) {
        executeBotTurn(currentGame);
      }
    }, 500);
  }
  
  res.json({
    success: true,
    game: sanitizeGameState(currentGame, 'player')
  });
});

app.post('/api/game/reset', (_req: Request, res: Response) => {
  currentGame = null;
  res.json({ success: true });
});

// Start new round (preserve existing chip counts)
app.post('/api/game/next-round', (req: Request, res: Response) => {
  if (!currentGame) {
    return res.status(404).json({ success: false, error: 'No active game' });
  }
  
  // Save current chip counts
  const player = currentGame.players.find(p => p.id === 'player');
  const bot = currentGame.players.find(p => p.id === 'bot');
  
  if (!player || !bot) {
    return res.status(400).json({ success: false, error: 'Invalid game state' });
  }
  
  // Check if either player is out of chips
  if (player.chips <= 0 || bot.chips <= 0) {
    return res.json({
      success: false,
      error: 'Game over - one player is out of chips',
      gameOver: true
    });
  }
  
  // Create new round with existing chip counts
  currentGame = createGame({ player: player.chips, bot: bot.chips });
  dealHands(currentGame);
  postBlinds(currentGame);
  
  // If it's bot's turn after blinds, execute bot turn
  if (currentGame.currentPlayerIndex === 1) {
    setTimeout(() => {
      if (currentGame) {
        executeBotTurn(currentGame);
      }
    }, 500);
  }
  
  res.json({
    success: true,
    game: sanitizeGameState(currentGame, 'player')
  });
});

// Get current game state
app.get('/api/game/state', (req: Request, res: Response) => {
  if (!currentGame) {
    return res.status(404).json({ success: false, error: 'No active game' });
  }
  
  res.json({
    success: true,
    game: sanitizeGameState(currentGame, 'player')
  });
});

// Player action
app.post('/api/game/action', (req: Request, res: Response) => {
  if (!currentGame) {
    return res.status(404).json({ success: false, error: 'No active game' });
  }
  
  const game = currentGame;
  const { action, amount } = req.body;
  const player = game.players.find(p => p.id === 'player');
  
  if (!player || player.folded) {
    return res.status(400).json({ success: false, error: 'Player cannot act' });
  }
  
  if (game.currentPlayerIndex !== 0) {
    return res.status(400).json({ success: false, error: 'Not player turn' });
  }
  
  const success = playerAction(game, 'player', action, amount);
  
  if (!success) {
    return res.status(400).json({ success: false, error: 'Invalid action' });
  }
  
  // Check if round is complete
  if (isRoundComplete(game)) {
    if (game.phase !== 'ended' && game.phase !== 'showdown') {
      advancePhase(game);
    }
    
    if (game.phase === 'showdown') {
      const winner = determineWinner(game);
      return res.json({
        success: true,
        game: sanitizeGameState(game, 'player'),
        winner
      });
    }
  }
  
  // Bot turn - schedule bot action after player action
  setTimeout(() => {
    const currentGameRef = currentGame;
    if (currentGameRef && currentGameRef.currentPlayerIndex === 1 && !currentGameRef.players[1].folded) {
      executeBotTurn(currentGameRef);
      
      if (isRoundComplete(currentGameRef)) {
        if (currentGameRef.phase !== 'ended' && currentGameRef.phase !== 'showdown') {
          advancePhase(currentGameRef);
        }
      }
    }
  }, 500);
  
  res.json({
    success: true,
    game: sanitizeGameState(game, 'player')
  });
});

// Check game status
app.get('/api/game/check', (req: Request, res: Response) => {
  if (!currentGame) {
    return res.status(404).json({ success: false, error: 'No active game' });
  }
  
  const game = currentGame;
  
  // If it's bot's turn, execute bot action
  if (game.currentPlayerIndex === 1 && !game.players[1].folded && 
      game.phase !== 'showdown' && game.phase !== 'ended') {
    executeBotTurn(game);
    
    // Check if we need to advance to next phase
    if (isRoundComplete(game)) {
      advancePhase(game);
      
      // After advancing, schedule another check to see if bot needs to act again
      setTimeout(() => {
        // Re-check game state after advance - don't try to execute if in showdown/ended
        const currentRef = currentGame;
        if (currentRef && currentRef.currentPlayerIndex === 1 && 
            !currentRef.players[1].folded) {
          // This check will only execute bot if not in showdown/ended
          const phase = currentRef.phase;
          if (phase === 'preflop' || phase === 'flop' || phase === 'turn' || phase === 'river') {
            executeBotTurn(currentRef);
          }
        }
      }, 300);
    }
  }
  
  let winner = null;
  if (game.phase === 'showdown' || game.phase === 'ended') {
    winner = determineWinner(game);
  }
  
  res.json({
    success: true,
    game: sanitizeGameState(game, 'player'),
    winner
  });
});

function sanitizeGameState(game: GameState, playerId: string) {
  const sanitized = {
    ...game,
    players: game.players.map(p => ({
      ...p,
      hand: p.id === playerId || game.phase === 'showdown' ? p.hand : []
    }))
  };
  return sanitized;
}

function determineWinner(game: GameState): { winnerId: string; hand: string; winAmount: number } | null {
  const activePlayers = game.players.filter(p => !p.folded);
  
  if (activePlayers.length === 1) {
    const winner = activePlayers[0];
    const potAmount = game.pot;
    if (potAmount > 0) {
      winner.chips += potAmount;
    }
    finalizeRound(game, winner.id);
    return {
      winnerId: winner.id,
      hand: 'Opponent folded',
      winAmount: potAmount
    };
  }
  
  if (game.communityCards.length < 5) {
    return null;
  }
  
  let bestPlayer = activePlayers[0];
  let bestHand = findBestHand([...bestPlayer.hand, ...game.communityCards]);
  
  for (let i = 1; i < activePlayers.length; i++) {
    const player = activePlayers[i];
    const hand = findBestHand([...player.hand, ...game.communityCards]);
    
    if (compareHands(hand, bestHand) > 0) {
      bestPlayer = player;
      bestHand = hand;
    }
  }
  
  const potAmount = game.pot;
  if (potAmount > 0) {
    bestPlayer.chips += potAmount;
  }
  finalizeRound(game, bestPlayer.id);
  
  return {
    winnerId: bestPlayer.id,
    hand: bestHand.description,
    winAmount: potAmount
  };
}

function finalizeRound(game: GameState, winnerId: string) {
  game.players.forEach(player => {
    player.currentBet = 0;
  });
  game.pot = 0;
  game.playersActedThisRound = [];
  game.phase = 'ended';
}

function findBestHand(cards: Card[]) {
  if (cards.length === 5) {
    return evaluateHand(cards);
  }
  
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

app.listen(PORT, () => {
  console.log(`Poker server running on http://localhost:${PORT}`);
});
