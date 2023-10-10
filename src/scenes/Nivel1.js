import ScoreBoard from "../componentes/scoreboard.js";
import Particle from "../componentes/particle.js";
import Life from "../componentes/lifeboard.js";
import FPS from "../componentes/fpsboard.js";
import SoundScene from "../componentes/sound-scene.js";

class Nivel1 extends Phaser.Scene {
    constructor() {
        super({ key: 'Nivel1' });

        // Inicializar variables aquí
        this.nave;
        this.proyectiles;
        this.proyectilesEnemigos;
        this.enemigos;
        this.cursors;
        this.spaceKey;
        this.fondo;
        this.velocidadEscenario = 1;
        this.disparosRecibidos = 0;
        this.maxDisparosPermitidos = 3;
    }

    //carga cuando se reinicia o inicia la escena
    init(data){
        this.scoreBoard = new ScoreBoard(this, data.puntos);
        this.particle1 = new Particle(this);
        this.particle2 = new Particle(this);
        this.vidas = new Life(this, data.vidas);
        this.fps = new FPS(this);
        this.sonido = new SoundScene(this);
    }

    preload() {
        // Cargamos las imágenes
        this.load.image("proyectil", "public/img/shoot.png");
        this.load.image("proyectilEnemigo", "public/img/shootEnemy.png");
        this.load.image("enemigo", "public/img/enemy.png");
        this.load.image("fondo", "public/img/fondito.jpg");
        this.load.image("particles", "public/img/orange.png");
        this.load.spritesheet("nave", "public/img/nave.png", {
            frameWidth: 70,
            frameHeight: 62,
        });

        // Cargamos los sonidos
        this.sonido.preload('nivel1', 'public/sound/musicScene/Pluto  Space.mp3');

        // Cargamos la fuente
        this.loadFont('dogicapixelbold', '../public/fonts/dogicapixel.ttf');

        this.load.spritesheet("explosion","public/img/explosion.png", {
              frameWidth: 48,
              frameHeight: 48,
            }
          );
    }

    create() {
        // Crea el fondo del escenario y lo hace un tileSprite para que se repita
        this.fondo = this.add.tileSprite(0, 0, 800, 600, "fondo");
        this.sonido.create('nivel1');

        this.fondo.setOrigin(0, 0);

        // Crea el personaje
        this.nave = this.physics.add.sprite(100, 300, "nave");
        this.nave.setCollideWorldBounds(true);

        // Crea las animaciones del personaje
        this.anims.create({
            key: "up",
            frames: this.anims.generateFrameNumbers("nave", {
                start: 2,
                end: 2,
            }),
            frameRate: 10,
        });
        this.anims.create({
            key: "idle",
            frames: this.anims.generateFrameNumbers("nave", {
                start: 0,
                end: 0,
            }),
            frameRate: 10,
        });
        this.anims.create({
            key: "down",
            frames: this.anims.generateFrameNumbers("nave", {
                start: 1,
                end: 1,
            }),
            frameRate: 10,
        });
        // Animacion de explosion
        this.anims.create({
            key: "explode",
            frames: this.anims.generateFrameNumbers("explosion"),
            frameRate: 20,
            repeat: 0, 
            hideOnComplete: true // desaparece una vez que finaliza la animacion
          });

        // Crea las particulas de la nave
        this.particle1.create(10, this.nave);
        this.particle2.create(-10, this.nave);

        // Crea un grupo para los proyectiles de la nave
        this.proyectiles = this.physics.add.group();

        // Crea un grupo para los proyectiles de los enemigos
        this.proyectilesEnemigos = this.physics.add.group();

        // Crea un grupo para los enemigos
        this.enemigos = this.physics.add.group();

        // Configura las teclas de movimiento
        this.cursors = this.input.keyboard.createCursorKeys();

        // Configura la tecla de espacio para disparar
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Configura un temporizador para crear enemigos
        this.time.addEvent({
            delay: 2000,
            callback: this.generarEnemigo,
            callbackScope: this,
            loop: true,
        });

        // Configura un temporizador para que los enemigos disparen
        this.time.addEvent({
            delay: 1500,
            callback: () => {
                this.enemigos.getChildren().forEach(enemigo => {
                    this.dispararProyectilEnemigo(enemigo);
                    this.sonido.enemigo_disparo();
                });
            },
            callbackScope: this,
            loop: true
        });

        // Agrega una colisión entre proyectiles y enemigos
        this.physics.add.collider(this.proyectiles, this.enemigos, (proyectil, enemigo) => {
            proyectil.destroy();
            this.scoreBoard.incrementPoints(10);
            this.add.sprite(enemigo.x, enemigo.y, 'explosion').play('explode').setScale(2);
            this.sonido.muerte_enemigo();
            enemigo.destroy();
        });

        // Agrega una colisión entre proyectiles enemigos y nave
        this.physics.add.collider(this.proyectilesEnemigos, this.nave, this.colisionNaveProyectil, null, this);
    
        // Agrega una colisión entre proyectiles enemigos y nave
        this.physics.add.collider(this.proyectilesEnemigos, this.nave, this.colicioninmediata, null, this);
    
        // Creando Marcador de vidas
        this.vidas.create();
        
        // Creando Marcador de puntos
        this.scoreBoard.create();

        // Crando marcador de FPS
        this.fps.create();

        // Colisionar nave con grupoEnemigos
        this.physics.add.collider(this.nave, this.enemigos, this.colisionNaveEnemigo, null, this);
    
    }
    // Colision Nave - Proyectil enemigo
    colisionNaveProyectil(nave, proyectilEnemigo){
        this.vidas.decrement();
        proyectilEnemigo.destroy();
    }

