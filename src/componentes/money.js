export class Money {
    constructor(scene) {
      this.relatedScene = scene;
      this.moneys = this.relatedScene.physics.add.group();
    }

    create(x, y, sprite, relatedPower) {
      this.relatedScene.physics.add.collider(this.relatedScene.nave.getObject(), this.moneys, this.ballImpact, null, this);
      let money = this.moneys.create(x, y, sprite)
      money.relatedPower = relatedPower;
      money.setVelocity(Phaser.Math.Between(-200, -100), Phaser.Math.Between(-50, 50));
    }

    verificarMuerte(){
      //Verifica que los enemigos salgan y se destruyan
      this.moneys.getChildren().forEach(money => {
        if (money.x > 800 || money.x < 0 || money.y > 600 || money.y < 0) {
          money.destroy();
          console.log('destruido');
        }
      });
    }
  
    ballImpact(nave, money) {
      money.destroy();
      money.relatedPower.obtenerPower();
    }
}