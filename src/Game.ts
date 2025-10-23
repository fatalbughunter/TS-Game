import { Card } from './Card.js';
import { CardStack } from './CardStack.js';
import { Menu } from './Menu.js';
import { MagicWords } from './MagicWords.js';
import { PhoenixFlame } from './PhoenixFlame.js';

// Use global PIXI object from CDN
declare const PIXI: any;

export class Game {
    private app!: any;
    private stacks: CardStack[] = [];
    private cards: Card[] = [];
    private menu!: Menu;
    private magicWords!: MagicWords;
    private phoenixFlame!: PhoenixFlame;
    private gameStarted: boolean = false;
    private exitButton!: any;
    private fpsText!: any;
    private moveTimer: number = 0;
    private readonly MOVE_INTERVAL = 1000; // 1 second
    private readonly ANIMATION_DURATION = 2000; // 2 seconds
    private readonly TOTAL_CARDS = 144;
    private readonly STACK_COUNT = 8;
    private autoMoveTimer: NodeJS.Timeout | null = null;
    private isAutoMoving: boolean = false;
    
    constructor() {
        // Don't call async method in constructor
    }
    
    public async initialize(): Promise<void> {
        console.log('Creating PixiJS Application...');
        
        // Get container first
        const container = document.getElementById('game-container');
        if (!container) {
            console.error('Game container not found!');
            return;
        }
        
        // Get responsive dimensions
        const dimensions = this.getResponsiveDimensions();
        
        this.app = new PIXI.Application({
            width: dimensions.width,
            height: dimensions.height,
            background: 0x0a0a0a,
            antialias: true,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
            resizeTo: container
        });
        
        console.log('Application created, adding canvas to DOM...');
        container.appendChild(this.app.view as HTMLCanvasElement);
        console.log('Canvas added to DOM');
        
        // Add resize listener
        window.addEventListener('resize', () => this.handleResize());
        window.addEventListener('orientationchange', () => {
            setTimeout(() => this.handleResize(), 100);
        });
        
        // Add full screen support
        this.addFullScreenSupport();
        
        console.log('Creating menu...');
        this.createMenu();
        console.log('Menu created, showing menu screen...');
        this.menu.show();
        
        // Create FPS counter
        this.createFPSCounter();
        
        console.log('Game initialization complete!');
    }
    
    private createMenu(): void {
        this.menu = new Menu(this.app, () => this.startGame(), () => this.showMagicWords(), () => this.showPhoenixFlame());
        this.magicWords = new MagicWords(this.app, () => this.backToMenu());
        this.phoenixFlame = new PhoenixFlame(this.app, () => this.backToMenu());
    }

    private startGame(): void {
        console.log('Starting game...');
        this.gameStarted = true;
        this.menu.hide();
        
        console.log('Creating exit button...');
        this.createExitButton();
        console.log('Creating stacks...');
        this.createStacks();
        console.log('Creating cards...');
        this.createCards();
        
        // Add visual test - make all cards flash to show they exist
        setTimeout(() => {
            console.log('🔍 Testing card visibility - making all cards flash');
            for (const card of this.cards) {
                card.alpha = 0.3; // Make them semi-transparent
            }
        }, 1000);
        
        setTimeout(() => {
            console.log('🔍 Restoring card visibility');
            for (const card of this.cards) {
                card.alpha = 1.0; // Make them fully visible again
            }
        }, 2000);
        console.log('Setting up game loop...');
        this.setupGameLoop();
        // Force reset all card animation states
        console.log('🔧 Resetting all card animation states...');
        for (const card of this.cards) {
            card.isAnimating = false;
        }
        
        console.log('Starting automatic card movement...');
        this.startAutoMovement();
        
        // Add multiple manual test triggers for debugging
        setTimeout(() => {
            console.log('🧪 Manual test trigger 1 - attempting card move');
            this.performAutoMove();
        }, 2000);
        
        setTimeout(() => {
            console.log('🧪 Manual test trigger 2 - attempting card move');
            this.performAutoMove();
        }, 5000);
        
        setTimeout(() => {
            console.log('🧪 Manual test trigger 3 - attempting card move');
            this.performAutoMove();
        }, 8000);
        
        // Add extreme test - force a card to move to screen center
        setTimeout(() => {
            console.log('🎯 EXTREME TEST - Moving card to screen center');
            if (this.cards.length > 0) {
                const testCard = this.cards[0];
                console.log(`🎯 Moving card from (${testCard.x}, ${testCard.y}) to screen center`);
                testCard.x = window.innerWidth / 2;
                testCard.y = window.innerHeight / 2;
                testCard.scale.set(3.0, 3.0); // Make it HUGE
                testCard.alpha = 1.0;
                console.log(`🎯 Card moved to (${testCard.x}, ${testCard.y}) with scale ${testCard.scale.x}`);
            }
        }, 10000);
        
        // Add animation state reset every 5 seconds
        setInterval(() => {
            console.log('🔧 Periodic animation state reset...');
            let stuckCards = 0;
            for (const card of this.cards) {
                if (card.isAnimating) {
                    stuckCards++;
                    card.isAnimating = false;
                }
            }
            if (stuckCards > 0) {
                console.log(`🔧 Reset ${stuckCards} stuck card animations`);
            }
        }, 5000);
        
        console.log('Game started!');
    }

