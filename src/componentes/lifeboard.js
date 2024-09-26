// Marcador de Vidas

export default class Life{
    constructor(scene,lifes){
        this.relatedScene = scene;
        this.lifes = lifes;
    }
    create () {
        // Configura el texto de las vidas
        this.vidaText = this.relatedScene.add.text(360, 20, "Lifes: "+ this.lifes, {
            fontSize: "28px",
            fill: "#fff",
            fontFamily: "dogicapixelbold"
        });
    }
    
    decrement(){
        this.lifes--;
        this.actualizarVida();
    }
    increment(){
        this.lifes++;
        this.actualizarVida();
    }

    actualizarVida(){
        this.vidaText.setText("Lifes: " + this.lifes)
    }

    getLifes(){
        return(this.lifes);
    }
}