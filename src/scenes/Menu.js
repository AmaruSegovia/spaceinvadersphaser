import SoundScene from "../componentes/sound-scene.js";
import play_botton from "../componentes/play-button.js";
class Menu extends Phaser.Scene{
    constructor(){
        super({key: "Menu"});
    }
    
    init(){
        this.sonido = new SoundScene(this);
        this.button = new play_botton(this);
    }
    preload() {
        // Sonido
        this.sonido.preload('Menu', '/public/sound/musicScene/Menu.mp3')
        //enemi
        this.load.image("enemigo", "public/img/enemy.png");
        //Fondo
        this.load.image('background', 'public/img/fondito.jpg');
        //Boton play
        this.button.preload();
        //cielo
        this.load.image('nube', 'public/img/skye3.png')
        this.load.spritesheet("explosion","public/img/explosion.png", {
            frameWidth: 48,
            frameHeight: 48,
        });
    }
    create() {
        // Agregando Sonido
        this.sonido.create('Menu')
        // 
        this.add.image(400,300, 'background').setScale(0.6,0.6);
        //this.add.image(300,300, 'nube').setScale(4,4)
        //crea un grupo para enemigos
        this.enemigos = this.physics.add.group();
        // Configura un temporizador para crear enemigos
        this.time.addEvent({
            delay: 2000,
            callback: this.generarEnemigo,
            callbackScope: this,
            loop: true,
        });

                // Habilita la interacción con los enemigos
                this.input.on('pointerdown', (pointer) => {
                    this.enemigos.getChildren().forEach(enemigo => {
                        if (enemigo.getBounds().contains(pointer.x, pointer.y)) {
                            this.add.sprite(enemigo.x, enemigo.y, 'explosion').play('explode').setScale(2);
                            enemigo.destroy();
                        }
                    });
                });
        
                // Animacion de explosion
                this.anims.create({
                    key: "explode",
                    frames: this.anims.generateFrameNumbers("explosion"),
                    frameRate: 20,
                    repeat: 0, 
                    hideOnComplete: true // desaparece una vez que finaliza la animacion
                });
    }
    generarEnemigo() {
        const x = 800;
        const y = Phaser.Math.Between(100, 500);
        const enemigo = this.enemigos.create(x, y, "enemigo");
        enemigo.setVelocityX(Phaser.Math.Between(-200, -100));
    }
    update(){
        //Verifica que los enemigos salgan y se destruyan
        this.enemigos.getChildren().forEach(enemigo => {
            if (enemigo.x > 800 || enemigo.x < 0 || enemigo.y > 600 || enemigo.y < 0) {
                enemigo.destroy();
            }
        });
        
        // Agregando el boton
        this.button.create();
    }
}
export default Menu;