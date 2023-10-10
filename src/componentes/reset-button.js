export default class restart_botton{
    constructor(scene) {
        this.relatedScene = scene;
    }
    preload() {
        this.relatedScene.load.spritesheet("button", "/public/img/restart.png");
    }
    create() {
        this.startButton = this.relatedScene.add.sprite(400, 230, "button").setInteractive();

        this.startButton.on('pointerdown', () => {
          this.relatedScene.scene.start("Game");
        });
    }
}