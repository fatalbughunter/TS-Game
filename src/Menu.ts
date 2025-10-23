// Use global PIXI object from CDN
declare const PIXI: any;

export class Menu {
    private app: any;
    private container: any;
    private onStartGame: () => void;
    private onMagicWords: () => void;
    private onPhoenixFlame: () => void;
    private fpsText: any;

    constructor(app: any, onStartGame: () => void, onMagicWords: () => void, onPhoenixFlame: () => void) {
        this.app = app;
        this.onStartGame = onStartGame;
        this.onMagicWords = onMagicWords;
        this.onPhoenixFlame = onPhoenixFlame;
        this.container = new PIXI.Container();
    }

    public show(): void {
        console.log('Showing game menu...');
        
        // Add menu container to stage
        this.app.stage.addChild(this.container);
        
        // Create background
        this.createBackground();
        
        // Create SOFTGAMES title
        this.createSoftGamesTitle();
        
        // Create title
        this.createTitle();
        
        // Create Magic Words menu
        this.createMagicWordsMenu();
        
        // Create Phoenix Flame menu
        this.createPhoenixFlameMenu();
        
        // Create FPS counter
        this.createFPSCounter();
        
        console.log('Menu displayed');
    }

    public hide(): void {
        console.log('Hiding game menu...');
        this.app.stage.removeChild(this.container);
        
        // Remove FPS counter from stage
        if (this.fpsText) {
            this.app.stage.removeChild(this.fpsText);
            this.fpsText = null;
        }
        
        console.log('Menu hidden');
    }
    
    public handleResize(dimensions: { width: number, height: number }): void {
        // Update background
        const background = this.container.children[0] as any;
        if (background && background.clear) {
            background.clear();
            background.beginFill(0x0a0a0a);
            background.drawRect(0, 0, dimensions.width, dimensions.height);
            background.endFill();
            
            // Add responsive pattern
            const patternDensity = dimensions.width < 768 ? 15 : 25;
            const patternRows = dimensions.width < 768 ? 12 : 18;
            background.beginFill(0x1a1a1a, 0.3);
            for (let i = 0; i < patternDensity; i++) {
                for (let j = 0; j < patternRows; j++) {
                    if ((i + j) % 2 === 0) {
                        const x = (dimensions.width / patternDensity) * i + (dimensions.width / patternDensity) / 2;
                        const y = (dimensions.height / patternRows) * j + (dimensions.height / patternRows) / 2;
                        background.drawCircle(x, y, 1);
                    }
                }
            }
            background.endFill();
        }
        
        // Update title positions
        this.updateTitlePositions(dimensions);
    }
    
