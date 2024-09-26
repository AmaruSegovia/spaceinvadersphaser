import Nivel1 from "./scenes/Nivel1.js";
import Menu from "./scenes/Menu.js";
import Tutorial from "./scenes/Tutorial.js";
import GameOver from "./scenes/GameOver.js";


let config = {
  type: Phaser.AUTO,
  scale: {
    width: 900,
    height: 600,
  },
  parent: "container",
  scene: [Menu,Tutorial,Nivel1, GameOver],
  physics: {
    default: "arcade",
    arcade: {
      gravity: {y: 0,},
      debug: true
    },
  },
};

let game = new Phaser.Game(config);