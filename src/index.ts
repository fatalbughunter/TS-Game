import { Game } from './Game.js';

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Initializing Ace of Shadows...');
    
    try {
        const game = new Game();
        await game.initialize();
        
        console.log('Ace of Shadows initialized with 144 cards');
        console.log('Cards will move between stacks every 1 second');
        console.log('Animation duration: 2 seconds');
    } catch (error) {
        console.error('Failed to initialize game:', error);
    }
});
