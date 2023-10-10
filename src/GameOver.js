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
        this.load.image('gameover-screen', '/public/img/gameover-screen.png')
        this.load.image('restart-button', '/public/img/restart-button.png')
    }

    create(){

        this.add.image(400, 200, 'gameover-screen');
        this.startButton = this.add.image(400, 450, 'restart-button').setInteractive();
        this.startButton.on('pointerdown', () => {
            this.scene.start('Nivel1');
        });
        this.puntuacionFinalText = this.add.text(160, 350, "Puntaje final: "+ this.puntajeFinal, {
            fontSize: "36px",
            fill: "#fff",
            fontFamily: "dogicapixelbold"
        });

    }

}
export default GameOver;