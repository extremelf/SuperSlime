
let game;
let player;
let ball;
let goal1;
let gameOptions = {
    type:Phaser.AUTO,
    defaultSize: {
        width: 1920,
        height: 1080,
        maxRatio: 16 / 9
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
        parent: "superSlime",
        width: gameOptions.defaultSize.width,
        height: gameOptions.defaultSize.height
    },
    physics:{
        default: "arcade",
        arcade:{
            gravity: { y:300},
            debug: true
        }
    },
    backgroundColor: 0x132c43,

    scene :[preloadGame, playGame]
}
game = new Phaser.Game(gameConfig);
window.focus();
}



class preloadGame extends Phaser.Scene{
    constructor(){
        super("preloadGame");
    }
    preload(){
        this.load.image("background", "assets/PNG/game_background_4/game_background_4.png");
        this.load.image("slime","assets/Untitled.png");
        this.load.image("ball","assets/PNG/ball.png");
        this.load.image("goal","assets/PNG/goal.png")
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
        //this.addBall();
        this.addGoal1();

    }

    addBackground(){
        let background = this.add.sprite(0, 0, "background");

        //this.arcade.background.setBounds(0, 0, gameOptions.width, gameOptions.height);
        background.setOrigin(0, 0);
        background.displayWidth = gameOptions.defaultSize.width + 100;
        background.displayHeight = gameOptions.defaultSize.height + 100;
    }

    addPlayer(){
        this.player = this.physics.add.sprite(100,450,"slime");
        this.player.setBounce(0.4);
        this.player.anims.play("right");
        this.player.setCollideWorldBounds(true);

    }


    /**
     * pá ya assim simplesmente aparece uma bola gigante
     *
        //ball.setOrigin(0,0);
        //ball.scale(0.2)
     *
     * isto devia funcionar e nao funfa
     */
    addBall(){
        ball = this.add.sprite(20, 20, "ball");

    }

    /**
     * fiz uma pesquisa entre this.add.sprite e this.add.image e sprite é para coisas animadas, daí as
     * balizas poderem ser estaticas e serem imagens
     */


    addGoal1(){
        this.goal1 = this.add.image(100, 850, "goal");
        this.goal1.displayHeight=500;
        this.goal1.displayWidth=200;

        /** COMANDOS QUE DEVIAM FUNCIONAR MAS ASSIM QUE DAS UNCOMMENT NADA FUNCIONA
         *  //this.goal1.invert();
         *
         */

    }
}