    private backToMenu(): void {
        console.log('Returning to menu...');
        this.gameStarted = false;
        this.magicWords.hide();
        this.phoenixFlame.hide();
        this.menu.show();
    }

    public showMagicWords(): void {
        console.log('Showing Magic Words...');
        this.menu.hide();
        this.magicWords.show();
    }

    public showPhoenixFlame(): void {
        console.log('Showing Phoenix Flame...');
        this.menu.hide();
        this.phoenixFlame.show();
    }

    private createExitButton(): void {
        const buttonContainer = new PIXI.Container();
        
        // Create modern exit button background with gradient effect
        const buttonBg = new PIXI.Graphics();
        
        // Modern dark theme with subtle gradient
        buttonBg.beginFill(0x2C2C2C); // Dark gray base
        buttonBg.lineStyle(1, 0x404040); // Subtle border
        buttonBg.drawRoundedRect(-18, -18, 36, 36, 8);
        buttonBg.endFill();
        
        // Add subtle inner shadow
        buttonBg.beginFill(0x1A1A1A, 0.6);
        buttonBg.drawRoundedRect(-16, -16, 34, 34, 6);
        buttonBg.endFill();
        
        // Add highlight for modern look
        buttonBg.beginFill(0x404040, 0.3);
        buttonBg.drawRoundedRect(-18, -18, 36, 8, 8);
        buttonBg.endFill();
        
        buttonContainer.addChild(buttonBg);
        
        // Create modern X symbol with better styling
        const xGraphics = new PIXI.Graphics();
        xGraphics.lineStyle(2.5, 0xE0E0E0, 0.9); // Light gray with transparency
        xGraphics.moveTo(-10, -10);
        xGraphics.lineTo(10, 10);
        xGraphics.moveTo(10, -10);
        xGraphics.lineTo(-10, 10);
        buttonContainer.addChild(xGraphics);
        
        // Add subtle glow effect
        const glowGraphics = new PIXI.Graphics();
        glowGraphics.lineStyle(4, 0xE0E0E0, 0.2);
        glowGraphics.moveTo(-10, -10);
        glowGraphics.lineTo(10, 10);
        glowGraphics.moveTo(10, -10);
        glowGraphics.lineTo(-10, 10);
        buttonContainer.addChildAt(glowGraphics, 0); // Behind the main X
        
        // Position button in top right corner
        buttonContainer.x = this.app.screen.width - 35;
        buttonContainer.y = 35;
        
        // Make button interactive
        buttonContainer.interactive = true;
        buttonContainer.buttonMode = true;
        
        // Add modern hover effects
        buttonContainer.on('pointerover', () => {
            buttonContainer.scale.set(1.1);
            buttonBg.tint = 0x404040; // Lighter on hover
            xGraphics.tint = 0xFFFFFF; // Brighter X on hover
        });
        
        buttonContainer.on('pointerout', () => {
            buttonContainer.scale.set(1.0);
            buttonBg.tint = 0xFFFFFF; // Reset tint
            xGraphics.tint = 0xFFFFFF; // Reset X tint
        });
        
        // Add click handler
        buttonContainer.on('pointerdown', () => {
            console.log('Exit button clicked - returning to menu');
            this.exitToMenu();
        });
        
        this.exitButton = buttonContainer;
        this.app.stage.addChild(buttonContainer);
        // Ensure exit button is on top
        this.app.stage.setChildIndex(buttonContainer, this.app.stage.children.length - 1);
    }

