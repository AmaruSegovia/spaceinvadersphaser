import Nivel1 from "./scenes/Nivel1.js";
import Menu from "./scenes/Menu.js";
import Tutorial from "./scenes/Tutorial.js";

let config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: "container",
  scene: [Tutorial,Nivel1],
  physics: {
    default: "arcade",
    arcade: {
      gravity: {y: 0,},
      debug: true
    },
  },
};

let game = new Phaser.Game(config);