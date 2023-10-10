// Jugador
import Particle from "./particle.js";

export default class Player{
    constructor(scene){
        this.relatedScene = scene;
        this.particle1 = new Particle(this.relatedScene);
        this.particle2 = new Particle(this.relatedScene);
    }
    init(){
    }
    preload(){
        this.relatedScene.load.spritesheet("nave", "public/img/nave.png", {
            frameWidth: 70,
            frameHeight: 62,
        });
        
        this.relatedScene.load.spritesheet("explosion","public/img/explosion.png", {
            frameWidth: 48,
            frameHeight: 48,
          }
        );
    }
    create () {
        
        this.crearNave();

        // Crea las animaciones del personaje
        this.relatedScene.anims.create({
            key: "up",
            frames: this.relatedScene.anims.generateFrameNumbers("nave", {
                start: 2,
                end: 2,
            }),
            frameRate: 10,
        });
        this.relatedScene.anims.create({
            key: "idle",
            frames: this.relatedScene.anims.generateFrameNumbers("nave", {
                start: 0,
                end: 0,
            }),
            frameRate: 10,
        });
        this.relatedScene.anims.create({
            key: "down",
            frames: this.relatedScene.anims.generateFrameNumbers("nave", {
                start: 1,
                end: 1,
            }),
            frameRate: 10,
        });
        // Animacion de explosion
        this.relatedScene.anims.create({
            key: "explode",
            frames: this.relatedScene.anims.generateFrameNumbers("explosion"),
            frameRate: 20,
            repeat: 0, 
            hideOnComplete: true, // desaparece una vez que finaliza la animacion
        });
        
    }

    crearNave(){
        // Crea el personaje
        this.nave = this.relatedScene.physics.add.sprite(100, 300, "nave");
        this.nave.setCollideWorldBounds(true);
        
        // Crea las particulas de la nave
        this.particle1.create(10, this.nave);
        this.particle2.create(-10, this.nave);
    }

    destruirNave(){
        this.nave.destroy();
        this.particle1.destruir();
        this.particle2.destruir();
    }

    velocidadX(x){
        this.nave.setVelocityX(x);
    }
    velocidadY(y){
        this.nave.setVelocityY(y);
    }

    animacion(nombre){
        this.nave.anims.play(nombre);
    }

    getObject(){
        return(this.nave);
    }

    getPosicionX(){
        return(this.nave.x)
    }
    getPosicionY(){
        return(this.nave.y);
    }
}