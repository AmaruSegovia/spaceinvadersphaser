import ScoreBoard from "../componentes/scoreboard.js";
import Player from "../componentes/player.js";
import Life from "../componentes/lifeboard.js";
import FPS from "../componentes/fpsboard.js";
import SoundScene from "../componentes/sound-scene.js";
import Asteroide from "../componentes/asteroid.js";
import { Money } from "../componentes/money.js";
import LivePower from "../componentes/powers/live-power.js";
import DestroyPower from "../componentes/powers/destroy-power.js";
import MultiplePower from "../componentes/powers/multiple-power.js";


class Nivel1 extends Phaser.Scene {
    constructor() {
        super({ key: 'Nivel1' });
        this.velocidadEscenario = 1;    // Representa la velocidad que avanza el escenario
        this.dañoPlayer = 1;            // Representa el daño de la bala del jugador
        this.proyectilScale = 1;        // Representa la escala del proyectil
        this.lifes = 3;                 // Representa la vida del jugador
        this.powerGroup = [];           // Almacen para los poderes que se podran usar
        this.maxDisparosPermitidos = 5; // Representa la cantidad maxima de disparos que puede hacer el jugador
        this.ultimoDisparo = 0;         // Representa al tiempo desde el ultimo disparo
        this.retardoDisparo = 250;      // Representa al tiempo minimo para hacer un disparo
    }

    // Carga cuando se reinicia o inicia la escena
    init(data){
        // Se crean instancias a partir de ALGUNA clase
        this.scoreBoard = new ScoreBoard(this, data.puntos);        // Representa el marcador de puntos
        this.scoreVidas = new Life(this,this.lifes );               // Representa el marcador de vidas
        this.fps = new FPS(this);                                   // Representa el marcador de FPS
        this.sonido = new SoundScene(this);                         // Representa los sonidos de las escenas
        this.nave = new Player(this);                               // Representa la jugador
        this.textoDown = new Text(this);                            // Representa al texto superior
        this.textoUp = new Text(this);                              // Representa al texto debajo
        this.asteroid = new Asteroide(this);                        // Representa el sprite del asteroide
        
        this.moneys = new Money(this);                              // Representa a las Monedas que usamos para los PowerUps

        this.powerGroup[1] = new LivePower(this, this.moneys);      // Representa el Poder de agregar vidas
        this.powerGroup[2] = new DestroyPower(this, this.moneys);   // Representa el Poder de aumentar el daño
        this.powerGroup[3] = new MultiplePower(this, this.moneys);  // Representa el Poder de disparo multiple
        
    }

    // Cargar recursos necesarios para el juego antes de que comience la ejecución
    preload() {
        // Asteroide
        this.asteroid.preload();

        // Cargamos las imágenes
        // Proyectil jugador
        this.load.image("proyectil", "public/img/shoot.png");
        // Proyectil Enemigo
        this.load.image("proyectilEnemigo", "public/img/shootEnemy.png");
        // Enemigo
        this.load.image("enemigo", "public/img/enemy.png");
        // Fondo Nivel 1
        this.load.image("fondo", "public/img/FondoNubes.jpg");
        // Particulas de la Nave
        this.load.image("particles", "public/img/orange.png");

        // Moneda
        this.load.image('ball-green', 'public/img/ball-green.png');
        this.load.image('ball-red', 'public/img/ball-red.png');
        this.load.image('ball-purple', 'public/img/ball-purple.png');

        // Nave
        this.nave.preload();

        // Cargamos los Sonidos
        this.sonido.preload('nivel1', 'public/sound/musicScene/Pluto  Space.mp3');

        // Cargamos la fuente
        this.loadFont('dogicapixelbold', '../public/fonts/dogicapixel.ttf');
        
    }

    // Realizaría la configuración adicional y la lógica del juego.
    create() {
        // Agregando sonido
        this.sonido.create('nivel1');

        // Crea el fondo del escenario y lo hace un tileSprite para que se repita
        this.fondo = this.add.tileSprite(0, 0, 800, 600, "fondo").setScale(2);
        this.fondo.setOrigin(0, 0);

        // Creando Nave
        this.nave.create();

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

        // Configura un temporizador para crear objetos powers randoms
        this.time.addEvent({ 
            delay: 5000, 
            callback: this.createRandomPower, 
            callbackScope: this, 
            loop: true 
        });

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
        this.physics.add.collider(this.proyectiles, this.enemigos, this.colisionProyectilEnemigo, null, this);

        // Creando Marcador de vidas
        this.scoreVidas.create();
        
        // Creando Marcador de puntos
        this.scoreBoard.create();

        // Crando marcador de FPS
        this.fps.create();
    } // End Create

