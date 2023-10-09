class Menu extends Phaser.Scene{
    constructor(){
        super({key: "Menu"});
    }
    preload() {
        // this.load.audio('cancion', '/public/sound/cancion.mp3')
        //enemi
        this.load.image("enemigo", "public/img/enemy.png");
        //Fondo
        this.load.image('background', 'public/img/fondito.jpg');
        //Boton play
        this.load.image('button', 'public/img/BotonPlay.png');
        //cielo
        this.load.image('nube', 'public/img/skye3.png')
    }
    create() {
        // Agregando Sonido
        // this.sonido = this.sound.add('cancion')
        // const soundConfig = {
        //     volume: 1,
        //     loop: true
        // }
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
        //hacer el boton interactivo
        this.startButton = this.add.image(400,300, 'button').setInteractive().setScale(0.5,0.5);
        //cuando el boton sea precionado pasar a Escena1
        this.startButton.on('pointerdown', () =>{
            this.scene.start('Nivel1');
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
    }
}
export default Menu;