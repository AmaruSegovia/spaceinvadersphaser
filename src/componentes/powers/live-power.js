import Power from './powers.js';

export default class LivePower extends Power{
  constructor(scene, money) {
    super( scene, money, 'ball-green');
  }

  mover(){
    this.sprite.setVelocityX(Phaser.Math.Between(-250, -100));
  }

  obtenerPower() {
    console.log('sumando vida');
    this.relatedScene.lifes++;
    console.log('vidas: '+this.relatedScene.lifes);
  }

}