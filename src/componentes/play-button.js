export default class play_botton{
    constructor(scene) {
      this.relatedScene = scene;
    }
    preload() {
      this.relatedScene.load.spritesheet("button-play", "/public/img/playbutton.png");
    }
    create() {
      this.startButton = this.relatedScene.add.sprite(400, 400, "button-play").setInteractive();

      this.startButton.on('pointerdown', () => {
        this.relatedScene.scene.start("Game");
      });
    }
}