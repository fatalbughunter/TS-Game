declare const PIXI: any;
export declare class Card extends PIXI.Sprite {
    readonly id: number;
    stackIndex: number;
    isAnimating: boolean;
    constructor(id: number, texture: any);
    setStackPosition(stackIndex: number, cardIndex: number, totalCards: number, screenWidth?: number, screenHeight?: number): void;
    animateToStack(targetStackIndex: number, targetCardIndex: number, totalCards: number, duration?: number): Promise<void>;
    private easeInOutCubic;
    private easeOutBounce;
    private easeOutElastic;
}
export {};
//# sourceMappingURL=Card.d.ts.map