export declare class MagicWords {
    private app;
    private container;
    private onBackToMenu;
    private dialogueData;
    private currentDialogueIndex;
    private dialogueContainer;
    private backButton;
    private fpsText;
    private autoAdvanceTimer;
    constructor(app: any, onBackToMenu: () => void);
    show(): Promise<void>;
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
    private loadDialogueData;
    private createDialogueSystem;
    private displayCurrentDialogue;
    private startAutoAdvance;
    private nextDialogue;
    private processDialogueText;
    private createCharacterAvatar;
}
//# sourceMappingURL=MagicWords.d.ts.map