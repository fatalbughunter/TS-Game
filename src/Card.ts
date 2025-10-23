// Use global PIXI object from CDN
declare const PIXI: any;

export class Card extends PIXI.Sprite {
    public readonly id: number;
    public stackIndex: number = 0;
    public isAnimating: boolean = false;
    
    constructor(id: number, texture: any) {
        super(texture);
        this.id = id;
        this.anchor.set(0.5);
        this.width = 120;
        this.height = 160;
        
        // Add a subtle shadow effect
        this.filters = [];
    }
    
    public setStackPosition(stackIndex: number, cardIndex: number, totalCards: number, screenWidth?: number, screenHeight?: number): void {
        this.stackIndex = stackIndex;
        
        // Get screen dimensions or use defaults
        const width = screenWidth || 1200;
        const height = screenHeight || 600;
        
        // Calculate responsive positioning for larger cards
        const cardWidth = 120;
        const cardHeight = 160;
        const totalStacks = 8;
        
        // Calculate spacing to center all stacks
        const stackSpacing = 20; // Fixed spacing between stacks
        const totalWidth = (cardWidth * totalStacks) + (stackSpacing * (totalStacks - 1));
        const startX = (width - totalWidth) / 2; // Center all stacks
        
        const baseX = startX + stackIndex * (cardWidth + stackSpacing) + cardWidth / 2;
        const baseY = height * 0.5; // Centered vertically
        
        // Each card is slightly offset to show the stack effect
        const offsetX = (cardIndex % 3) * 3; // Slightly larger horizontal offset for bigger cards
        const offsetY = cardIndex * (height < 600 ? 4 : 6); // Responsive vertical spacing for larger cards
        
        this.x = baseX + offsetX;
        this.y = baseY - offsetY;
        
        // Add slight rotation for more 3D effect
        this.rotation = (Math.random() - 0.5) * 0.1; // Small random rotation
        
        // Add scale variation for depth
        this.scale.set(1 - cardIndex * 0.01, 1 - cardIndex * 0.01);
        
        // Bring top cards to front
        this.zIndex = totalCards - cardIndex;
    }
    
