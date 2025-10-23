export class CardStack extends PIXI.Container {
    constructor(stackIndex) {
        super();
        this.cards = [];
        this.stackIndex = stackIndex;
    }
    addCard(card) {
        this.cards.push(card);
        this.addChild(card);
        this.updateCardPositions();
    }
    removeCard(card) {
        const index = this.cards.indexOf(card);
        if (index > -1) {
            this.cards.splice(index, 1);
            this.removeChild(card);
            this.updateCardPositions();
        }
    }
    getTopCard() {
        return this.cards.length > 0 ? this.cards[this.cards.length - 1] : null;
    }
    getCardCount() {
        return this.cards.length;
    }
    getAllCards() {
        return [...this.cards];
    }
    isEmpty() {
        return this.cards.length === 0;
    }
    updateCardPositions() {
        const dimensions = this.getGameDimensions();
        this.cards.forEach((card, index) => {
            card.setStackPosition(this.stackIndex, index, this.cards.length, dimensions.width, dimensions.height);
        });
    }
    getGameDimensions() {
        // Use actual window dimensions for proper centering
        return {
            width: window.innerWidth,
            height: window.innerHeight
        };
    }
}
//# sourceMappingURL=CardStack.js.map