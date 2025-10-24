# Hackathon Project Spec: Simple Poker Game (Player vs BOT)

## Objective

Create a functional web-based Poker game in under 3.5 hours using **TypeScript**, **Node.js**, **HTML**, **CSS (Tailwind)**. The player competes against an AI BOT that makes randomized but plausible decisions.

---

## Core Requirements

- **Stack:** Node.js + Express backend, TypeScript, basic front-end using HTML + Tailwind CSS.
- **Gameplay Mode:** 1v1 — player vs BOT (Texas Hold’em simplified to one betting round).
- **No multiplayer or persistence needed** — all in-memory.
- **Timebox:** 3.5 hours max to reach a playable demo.

---

## Core Components

### 1. Game Logic (Server)

- Initialize a deck of 52 cards.
- Deal two cards each to the player and BOT.
- Reveal three community cards (flop), one turn, and one river.
- Evaluate hands (pair, flush, etc.) using a simple hand-ranking utility.
- BOT logic:
  - Makes basic decisions (fold, call, raise) based on hand strength or random weight.
- Track bets, pot, and winner.

### 2. Backend API

Expose minimal endpoints:

- `GET /new-game` → initializes a new round.
- `POST /action` → handles player action (fold, call, raise).
- `GET /state` → returns current game state (cards, pot, decisions).

### 3. Frontend (Client)

- Minimal HTML page using Tailwind.
- Show:
  - Player hand.
  - Community cards.
  - BOT status.
  - Pot amount and buttons for Fold / Call / Raise.
- Use Fetch API to interact with the backend.

### 4. Structure

```
/poker-bot/
 ├── /src/
 │    ├── server.ts
 │    ├── game.ts
 │    ├── bot.ts
 │    └── handEvaluator.ts
 ├── /public/
 │    ├── index.html
 │    └── styles.css (generated via Tailwind)
 ├── package.json
 ├── tailwind.config.js
 └── tsconfig.json
```

---

## Stretch Goals (if time allows)

- Add sound or card-flip animation.
- Include chip visuals.
- Display simple AI commentary (“BOT folds”, “BOT raises 20”).
- Add restart button after round end.

---

## Success Criteria

- Game runs locally with `npm start`.
- Player can play at least one full round against BOT.
- No crashes, minimal logic errors.
- Looks clean and readable (Tailwind polish).

---

## Tone for Copilot

Use concise, modern TypeScript. Prioritize working code fast over perfection. Skip database, authentication, or build pipelines. Focus on the _feel_ of poker: draw cards, bet, reveal, win/lose message.
