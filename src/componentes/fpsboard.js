// Marcador de FPS

export default class FPS{
    constructor(scene){
        this.relatedScene = scene;
    }
    create () {
        // Configura el texto de los FPS
        this.mostrarFPS = this.relatedScene.add.text(730, 20, 'FPS: 0', {
            fontSize: '28px',
            fill: '#fff',
            fontFamily: 'dogicapixelbold'
        });
    }
    obteniendo(Caso){
        this.mostrarFPS.setText(`FPS: ${Caso}`);
    }
}