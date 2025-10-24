# Hackathon-TeamD-Poker

A simple 1v1 Poker game (Player vs Bot) built with TypeScript, Node.js, Express, and Tailwind CSS.

## Features

- **1v1 Poker Game**: Play Texas Hold'em poker against an AI bot
- **Web-based UI**: Clean interface with Tailwind CSS
- **Complete Game Logic**: Includes hand evaluation, betting rounds, and winner determination
- **Automated Bot**: Bot makes decisions based on hand strength
- **Real-time Updates**: Game state updates automatically via polling

## Project Structure

```
├── src/
│   ├── server.ts          # Express server and API endpoints
│   ├── game.ts            # Core game logic (dealing, betting, phases)
│   ├── bot.ts             # Bot AI logic
│   └── handEvaluator.ts   # Poker hand evaluation and comparison
├── public/
│   └── index.html         # Web UI with Tailwind CSS
├── package.json           # Project dependencies and scripts
└── tsconfig.json          # TypeScript configuration
```

## Installation

```bash
npm install
```

## Usage

### Development Mode
Run with TypeScript directly (no build required):
```bash
npm run dev
```

### Production Mode
Build and run the compiled JavaScript:
```bash
npm start
```

The game will be available at `http://localhost:3000`

## How to Play

1. Open your browser to `http://localhost:3000`
2. Click **Start New Game** to begin
3. View your two hole cards and make decisions:
   - **Fold**: Give up your hand
   - **Check**: Pass without betting (only when no bet to match)
   - **Call**: Match the current bet
   - **Raise**: Increase the bet by entering an amount
4. The bot will automatically make its decisions
5. Progress through the betting rounds (Preflop, Flop, Turn, River)
6. At showdown, the best hand wins!

## Game Rules

- Standard Texas Hold'em poker rules
- Blinds: Small blind (10 chips), Big blind (20 chips)
- Starting chips: 1000 for each player
- Hand rankings from high to low:
  - Royal Flush
  - Straight Flush
  - Four of a Kind
  - Full House
  - Flush
  - Straight
  - Three of a Kind
  - Two Pair
  - One Pair
  - High Card

## Technologies Used

- **TypeScript**: Type-safe JavaScript
- **Node.js**: Runtime environment
- **Express**: Web server framework
- **Tailwind CSS**: Utility-first CSS framework (via CDN)

## API Endpoints

- `POST /api/game/new`: Start a new game
- `GET /api/game/state`: Get current game state
- `POST /api/game/action`: Perform a player action (fold/check/call/raise)
- `GET /api/game/check`: Check game status and trigger bot actions
