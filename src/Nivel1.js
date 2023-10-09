class Nivel1 extends Phaser.Scene{
    constructor() {
        super(Nivel1);
    }
    preload() {
        this.load.image('imagen1','/public/img/shoot.png')
    }
    create(){
        this.img.create(0,0,"imagen1")
    }
}
export default Nivel1;