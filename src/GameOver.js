class GameOver extends Phaser.Scene {
    constructor() {
        super("GameOver");

        let puntuacionFinal;
    }

    init(data){
        console.log(data)
        this.puntajeFinal = data.puntajeFinal;
    }

    preload(){
        this.load.image('gameover-screen', '/public/img/gameover-screen.jpeg')
        this.load.image('restart-button', '/public/img/restart-button.jpeg')
    }

    create(){

        this.add.image(400, 300, 'gameover-screen');
        this.startButton = this.add.image(400, 450, 'restart-button').setScale(0.2).setInteractive();
        this.startButton.on('pointerdown', () => {
            this.scene.start('Nivel1');
        });
        this.puntuacionFinalText = this.add.text(160, 300, "Puntaje final: "+ this.puntajeFinal, {
            fontSize: "36px",
            fill: "#fff",
            fontFamily: "dogicapixelbold"
        });

    }

}
export default GameOver;