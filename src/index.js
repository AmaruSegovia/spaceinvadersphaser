
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent:"container",
    type: Phaser.AUTO,
    scene:{
        preload: preload,
        create: create
    } 
};

const game = new Phaser.Game(config);

function preload(){
    console.log("soiy este");
}

function create(){
    console.log("soiy este otro");
}
