export declare class Menu {
    private app;
    private container;
    private onStartGame;
    private onMagicWords;
    private onPhoenixFlame;
    private fpsText;
    constructor(app: any, onStartGame: () => void, onMagicWords: () => void, onPhoenixFlame: () => void);
    show(): void;
    hide(): void;
    handleResize(dimensions: {
        width: number;
        height: number;
    }): void;
    private updateTitlePositions;
    private createFPSCounter;
    private updateFPS;
    private createBackground;
    private createSoftGamesTitle;
    private createTitle;
    private createMagicWordsMenu;
    private createPhoenixFlameMenu;
}
//# sourceMappingURL=Menu.d.ts.map