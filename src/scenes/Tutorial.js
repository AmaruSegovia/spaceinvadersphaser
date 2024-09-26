import ScoreBoard from "../componentes/scoreboard.js";
import FPS from "../componentes/fpsboard.js";
import SoundScene from "../componentes/sound-scene.js";
import Player from "../componentes/player.js";
import Text from "../componentes/textboard.js";
import Asteroide from "../componentes/asteroid.js";
import { Moneys } from "../componentes/moneys.js";
import DestroyPower from "../componentes/powers/destroy-power.js";
import MultiplePower from "../componentes/powers/multiple-power.js";
import Proyectiles from "../componentes/proyectiles.js";

export default class Tutorial extends Phaser.Scene{
    constructor(){
        super({key: "Tutorial"});
        this.maxpoints= 150;            // Cantidad de puntos necesarios para pasar a otro nivel
        this.velocidadEscenario = 1;    // Representa la velocidad que avanza el escenario
        this.puntaje = 0;               // Representa el puntaje del jugador
        this.dañoPlayer = 1;            // Representa el daño de la bala del jugador
        this.proyectilScale = 1;        // Representa la escala del proyectil
        this.lifes = 0                  // Representa la vida del jugador
        this.powerGroup = [];           // Almacen para los poderes que se podran usar
        this.ultimoDisparo = 0;         // Representa al tiempo desde el ultimo disparo
        this.retardoDisparo = 200;      // Representa al tiempo minimo para hacer un disparo
    }

    //Carga cuando se reinicia o inicia la escena
    init(){
        // Se crean instancias a partir de ALGUNA clase
        this.scoreBoard = new ScoreBoard(this, this.puntaje);       // Representa el marcador de puntos
        this.fps = new FPS(this);                                   // Representa el marcador de FPS
        this.sonido = new SoundScene(this);                         // Representa los sonidos de las escenas
        this.nave = new Player(this);                               // Representa la jugador
        this.textoDown = new Text(this);                            // Representa al texto superior
        this.textoUp = new Text(this);                              // Representa al texto debajo
        this.asteroid = new Asteroide(this);                        // Representa el sprite del asteroide
        this.proyectiles = new Proyectiles(this);                   // Representa a los proyectiles del jugador
        
        this.moneys = new Moneys(this);                              // Representa a las Monedas que usamos para los PowerUps

        // this.powerGroup[1] = new LivePower(this, this.moneys);      // Representa el Poder de agregar vidas
        this.powerGroup[2] = new DestroyPower(this, this.moneys);   // Representa el Poder de aumentar el daño
        this.powerGroup[3] = new MultiplePower(this, this.moneys);  // Representa el Poder de disparo multiple
    }

    // Cargar recursos necesarios para el juego antes de que comience la ejecución
    preload() {
        // Asteroide
        this.asteroid.preload();

        // Jugador
        this.nave.preload();

        // Moneda
        this.load.image('ball-green', 'public/img/ball-green.png');
        this.load.image('ball-red', 'public/img/ball-red.png');
        this.load.image('ball-purple', 'public/img/ball-purple.png');

        // Fondo
        this.load.image('fondoQuieto', 'public/img/fondo02.png');
        this.load.image('fondoTutorial', 'public/img/Sprite-0001.png');

        // Proyectil Jugador
        this.load.image("proyectil", "public/img/shoot.png");

        // Cargamos la fuente
        this.loadFont('dogicapixelbold', '../public/fonts/dogicapixel.ttf');

        // Cargamos los sonidos
        this.sonido.preload('tutorial', 'public/sound/musicScene/Tutorial.mp3');
    }
    // Realizaría la configuración adicional y la lógica del juego.
    create() {
        // Agregando Sonido
        this.sonido.create('tutorial');

        // Agregando Fondo
        this.add.image(0,0, 'fondoQuieto').setOrigin(0,0);
        this.fondo = this.add.tileSprite(0, 0, 800, 600, "fondoTutorial").setOrigin(0, 0);

        // Creando nave
        this.nave.create();

        // Colocando texto en la parte baja
        this.textoDown.create(`Get ${this.maxpoints} Points`, 290, 555, '28px' );
        // Colocando texto en la parte superior
        this.textoUp.create(`TUTORIAL`, 360, 20, '28px');
        this.textoUp.create(`Press ENTER to continue`, 270, 50, '20px');

        // Configura las teclas de movimiento
        this.cursors = this.input.keyboard.createCursorKeys();

        // Configura la tecla de espacio para disparar
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Configura la tecla de enter para saltar el tutorial
        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        
        // Creando Marcador de puntos
        this.scoreBoard.create(0);

        // Creando marcador de FPS
        this.fps.create();

        // Gestionar superposición entre proyectiles y asteroide
        this.proyectiles.create();

        // Configura un temporizador para crear objetos powers randoms
        this.time.addEvent({ 
            delay: 5000, 
            callback: this.createRandomPower, 
            callbackScope: this, 
            loop: true 
        });

        // Configura un temporizador para crear asteroides
        this.time.addEvent({
            delay: 2000,
            callback:  () => {
                this.asteroid.create();
            },
            callbackScope: this,
            loop: true,
        });
    }

    // Metodo para crear poderes aleatorios
    createRandomPower(){
        // Array de colores posibles
        let typePower = [2, 3];
        // Elije un poder aleatorio
        let randomPower = Phaser.Utils.Array.GetRandom(typePower);
        // Creando objeto con poder
        this.powerGroup[randomPower].create(800, Phaser.Math.Between(20, 580));
    }
    
    // Colision entre la nave y algun asteroide
    colisionNaveEnemigo(nave, asteroide) {
        asteroide.destroy();
        this.sonido.muerte_enemigo();
        this.add.sprite(nave.x, nave.y, 'explosion').play('explode').setScale(2);
        this.add.sprite(asteroide.x, asteroide.y, 'explosion').play('explode').setScale(2);
        this.nave.destruirNave();
        this.nave.crearNave();
        this.powerGroup[2].resetDamage();         // resetea el daño de disparo
        this.powerGroup[3].resetMultiplePower();  // resetea el disparo multiple
    }

    // Actualizacion continua
    update(){
        this.fondo.tilePositionX += this.velocidadEscenario;

        // Colisionar nave con grupoEnemigos
        this.physics.add.collider(this.nave.getObject(), this.asteroid.getAsteroids(), this.colisionNaveEnemigo, null, this);

        // Actualizando los FPS
        this.fps.obteniendo(Math.floor(this.game.loop.actualFps));

        // Verificar limites de los proyectiles
        this.proyectiles.verificarLimitProyectiles();

        this.asteroid.verificarLimites();

        this.moneys.verificarMuerte();

        // Control en el disparo del jugador segun la tecla de espacio
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
             this.nave.dispararProyectil(this.proyectiles);
        }

        // Verifica la puntuacion actual, para cambiar de escena
        if (this.scoreBoard.getPoints() >= this.maxpoints || Phaser.Input.Keyboard.JustDown(this.enterKey)) {
            this.scene.pause();
            this.sonido.detener_escena();
            this.scene.start('Nivel1',{puntos:this.scoreBoard.getPoints()},);
        }

        // Movimiento del jugador
        this.nave.actualizarPosicion(this.cursors,this);
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