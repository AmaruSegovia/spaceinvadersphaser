export default class Proyectiles {
    constructor(scene) {
        this.relatedScene = scene;
        this.proyectiles = this.relatedScene.physics.add.group();
      }
  
      create() {
        // Gestionar superposición entre proyectiles y asteroides
        this.relatedScene.physics.add.overlap(this.proyectiles, this.relatedScene.asteroides, this.colisionProyectilAsteroide,null, this);
      }

      // Colision entre un proyectil del jugador y un asteroide
      colisionProyectilAsteroide(proyectil,asteroide){
        proyectil.destroy();
        asteroide.vida -=this.relatedScene.dañoPlayer;
        if (asteroide.vida <= 0) {
            this.relatedScene.scoreBoard.incrementPoints(10);
            this.relatedScene.add.sprite(asteroide.x, asteroide.y, 'explosion').play('explode').setScale(2);
            this.relatedScene.sonido.muerte_enemigo();
            asteroide.destroy();
        }
      }

      verificarSonidoDisparo(){
        if(this.relatedScene.proyectilScale != 1 && this.relatedScene.powerGroup[3].powerMultipleActive){
            this.relatedScene.sonido.disparoCombo();
        }else if(this.relatedScene.proyectilScale != 1){
            this.relatedScene.sonido.disparoSuper();
        }else if(this.relatedScene.powerGroup[3].powerMultipleActive){
            this.relatedScene.sonido.disparoMultiple();
        } else{
            this.relatedScene.sonido.disparo();
        }
      }
      crearProyectilSegunPower(){
        const proyectil = this.proyectiles.create(this.relatedScene.nave.getPosicionX(), this.relatedScene.nave.getPosicionY(), "proyectil");
        proyectil.setScale(this.relatedScene.proyectilScale);
        proyectil.setVelocityX(400);

        if (this.relatedScene.powerGroup[3].powerMultipleActive ) {
            proyectil.destroy();
              const angulo = 80;
              for (let i = -3; i < 4; i+=3) {
                let proyectil = this.proyectiles.create(this.relatedScene.nave.getPosicionX(), this.relatedScene.nave.getPosicionY(), "proyectil");
                proyectil.setVelocityY(i* angulo);
                proyectil.setVelocityX(800);
                proyectil.setScale(this.relatedScene.proyectilScale);
              }
              setTimeout(() => this.relatedScene.powerGroup[3].resetMultiplePower(), 10000);
        }
      }

      // Verifica si los proyectiles han salido de los límites del mapa y destrúyelos
      verificarLimitProyectiles(){
        this.proyectiles.getChildren().forEach(proyectil => {
          if (proyectil.x > 800 || proyectil.x < 0 || proyectil.y > 600 || proyectil.y < 0) {
              proyectil.destroy();
          }
        });
      }
}