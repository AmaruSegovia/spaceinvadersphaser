import Power from "./powers.js";

export default class MultiplePower extends Power {
  constructor(scene, money) {
    super(scene, money, "ball-purple");
    this.powerMultipleActive = false;
  }

  mover() {
    this.sprite.setVelocityX(Phaser.Math.Between(-250, -100));
  }

  obtenerPower() {
    this.MultiplePower();
  }
  
  MultiplePower(){
    console.log("Se obtuvo el power up");
    if(this.powerMultipleActive){
      const angulo = 80;
      for (let i = -3; i < 4; i+=3) {
        let proyectil = this.relatedScene.proyectiles.create(this.relatedScene.nave.getPosicionX(), this.relatedScene.nave.getPosicionY(), "proyectil");
        proyectil.setVelocityY(i* angulo);
        proyectil.setVelocityX(800);
        proyectil.setScale(this.relatedScene.proyectilScale);
      }
      setTimeout(() => this.resetMultiplePower(), 10000);
    }
    this.powerMultipleActive = true;
  }

  // Resetea El power del jugador
  resetMultiplePower(){
    this.powerMultipleActive = false;
  }
}
