import ScoreBoard from "../componentes/scoreboard.js";
import FPS from "../componentes/fpsboard.js";
import SoundScene from "../componentes/sound-scene.js";
import Player from "../componentes/player.js";
import Text from "../componentes/textboard.js";
import Asteroide from "../componentes/asteroid.js";
import { Money } from "../componentes/money.js";
import LivePower from "../componentes/powers/live-power.js"
import DestroyPower from "../componentes/powers/destroy-power.js";
import MultiplePower from "../componentes/powers/multiple-power.js";

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
        this.maxDisparosPermitidos = 5; // Representa la cantidad maxima de disparos que puede hacer el jugador
        this.contDisparos = 0;          // Representa al contador de disparos del jugador
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
        
        this.moneys = new Money(this);                              // Representa a las Monedas que usamos para los PowerUps

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
        this.textoDown.create(`Consigue ${this.maxpoints} puntos`, 240, 555 );
        // Colocando texto en la parte superior
        this.textoUp.create(`TUTORIAL`, 340, 20);

        // Crea un grupo para los proyectiles de la nave
        this.proyectiles = this.physics.add.group();

        //crea un grupo para asteroides
        this.asteroides = this.physics.add.group();

        // Configura las teclas de movimiento
        this.cursors = this.input.keyboard.createCursorKeys();

        // Configura la tecla de espacio para disparar
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        
        // Creando Marcador de puntos
        this.scoreBoard.create(0);

        // Creando marcador de FPS
        this.fps.create();

        // Gestionar superposición entre proyectiles y asteroide
        this.physics.add.overlap(this.proyectiles, this.asteroides, this.colisionProyectilEnemigo,null, this);

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
            callback: this.generarEnemigo,
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
    // Colision entre un proyectil del jugador y un asteroide
    colisionProyectilEnemigo(proyectil,asteroide){
        this.contDisparos--;
        proyectil.destroy();
        asteroide.vida -=this.dañoPlayer;
        if (asteroide.vida <= 0) {
            this.scoreBoard.incrementPoints(10);
            this.add.sprite(asteroide.x, asteroide.y, 'explosion').play('explode').setScale(2);
            this.sonido.muerte_enemigo();
            asteroide.destroy();
        }
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
    // Generando Asteroides
    generarEnemigo() {
        const x = 800;
        const y = Phaser.Math.Between(100, 500);
        const asteroide = this.asteroides.create(x, y, "asteroide");
        asteroide.setVelocityX(Phaser.Math.Between(-200, -100));
        asteroide.vida =10;
    }
    // Nave dispara proyectil
    dispararProyectil() {
        const proyectil = this.proyectiles.create(this.nave.getPosicionX(), this.nave.getPosicionY(), "proyectil");
        proyectil.setScale(this.proyectilScale);
        proyectil.setVelocityX(400);
        
        if (this.powerGroup[3].powerMultipleActive && this.contDisparos<this.maxDisparosPermitidos) {
            proyectil.destroy();
            this.contDisparos+=2;
            this.powerGroup[3].MultiplePower();
            console.log('entro: '+this.contDisparos);
        }
    }

    // Actualizacion continua
    update(){
        this.fondo.tilePositionX += this.velocidadEscenario;

        // Colisionar nave con grupoEnemigos
        this.physics.add.collider(this.nave.getObject(), this.asteroides, this.colisionNaveEnemigo, null, this);

        // Actualizando los FPS
        this.fps.obteniendo(Math.floor(this.game.loop.actualFps));

        // Verifica si los proyectiles han salido de los límites del mapa y destrúyelos
        this.proyectiles.getChildren().forEach(proyectil => {
            if (proyectil.x > 800 || proyectil.x < 0 || proyectil.y > 600 || proyectil.y < 0) {
                proyectil.destroy();
                this.contDisparos--;
            }
        });

        //Verifica que los enemigos salgan y se destruyan
        this.asteroides.getChildren().forEach(asteroide => {
            asteroide.rotation -= 0.01;
            if (asteroide.x > 800 || asteroide.x < 0 || asteroide.y > 600 || asteroide.y < 0) {
                asteroide.destroy();
            }
        });

        this.moneys.verificarMuerte();

        // Control en el disparo del jugador segun la tecla de espacio
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey) && this.contDisparos < this.maxDisparosPermitidos) {
             this.dispararProyectil();
             this.sonido.disparo();
             this.contDisparos++;
        }

        // Verifica la puntuacion actual, para cambiar de escena
        if (this.scoreBoard.getPoints() >= this.maxpoints) {
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