// Importa Phaser y crea una instancia de un juego
import Phaser from 'phaser';

const config = {
  type: Phaser.AUTO, // Puede ser Phaser.CANVAS, Phaser.WEBGL, o Phaser.AUTO
  width: 800,        // Ancho de la pantalla en píxeles
  height: 600,       // Altura de la pantalla en píxeles
  scene: {
    create: create,
  },
};

const game = new Phaser.Game(config);

// Función de creación (crea objetos en la pantalla)
function create() {
  // Tu pantalla estará vacía, ya que no hemos agregado ningún elemento.
}