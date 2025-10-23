import { Card } from './Card.js';
declare const PIXI: any;
export declare class CardStack extends PIXI.Container {
    readonly stackIndex: number;
    private cards;
    constructor(stackIndex: number);
    addCard(card: Card): void;
    removeCard(card: Card): void;
    getTopCard(): Card | null;
    getCardCount(): number;
    getAllCards(): Card[];
    isEmpty(): boolean;
    private updateCardPositions;
    private getGameDimensions;
}
export {};
//# sourceMappingURL=CardStack.d.ts.map