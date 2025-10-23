export declare class PhoenixFlame {
    private app;
    private container;
    private onBackToMenu;
    private particles;
    private maxParticles;
    private particleContainer;
    private backButton;
    private animationId;
    private fpsText;
    private title;
    private glowTitle;
    constructor(app: any, onBackToMenu: () => void);
    show(): void;
    hide(): void;
    handleResize(dimensions: {
        width: number;
        height: number;
    }): void;
    private createFPSCounter;
    private updateFPS;
    private createBackground;
    private createTitle;
    private createBackButton;
    private createParticleSystem;
    private createParticle;
    private startAnimation;
    private stopAnimation;
    private updateParticles;
}
//# sourceMappingURL=PhoenixFlame.d.ts.map