    private exitToMenu(): void {
        console.log('Exiting to menu...');
        this.gameStarted = false;
        
        // Hide exit button
        if (this.exitButton) {
            this.app.stage.removeChild(this.exitButton);
        }
        
        // Clear game objects
        this.clearGame();
        
        // Show menu
        this.menu.show();
        console.log('Returned to menu');
    }

    private clearGame(): void {
        // Remove all stacks
        for (const stack of this.stacks) {
            this.app.stage.removeChild(stack);
        }
        this.stacks = [];
        
        // Clear cards array
        this.cards = [];
        
        // Reset move timer
        this.moveTimer = 0;
        
        // Stop automatic movement
        this.stopAutoMovement();
    }

    private createStacks(): void {
        for (let i = 0; i < this.STACK_COUNT; i++) {
            const stack = new CardStack(i);
            this.stacks.push(stack);
            this.app.stage.addChild(stack);
        }
    }
    
    private createCards(): void {
        // Create card texture
        console.log('Creating card texture...');
        const cardTexture = this.createCardTexture();
        console.log('Card texture created');
        
        // Create 144 cards
        console.log(`Creating ${this.TOTAL_CARDS} cards...`);
        for (let i = 0; i < this.TOTAL_CARDS; i++) {
            const card = new Card(i, cardTexture);
            this.cards.push(card);
        }
        console.log(`${this.cards.length} cards created`);
        
        // Distribute cards evenly across stacks
        console.log('Distributing cards across stacks...');
        this.distributeCards();
        console.log('Cards distributed');
    }
    
    private createCardTexture(): any {
        const graphics = new PIXI.Graphics();
        
        // Create royal blue card back with white diamond grid pattern
        // Main card body with royal blue background
        graphics.beginFill(0x4169E1); // Royal blue color
        graphics.drawRoundedRect(0, 0, 120, 160, 8);
        graphics.endFill();
        
        // Clean white border
        graphics.lineStyle(3, 0xFFFFFF); // Clean white border
        graphics.drawRoundedRect(0, 0, 120, 160, 8);
        
        // Create white diamond grid pattern
        graphics.lineStyle(1, 0xFFFFFF); // White lines for diamonds
        
        // Calculate grid spacing for diamond pattern
        const gridSize = 12; // Size of each diamond for larger card
        const startX = 6;
        const startY = 6;
        const endX = 114;
        const endY = 154;
        
        // Draw horizontal lines for diamond grid
        for (let y = startY; y <= endY; y += gridSize) {
            graphics.moveTo(startX, y);
            graphics.lineTo(endX, y);
        }
        
        // Draw vertical lines for diamond grid
        for (let x = startX; x <= endX; x += gridSize) {
            graphics.moveTo(x, startY);
            graphics.lineTo(x, endY);
        }
        
        // Draw diagonal lines to create diamond pattern
        // Top-left to bottom-right diagonals
        for (let i = 0; i < (endX - startX) / gridSize; i++) {
            const x1 = startX + i * gridSize;
            const y1 = startY;
            const x2 = startX + (i + 1) * gridSize;
            const y2 = startY + gridSize;
            
            if (x2 <= endX && y2 <= endY) {
                graphics.moveTo(x1, y1);
                graphics.lineTo(x2, y2);
            }
        }
        
        // Bottom-left to top-right diagonals
        for (let i = 0; i < (endX - startX) / gridSize; i++) {
            const x1 = startX + i * gridSize;
            const y1 = startY + gridSize;
            const x2 = startX + (i + 1) * gridSize;
            const y2 = startY;
            
            if (x2 <= endX && y2 >= startY) {
                graphics.moveTo(x1, y1);
                graphics.lineTo(x2, y2);
            }
        }
        
        // Add subtle 3D effect with highlight
        graphics.beginFill(0x5B9BD5, 0.3); // Light blue highlight
        graphics.drawRoundedRect(2, 2, 116, 18, 4);
        graphics.endFill();
        
        return this.app.renderer.generateTexture(graphics);
    }
    
