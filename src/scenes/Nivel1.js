import ScoreBoard from "../componentes/scoreboard.js";
import Player from "../componentes/player.js";
import Life from "../componentes/lifeboard.js";
import FPS from "../componentes/fpsboard.js";
import SoundScene from "../componentes/sound-scene.js";

class Nivel1 extends Phaser.Scene {
    constructor() {
        super({ key: 'Nivel1' });

        // Inicializar variables aquí
        this.proyectiles;
        this.proyectilesEnemigos;
        this.enemigos;
        this.cursors;
        this.spaceKey;
        this.fondo;
        this.velocidadEscenario = 1;
        this.disparosRecibidos = 0;
        this.lifes = 3;
        this.maxDisparosPermitidos = 3;
    }

    //carga cuando se reinicia o inicia la escena
    init(data){
        this.scoreBoard = new ScoreBoard(this, data.puntos);
        this.vidas = new Life(this,this.lifes );
        this.fps = new FPS(this);
        this.sonido = new SoundScene(this);
        this.nave = new Player(this);
    }

    preload() {
        // Cargamos las imágenes
        this.load.image("proyectil", "public/img/shoot.png");
        this.load.image("proyectilEnemigo", "public/img/shootEnemy.png");
        this.load.image("enemigo", "public/img/enemy.png");
        this.load.image("fondo", "public/img/FondoNubes.jpg");
        this.load.image("particles", "public/img/orange.png");
        // Cargamos la nave
        this.nave.preload();

        // Cargamos los sonidos
        this.sonido.preload('nivel1', 'public/sound/musicScene/Pluto  Space.mp3');

        // Cargamos la fuente
        this.loadFont('dogicapixelbold', '../public/fonts/dogicapixel.ttf');
    }

    create() {
        // Crea el fondo del escenario y lo hace un tileSprite para que se repita
        this.fondo = this.add.tileSprite(0, 0, 800, 600, "fondo").setScale(2);
        this.fondo.setOrigin(0, 0);

        this.sonido.create('nivel1');

        // Crea el personaje
        this.nave.create();
        this.estadoNave = true;

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

        // Creando Marcador de vidas
        this.vidas.create();
        
        // Creando Marcador de puntos
        this.scoreBoard.create();

        // Crando marcador de FPS
        this.fps.create();

    }

    update() {
        if (this.estadoNave) {
            this.fondo.tilePositionX += this.velocidadEscenario;
        }
        
        // Colisionar nave con grupoEnemigos
        this.physics.add.collider(this.nave.getObject(), this.enemigos, this.colisionNaveEnemigo, null, this);
        
        // Agrega una colisión entre proyectiles enemigos y nave
        this.physics.add.collider(this.proyectilesEnemigos, this.nave.getObject(), this.colisionNaveProyectil, null, this);

        this.fps.obteniendo(Math.floor(this.game.loop.actualFps));

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
        // Verifica si la nave no tiene vidas y pasa a la escena de GameOver
        if (this.vidas.lifes <= 0) {
            if (this.estadoNave) {
                this.estadoNave = false;
                this.sonido.muerte_nave();
                this.sonido.detener_escena();
            }
            // Cuando la nave muere, puedes esperar 2 segundos y luego cambiar de escena
            setTimeout(() => {
                this.scene.start('GameOver',{puntajeFinal: this.scoreBoard.getPoints()});
            }, 2000);
        }
    }

    dispararProyectil() {
        const proyectil = this.proyectiles.create(this.nave.getPosicionX(), this.nave.getPosicionY(), "proyectil");
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

    // Colision Nave - Proyectil enemigo
    colisionNaveProyectil(nave, proyectilEnemigo){
        this.vidas.decrement();
        proyectilEnemigo.destroy();
        if (this.vidas.lifes <= 0) {
            this.naveInvisible();
        }
    }

    // Colision entre la nave y algun enemigo
    colisionNaveEnemigo(nave, enemigo) {
        enemigo.destroy();
        this.sonido.muerte_enemigo();
        this.add.sprite(nave.x, nave.y, 'explosion').play('explode').setScale(2);
        this.add.sprite(enemigo.x, enemigo.y, 'explosion').play('explode').setScale(2);
        this.vidas.decrement();
        this.nave.destruirNave();

        if (this.vidas.lifes > 0) {
            this.nave.crearNave();
        }else {
            this.nave.crearNave();
            this.naveInvisible();
        }
    }

    naveInvisible(){
        this.nave.deshabilitar();
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
