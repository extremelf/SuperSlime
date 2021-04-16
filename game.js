 var config = {
    type:Phaser.AUTO,
    width: 1920,
    height: 1080,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300},
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
 };

var game = new Phaser.Game(config);
var player;
function preload(){
    this.load.image('ground', 'assets/PNG/game_background_4/layers/ground.png');
    this.load.image('sky','assets/PNG/game_background_4/layers/sky.png');
    this.load.image('rocks', 'assets/PNG/game_background_4/layers/rocks.png');
    this.load.image('clouds_1', 'assets/PNG/game_background_4/layers/clouds_1.png');
    this.load.image('clouds_2', 'assets/PNG/game_background_4/layers/clouds_2.png');
    this.load.image('slime','assets/Untitled.png');
}

function create(){
    this.add.image(960,540,'sky');
    this.add.image(960,540,'clouds_1');
    this.add.image(960,540,'rocks');
    this.add.image(960,540,'clouds_2');
    this.add.image(960,540,'ground');

    player = this.physics.add.image(100,450,'slime');

    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
}

function update(){

}