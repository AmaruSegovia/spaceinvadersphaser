// Marcador de Puntuacion

export default class ScoreBoard{
    constructor(scene, puntaje){
        this.relatedScene = scene;
        this.puntaje = puntaje;
    }
    create () {
        // Configura el texto del puntaje
        this.puntajeText = this.relatedScene.add.text(20, 20, "Puntaje: "+ this.puntaje, {
            fontSize: "28px",
            fill: "#fff",
            fontFamily: "dogicapixelbold"
        });
    }
    
    incrementPoints(points){
        this.puntaje += points;
        this.puntajeText.setText("Puntaje: " + this.puntaje);
    }

    getPoints(){
        return(this.puntaje);
    }
}