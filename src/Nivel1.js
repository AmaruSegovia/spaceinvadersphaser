class Nivel1 extends Phaser.Scene {
    constructor() {
        super({ key: 'Nivel1' });

        // Inicializar variables aquí
        this.mostrarFPS;
        this.nave;
        this.proyectiles;
        this.proyectilesEnemigos;
        this.enemigos;
        this.cursors;
        this.spaceKey;
        this.puntaje = 0;
        this.puntajeText;
        this.fondo;
        this.velocidadEscenario = 1;
        this.particle1;
        this.particle2;
        this.disparosRecibidos = 0;
        this.maxDisparosPermitidos = 3;
        this.laser1;
        this.laser2;
    }

    preload() {
        console.log("Cargando imágenes");
        this.load.spritesheet("nave", "public/img/nave.png", {
            frameWidth: 70,
            frameHeight: 62,
        });

        // Cargamos las imágenes
        this.load.image("proyectil", "public/img/shoot.png");
        this.load.image("proyectilEnemigo", "public/img/shootEnemy.png");
        this.load.image("enemigo", "public/img/enemy.png");
        this.load.image("fondo", "public/img/fondito.jpg");
        this.load.image("particles", "public/img/orange.png");
        this.load.audio('laser1', ['public/sound/laser2.mp3']);
        this.load.audio('laser2', ['public/sound/laser1.mp3']);
    }

    create() {
        // Crea el fondo del escenario y lo hace un tileSprite para que se repita
        this.fondo = this.add.tileSprite(0, 0, 800, 600, "fondo");
        this.fondo.setOrigin(0, 0);
        this.laser1 = this.sound.add('laser1');
        this.laser2 = this.sound.add('laser2');
        this.laser1.setVolume(0.1);

        // Partícula del primer motor de la nave
        this.particle1 = this.add.particles(-20, -10, "particles", {
            speed: 150,
            quantity: 20,
            angle: {
                min: 170,
                max: 190,
            },
            scale: { start: 0.6, end: 0 },
            blendMode: "ADD",
        });

        // Partícula del segundo motor de la nave
        this.particle2 = this.add.particles(-20, 10, "particles", {
            speed: 150,
            quantity: 20,
            angle: {
                min: 170,
                max: 190,
            },
            scale: { start: 0.6, end: 0 },
            blendMode: "ADD",
        });

        // Crea el personaje
        this.nave = this.physics.add.sprite(100, 300, "nave");
        this.nave.setCollideWorldBounds(true);
        this.particle2.startFollow(this.nave);
        this.particle1.startFollow(this.nave);

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

        // Crea un grupo para los proyectiles de la nave
        this.proyectiles = this.physics.add.group();

        // Crea un grupo para los proyectiles de los enemigos
        this.proyectilesEnemigos = this.physics.add.group();

        // Crea un grupo para los enemigos
        this.enemigos = this.physics.add.group();

        // Configura las teclas de movimiento
        this.cursors = this.input.keyboard.createCursorKeys();
        this.upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.downKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);

        // Configura la tecla de espacio para disparar
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Configura el texto del puntaje
        this.puntajeText = this.add.text(20, 20, "Puntaje: 0", {
            fontSize: "32px",
            fill: "#fff",
            fontFamily: "dogicapixelbold"
        });

        // Configura el texto de los FPS
        this.mostrarFPS = this.add.text(640, 30, 'FPS: 0', {
            fontSize: '24px',
            fill: '#fff',
            fontFamily: 'dogicapixelbold'
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
                });
            },
            callbackScope: this,
            loop: true,
        });

        // Agrega una colisión entre proyectiles y enemigos
        this.physics.add.collider(this.proyectiles, this.enemigos, (proyectil, enemigo) => {
            proyectil.destroy();
            enemigo.destroy();
            this.puntaje += 10;
            this.puntajeText.setText("Puntaje: " + this.puntaje);
        });
    }

    update() {
        this.fondo.tilePositionX += this.velocidadEscenario;

        this.mostrarFPS.setText(`FPS: ${Math.floor(this.game.loop.actualFps)}`);

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

        if (this.upKey.isDown) {
            this.nave.setVelocityY(-200);
            this.nave.anims.play("up", true);
        } else if (this.downKey.isDown) {
            this.nave.setVelocityY(200);
            this.nave.anims.play("down", true);
        } else {
            this.nave.setVelocityY(0);
            this.nave.anims.play("idle");
        }

        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            this.dispararProyectil();
            this.laser1.play();
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
}

export default Nivel1;
