# Chip Assets Integration Guide

## Overview
Your poker game now includes visual chip representations that dynamically update based on chip counts for players and the pot.

## Assets Used
The following chip assets from the `/assets` folder are now integrated:

### Single Chips
- `chip-red.png` - Used for very small amounts (< 20 chips)
- `chip-teal.png` - Available for future use
- `chip-gold.png` - Used for small amounts (20-49 chips)

### Chip Stacks
- `chip-stack-red.png` - Used for small-medium amounts (50-99 chips)
- `chip-stack-teal.png` - Used for medium amounts (100-199 chips)
- `chip-stack-gold.png` - Used for medium-high amounts (200-499 chips)

### Large Chip Stacks
- `chips-stack-variant1.png` - Used for large amounts (500+ chips)
- `chips-stack-variant2.png` - Available for future use

## How It Works

### Chip Count Thresholds
The system automatically selects chip images based on the chip count:

| Chip Count | Image Displayed | Description |
|------------|----------------|-------------|
| 0 | None | No chips shown |
| 1-19 | chip-red.png | Single red chip |
| 20-49 | chip-gold.png | Single gold chip |
| 50-99 | chip-stack-red.png | Red chip stack |
| 100-199 | chip-stack-teal.png | Teal chip stack |
| 200-499 | chip-stack-gold.png | Gold chip stack |
| 500+ | chips-stack-variant1.png | Large variant stack |

### Display Locations
Chip visualizations appear in three locations:
1. **Player section** - Next to your chip count
2. **Bot section** - Next to the bot's chip count
3. **Pot section** - Next to the pot amount in the center

### Technical Implementation
- **Function**: `createChipVisualization(chipCount)` determines which chip images to display
- **Function**: `updateChipDisplay(elementId, chipCount)` updates the DOM with chip images
- **Update**: Called automatically in `updateUI()` whenever game state changes
- **Server**: Assets served via `/assets` route in Express

## Customization

### Adjusting Thresholds
To change when different chip images appear, edit the thresholds in `createChipVisualization()`:

```javascript
if (chipCount >= 500) {
    // Large amount
    chipImages.push({ src: '/assets/chips-stack-variant1.png', alt: 'Large chip stack' });
}
// ... etc
```

### Changing Chip Sizes
Chips are displayed at 12x12 (w-12 h-12 in Tailwind). To change size, modify:

```javascript
img.className = 'w-12 h-12 object-contain';
```

### Using Additional Assets
To use `chip-teal.png` or `chips-stack-variant2.png`, add them to the threshold conditions in `createChipVisualization()`.

## Testing
Start your server and the chip images will automatically appear:

```bash
npm start
```

Then visit `http://localhost:3000` and start a new game. As chip counts change through betting, the chip visualizations will update in real-time!

## Future Enhancements
Possible improvements:
- Show multiple chip stacks for very large amounts
- Animate chips moving to pot when betting
- Different chip colors for different bet amounts
- Chip sound effects
