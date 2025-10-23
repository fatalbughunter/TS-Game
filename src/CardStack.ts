import { Card } from './Card.js';

// Use global PIXI object from CDN
declare const PIXI: any;

export class CardStack extends PIXI.Container {
    public readonly stackIndex: number;
    private cards: Card[] = [];
    
    constructor(stackIndex: number) {
        super();
        this.stackIndex = stackIndex;
    }
    
    public addCard(card: Card): void {
        this.cards.push(card);
        this.addChild(card);
        this.updateCardPositions();
    }
    
    public removeCard(card: Card): void {
        const index = this.cards.indexOf(card);
        if (index > -1) {
            this.cards.splice(index, 1);
            this.removeChild(card);
            this.updateCardPositions();
        }
    }
    
    public getTopCard(): Card | null {
        return this.cards.length > 0 ? this.cards[this.cards.length - 1] : null;
    }
    
    public getCardCount(): number {
        return this.cards.length;
    }
    
    public getAllCards(): Card[] {
        return [...this.cards];
    }
    
    public isEmpty(): boolean {
        return this.cards.length === 0;
    }
    
    private updateCardPositions(): void {
        const dimensions = this.getGameDimensions();
        this.cards.forEach((card, index) => {
            card.setStackPosition(this.stackIndex, index, this.cards.length, dimensions.width, dimensions.height);
        });
    }
    
    private getGameDimensions(): { width: number, height: number } {
        // Use actual window dimensions for proper centering
        return {
            width: window.innerWidth,
            height: window.innerHeight
        };
    }
}