    update() {
        this.fondo.tilePositionX += this.velocidadEscenario;

        // Actualizando los FPS
        this.fps.obteniendo(Math.floor(this.game.loop.actualFps));

        // Colisionar nave con grupoEnemigos
        this.physics.add.collider(this.nave.getObject(), this.enemigos, this.colisionNaveEnemigo, null, this);
        
        // Agrega una colisión entre proyectiles enemigos y nave
        this.physics.add.collider(this.proyectilesEnemigos, this.nave.getObject(), this.colisionNaveProyectil, null, this);

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

        // Verifica si la moneda salio de los limites
        this.moneys.verificarMuerte();

        // Control en el disparo del jugador segun la tecla de espacio
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            this.dispararProyectil();
        }

        // Verifica si la nave no tiene vidas y pasa a la escena de GameOver
        if (this.scoreVidas.lifes <= 0) {
            this.sonido.detener_escena();
            this.sonido.muerte_nave();
            // Esperar y luego cambiar de escena
            setTimeout(() => {
                this.scene.start('GameOver',{puntajeFinal: this.scoreBoard.getPoints()});
            }, 1000);
        }

        // Movimiento del jugador
        this.nave.actualizarPosicion(this.cursors,this);
    } // end Update

    // Metodo para crear poderes aleatorios
    createRandomPower(){
        // Array de colores posibles
        let typePower = [1, 2, 3];
        // Elije un poder aleatorio
        let randomPower = Phaser.Utils.Array.GetRandom(typePower);

        // Creando objeto con poder
        this.powerGroup[randomPower].create(800, Phaser.Math.Between(20, 580));
    }
    
    //
    colisionProyectilEnemigo(proyectil, enemigo){
        proyectil.destroy();
        enemigo.vida -= this.dañoPlayer;
        if(enemigo.vida <= 0){
            this.scoreBoard.incrementPoints(15);
            this.add.sprite(enemigo.x, enemigo.y, 'explosion').play('explode').setScale(2);
            this.sonido.muerte_enemigo();
            enemigo.destroy();
        }
    }

    dispararProyectil() {
        const tiempoActual = this.time.now;
        console.log(tiempoActual);
        if (tiempoActual - this.ultimoDisparo > this.retardoDisparo) {
            const proyectil = this.proyectiles.create(this.nave.getPosicionX(), this.nave.getPosicionY(), "proyectil");
            this.sonido.disparo();
            proyectil.setScale(this.proyectilScale);
            proyectil.setVelocityX(400);
            if (this.powerGroup[3].powerMultipleActive ) {
                proyectil.destroy();
                this.powerGroup[3].MultiplePower();
            }
            this.ultimoDisparo = tiempoActual;
        }
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
        enemigo.vida = 5;
    }

    // Colision Nave - Proyectil enemigo
    colisionNaveProyectil(nave, proyectilEnemigo){
        this.scoreVidas.decrement();
        proyectilEnemigo.destroy();
        if (this.scoreVidas.lifes <= 0) {
            this.naveInvisible();
        }
    }

    // Colision entre la nave y algun enemigo
    colisionNaveEnemigo(nave, enemigo) {
        enemigo.destroy();
        this.sonido.muerte_nave();
        this.sonido.muerte_enemigo();
        this.add.sprite(nave.x, nave.y, 'explosion').play('explode').setScale(2);
        this.add.sprite(enemigo.x, enemigo.y, 'explosion').play('explode').setScale(2);
        this.scoreVidas.decrement();
        this.nave.destruirNave();

        if (this.scoreVidas.lifes > 0) {
            this.nave.crearNave();
        }else {
            this.nave.crearNave();
            this.naveInvisible();
        }
        this.powerGroup[2].resetDamage();         // resetea el daño de disparo
        this.powerGroup[3].resetMultiplePower();  // resetea el disparo multiple
    }

    naveInvisible(){
        this.nave.deshabilitar();
    }

    // Cambiar Velocidad del escenario
    setVelocidadEscenario(velocidad){
        this.velocidadEscenario = velocidad;
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
