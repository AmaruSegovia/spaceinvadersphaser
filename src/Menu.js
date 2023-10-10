import SoundScene from "./componentes/sound-scene.js";

class Menu extends Phaser.Scene {
    constructor() {
        super({ key: "Menu" });
    }

    init(){
        this.sonido = new SoundScene(this);
    }
    preload() {
        // Carga de recursos
        this.load.image("enemigo", "public/img/enemy.png");
        this.load.image('background', 'public/img/fondito.jpg');
        this.load.image('button', 'public/img/BotonPlay.png');
        this.load.image('nube', 'public/img/skye3.png');
        this.sonido.preload('menu', 'public/sound/musicScene/Tutorial.mp3');
        this.load.spritesheet("explosion","public/img/explosion.png", {
            frameWidth: 48,
            frameHeight: 48,
        });
    }

    create() {
        this.sonido.create('menu');
        this.add.image(400, 300, 'background').setScale(0.6, 0.6);
        this.enemigos = this.physics.add.group();
        // Configura un temporizador para crear enemigos
        this.time.addEvent({
            delay: 2000,
            callback: this.generarEnemigo,
            callbackScope: this,
            loop: true,
        });

        // Inicializa la instancia de SoundScene aquí
 // Reemplaza 'nivel1' con el nombre correcto de tu escena de sonido

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

        // Botón de inicio
        this.startButton = this.add.image(400, 300, 'button').setInteractive().setScale(0.5, 0.5);

        this.startButton.on('pointerdown', () => {
            this.scene.start('Nivel1');
        });
    }

    generarEnemigo() {
        const x = 800;
        const y = Phaser.Math.Between(100, 500);
        const enemigo = this.enemigos.create(x, y, "enemigo");
        enemigo.setVelocityX(Phaser.Math.Between(-200, -100));
    }

    update() {
        // Verifica que los enemigos salgan y se destruyan
        this.enemigos.getChildren().forEach(enemigo => {
            if (enemigo.x > 800 || enemigo.x < 0 || enemigo.y > 600 || enemigo.y < 0) {
                enemigo.destroy();
            }
        });
    }
}

export default Menu;