    private distributeCards(): void {
        const cardsPerStack = Math.floor(this.TOTAL_CARDS / this.STACK_COUNT);
        const remainingCards = this.TOTAL_CARDS % this.STACK_COUNT;
        
        let cardIndex = 0;
        
        for (let stackIndex = 0; stackIndex < this.STACK_COUNT; stackIndex++) {
            const cardsInThisStack = cardsPerStack + (stackIndex < remainingCards ? 1 : 0);
            
            for (let i = 0; i < cardsInThisStack; i++) {
                const card = this.cards[cardIndex];
                this.stacks[stackIndex].addCard(card);
                cardIndex++;
            }
        }
    }
    
    private setupGameLoop(): void {
        this.app.ticker.add((delta: any) => {
            this.update(delta);
        });
        this.app.ticker.add((delta: any) => {
            this.updateFPS(delta);
        });
    }
    
    private update(delta: any): void {
        // Only run game logic if game has started
        if (!this.gameStarted) return;
        
        this.moveTimer += delta * 16.67; // Convert to milliseconds
        
        if (this.moveTimer >= this.MOVE_INTERVAL) {
            this.moveTimer = 0;
            this.moveTopCard();
        }
    }
    
    private async moveTopCard(): Promise<void> {
        console.log('🔍 Finding stack with most cards...');
        
        // Find the stack with the most cards
        let sourceStackIndex = 0;
        let maxCards = 0;
        
        for (let i = 0; i < this.STACK_COUNT; i++) {
            const cardCount = this.stacks[i].getCardCount();
            console.log(`Stack ${i}: ${cardCount} cards`);
            if (cardCount > maxCards) {
                maxCards = cardCount;
                sourceStackIndex = i;
            }
        }
        
        console.log(`📊 Max cards: ${maxCards} in stack ${sourceStackIndex}`);
        
        if (maxCards === 0) {
            console.log('❌ No cards found to move');
            return;
        }
        
        const sourceStack = this.stacks[sourceStackIndex];
        const topCard = sourceStack.getTopCard();
        
        console.log(`🎯 Top card found: ${topCard ? 'Yes' : 'No'}, Animating: ${topCard?.isAnimating || 'N/A'}`);
        
        if (!topCard || topCard.isAnimating) {
            console.log('❌ Cannot move card - no card or already animating');
            return;
        }
        
        // Find a different stack to move to
        let targetStackIndex: number;
        do {
            targetStackIndex = Math.floor(Math.random() * this.STACK_COUNT);
        } while (targetStackIndex === sourceStackIndex);
        
        console.log(`🎯 Moving from stack ${sourceStackIndex} to stack ${targetStackIndex}`);
        
        const targetStack = this.stacks[targetStackIndex];
        
        // Remove card from source stack
        sourceStack.removeCard(topCard);
        console.log(`📤 Removed card from source stack ${sourceStackIndex}`);
        
        // Add card to target stack
        targetStack.addCard(topCard);
        console.log(`📥 Added card to target stack ${targetStackIndex}`);
        
        // Add magical sparkle effects around the moving card
        this.createMagicalSparkles(topCard);
        console.log('✨ Created magical sparkles');
        
        // Use consistent 2-second animation duration for full movement
        const targetCardIndex = targetStack.getCardCount() - 1;
        console.log(`🎬 Starting animation to stack ${targetStackIndex}, card index ${targetCardIndex}`);
        
        await topCard.animateToStack(targetStackIndex, targetCardIndex, targetStack.getCardCount(), this.ANIMATION_DURATION);
        
        console.log('🎉 Animation completed!');
    }
    
