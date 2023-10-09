// class Nivel1 extends Phaser.Scene{
//     constructor(){
//         super("Nivel1");
// this.mostrarFPS;
// this.cachenave;
// this.animsproyectiles;
// this.proyectilesEnemigos;
// this.enemigos;
// this.cursors;
// this.spaceKey;
// this.puntaje = 0;
// this.puntajeText;
// this.fondo; 
// this.velocidadEscenario = 1; 
// this.particle1;
// this.particle2;
// this.disparosRecibidos = 0;
// this.maxDisparosPermitidos = 3;
// this.laser1;
// this.laser2;
//     }

// /* let mostrarFPS;
// let nave;
// let proyectiles;
// let proyectilesEnemigos;
// let enemigos;
// let cursors;
// let spaceKey;
// let puntaje = 0;
// let puntajeText;
// let fondo; 
// let velocidadEscenario = 1; 
// let particle1;
// let particle2;
// let disparosRecibidos = 0;
// const maxDisparosPermitidos = 3;
// let laser1;
// let laser2; */



// preload() {
//   console.log("Cargando imágenes");
//   this.load.spritesheet("nave", "/public/img/nave.png", {
//     frameWidth: 70,
//     frameHeight: 62,
//   });

//   //Cargamos la fuente
//   loadFont("dogicapixelbold", "/public/fonts/dogicapixel.ttf");
//   //Cargamos las imagenes
//   this.load.image("proyectil", "/public/img/shoot.png");
//   this.load.image("proyectilEnemigo", "/public/img/shootEnemy.png");
//   this.load.image("enemigo", "/public/img/enemy.png"); 
//   this.load.image("fondo", "/public/img/fondito.jpg"); 
//   this.load.image("particles", "/public/img/orange.png");
//   this.load.audio('laser1', ['/public/sound/laser2.mp3']);
//   this.load.audio('laser2', ['/public/sound/laser1.mp3']);
// }

// create() {
//   // Crea el fondo del escenario y lo hace un tileSprite para que se repita
//   this.fondo = this.add.tileSprite(0, 0, 800, 600, "fondo");
//   this.fondo.setOrigin(0, 0);
//   this.laser1 = this.sound.add('laser1');
//   this.laser2 = this.sound.add('laser2');
//   this.laser1.setVolume(0.1);

//       //Particula del primer motor de la nave
//   this.particle1 = this.add.particles(-20, -10, "particles", {
// 	speed: 150,
// 	quantity: 20,
// 	angle: {
// 	  min: 170,
// 	  max: 190,
// 	},
// 	scale: { start: 0.6, end: 0 },
// 	blendMode: "ADD",
//       });

//       //Particula del segundo motor de la nave
//       this.particle2 = this.add.particles(-20, 10, "particles", {
// 	speed: 150,
// 	quantity: 20,
// 	angle: {
// 	  min: 170,
// 	  max: 190,
// 	},
// 	scale: { start: 0.6, end: 0 },
// 	blendMode: "ADD",
//       });

//   // Crea el personaje
//   this.nave = this.physics.add.sprite(100, 300, "nave");
//   this.nave.setCollideWorldBounds(true);
//   this.particle2.startFollow(nave);
//   this.particle1.startFollow(nave);
 
//   // Crea las animaciones del personaje
//   this.anims.create({
//     key: "up",
//     frames: this.anims.generateFrameNumbers("nave", {
//       start: 2,
//       end: 2,
//     }),
//     framesRate: 10,
//   });
//   this.anims.create({
//     key: "idle",
//     frames: this.anims.generateFrameNumbers("nave", {
//       start: 0,
//       end: 0,
//     }),
//     framesRate: 10,
//   });
//   this.anims.create({
//     key: "down",
//     frames: this.anims.generateFrameNumbers("nave", {
//       start: 1,
//       end: 1,
//     }),
//     framesRate: 10,
//   });

//   // Crea un grupo para los proyectiles de la nave
//   proyectiles = this.physics.add.group();

//   // Crea un grupo para los proyectiles de la nave
//   proyectilesEnemigos = this.physics.add.group();

//   // Crea un grupo para los enemigos
//   enemigos = this.physics.add.group();

