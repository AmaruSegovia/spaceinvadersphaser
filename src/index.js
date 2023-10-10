import Nivel1 from "./Nivel1.js";
import Menu from "./Menu.js";

let config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: "container",
  scene: [Menu,Nivel1],
  physics: {
    default: "arcade",
    arcade: {
      gravity: {y: 0,},
      debug: false
    },
  },
};

let game = new Phaser.Game(config);