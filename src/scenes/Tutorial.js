import ScoreBoard from "../componentes/scoreboard.js";
import Particle from "../componentes/particle.js";
import Life from "../componentes/lifeboard.js";
import FPS from "../componentes/fpsboard.js";
import SoundScene from "../componentes/sound-scene.js";
import Player from "../componentes/player.js";

export default class Tutorial extends Phaser.Scene{
    constructor(){
        super({key: "Tutorial"});
        this.maxpoints= 100; // Cantidad de puntos necesarios para pasar a otro nivel
        this.lifes = 3;
        this.puntaje = 0;
    }

    //carga cuando se reinicia o inicia la escena
    init(){
        this.scoreBoard = new ScoreBoard(this, this.puntaje);
        this.vidas = new Life(this,this.lifes);
        this.fps = new FPS(this);
        this.sonido = new SoundScene(this);
        this.nave = new Player(this);
    }

    preload() {
        // Asteroide
        this.load.spritesheet("asteroide", "public/img/asteroide.png", {
            frameWidth: 58,
            frameHeight: 62,
            startFrame:3
        });

        // Jugador
        this.nave.preload();
        
        //Fondo
        this.load.image('fondoTutorial', 'public/img/1.jpeg');
        this.load.image("proyectil", "public/img/shoot.png");

        // Cargamos la fuente
        this.loadFont('dogicapixelbold', '../public/fonts/dogicapixel.ttf');

        // Cargamos los sonidos
        this.sonido.preload('tutorial', 'public/sound/musicScene/Tutorial.mp3');

    }
    create() {
        console.log('Consigue 100 puntos para avanzar');
        // Agregando Sonido
        this.sonido.create('tutorial');

        this.add.image(400,300, 'fondoTutorial').setScale(0.82);
        //crea un grupo para asteroides
        this.asteroides = this.physics.add.group();

        // Configura un temporizador para crear asteroides
        this.time.addEvent({
            delay: 2000,
            callback: this.generarEnemigo,
            callbackScope: this,
            loop: true,
        });
        // Creando nave
        this.nave.create();

        // Crea un grupo para los proyectiles de la nave
        this.proyectiles = this.physics.add.group();

        // Configura las teclas de movimiento
        this.cursors = this.input.keyboard.createCursorKeys();

        // Configura la tecla de espacio para disparar
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Creando Marcador de vidas
        this.vidas.create();
        
        // Creando Marcador de puntos
        this.scoreBoard.create(0);

        // Crando marcador de FPS
        this.fps.create();

        // Agrega una colisión entre proyectiles y asteroide
        this.physics.add.collider(this.proyectiles, this.asteroides, (proyectil, asteroide) => {
            proyectil.destroy();
            this.scoreBoard.incrementPoints(10);
            this.add.sprite(asteroide.x, asteroide.y, 'explosion').play('explode').setScale(2);
            this.sonido.muerte_enemigo();
            asteroide.destroy();
        });
        this.estadoNave = true;
    }
    // Colision entre la nave y algun asteroide(enemigo)
    colisionNaveEnemigo(nave, enemigo) {
        enemigo.destroy();
        this.sonido.muerte_enemigo();
        this.add.sprite(nave.x, nave.y, 'explosion').play('explode').setScale(2);
        this.add.sprite(enemigo.x, enemigo.y, 'explosion').play('explode').setScale(2);
        this.nave.deshabilitar();
        this.vidas.decrement();
        this.nave.destruirNave();

        if (this.vidas.lifes > 0) {
            this.nave.crearNave();
        }else {
            this.nave.crearNave();
            this.nave.deshabilitar();
        }
    }

    // Generando Asteroides
    generarEnemigo() {
        const x = 800;
        const y = Phaser.Math.Between(100, 500);
        const asteroide = this.asteroides.create(x, y, "asteroide");
        asteroide.setVelocityX(Phaser.Math.Between(-200, -100));
    }

    // Nave disparando proyectil
    dispararProyectil() {
        const proyectil = this.proyectiles.create(this.nave.getPosicionX(), this.nave.getPosicionY(), "proyectil");
        proyectil.setVelocityX(400);
    }

    update(){
        // Colisionar nave con grupoEnemigos
        this.physics.add.collider(this.nave.getObject(), this.asteroides, this.colisionNaveEnemigo, null, this);
    
        this.fps.obteniendo(Math.floor(this.game.loop.actualFps));

        // Verifica si los proyectiles han salido de los límites del mapa y destrúyelos
        this.proyectiles.getChildren().forEach(proyectil => {
            if (proyectil.x > 800 || proyectil.x < 0 || proyectil.y > 600 || proyectil.y < 0) {
                proyectil.destroy();
            }
        });

        //Verifica que los enemigos salgan y se destruyan
        this.asteroides.getChildren().forEach(asteroide => {
            asteroide.rotation -= 0.01;
            if (asteroide.x > 800 || asteroide.x < 0 || asteroide.y > 600 || asteroide.y < 0) {
                asteroide.destroy();
            }
        });

        if (this.cursors.right.isDown) {
            this.nave.velocidadX(200);
            this.velocidadEscenario = 3;
        } else if (this.cursors.left.isDown) {
            this.nave.velocidadX(-200);
            this.velocidadEscenario = 0.5;
        } else {
            this.nave.velocidadX(0);
            this.nave.animacion("idle");
            this.velocidadEscenario = 1;
        }

        if (this.cursors.up.isDown) {
            this.nave.velocidadY(-200);
            this.nave.animacion("up");
        } else if (this.cursors.down.isDown) {
            this.nave.velocidadY(200);
            this.nave.animacion("down");
        } else {
            this.nave.velocidadY(0);
            this.nave.animacion("idle");
        }

        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
             this.dispararProyectil();
             this.sonido.disparo();
        }

        if (this.vidas.lifes <= 0) {
            if (this.estadoNave) {
                this.estadoNave = false;
                this.sonido.muerte_nave();
                this.sonido.detener_escena();
            
            }
            // Cuando la nave muere, puedes esperar 2 segundos y luego cambiar de escena
            setTimeout(() => {
                this.scene.start('GameOver',{puntajeFinal: this.scoreBoard.getPoints()}); // Puedes pasar datos adicionales aquí
            }, 2000);
        }

        if (this.scoreBoard.getPoints() >= this.maxpoints) {
            this.scene.pause();
            this.sonido.detener_escena();
            this.scene.start('Nivel1',{vidas:this.vidas.getLifes(), puntos:this.scoreBoard.getPoints()},);
        }
    }

    // Funcion para cargar la fuente
    loadFont(name, url) {
        let newFont = new FontFace(name, `url(${url})`);
        newFont.load().then(function (loaded) {
            document.fonts.add(loaded);
        }).catch(function (error) {
            return error;
        });
    }
}