    private updateTitlePositions(dimensions: { width: number, height: number }): void {
        const isMobile = dimensions.width < 768;
        const isTablet = dimensions.width >= 768 && dimensions.width < 1025;
        
        // Update SOFTGAMES title
        const softGamesTitle = this.container.children.find((child: any) => 
            child.children && child.children.some((c: any) => c.text === 'SOFTGAMES')
        );
        if (softGamesTitle) {
            softGamesTitle.x = dimensions.width / 2;
            softGamesTitle.y = isMobile ? 40 : (isTablet ? 60 : 80);
            
            // Adjust font size for different screen sizes - make it bigger than other texts
            if (isMobile) {
                softGamesTitle.style.fontSize = 48;
            } else if (isTablet) {
                softGamesTitle.style.fontSize = 72;
            } else {
                softGamesTitle.style.fontSize = 96;
            }
        }
        
        // Update ACE OF SHADOWS title
        const mainTitle = this.container.children.find((child: any) => 
            child.text === 'ACE OF SHADOWS'
        );
        if (mainTitle) {
            mainTitle.x = dimensions.width / 2;
            mainTitle.y = dimensions.height / 2;
            
            // Adjust font size for different screen sizes
            if (isMobile) {
                mainTitle.style.fontSize = 36;
            } else if (isTablet) {
                mainTitle.style.fontSize = 56;
            } else {
                mainTitle.style.fontSize = 72;
            }
        }
        
        // Update MAGIC WORDS title
        const magicWords = this.container.children.find((child: any) => 
            child.text === 'MAGIC WORDS'
        );
        if (magicWords) {
            magicWords.x = dimensions.width / 2;
            magicWords.y = dimensions.height / 2 + (isMobile ? 60 : (isTablet ? 80 : 100));
            
            // Adjust font size for different screen sizes
            if (isMobile) {
                magicWords.style.fontSize = 24;
            } else if (isTablet) {
                magicWords.style.fontSize = 36;
            } else {
                magicWords.style.fontSize = 48;
            }
        }
        
        // Update PHOENIX FLAME title
        const phoenixFlame = this.container.children.find((child: any) => 
            child.text === 'PHOENIX FLAME'
        );
        if (phoenixFlame) {
            phoenixFlame.x = dimensions.width / 2;
            phoenixFlame.y = dimensions.height / 2 + (isMobile ? 120 : (isTablet ? 160 : 200));
            
            // Adjust font size for different screen sizes
            if (isMobile) {
                phoenixFlame.style.fontSize = 36;
            } else if (isTablet) {
                phoenixFlame.style.fontSize = 56;
            } else {
                phoenixFlame.style.fontSize = 72;
            }
        }
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
        
        // Add to stage directly to ensure it's always visible
        this.app.stage.addChild(this.fpsText);
        
        // Add ticker for FPS updates
        this.app.ticker.add((delta: any) => {
            this.updateFPS(delta);
        });
    }
    
    private updateFPS(delta: any): void {
        if (this.fpsText) {
            const fps = Math.round(1000 / (delta * 16.67));
            this.fpsText.text = `FPS: ${fps}`;
        }
    }

    private createBackground(): void {
        const background = new PIXI.Graphics();
        background.beginFill(0x0a0a0a);
        background.drawRect(0, 0, this.app.screen.width, this.app.screen.height);
        background.endFill();
        
        // Add subtle pattern
        background.beginFill(0x1a1a1a, 0.3);
        for (let i = 0; i < 20; i++) {
            for (let j = 0; j < 15; j++) {
                if ((i + j) % 2 === 0) {
                    background.drawCircle(i * 60 + 30, j * 40 + 20, 1);
                }
            }
        }
        background.endFill();
        
        this.container.addChild(background);
    }

    private createSoftGamesTitle(): void {
        // Create SOFTGAMES text - completely static
        const titleStyle = new PIXI.TextStyle({
            fontFamily: 'Arial, sans-serif',
            fontSize: 64,
            fontWeight: 'bold',
            fill: 0xFF6B35, // Orange color
            stroke: 0x000000,
            strokeThickness: 3
        });
        
        const titleText = new PIXI.Text('SOFTGAMES', titleStyle);
        titleText.anchor.set(0.5);
        titleText.x = this.app.screen.width / 2;
        titleText.y = 80;
        
        this.container.addChild(titleText);
    }

    private createTitle(): void {
        const titleStyle = new PIXI.TextStyle({
            fontFamily: 'Arial, sans-serif',
            fontSize: 72,
            fontWeight: 'bold',
            fill: 0x00BFFF, // Light blue color
            stroke: 0xFFFFFF,
            strokeThickness: 4,
            dropShadow: true,
            dropShadowColor: 0x000000,
            dropShadowBlur: 10,
            dropShadowAngle: Math.PI / 4,
            dropShadowDistance: 5
        });

        const title = new PIXI.Text('ACE OF SHADOWS', titleStyle);
        title.anchor.set(0.5);
        title.x = this.app.screen.width / 2;
        title.y = this.app.screen.height / 2;
        
        // Make title clickable
        title.interactive = true;
        title.buttonMode = true;
        
        // Add hover effects
        title.on('pointerover', () => {
            title.scale.set(1.1);
            title.tint = 0x87CEFA; // Lighter blue on hover
        });
        
        title.on('pointerout', () => {
            title.scale.set(1.0);
            title.tint = 0xFFFFFF; // Reset tint
        });
        
        // Add click handler
        title.on('pointerdown', () => {
            console.log('Title clicked - starting game');
            this.onStartGame();
        });
        
        // Add subtle animation
        this.app.ticker.add(() => {
            title.rotation = Math.sin(Date.now() * 0.001) * 0.05;
        });
        
        this.container.addChild(title);
    }

