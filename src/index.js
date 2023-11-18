import Nivel1 from "./scenes/Nivel1.js";
import Menu from "./scenes/Menu.js";
import Tutorial from "./scenes/Tutorial.js";
import GameOver from "./scenes/GameOver.js";


let config = {
  type: Phaser.AUTO,
  scale: {
    width: 800,
    height: 600,
  },
  parent: "container",
  scene: [Menu,Tutorial, GameOver,Nivel1],
  physics: {
    default: "arcade",
    arcade: {
      gravity: {y: 0,},
      debug: false
    },
  },
};

let game = new Phaser.Game(config);