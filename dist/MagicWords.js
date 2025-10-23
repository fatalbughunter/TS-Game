export class MagicWords {
    constructor(app, onBackToMenu) {
        this.dialogueData = null;
        this.currentDialogueIndex = 0;
        this.dialogueContainer = null;
        this.backButton = null;
        this.autoAdvanceTimer = null;
        this.app = app;
        this.onBackToMenu = onBackToMenu;
        this.container = new PIXI.Container();
    }
    async show() {
        console.log('Showing Magic Words page...');
        // Add container to stage
        this.app.stage.addChild(this.container);
        console.log('Container added to stage');
        // Create background
        this.createBackground();
        console.log('Background created');
        // Create title
        this.createTitle();
        console.log('Title created');
        // Create back button
        this.createBackButton();
        console.log('Back button created');
        // Load dialogue data from API
        await this.loadDialogueData();
        console.log('Dialogue data loaded');
        // Create dialogue system
        this.createDialogueSystem();
        console.log('Dialogue system created');
        // Create FPS counter
        this.createFPSCounter();
        console.log('FPS counter created');
        console.log('Magic Words page displayed');
    }
    hide() {
        console.log('Hiding Magic Words page...');
        this.app.stage.removeChild(this.container);
        // Clear auto-advance timer
        if (this.autoAdvanceTimer) {
            clearInterval(this.autoAdvanceTimer);
            this.autoAdvanceTimer = null;
        }
        // Remove FPS counter from stage
        if (this.fpsText) {
            this.app.stage.removeChild(this.fpsText);
            this.fpsText = null;
        }
        console.log('Magic Words page hidden');
    }
    handleResize(dimensions) {
        // Update background
        const background = this.container.children[0];
        if (background && background.clear) {
            background.clear();
            background.beginFill(0x1a1a2e);
            background.drawRect(0, 0, dimensions.width, dimensions.height);
            background.endFill();
            // Add responsive magical pattern
            const patternDensity = dimensions.width < 768 ? 15 : 30;
            const patternRows = dimensions.width < 768 ? 10 : 20;
            background.beginFill(0x16213e, 0.3);
            for (let i = 0; i < patternDensity; i++) {
                for (let j = 0; j < patternRows; j++) {
                    if ((i + j) % 3 === 0) {
                        const x = (dimensions.width / patternDensity) * i + (dimensions.width / patternDensity) / 2;
                        const y = (dimensions.height / patternRows) * j + (dimensions.height / patternRows) / 2;
                        background.drawCircle(x, y, 3);
                    }
                }
            }
            background.endFill();
        }
        // Update dialogue container position
        if (this.dialogueContainer) {
            this.dialogueContainer.x = dimensions.width / 2;
            this.dialogueContainer.y = dimensions.height / 2;
        }
    }
    createFPSCounter() {
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
        this.app.ticker.add((delta) => {
            this.updateFPS(delta);
        });
        console.log('FPS counter created for Magic Words');
    }
    updateFPS(delta) {
        if (this.fpsText) {
            const fps = Math.round(1000 / (delta * 16.67));
            this.fpsText.text = `FPS: ${fps}`;
        }
    }
    createBackground() {
        const background = new PIXI.Graphics();
        background.beginFill(0x1a1a2e); // Dark blue background
        background.drawRect(0, 0, this.app.screen.width, this.app.screen.height);
        background.endFill();
        // Add magical pattern using circles instead of stars
        background.beginFill(0x16213e, 0.3);
        for (let i = 0; i < 30; i++) {
            for (let j = 0; j < 20; j++) {
                if ((i + j) % 3 === 0) {
                    background.drawCircle(i * 40 + 20, j * 30 + 15, 3);
                }
            }
        }
        background.endFill();
        this.container.addChild(background);
    }
    createTitle() {
        const titleStyle = new PIXI.TextStyle({
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
        const title = new PIXI.Text('MAGIC WORDS', titleStyle);
        title.anchor.set(0.5);
        title.x = this.app.screen.width / 2;
        title.y = 80;
        this.container.addChild(title);
    }
    createBackButton() {
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
    async loadDialogueData() {
        try {
            console.log('Loading dialogue data from API...');
            const response = await fetch('https://private-624120-softgamesassignment.apiary-mock.com/v2/magicwords');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.dialogueData = await response.json();
            console.log('Dialogue data loaded:', this.dialogueData);
            // Ensure we have the expected structure
            if (!this.dialogueData.dialogue) {
                console.warn('API response missing dialogue array, using fallback');
                throw new Error('Invalid API response structure');
            }
        }
        catch (error) {
            console.error('Failed to load dialogue data:', error);
            console.log('Using fallback data...');
            // Create mock data if API fails
            this.dialogueData = {
                dialogue: [
                    {
                        name: "Sheldon",
                        text: "I admit {satisfied} the design of Cookie Crush is quite elegant in its simplicity."
                    },
                    {
                        name: "Leonard",
                        text: "That's practically a compliment, Sheldon. {intrigued} Are you feeling okay?"
                    }
                ],
                emojies: [
                    { name: "satisfied", url: "https://api.dicebear.com/9.x/fun-emoji/png?seed=Jocelyn" },
                    { name: "intrigued", url: "https://api.dicebear.com/9.x/fun-emoji/png?seed=Sawyer" }
                ],
                avatars: [
                    { name: "Sheldon", url: "https://api.dicebear.com/9.x/personas/png?body=squared&clothingColor=6dbb58&eyes=open&hair=buzzcut&hairColor=6c4545&mouth=smirk&nose=smallRound&skinColor=e5a07e", position: "left" },
                    { name: "Leonard", url: "https://api.dicebear.com/9.x/personas/png?body=checkered&clothingColor=f3b63a&eyes=glasses&hair=shortCombover&hairColor=362c47&mouth=surprise&nose=mediumRound&skinColor=d78774", position: "right" }
                ]
            };
        }
    }
    createDialogueSystem() {
        console.log('Creating dialogue system...');
        console.log('Dialogue data:', this.dialogueData);
        if (!this.dialogueData || !this.dialogueData.dialogue) {
            console.error('No dialogue data available');
            console.error('dialogueData:', this.dialogueData);
            return;
        }
        // Create dialogue container
        this.dialogueContainer = new PIXI.Container();
        this.dialogueContainer.x = this.app.screen.width / 2 - 400; // Center the dialogue box (800/2 = 400)
        this.dialogueContainer.y = this.app.screen.height / 2 - 100; // Center vertically (200/2 = 100)
        console.log('Dialogue container created at:', this.dialogueContainer.x, this.dialogueContainer.y);
        // Create dialogue box background
        const dialogueBox = new PIXI.Graphics();
        dialogueBox.beginFill(0x2C2C2C, 0.9);
        dialogueBox.lineStyle(3, 0xFF69B4);
        dialogueBox.drawRoundedRect(0, 0, 800, 200, 15);
        dialogueBox.endFill();
        // Add inner glow
        dialogueBox.beginFill(0x1A1A1A, 0.5);
        dialogueBox.drawRoundedRect(5, 5, 790, 190, 12);
        dialogueBox.endFill();
        this.dialogueContainer.addChild(dialogueBox);
        // Display first dialogue
        this.displayCurrentDialogue();
        // Start auto-advance timer (every 2 seconds)
        this.startAutoAdvance();
        this.container.addChild(this.dialogueContainer);
        console.log('Dialogue container added to main container');
        console.log('Container children count:', this.container.children.length);
    }
    displayCurrentDialogue() {
        console.log('Displaying current dialogue...');
        console.log('Dialogue data:', this.dialogueData);
        console.log('Current index:', this.currentDialogueIndex);
        if (!this.dialogueData || !this.dialogueData.dialogue || this.currentDialogueIndex >= this.dialogueData.dialogue.length) {
            console.log('No dialogue to display');
            return;
        }
        const dialogue = this.dialogueData.dialogue[this.currentDialogueIndex];
        console.log('Current dialogue:', dialogue);
        // Clear previous dialogue content (keep background box at index 0)
        if (this.dialogueContainer.children.length > 1) {
            this.dialogueContainer.removeChildren(1);
        }
        // Create character name
        const characterStyle = new PIXI.TextStyle({
            fontFamily: 'Arial, sans-serif',
            fontSize: 24,
            fontWeight: 'bold',
            fill: 0xFF69B4,
            stroke: 0xFFFFFF,
            strokeThickness: 2
        });
        const characterText = new PIXI.Text(`${dialogue.name}:`, characterStyle);
        characterText.x = 30;
        characterText.y = 30;
        this.dialogueContainer.addChild(characterText);
        // Create character avatar
        this.createCharacterAvatar(dialogue.name);
        // Process dialogue text with emoji replacements
        const processedText = this.processDialogueText(dialogue.text);
        // Create dialogue text
        const textStyle = new PIXI.TextStyle({
            fontFamily: 'Arial, sans-serif',
            fontSize: 20,
            fill: 0xFFFFFF,
            wordWrap: true,
            wordWrapWidth: 900,
            lineHeight: 28
        });
        const dialogueText = new PIXI.Text(processedText, textStyle);
        dialogueText.x = 30;
        dialogueText.y = 150;
        this.dialogueContainer.addChild(dialogueText);
        // Add progress indicator
        const progressStyle = new PIXI.TextStyle({
            fontFamily: 'Arial, sans-serif',
            fontSize: 16,
            fill: 0x888888
        });
        const progressText = new PIXI.Text(`${this.currentDialogueIndex + 1} / ${this.dialogueData.dialogue.length}`, progressStyle);
        progressText.x = 30;
        progressText.y = 250;
        this.dialogueContainer.addChild(progressText);
    }
    startAutoAdvance() {
        console.log('Starting auto-advance timer (2 seconds)');
        this.autoAdvanceTimer = setInterval(() => {
            this.nextDialogue();
        }, 2000); // 2 seconds
    }
    nextDialogue() {
        if (!this.dialogueData || !this.dialogueData.dialogue)
            return;
        this.currentDialogueIndex++;
        if (this.currentDialogueIndex >= this.dialogueData.dialogue.length) {
            this.currentDialogueIndex = 0; // Loop back to start
        }
        this.displayCurrentDialogue();
    }
    processDialogueText(text) {
        // Replace emotion tags with actual emojis
        let processedText = text;
        if (this.dialogueData.emojies) {
            this.dialogueData.emojies.forEach((emoji) => {
                const emotionTag = `{${emoji.name}}`;
                processedText = processedText.replace(emotionTag, `[${emoji.name}]`);
            });
        }
        return processedText;
    }
    createCharacterAvatar(characterName) {
        if (!this.dialogueData.avatars)
            return;
        const avatar = this.dialogueData.avatars.find((a) => a.name === characterName);
        if (!avatar)
            return;
        // Create avatar sprite from URL
        const avatarSprite = PIXI.Sprite.from(avatar.url);
        avatarSprite.width = 80;
        avatarSprite.height = 80;
        // Position based on character position
        if (avatar.position === 'left') {
            avatarSprite.x = -120; // Move left avatar much further left to avoid overlap
            avatarSprite.y = 80;
        }
        else {
            avatarSprite.x = 900;
            avatarSprite.y = 80;
        }
        this.dialogueContainer.addChild(avatarSprite);
    }
}
//# sourceMappingURL=MagicWords.js.map