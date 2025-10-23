// Use global PIXI object from CDN
declare const PIXI: any;

export class PhoenixFlame {
    private app: any;
    private container: any;
    private onBackToMenu: () => void;
    private particles: any[] = [];
    private maxParticles: number = 10;
    private particleContainer: any = null;
    private backButton: any = null;
    private animationId: number = 0;
    private fpsText: any;
    private title: any = null;
    private glowTitle: any = null;

    constructor(app: any, onBackToMenu: () => void) {
        this.app = app;
        this.onBackToMenu = onBackToMenu;
        this.container = new PIXI.Container();
    }

    public show(): void {
        console.log('Showing Phoenix Flame page...');
        
        // Add container to stage
        this.app.stage.addChild(this.container);
        
        // Create background
        this.createBackground();
        
        // Create title
        this.createTitle();
        
        // Create back button
        this.createBackButton();
        
        // Create particle system
        this.createParticleSystem();
        
        // Start animation
        this.startAnimation();
        
        // Create FPS counter
        this.createFPSCounter();
        
        console.log('Phoenix Flame page displayed');
    }

    public hide(): void {
        console.log('Hiding Phoenix Flame page...');
        
        // Stop animation
        this.stopAnimation();
        
        // Clear particles
        this.particles = [];
        
        // Remove container from stage
        this.app.stage.removeChild(this.container);
        
        // Remove FPS counter from stage
        if (this.fpsText) {
            this.app.stage.removeChild(this.fpsText);
            this.fpsText = null;
        }
        
        console.log('Phoenix Flame page hidden');
    }
    
    public handleResize(dimensions: { width: number, height: number }): void {
        // Update background to maintain uniform dark appearance
        const background = this.container.children[0] as any;
        if (background && background.clear) {
            background.clear();
            // Create uniform dark background
            background.beginFill(0x000000); // Black base
            background.drawRect(0, 0, dimensions.width, dimensions.height);
            background.endFill();
            
            // Add subtle dark red overlay for atmosphere (very subtle)
            background.beginFill(0x110000, 0.2); // Very dark red, very subtle
            background.drawRect(0, 0, dimensions.width, dimensions.height);
            background.endFill();
            
            // Add some subtle fire embers in background (much more subtle)
            for (let i = 0; i < 15; i++) {
                const x = Math.random() * dimensions.width;
                const y = Math.random() * dimensions.height;
                const size = Math.random() * 2 + 0.5;
                const alpha = Math.random() * 0.15 + 0.05; // Much more subtle
                
                background.beginFill(0x220000, alpha); // Dark red embers
                background.drawCircle(x, y, size);
                background.endFill();
            }
        }
        
        // Update title position
        const title = this.container.children.find((child: any) => 
            child.text === 'PHOENIX FLAME'
        );
        if (title) {
            title.x = dimensions.width / 2;
            title.y = dimensions.height < 600 ? 100 : 150;
            
            // Adjust font size for mobile
            if (dimensions.width < 768) {
                title.style.fontSize = 48;
            } else {
                title.style.fontSize = 72;
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
        
        // Create uniform dark background like the top area
        background.beginFill(0x000000); // Black base
        background.drawRect(0, 0, this.app.screen.width, this.app.screen.height);
        background.endFill();
        
        // Add subtle dark red overlay for atmosphere (very subtle)
        background.beginFill(0x110000, 0.2); // Very dark red, very subtle
        background.drawRect(0, 0, this.app.screen.width, this.app.screen.height);
        background.endFill();
        
        // Add some subtle fire embers in background (much more subtle)
        for (let i = 0; i < 15; i++) {
            const x = Math.random() * this.app.screen.width;
            const y = Math.random() * this.app.screen.height;
            const size = Math.random() * 2 + 0.5;
            const alpha = Math.random() * 0.15 + 0.05; // Much more subtle
            
            background.beginFill(0x220000, alpha); // Dark red embers
            background.drawCircle(x, y, size);
            background.endFill();
        }
        
        this.container.addChild(background);
    }

    private createTitle(): void {
        const titleStyle = new PIXI.TextStyle({
            fontFamily: 'Arial, sans-serif',
            fontSize: 64, // Larger font
            fontWeight: 'bold',
            fill: 0xFF2200, // Bright red-orange
            stroke: 0xFFFFFF,
            strokeThickness: 4,
            dropShadow: true,
            dropShadowColor: 0xFF0000,
            dropShadowBlur: 15,
            dropShadowAngle: Math.PI / 4,
            dropShadowDistance: 8
        });

        const title = new PIXI.Text('PHOENIX FLAME', titleStyle);
        title.anchor.set(0.5);
        title.x = this.app.screen.width / 2;
        title.y = 100;
        
        // Add animated glow effect
        const glowStyle = new PIXI.TextStyle({
            fontFamily: 'Arial, sans-serif',
            fontSize: 64,
            fontWeight: 'bold',
            fill: 0xFFAA00, // Yellow glow
            stroke: 0xFF4400,
            strokeThickness: 2,
            dropShadow: true,
            dropShadowColor: 0xFF0000,
            dropShadowBlur: 20,
            dropShadowAngle: Math.PI / 4,
            dropShadowDistance: 10
        });
        
        const glowTitle = new PIXI.Text('PHOENIX FLAME', glowStyle);
        glowTitle.anchor.set(0.5);
        glowTitle.x = this.app.screen.width / 2;
        glowTitle.y = 100;
        glowTitle.alpha = 0.6;
        
        // Add glow behind main title
        this.container.addChild(glowTitle);
        this.container.addChild(title);
        
        // Store references for animation
        this.title = title;
        this.glowTitle = glowTitle;
    }

    private createBackButton(): void {
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
            console.log('Back button clicked');
            this.onBackToMenu();
        });
        
        this.backButton = buttonContainer;
        this.container.addChild(buttonContainer);
    }

