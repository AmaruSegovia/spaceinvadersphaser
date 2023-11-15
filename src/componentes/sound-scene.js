// Clase para las musicas segun su escena

export default class SoundScene{
    constructor(scene){
        this.relatedScene = scene;
    }
    preload(escena, ruta){
        // Cargamos los audios
        // this.relatedScene.load.audio('nivel1', 'public/sound/musicScene/Tutorial.mp3');
        this.relatedScene.load.audio(escena, ruta);

        // Cargamos los efectos
        this.relatedScene.load.audio('laser1', 'public/sound/efects/laser1.mp3');
        this.relatedScene.load.audio('laser2', 'public/sound/efects/laser2.mp3');
        this.relatedScene.load.audio('laser3', 'public/sound/efects/laser3.mp3');
        this.relatedScene.load.audio('laser4', 'public/sound/efects/laser6.mp3');
        this.relatedScene.load.audio('laser5', 'public/sound/efects/laser7.mp3');
        this.relatedScene.load.audio('mydeath', 'public/sound/efects/death.mp3');
        this.relatedScene.load.audio('enemyDeath', 'public/sound/efects/deathEnemy.mp3');
        this.relatedScene.load.audio('shootEnemy', 'public/sound/efects/shootEnemy.mp3');
        this.relatedScene.load.audio('money', 'public/sound/efects/coin.ogg');
    }
    create (escena) {
        this.soundScene = this.relatedScene.sound.add(escena);
        this.soundScene.setVolume(1);
        this.soundScene.play();

        this.laser1 = this.relatedScene.sound.add('laser1');
        this.laser2 = this.relatedScene.sound.add('laser2');
        this.laserSuper = this.relatedScene.sound.add('laser3');
        this.laserMultiple = this.relatedScene.sound.add('laser4');
        this.laserCombo = this.relatedScene.sound.add('laser5');
        this.mydeath = this.relatedScene.sound.add('mydeath');
        this.enemyDeath = this.relatedScene.sound.add('enemyDeath');
        this.shootEnemy = this.relatedScene.sound.add('shootEnemy');
        this.money = this.relatedScene.sound.add('money');
        this.laser1.setVolume(0.1);
        this.mydeath.setVolume(0.1);
        this.enemyDeath.setVolume(0.1);
        this.shootEnemy.setVolume(0.1);
    }
    detener_escena(){
        this.soundScene.stop();
    }

    muerte_nave(){
        this.mydeath.play();
    }

    muerte_enemigo(){
        this.enemyDeath.play();
    }

    disparo(){
        this.laser1.play();
    }
    disparoSuper(){
        this.laserSuper.play();
    }
    disparoMultiple(){
        this.laserMultiple.play();
    }
    disparoCombo(){
        this.laserCombo.play();
    }

    enemigo_disparo(){
        this.shootEnemy.play();
    }

    money_collected(){
        this.money.play();
    }

    
}