//   //    figura las teclas de movimiento
//   cursors = this.input.keyboard.createCursorKeys();
//   this.upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
//   this.downKey = this.input.keyboard.addKey(
//     Phaser.Input.Keyboard.KeyCodes.DOWN
//   );

//   // Configura la tecla de espacio para disparar
//   spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

//   // Configura el texto del puntaje
//   puntajeText = this.add.text(20, 20, "Puntaje: 0", {
//     fontSize: "32px",
//     fill: "#fff",
//     fontFamily: "dogicapixelbold"
//   });
//   console.log(puntajeText);

//   // Configuramos el texto de los FPS
//   mostrarFPS = this.add.text(640, 30, 'FPS: 0', {
//     fontSize: '24px',
//     fill: '#fff',
//     fontFamily: 'dogicapixelbold'
//   });

// // Configura un temporizador para crear enemigos
// this.time.addEvent({
//   delay: 2000, 
//   callback: generarEnemigo,
//   callbackScope: this,
//   loop: true, 
// });

// // Configura un temporizador para que los enemigos disparen
// this.time.addEvent({
//   delay: 1500, 
//   callback: () => {
//       enemigos.getChildren().forEach(enemigo => {
//           dispararProyectilEnemigo(enemigo);
//       });
//   },
//   callbackScope: this,
//   loop: true, 
// });
//   // Agrega una colisión entre proyectiles y enemigos
//   this.physics.add.collider(proyectiles, enemigos, (proyectil, enemigo) => {
//     proyectil.destroy(); 
//     enemigo.destroy();
//     puntaje += 10; 
//     puntajeText.setText("Puntaje: " + puntaje); 
//   });

// }

// update() {

//   fondo.tilePositionX += velocidadEscenario;

//   mostrarFPS.setText(`FPS: ${Math.floor(this.game.loop.actualFps)}`);

//   if (cursors.right.isDown) {
//     nave.setVelocityX(200);
//     velocidadEscenario = 3;
//   } else if (cursors.left.isDown) {
//     nave.setVelocityX(-200);
//     velocidadEscenario = 0.5;
//   } else {
//     nave.setVelocityX(0);
//     nave.anims.play("idle");
//     velocidadEscenario = 1;
//   }

  
//   if (this.upKey.isDown) {
//     nave.setVelocityY(-200);
//     nave.anims.play("up", true);
//   } else if (this.downKey.isDown) {
//     nave.setVelocityY(200);
//     nave.anims.play("down", true);
//   } else {
//     nave.setVelocityY(0);
//     nave.anims.play("idle");
//   }
//   if (Phaser.Input.Keyboard.JustDown(spaceKey)) {
//     dispararProyectil();
//     laser1.play();
//   }

//     //         ESTA PARTE DEL CODIGO PUEDE MEJORAR PERO POR EL MOMENTO SIRVE, es para que no vaya lagueado :D

//     // Verifica si los proyectiles han salido de los límites del mapa y destrúyelos
//     proyectiles.getChildren().forEach(proyectil => {
//       if (proyectil.x > 800 || proyectil.x < 0 || proyectil.y > 600 || proyectil.y < 0) {
//         proyectil.destroy();
//       }
//     });
  
//     // Verifica si los proyectiles enemigos han salido de los límites del mapa y destrúyelos
//     proyectilesEnemigos.getChildren().forEach(proyectilEnemigo => {
//       if (proyectilEnemigo.x > 800 || proyectilEnemigo.x < 0 || proyectilEnemigo.y > 600 || proyectilEnemigo.y < 0) {
//         proyectilEnemigo.destroy();
//       }
//     });
  
//     // Verifica si los enemigos han salido de los límites del mapa y destrúyelos
//     enemigos.getChildren().forEach(enemigo => {
//       if (enemigo.x > 800 || enemigo.x < 0 || enemigo.y > 600 || enemigo.y < 0) {
//         enemigo.destroy();
//       }
//     });
// }

// dispararProyectil() {
//   const proyectil = proyectiles.create(nave.x, nave.y, "proyectil");
//   proyectil.setVelocityX(400); 
// }

// dispararProyectilEnemigo(enemigo) {
//   const proyectilEnemigo = proyectilesEnemigos.create(enemigo.x, enemigo.y, "proyectilEnemigo");
//   proyectilEnemigo.setVelocityX(-400);
//   enemigo.setVelocityY(Phaser.Math.Between(-100, 100));
// }

