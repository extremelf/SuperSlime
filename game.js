let game;
let gameOptions = {
    type:Phaser.AUTO,
    defaultSize: {
        width: 1920,
        height: 1080,
        maxRatio: 16 / 9
    },
    physics:{
        default: "arcade",
        arcade:{
            gravity: { y:300},
            debug: true
        }
    }
}

window.onload = function() {
    let width = gameOptions.defaultSize.width;
    let height = gameOptions.defaultSize.height;
    let perfectRatio = width / height;
    let innerWidth = window.innerWidth;
    let innerHeight = window.innerHeight;
    let actualRatio = Math.min(innerWidth / innerHeight, gameOptions.defaultSize.maxRatio);
    if(perfectRatio > actualRatio){
        height = width / actualRatio;
    }
    else{
        width = height * actualRatio;
    }
    let gameConfig = {
        type: Phaser.AUTO,
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            parent: "superslime",
            width: width,
            height: height
        },
        backgroundColor: 0x132c43,

        scene :[preloadGame, playGame]
    }
    game = new Phaser.Game(gameConfig);
    window.focus();
}

let player;

class preloadGame extends Phaser.Scene{
    constructor(){
        super("preloadGame");
    }
    preload(){
        this.load.image("background", "assets/PNG/game_background_4/game_background_4.png")
        this.load.image("slime","assets/Untitled.png");
        this.load.image("ball","assets/PNG/ball.png");


    }
    create(){
        this.scene.start("PlayGame");
    }
}

class playGame extends Phaser.Scene{
    constructor(){
        super("PlayGame");

    }
    create(){
        this.addBackground();
        this.addPlayer();
        this.addBall();
    }

    addBackground(){
        let background = this.add.sprite(0, 0, "background");

        background.setOrigin(0, 0);
        background.displayWidth = game.config.width + 100;
        background.displayHeight = game.config.height + 100;
    }

    addPlayer(){
        this.player = this.add.sprite(100, 450,"slime");
        this.player.setOrigin(0,0);
        //this.player.add.physics.arcade.gravity.y=300;
        //this.player.add.physics.arcade.debug=true;
        //this.player.setBounce(0,2);
        //this.player.setCollideWorldBounds(true);
    }

    addBall(){

        let ball = this.add.sprite(1,1,"ball");

        ball.setOrigin(0,0);
    }
}