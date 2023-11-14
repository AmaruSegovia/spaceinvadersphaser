export default class Asteroide{
    constructor(scene){
        this.relatedScene = scene;
    }
    preload(){
        // Sprite
        this.relatedScene.load.spritesheet("asteroide", "public/img/asteroide.png", {
            frameWidth: 58,
            frameHeight: 62,
            startFrame:3
        });
    }
}