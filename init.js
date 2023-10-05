const config = {
    width: 320*2,
    height: 180*2,
    parent: "container",
    type: Phaser.AUTO,
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    physics: {
        default: "arcade",
        arcade: {
            gravity: {
                // y: 500
            }
        }
    }
}

var game = new Phaser.Game(config);

function preload() {
    this.load.image("bird", "./assets/bird.png");

}
function create() {
    this.pajaro = this.physics.add.image(100, 50, "bird");
    // this.input.keyboard.on("keydown_RIGHT", () => {
    //     this.pajaro.setAcceleration(100, 0);
    // });

    // this.input.keyboard.on("keyup_RIGHT", () => {
    //     this.pajaro.setAcceleration(0, 0);
    //     this.pajaro.setVelocity(0)
    // });

    // this.cursor = this.input.keyboard.createCursorKeys();
    // console.log(this.cursor);

    this.right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.left =  this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);

}
function update(time, delta) {
    if(this.right.isDown) {
        this.pajaro.x++;
    } else if(this.left.isDown) {
        this.pajaro.x--;
    }
}