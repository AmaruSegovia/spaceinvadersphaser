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
        this.relatedScene.load.audio('laser1', 'public/sound/efects/laser2.mp3');
        this.relatedScene.load.audio('laser2', 'public/sound/efects/laser1.mp3');
        this.relatedScene.load.audio('mydeath', 'public/sound/efects/death.mp3');
        this.relatedScene.load.audio('enemyDeath', 'public/sound/efects/deathEnemy.mp3');
        this.relatedScene.load.audio('shootEnemy', 'public/sound/efects/shootEnemy.mp3');

    }
    create (escena) {
        this.soundScene = this.relatedScene.sound.add(escena);
        this.soundScene.play();

        this.laser1 = this.relatedScene.sound.add('laser1');
        this.laser2 = this.relatedScene.sound.add('laser2');
        this.mydeath = this.relatedScene.sound.add('mydeath');
        this.enemyDeath = this.relatedScene.sound.add('enemyDeath');
        this.shootEnemy = this.relatedScene.sound.add('shootEnemy');
        this.laser1.setVolume(0.1);
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

    enemigo_disparo(){
        this.shootEnemy.play();
    }

    
}