    colisionNaveEnemigo(nave, enemigo) {
        enemigo.destroy();
        this.sonido.muerte_enemigo();
        this.add.sprite(enemigo.x, enemigo.y, 'explosion').play('explode').setScale(2);
        this.vidas.decrement();
    }

    update() {
        this.fondo.tilePositionX += this.velocidadEscenario;

        this.fps.obteniendo(Math.floor(this.game.loop.actualFps));

        if (this.cursors.right.isDown) {
            this.nave.setVelocityX(200);
            this.velocidadEscenario = 3;
        } else if (this.cursors.left.isDown) {
            this.nave.setVelocityX(-200);
            this.velocidadEscenario = 0.5;
        } else {
            this.nave.setVelocityX(0);
            this.nave.anims.play("idle");
            this.velocidadEscenario = 1;
        }

        if (this.cursors.up.isDown) {
            this.nave.setVelocityY(-200);
            this.nave.anims.play("up", true);
        } else if (this.cursors.down.isDown) {
            this.nave.setVelocityY(200);
            this.nave.anims.play("down", true);
        } else {
            this.nave.setVelocityY(0);
            this.nave.anims.play("idle");
        }

        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            this.dispararProyectil();
            this.sonido.disparo();
        }

        // Verifica si los proyectiles han salido de los límites del mapa y destrúyelos
        this.proyectiles.getChildren().forEach(proyectil => {
            if (proyectil.x > 800 || proyectil.x < 0 || proyectil.y > 600 || proyectil.y < 0) {
                proyectil.destroy();
            }
        });

        // Verifica si los proyectiles enemigos han salido de los límites del mapa y destrúyelos
        this.proyectilesEnemigos.getChildren().forEach(proyectilEnemigo => {
            if (proyectilEnemigo.x > 800 || proyectilEnemigo.x < 0 || proyectilEnemigo.y > 600 || proyectilEnemigo.y < 0) {
                proyectilEnemigo.destroy();
            }
        });

        // Verifica si los enemigos han salido de los límites del mapa y destrúyelos
        this.enemigos.getChildren().forEach(enemigo => {
            if (enemigo.x > 800 || enemigo.x < 0 || enemigo.y > 600 || enemigo.y < 0) {
                enemigo.destroy();
            }
        });
        if (this.vidas.lives === 0) {
            this.sonido.muerte_nave();
            this.add.sprite(this.nave.x, this.nave.y, 'explosion').play('explode').setScale(2);
            console.log("Game Over");
            this.sonido.detener_escena();
            // Después de un cierto tiempo (en milisegundos), cambia a la siguiente escena
            this.time.delayedCall(10000, this.scene.start('NombreDeSiguienteEscena'), [], this);
        }
    }

    dispararProyectil() {
        const proyectil = this.proyectiles.create(this.nave.x, this.nave.y, "proyectil");
        proyectil.setVelocityX(400);
    }

    dispararProyectilEnemigo(enemigo) {
        const proyectilEnemigo = this.proyectilesEnemigos.create(enemigo.x, enemigo.y, "proyectilEnemigo");
        proyectilEnemigo.setVelocityX(-400);
        enemigo.setVelocityY(Phaser.Math.Between(-100, 100));
    }

    generarEnemigo() {
        const x = 800;
        const y = Phaser.Math.Between(100, 500);
        const enemigo = this.enemigos.create(x, y, "enemigo");
        enemigo.setVelocityX(Phaser.Math.Between(-200, -100));
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

export default Nivel1;
