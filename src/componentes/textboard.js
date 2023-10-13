// Texto

export default class Text{
    constructor(scene){
        this.relatedScene = scene;
    }
    create (text, x, y) {
        // Configura el texto de los FPS
        this.mostrarFPS = this.relatedScene.add.text(x, y, text, {
            fontSize: '28px',
            fill: '#fff',
            fontFamily: 'dogicapixelbold'
        });
    }
}