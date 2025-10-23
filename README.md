# Ace of Shadows

A mesmerizing card stacking animation built with TypeScript and PixiJS v7.

## Features

- **144 Card Sprites**: Each card is a proper PixiJS sprite, not a graphics object
- **Stacked Layout**: Cards are stacked with partial overlap, creating a deck-like appearance
- **Automatic Movement**: Every 1 second, the top card from the largest stack moves to a random different stack
- **Smooth Animation**: Card movement animations take exactly 2 seconds with easing
- **8 Stacks**: Cards are distributed across 8 different stacks

## Setup Instructions

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Build the Project**:
   ```bash
   npm run build
   ```

3. **Start the Application**:
   ```bash
   npm start
   ```

4. **Open in Browser**:
   Open `index.html` in your web browser to see the animation in action.

## Development

For development with auto-rebuild:
```bash
npm run dev
```

## How It Works

- The game creates 144 card sprites with a dark, shadowy appearance
- Cards are initially distributed evenly across 8 stacks
- Every second, the system finds the stack with the most cards
- The top card from that stack is moved to a randomly selected different stack
- The movement animation uses smooth easing over 2 seconds
- Cards maintain their stacking order and visual hierarchy

## Technical Details

- Built with TypeScript for type safety
- Uses PixiJS v7 for high-performance 2D rendering
- Implements proper sprite management and animation
- Cards have unique IDs and maintain stack positions
- Smooth easing functions for natural movement