    private createMagicWordsMenu(): void {
        const magicWordsStyle = new PIXI.TextStyle({
            fontFamily: 'Arial, sans-serif',
            fontSize: 48,
            fontWeight: 'bold',
            fill: 0xFF69B4, // Hot pink color
            stroke: 0xFFFFFF,
            strokeThickness: 3,
            dropShadow: true,
            dropShadowColor: 0x000000,
            dropShadowBlur: 8,
            dropShadowAngle: Math.PI / 4,
            dropShadowDistance: 3
        });

        const magicWords = new PIXI.Text('MAGIC WORDS', magicWordsStyle);
        magicWords.anchor.set(0.5);
        magicWords.x = this.app.screen.width / 2;
        magicWords.y = this.app.screen.height / 2 + 100; // Position below the main title
        
        // Make it interactive
        magicWords.interactive = true;
        magicWords.buttonMode = true;
        
        // Add hover effects
        magicWords.on('pointerover', () => {
            magicWords.scale.set(1.1);
            magicWords.tint = 0xFFB6C1; // Light pink on hover
        });
        
        magicWords.on('pointerout', () => {
            magicWords.scale.set(1.0);
            magicWords.tint = 0xFFFFFF; // Reset tint
        });
        
        // Add click handler
        magicWords.on('pointerdown', () => {
            console.log('Magic Words clicked!');
            this.onMagicWords();
        });
        
        // Add subtle animation
        this.app.ticker.add(() => {
            magicWords.rotation = Math.sin(Date.now() * 0.0008) * 0.03; // Slower rotation than main title
        });
        
        this.container.addChild(magicWords);
    }

    private createPhoenixFlameMenu(): void {
        const phoenixFlameStyle = new PIXI.TextStyle({
            fontFamily: 'Arial, sans-serif',
            fontSize: 72, // Same font size as "Ace of Shadows"
            fontWeight: 'bold',
            fill: 0x00FF00, // Bright green color
            stroke: 0xFFFFFF,
            strokeThickness: 4, // Same stroke thickness as main title
            dropShadow: true,
            dropShadowColor: 0x000000,
            dropShadowBlur: 10, // Same blur as main title
            dropShadowAngle: Math.PI / 4,
            dropShadowDistance: 5 // Same distance as main title
        });

        const phoenixFlame = new PIXI.Text('PHOENIX FLAME', phoenixFlameStyle);
        phoenixFlame.anchor.set(0.5);
        phoenixFlame.x = this.app.screen.width / 2;
        phoenixFlame.y = this.app.screen.height / 2 + 200; // Position below Magic Words
        
        // Make it interactive
        phoenixFlame.interactive = true;
        phoenixFlame.buttonMode = true;
        
        // Add hover effects
        phoenixFlame.on('pointerover', () => {
            phoenixFlame.scale.set(1.1);
            phoenixFlame.tint = 0x90EE90; // Light green on hover
        });
        
        phoenixFlame.on('pointerout', () => {
            phoenixFlame.scale.set(1.0);
            phoenixFlame.tint = 0xFFFFFF; // Reset tint
        });
        
        // Add click handler
        phoenixFlame.on('pointerdown', () => {
            console.log('Phoenix Flame clicked!');
            this.onPhoenixFlame();
        });
        
        // Add subtle animation
        this.app.ticker.add(() => {
            phoenixFlame.rotation = Math.sin(Date.now() * 0.0006) * 0.04; // Different rotation speed
        });
        
        this.container.addChild(phoenixFlame);
    }

}