    private createParticleSystem(): void {
        // Create particle container
        this.particleContainer = new PIXI.Container();
        this.particleContainer.x = this.app.screen.width / 2;
        this.particleContainer.y = this.app.screen.height / 2 + 100;
        
        this.container.addChild(this.particleContainer);
        
        // Create initial particles
        for (let i = 0; i < this.maxParticles; i++) {
            this.createParticle();
        }
    }

    private createParticle(): void {
        const particle = new PIXI.Graphics();
        
        // Create larger, more beautiful flame particles
        const size = Math.random() * 25 + 15; // Random size between 15-40 (bigger)
        const alpha = Math.random() * 0.9 + 0.3; // Random alpha between 0.3-1.2
        
        // Create multi-layered flame effect
        // Outer flame (red-orange)
        particle.beginFill(0xFF2200, alpha); // Bright red-orange
        particle.drawEllipse(0, 0, size, size * 1.8); // More elongated
        particle.endFill();
        
        // Middle flame (orange-yellow)
        particle.beginFill(0xFF6600, alpha * 0.8); // Orange
        particle.drawEllipse(0, 0, size * 0.7, size * 1.3);
        particle.endFill();
        
        // Inner flame (yellow)
        particle.beginFill(0xFFAA00, alpha * 0.7); // Yellow-orange
        particle.drawEllipse(0, 0, size * 0.5, size * 0.9);
        particle.endFill();
        
        // Hot white center
        particle.beginFill(0xFFFFFF, alpha * 0.9); // Bright white center
        particle.drawEllipse(0, 0, size * 0.25, size * 0.4);
        particle.endFill();
        
        // Add flickering sparks
        for (let i = 0; i < 3; i++) {
            const sparkSize = Math.random() * 3 + 1;
            const sparkX = (Math.random() - 0.5) * size * 0.8;
            const sparkY = (Math.random() - 0.5) * size * 0.8;
            particle.beginFill(0xFFFF88, alpha * 0.6);
            particle.drawCircle(sparkX, sparkY, sparkSize);
            particle.endFill();
        }
        
        // Set initial position with more spread
        particle.x = (Math.random() - 0.5) * 300; // Random X within 300px range (wider)
        particle.y = Math.random() * 150 + 50; // Start from bottom with some height
        
        // Set initial properties for more dynamic movement
        particle.vx = (Math.random() - 0.5) * 4; // Random horizontal velocity (faster)
        particle.vy = -Math.random() * 5 - 2; // Upward velocity (faster)
        particle.life = 1.0; // Life starts at 1.0
        particle.decay = Math.random() * 0.015 + 0.008; // Slower decay for longer life
        particle.rotationSpeed = (Math.random() - 0.5) * 0.3; // More rotation
        particle.scaleX = 1.0;
        particle.scaleY = 1.0;
        particle.scaleSpeed = Math.random() * 0.02 + 0.01; // Scale animation
        particle.flickerSpeed = Math.random() * 0.1 + 0.05; // Flicker animation
        
        this.particles.push(particle);
        this.particleContainer.addChild(particle);
    }

    private startAnimation(): void {
        const animate = () => {
            this.updateParticles();
            this.animationId = requestAnimationFrame(animate);
        };
        animate();
    }

    private stopAnimation(): void {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = 0;
        }
    }

    private updateParticles(): void {
        // Update title glow animation
        if (this.glowTitle) {
            const glowPulse = Math.sin(Date.now() * 0.003) * 0.2 + 0.6;
            this.glowTitle.alpha = glowPulse;
            this.glowTitle.scale.set(1 + Math.sin(Date.now() * 0.002) * 0.05);
        }
        
        // Update existing particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Update rotation
            particle.rotation += particle.rotationSpeed;
            
            // Apply gravity (slight downward force)
            particle.vy += 0.03;
            
            // Apply air resistance
            particle.vx *= 0.98;
            particle.vy *= 0.98;
            
            // Update scale animation (pulsing effect)
            particle.scaleX += Math.sin(Date.now() * particle.scaleSpeed) * 0.1;
            particle.scaleY += Math.sin(Date.now() * particle.scaleSpeed) * 0.1;
            
            // Apply flickering effect
            const flicker = Math.sin(Date.now() * particle.flickerSpeed) * 0.3 + 0.7;
            particle.alpha = particle.life * flicker;
            
            // Add wind effect (horizontal swaying)
            particle.vx += Math.sin(Date.now() * 0.001 + particle.x * 0.01) * 0.1;
            
            // Update life
            particle.life -= particle.decay;
            
            // Color transition based on life
            if (particle.life < 0.3) {
                // Fade to blue/white as particle dies
                particle.tint = 0x88AAFF;
            } else if (particle.life < 0.6) {
                // Transition to orange
                particle.tint = 0xFFAA00;
            } else {
                // Full red-orange when young
                particle.tint = 0xFFFFFF;
            }
            
            // Remove dead particles
            if (particle.life <= 0) {
                this.particleContainer.removeChild(particle);
                this.particles.splice(i, 1);
            }
        }
        
        // Add new particles to maintain max count
        while (this.particles.length < this.maxParticles) {
            this.createParticle();
        }
        
        // Add some randomness to particle creation with burst effects
        if (Math.random() < 0.4 && this.particles.length < this.maxParticles) {
            this.createParticle();
        }
        
        // Occasionally create burst of particles
        if (Math.random() < 0.1 && this.particles.length < this.maxParticles - 2) {
            this.createParticle();
            this.createParticle();
        }
    }
}
