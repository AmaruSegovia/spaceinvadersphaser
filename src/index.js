import Nivel1 from "./Nivel1.js";

let config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: "container",
  scene: [Nivel1],
  physics: {
    default: "arcade",
    arcade: {
      gravity: {y: 0,},
      debug: false
    },
  },
};

let game = new Phaser.Game(config);