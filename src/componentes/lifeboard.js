// Marcador de Vidas

export default class Life{
    constructor(scene){
        this.relatedScene = scene;
        this.lives = 3;
    }
    create () {
        // Configura el texto de las vidas
        this.vidaText = this.relatedScene.add.text(360, 20, "Vidas: "+ this.lives, {
            fontSize: "28px",
            fill: "#fff",
            fontFamily: "dogicapixelbold"
        });
    }
    
    decrement(){
        this.lives -= 1;
        this.vidaText.setText("Vidas: " + this.lives);

    }
}