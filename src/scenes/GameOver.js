import restart_botton from "../componentes/reset-button.js";

class GameOver extends Phaser.Scene {
    constructor() {
        super("GameOver");
        let puntuacionFinal;
    }

    init(data){
        console.log(data)
        this.puntajeFinal = data.puntajeFinal;
        this.button = new restart_botton(this);
    }

    preload(){
        this.load.image('gameover-screen', '/public/img/gameover-screen.jpeg');
        this.button.preload();
    }

    create(){

        this.add.image(400, 300, 'gameover-screen');
        this.button.create();

        this.puntuacionFinalText = this.add.text(160, 300, "Puntaje final: "+ this.puntajeFinal, {
            fontSize: "36px",
            fill: "#fff",
            fontFamily: "dogicapixelbold"
        });

    }

}
export default GameOver;