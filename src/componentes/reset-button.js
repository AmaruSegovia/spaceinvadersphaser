export default class restart_botton{
    constructor(scene) {
        this.relatedScene = scene;
    }
    preload() {
        this.relatedScene.load.image('restart-button', '/public/img/restart-button.jpeg')
    }
    create() {
        this.startButton = this.relatedScene.add.image(400, 450, 'restart-button').setScale(0.2).setInteractive();
        this.startButton.on('pointerdown', () => {
            this.relatedScene.scene.start('Tutorial');
        });
    }
}