    private createMagicalSparkles(card: Card): void {
        // Create magical sparkle particles around the moving card
        const sparkleCount = 8;
        
        for (let i = 0; i < sparkleCount; i++) {
            const sparkle = new PIXI.Graphics();
            
            // Create twinkling star shape using PIXI Graphics
            const size = Math.random() * 4 + 2;
            const alpha = Math.random() * 0.8 + 0.2;
            
            // Create star shape manually using lines
            sparkle.lineStyle(2, 0xFFFF88, alpha);
            sparkle.beginFill(0xFFFF88, alpha);
            
            // Draw 5-pointed star manually
            const starPoints = [];
            for (let i = 0; i < 5; i++) {
                const angle = (i * Math.PI * 2) / 5 - Math.PI / 2;
                const outerX = Math.cos(angle) * size;
                const outerY = Math.sin(angle) * size;
                const innerX = Math.cos(angle + Math.PI / 5) * (size * 0.5);
                const innerY = Math.sin(angle + Math.PI / 5) * (size * 0.5);
                
                starPoints.push(outerX, outerY);
                starPoints.push(innerX, innerY);
            }
            
            sparkle.drawPolygon(starPoints);
            sparkle.endFill();
            
            // Add inner glow
            sparkle.lineStyle(1, 0xFFFFFF, alpha * 0.6);
            sparkle.beginFill(0xFFFFFF, alpha * 0.6);
            
            const innerStarPoints = [];
            for (let i = 0; i < 5; i++) {
                const angle = (i * Math.PI * 2) / 5 - Math.PI / 2;
                const outerX = Math.cos(angle) * (size * 0.6);
                const outerY = Math.sin(angle) * (size * 0.6);
                const innerX = Math.cos(angle + Math.PI / 5) * (size * 0.3);
                const innerY = Math.sin(angle + Math.PI / 5) * (size * 0.3);
                
                innerStarPoints.push(outerX, outerY);
                innerStarPoints.push(innerX, innerY);
            }
            
            sparkle.drawPolygon(innerStarPoints);
            sparkle.endFill();
            
            // Position around the card
            const angle = (i / sparkleCount) * Math.PI * 2;
            const radius = 30 + Math.random() * 20;
            sparkle.x = card.x + Math.cos(angle) * radius;
            sparkle.y = card.y + Math.sin(angle) * radius;
            
            // Add to stage
            this.app.stage.addChild(sparkle);
            
            // Animate sparkle
            const startTime = Date.now();
            const duration = 2000; // Match card animation
            
            const animateSparkle = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Follow the card with magical offset
                const waveOffset = Math.sin(progress * Math.PI * 4 + i) * 10;
                const floatOffset = Math.sin(progress * Math.PI * 2 + i) * 5;
                
                sparkle.x = card.x + Math.cos(angle + progress * Math.PI) * (radius + waveOffset);
                sparkle.y = card.y + Math.sin(angle + progress * Math.PI) * (radius + floatOffset);
                
                // Twinkling effect
                const twinkle = Math.sin(progress * Math.PI * 8 + i) * 0.3 + 0.7;
                sparkle.alpha = alpha * twinkle * (1 - progress);
                
                // Scale pulsing
                const pulse = 1 + Math.sin(progress * Math.PI * 6 + i) * 0.3;
                sparkle.scale.set(pulse);
                
                // Rotation
                sparkle.rotation += 0.1;
                
                if (progress < 1) {
                    requestAnimationFrame(animateSparkle);
                } else {
                    // Remove sparkle when animation is complete
                    this.app.stage.removeChild(sparkle);
                }
            };
            
            animateSparkle();
        }
    }
    
    private startAutoMovement(): void {
        if (this.autoMoveTimer) {
            clearInterval(this.autoMoveTimer);
        }
        
        this.autoMoveTimer = setInterval(() => {
            this.performAutoMove();
        }, this.MOVE_INTERVAL);
        
        console.log('Automatic card movement started - moving every 1 second');
    }
    
    private stopAutoMovement(): void {
        if (this.autoMoveTimer) {
            clearInterval(this.autoMoveTimer);
            this.autoMoveTimer = null;
        }
        this.isAutoMoving = false;
        console.log('Automatic card movement stopped');
    }
    
    private async performAutoMove(): Promise<void> {
        if (this.isAutoMoving) {
            console.log('Auto move skipped - already moving');
            return;
        }
        
        console.log('🎬 Starting automatic card movement...');
        this.isAutoMoving = true;
        
        try {
            await this.moveTopCard();
            console.log('✅ Auto move completed successfully');
        } catch (error) {
            console.error('❌ Auto move failed:', error);
        } finally {
            this.isAutoMoving = false;
        }
    }
    
    
    public getApp(): any {
        return this.app;
    }
    
    private addFullScreenSupport(): void {
        // Add double-click to toggle full screen
        this.app.view.addEventListener('dblclick', () => {
            this.toggleFullScreen();
        });
        
        // Add keyboard shortcut (F11 or Escape)
        document.addEventListener('keydown', (event) => {
            if (event.key === 'F11') {
                event.preventDefault();
                this.toggleFullScreen();
            } else if (event.key === 'Escape' && document.fullscreenElement) {
                this.exitFullScreen();
            }
        });
        
        // Handle full screen change events
        document.addEventListener('fullscreenchange', () => {
            this.handleFullScreenChange();
        });
    }
    
    private toggleFullScreen(): void {
        if (!document.fullscreenElement) {
            this.enterFullScreen();
        } else {
            this.exitFullScreen();
        }
    }
    
    private enterFullScreen(): void {
        const container = document.getElementById('game-container');
        if (container && container.requestFullscreen) {
            container.requestFullscreen().then(() => {
                console.log('Entered full screen mode');
            }).catch((err) => {
                console.error('Error entering full screen:', err);
            });
        }
    }
    
    private exitFullScreen(): void {
        if (document.exitFullscreen) {
            document.exitFullscreen().then(() => {
                console.log('Exited full screen mode');
            }).catch((err) => {
                console.error('Error exiting full screen:', err);
            });
        }
    }
    
    private handleFullScreenChange(): void {
        // Handle resize when full screen changes
        setTimeout(() => {
            this.handleResize();
        }, 100);
    }
    
    private createFPSCounter(): void {
        const style = new PIXI.TextStyle({
            fontFamily: 'Arial, sans-serif',
            fontSize: 16,
            fontWeight: 'bold',
            fill: 0xFFFFFF,
            stroke: 0x000000,
            strokeThickness: 2
        });
        
        this.fpsText = new PIXI.Text('FPS: 0', style);
        this.fpsText.x = 10;
        this.fpsText.y = 10;
        
        // Add to stage and ensure it's on top
        this.app.stage.addChild(this.fpsText);
        this.app.stage.setChildIndex(this.fpsText, this.app.stage.children.length - 1);
    }
    
    private updateFPS(delta: any): void {
        if (this.fpsText) {
            const fps = Math.round(1000 / (delta * 16.67));
            this.fpsText.text = `FPS: ${fps}`;
        }
    }
    
    private getResponsiveDimensions(): { width: number, height: number } {
        // Use actual window dimensions for proper centering
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        console.log('Window dimensions:', windowWidth, 'x', windowHeight);
        
        // Use actual window size to ensure proper centering
        return {
            width: windowWidth,
            height: windowHeight
        };
    }
    
    private handleResize(): void {
        if (!this.app) return;
        
        // Let PixiJS handle the resize automatically with resizeTo
        // But we still need to update our components
        const dimensions = this.getResponsiveDimensions();
        
        // Update menu if it exists
        if (this.menu) {
            this.menu.handleResize(dimensions);
        }
        
        // Update magic words if it exists
        if (this.magicWords) {
            this.magicWords.handleResize(dimensions);
        }
        
        // Update phoenix flame if it exists
        if (this.phoenixFlame) {
            this.phoenixFlame.handleResize(dimensions);
        }
        
        // Update card positions if game is started
        if (this.gameStarted) {
            this.updateCardPositions();
        }
        
        console.log(`Resized to: ${dimensions.width}x${dimensions.height}`);
    }
    
    private updateCardPositions(): void {
        // Update card positions based on new screen size
        const dimensions = this.getResponsiveDimensions();
        this.cards.forEach((card, index) => {
            const stackIndex = Math.floor(index / (this.TOTAL_CARDS / this.STACK_COUNT));
            const cardIndex = index % (this.TOTAL_CARDS / this.STACK_COUNT);
            card.setStackPosition(stackIndex, cardIndex, this.TOTAL_CARDS / this.STACK_COUNT, dimensions.width, dimensions.height);
        });
    }
}