// Texto

export default class Text{
    constructor(scene){
        this.relatedScene = scene;
    }
    create (text, x, y, size) {
        // Configura cualquier texto
        this.text = this.relatedScene.add.text(x, y, text, {
            fontSize: size,
            fill: '#fff',
            fontFamily: 'dogicapixelbold',align: 'center'
        });
    }
}