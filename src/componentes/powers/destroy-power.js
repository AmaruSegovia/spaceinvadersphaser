import Power from './powers.js';

export default class DestroyPower extends Power{
  constructor(scene, money) {
    super( scene, money, 'ball-red');
  }
  
  mover(){
    this.sprite.setVelocityX(Phaser.Math.Between(-250, -100));
  }

  obtenerPower() {
    this.increaseDamage();
    
  }

    // Aumenta el daño del jugador
  increaseDamage(){
      this.relatedScene.dañoPlayer += 2;
      this.relatedScene.proyectilScale = 2;
      console.log('ahora tienes un daño de: '+this.relatedScene.dañoPlayer);
      setTimeout(() => this.restDamage(), 10000);
  }
  restDamage(){
      if(this.relatedScene.dañoPlayer >1){
          this.relatedScene.dañoPlayer -=4;
      }
      if (this.relatedScene.dañoPlayer <= 1) {
          this.resetDamage();
      }
      console.log('daño: '+this.relatedScene.dañoPlayer);
  }
  
    // Resetea El daño del jugador
    resetDamage(){
      this.relatedScene.proyectilScale = 1;
      this.relatedScene.dañoPlayer = 1;
    }
}