// generarEnemigo() {
//   const x = 800; 
//   const y = Phaser.Math.Between(100, 500); 
//   const enemigo = enemigos.create(x, y, "enemigo"); 
//   enemigo.setVelocityX(Phaser.Math.Between(-200, -100));
// }

// // Funcion para cargar la fuente
// loadFont(name, url) {
//   let newFont = new FontFace(name, `url(${url})`);
//   newFont.load().then(function (loaded) {
//       document.fonts.add(loaded);
//   }).catch(function (error) {
//       return error;
//   });
// }
// }
// export default Nivel1;





//////// Codigo 1 el de arriba es el 2

/* let mostrarFPS;
let nave;
let proyectiles;
let proyectilesEnemigos;
let enemigos;
let cursors;
let spaceKey;
let puntaje = 0;
let puntajeText;
let fondo; 
let velocidadEscenario = 1; 
let particle1;
let particle2;
let disparosRecibidos = 0;
const maxDisparosPermitidos = 3;
let laser1;
let laser2;



function preload() {
  console.log("Cargando imágenes");
  this.load.spritesheet("nave", "/public/img/nave.png", {
    frameWidth: 70,
    frameHeight: 62,
  });

  //Cargamos la fuente
  loadFont("dogicapixelbold", "/public/fonts/dogicapixel.ttf");
  //Cargamos las imagenes
  this.load.image("proyectil", "/public/img/shoot.png");
  this.load.image("proyectilEnemigo", "/public/img/shootEnemy.png");
  this.load.image("enemigo", "/public/img/enemy.png"); 
  this.load.image("fondo", "/public/img/fondito.jpg"); 
  this.load.image("particles", "/public/img/orange.png");
  this.load.audio('laser1', ['/public/sound/laser2.mp3']);
  this.load.audio('laser2', ['/public/sound/laser1.mp3']);
}

function create() {
  // Crea el fondo del escenario y lo hace un tileSprite para que se repita
  fondo = this.add.tileSprite(0, 0, 800, 600, "fondo");
  fondo.setOrigin(0, 0);
  laser1 = this.sound.add('laser1');
  laser2 = this.sound.add('laser2');
  laser1.setVolume(0.1);

      //Particula del primer motor de la nave
  particle1 = this.add.particles(-20, -10, "particles", {
	speed: 150,
	quantity: 20,
	angle: {
	  min: 170,
	  max: 190,
	},
	scale: { start: 0.6, end: 0 },
	blendMode: "ADD",
      });

      //Particula del segundo motor de la nave
      particle2 = this.add.particles(-20, 10, "particles", {
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
  nave = this.physics.add.sprite(100, 300, "nave");
  nave.setCollideWorldBounds(true);
  particle2.startFollow(nave);
  particle1.startFollow(nave);
 
  // Crea las animaciones del personaje
  this.anims.create({
    key: "up",
    frames: this.anims.generateFrameNumbers("nave", {
      start: 2,
      end: 2,
    }),
    framesRate: 10,
  });
  this.anims.create({
    key: "idle",
    frames: this.anims.generateFrameNumbers("nave", {
      start: 0,
      end: 0,
    }),
    framesRate: 10,
  });
  this.anims.create({
    key: "down",
    frames: this.anims.generateFrameNumbers("nave", {
      start: 1,
      end: 1,
    }),
    framesRate: 10,
  });

  // Crea un grupo para los proyectiles de la nave
  proyectiles = this.physics.add.group();

  // Crea un grupo para los proyectiles de la nave
  proyectilesEnemigos = this.physics.add.group();

  // Crea un grupo para los enemigos
  enemigos = this.physics.add.group();

  // Configura las teclas de movimiento
  cursors = this.input.keyboard.createCursorKeys();
  this.upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
  this.downKey = this.input.keyboard.addKey(
    Phaser.Input.Keyboard.KeyCodes.DOWN
  );

  // Configura la tecla de espacio para disparar
  spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

  // Configura el texto del puntaje
  puntajeText = this.add.text(20, 20, "Puntaje: 0", {
    fontSize: "32px",
    fill: "#fff",
    fontFamily: "dogicapixelbold"
  });
  console.log(puntajeText);

  // Configuramos el texto de los FPS
  mostrarFPS = this.add.text(640, 30, 'FPS: 0', {
    fontSize: '24px',
    fill: '#fff',
    fontFamily: 'dogicapixelbold'
  });

// Configura un temporizador para crear enemigos
this.time.addEvent({
  delay: 2000, 
  callback: generarEnemigo,
  callbackScope: this,
  loop: true, 
});

// Configura un temporizador para que los enemigos disparen
this.time.addEvent({
  delay: 1500, 
  callback: () => {
      enemigos.getChildren().forEach(enemigo => {
          dispararProyectilEnemigo(enemigo);
      });
  },
  callbackScope: this,
  loop: true, 
});
  // Agrega una colisión entre proyectiles y enemigos
  this.physics.add.collider(proyectiles, enemigos, (proyectil, enemigo) => {
    proyectil.destroy(); 
    enemigo.destroy();
    puntaje += 10; 
    puntajeText.setText("Puntaje: " + puntaje); 
  });

}

function update() {

  fondo.tilePositionX += velocidadEscenario;

  mostrarFPS.setText(`FPS: ${Math.floor(this.game.loop.actualFps)}`);

  if (cursors.right.isDown) {
    nave.setVelocityX(200);
    velocidadEscenario = 3;
  } else if (cursors.left.isDown) {
    nave.setVelocityX(-200);
    velocidadEscenario = 0.5;
  } else {
    nave.setVelocityX(0);
    nave.anims.play("idle");
    velocidadEscenario = 1;
  }

  
  if (this.upKey.isDown) {
    nave.setVelocityY(-200);
    nave.anims.play("up", true);
  } else if (this.downKey.isDown) {
    nave.setVelocityY(200);
    nave.anims.play("down", true);
  } else {
    nave.setVelocityY(0);
    nave.anims.play("idle");
  }
  if (Phaser.Input.Keyboard.JustDown(spaceKey)) {
    dispararProyectil();
    laser1.play();
  }

    //         ESTA PARTE DEL CODIGO PUEDE MEJORAR PERO POR EL MOMENTO SIRVE, es para que no vaya lagueado :D

    // Verifica si los proyectiles han salido de los límites del mapa y destrúyelos
    proyectiles.getChildren().forEach(proyectil => {
      if (proyectil.x > 800 || proyectil.x < 0 || proyectil.y > 600 || proyectil.y < 0) {
        proyectil.destroy();
      }
    });
  
    // Verifica si los proyectiles enemigos han salido de los límites del mapa y destrúyelos
    proyectilesEnemigos.getChildren().forEach(proyectilEnemigo => {
      if (proyectilEnemigo.x > 800 || proyectilEnemigo.x < 0 || proyectilEnemigo.y > 600 || proyectilEnemigo.y < 0) {
        proyectilEnemigo.destroy();
      }
    });
  
    // Verifica si los enemigos han salido de los límites del mapa y destrúyelos
    enemigos.getChildren().forEach(enemigo => {
      if (enemigo.x > 800 || enemigo.x < 0 || enemigo.y > 600 || enemigo.y < 0) {
        enemigo.destroy();
      }
    });
}

function dispararProyectil() {
  const proyectil = proyectiles.create(nave.x, nave.y, "proyectil");
  proyectil.setVelocityX(400); 
}

function dispararProyectilEnemigo(enemigo) {
  const proyectilEnemigo = proyectilesEnemigos.create(enemigo.x, enemigo.y, "proyectilEnemigo");
  proyectilEnemigo.setVelocityX(-400);
  enemigo.setVelocityY(Phaser.Math.Between(-100, 100));
}

function generarEnemigo() {
  const x = 800; 
  const y = Phaser.Math.Between(100, 500); 
  const enemigo = enemigos.create(x, y, "enemigo"); 
  enemigo.setVelocityX(Phaser.Math.Between(-200, -100));
}

// Funcion para cargar la fuente
function loadFont(name, url) {
  let newFont = new FontFace(name, `url(${url})`);
  newFont.load().then(function (loaded) {
      document.fonts.add(loaded);
  }).catch(function (error) {
      return error;
  });
} */