    public animateToStack(targetStackIndex: number, targetCardIndex: number, totalCards: number, duration: number = 2000): Promise<void> {
        return new Promise((resolve) => {
            console.log(`🎬 Card animation starting - Target: stack ${targetStackIndex}, card ${targetCardIndex}`);
            this.isAnimating = true;
            
            // Calculate target position using actual screen dimensions
            const cardWidth = 120;
            const stackSpacing = 20;
            const totalStacks = 8;
            const totalWidth = (cardWidth * totalStacks) + (stackSpacing * (totalStacks - 1));
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;
            const centerStartX = (screenWidth - totalWidth) / 2; // Use actual screen width
            const targetX = centerStartX + targetStackIndex * (cardWidth + stackSpacing) + cardWidth / 2 + (targetCardIndex % 3) * 4;
            const targetY = screenHeight * 0.5 - targetCardIndex * 8; // Use actual screen height
            const targetZ = totalCards - targetCardIndex;
            
            console.log(`📍 Card positions - Start: (${this.x}, ${this.y}) -> Target: (${targetX}, ${targetY})`);
            console.log(`📐 Screen dimensions: ${screenWidth}x${screenHeight}`);
            
            // Store initial values for vivid animation
            const startX = this.x;
            const startY = this.y;
            const startZ = this.zIndex;
            const startScaleX = this.scale.x;
            const startScaleY = this.scale.y;
            const startRotation = this.rotation;
            const startAlpha = this.alpha;
            
            // Calculate movement distance for dynamic effects
            const distance = Math.sqrt((targetX - startX) ** 2 + (targetY - startY) ** 2);
            const isLongDistance = distance > 200;
            
            const startTime = Date.now();
            
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Debug logging every 20% progress
                if (Math.floor(progress * 5) !== Math.floor((progress - 0.01) * 5)) {
                    console.log(`🎬 Animation progress: ${Math.floor(progress * 100)}% - Position: (${this.x.toFixed(1)}, ${this.y.toFixed(1)})`);
                }
                
                // Safety check - force completion if animation takes too long
                if (elapsed > duration + 1000) {
                    console.log('⚠️ Animation timeout - forcing completion');
                    this.isAnimating = false;
                    this.x = targetX;
                    this.y = targetY;
                    this.scale.set(startScaleX, startScaleY);
                    this.rotation = startRotation;
                    this.alpha = startAlpha;
                    this.tint = 0xFFFFFF;
                    this.stackIndex = targetStackIndex;
                    resolve();
                    return;
                }
                
                // Movie-like cinematic easing with dramatic curves
                const easeProgress = this.easeInOutCubic(progress);
                
                // Cinematic movie-like movement with dramatic curves
                let currentX, currentY;
                
                // Movie-style camera shake and dramatic movement
                const shakeIntensity = Math.sin(progress * Math.PI * 8) * 3;
                const dramaticWave = Math.sin(progress * Math.PI * 2) * 20;
                const cinematicFloat = Math.sin(progress * Math.PI * 1.5) * 15;
                
                if (isLongDistance) {
                    // Create EXTREMELY dramatic cinematic arc - make it impossible to miss
                    const arcHeight = Math.min(distance * 2.0, 800); // EXTREMELY high arc
                    const midProgress = progress * 2 - 1; // -1 to 1
                    const arcOffset = Math.sin(midProgress * Math.PI) * arcHeight;
                    
                    // Add EXTREME cinematic camera effects
                    const cameraOffset = Math.sin(progress * Math.PI * 4) * 50; // MASSIVE camera shake
                    
                    currentX = startX + (targetX - startX) * easeProgress + dramaticWave + shakeIntensity + cameraOffset;
                    currentY = startY + (targetY - startY) * easeProgress - arcOffset + cinematicFloat;
                } else {
                    // Short distance with EXTREME zoom effect
                    const zoomOffset = Math.sin(progress * Math.PI * 3) * 50; // MASSIVE zoom effect
                    currentX = startX + (targetX - startX) * easeProgress + dramaticWave + zoomOffset;
                    currentY = startY + (targetY - startY) * easeProgress + cinematicFloat;
                }
                
                this.x = currentX;
                this.y = currentY;
                this.zIndex = startZ + (targetZ - startZ) * easeProgress;
                
                // EXTREMELY dramatic cinematic movie-style scaling - impossible to miss
                let scaleMultiplier = 1;
                if (progress < 0.1) {
                    // EXTREMELY dramatic lift - make it HUGE
                    const liftProgress = progress / 0.1;
                    scaleMultiplier = 1 + liftProgress * 3.0; // MASSIVE 400% scale
                } else if (progress > 0.9) {
                    // Cinematic landing with EXTREME impact effect
                    const landingProgress = (progress - 0.9) / 0.1;
                    scaleMultiplier = 1 + Math.sin(landingProgress * Math.PI * 3) * 2.0 * (1 - landingProgress);
                } else {
                    // Movie-style EXTREMELY dramatic pulsing during flight
                    scaleMultiplier = 1 + Math.sin(progress * Math.PI * 6) * 1.5; // MASSIVE pulsing
                }
                this.scale.set(startScaleX * scaleMultiplier, startScaleY * scaleMultiplier);
                
                // Cinematic rotation with dramatic flair
                const rotationAmount = (progress * Math.PI * 2.5) * 0.4; // More dramatic rotation
                this.rotation = startRotation + rotationAmount;
                
                // Movie-style dramatic alpha effects
                const cinematicEffect = Math.sin(progress * Math.PI * 6) * 0.4 + 0.6;
                this.alpha = startAlpha * cinematicEffect;
                
                // Cinematic movie-style color effects
                if (progress < 0.15) {
                    // Dramatic golden launch like movie action scenes
                    this.tint = 0xFFD700 + Math.floor(Math.sin(progress * Math.PI * 12) * 0x222222);
                } else if (progress < 0.4) {
                    // Cinematic blue trail during flight
                    const flightProgress = (progress - 0.15) / 0.25;
                    const cinematicBlue = Math.sin(flightProgress * Math.PI * 4) * 0.6 + 0.4;
                    this.tint = 0x88AAFF + Math.floor(cinematicBlue * 0x333333);
                } else if (progress < 0.7) {
                    // Movie-style red energy trail
                    const energyProgress = (progress - 0.4) / 0.3;
                    const energyRed = Math.sin(energyProgress * Math.PI * 5) * 0.5 + 0.5;
                    this.tint = 0xFF6666 + Math.floor(energyRed * 0x444444);
                } else if (progress < 0.9) {
                    // Silver cinematic approach
                    this.tint = 0xCCCCFF + Math.floor(Math.sin(progress * Math.PI * 15) * 0x333333);
                } else {
                    // Dramatic return to normal with impact
                    const returnProgress = (progress - 0.9) / 0.1;
                    this.tint = 0xFFFFFF + Math.floor((1 - returnProgress) * 0x222222);
                }
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    // Cinematic movie-style landing with dramatic impact
                    this.scale.set(startScaleX, startScaleY);
                    this.rotation = startRotation;
                    this.alpha = startAlpha;
                    this.tint = 0xFFFFFF;
                    this.isAnimating = false;
                    this.stackIndex = targetStackIndex;
                    resolve();
                }
            };
            
            animate();
        });
    }
    
    private easeInOutCubic(t: number): number {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
    
    private easeOutBounce(t: number): number {
        const n1 = 7.5625;
        const d1 = 2.75;
        
        if (t < 1 / d1) {
            return n1 * t * t;
        } else if (t < 2 / d1) {
            return n1 * (t -= 1.5 / d1) * t + 0.75;
        } else if (t < 2.5 / d1) {
            return n1 * (t -= 2.25 / d1) * t + 0.9375;
        } else {
            return n1 * (t -= 2.625 / d1) * t + 0.984375;
        }
    }
    
    private easeOutElastic(t: number): number {
        const c4 = (2 * Math.PI) / 3;
        
        if (t === 0) return 0;
        if (t === 1) return 1;
        
        return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
    }
}
