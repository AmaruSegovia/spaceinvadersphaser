const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: "container",
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    physics: {
        default: "arcade",
        arcade: {
            gravity: {
                y: 0
            }
        }
    }
};

const game = new Phaser.Game(config);

let nave;
let proyectiles;
let enemigos;
let cursors;
let spaceKey;
let puntaje = 0;
let puntajeText;

function preload() {
    console.log("Cargando imágenes");
    this.load.image("nave", "/public/img/nave.png");
    this.load.image("proyectil", "/public/img/shoot.png");
    this.load.image("enemigo", "/public/img/enemy.png"); // Precarga la imagen del enemigo
}

function create() {
    // Crea el personaje
    nave = this.physics.add.image(100, 300, "nave");
    nave.setCollideWorldBounds(true);

    // Crea un grupo para los proyectiles de la nave
    proyectiles = this.physics.add.group();

    // Crea un grupo para los enemigos
    enemigos = this.physics.add.group();

    // Configura las teclas de movimiento
    cursors = this.input.keyboard.createCursorKeys();
    this.upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    this.downKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);

    // Configura la tecla de espacio para disparar
    spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // Configura el texto del puntaje
    puntajeText = this.add.text(16, 16, 'Puntaje: 0', { fontSize: '32px', fill: '#fff' });

    // Configura un temporizador para crear enemigos
    this.time.addEvent({
        delay: 2000, // Intervalo en milisegundos para la aparición de enemigos (ajusta según sea necesario)
        callback: generarEnemigo,
        callbackScope: this,
        loop: true // Esto hará que el temporizador se repita indefinidamente
    });

    // Agrega una colisión entre proyectiles y enemigos
    this.physics.add.collider(proyectiles, enemigos, (proyectil, enemigo) => {
        proyectil.destroy(); // Elimina la bala
        enemigo.destroy(); // Elimina el enemigo
        // Incrementa el puntaje
        puntaje += 10; // Puedes ajustar la cantidad de puntos ganados
        puntajeText.setText('Puntaje: ' + puntaje); // Actualiza el texto del puntaje
    });
}

function update() {
    // Mueve la nave horizontalmente
    if (cursors.right.isDown) {
        nave.setVelocityX(200);
    } else if (cursors.left.isDown) {
        nave.setVelocityX(-200);
    } else {
        nave.setVelocityX(0);
    }

    // Mueve la nave verticalmente
    if (this.upKey.isDown) {
        nave.setVelocityY(-200);
    } else if (this.downKey.isDown) {
        nave.setVelocityY(200);
    } else {
        nave.setVelocityY(0);
    }

    // Disparar proyectil cuando se presiona la barra espaciadora
    if (Phaser.Input.Keyboard.JustDown(spaceKey)) {
        dispararProyectil();
    }
}

function dispararProyectil() {
    // Crea un proyectil en la posición actual de la nave
    const proyectil = proyectiles.create(nave.x, nave.y, "proyectil");
    proyectil.setVelocityX(400); // Cambia la velocidad horizontal del proyectil (ajusta según sea necesario)
}

function generarEnemigo() {
    // Crea un enemigo en el lado derecho de la pantalla y lo hace moverse hacia la izquierda
    const x = 800; // Posición horizontal en el lado derecho
    const y = Phaser.Math.Between(100, 500); // Posición vertical aleatoria
    const enemigo = enemigos.create(x, y, "enemigo"); // Crea un enemigo en la posición especificada

    // Configura la velocidad del enemigo para moverse hacia la izquierda
    enemigo.setVelocityX(-100); // Ajusta la velocidad según sea necesario
}
