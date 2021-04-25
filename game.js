let gameOptions = {
    defaultSize: {
        width: 1920,
        height: 1080,
        maxRatio: 16 / 9
    }
}
let game;
let player;
let player2;
let cursors;
let background;
let ground;
let baliza;
let baliza2;
let balizaCollider;
let balizaCollider2;
let ball;
let score1 = 0;
let score2 = 0;
let winnerScore = 0;
let loserScore = 0;
let score1Text;
let score2Text;

let selectedSlimePlayer1;
let selectedSlimePlayer2;

let wasd;

let keyA;
let keyS;
let keyD;
let keyW;
let gameover = false;


window.onload = function () {
    let width = gameOptions.defaultSize.width;
    let height = gameOptions.defaultSize.height;
    let perfectRatio = width / height;
    let innerWidth = window.innerWidth;
    let innerHeight = window.innerHeight;
    let actualRatio = Math.min(innerWidth / innerHeight, gameOptions.defaultSize.maxRatio);
    if (perfectRatio > actualRatio) {
        height = width / actualRatio;
    } else {
        width = height * actualRatio;
    }


    let gameConfig = {
        type: Phaser.CANVAS,
        scale: {
            mode: Phaser.Scale.FIT,
            //autoCenter: Phaser.Scale.CENTER_BOTH,
            parent: "superSlime",
            width: width,
            height: height
        },
        physics: {
            default: "arcade",
            arcade: {
                gravity: {y: 300},
                debug: true
            },
            matter: {
                gravity: {y: 0},
                setBounds: {
                    left: true,
                    right: true,
                    top: true,
                    bottom: true
                },
                debug: true
            }
        },
        scene: [
            preloadGame,
            menuGame,
            playGame,
            endGame,
            selectMenu
        ]
    }

    game = new Phaser.Game(gameConfig);
    console.log("1");
    window.focus();
};


class preloadGame extends Phaser.Scene {
    constructor() {
        super("PreloadGame");
    }

    preload() {

        this.load.image("background", "assets/PNG/game_background_4/game_background_4.png");
        this.load.image("ground", "assets/ground.png");
        this.load.image("baliza", "assets/baliza.png");
        this.load.image("balizaCollider", "assets/balizaCollider.png");
        this.load.image("ball", "assets/ball.png");
        /*this.load.spritesheet("slime", "assets/img.png",
            {frameWidth: 32, frameHeight: 48}
        );
         */
        this.load.image("slime", "assets/asdd.png");
        this.load.image("slime1", "assets/asddBlue.png");
        this.load.image("slime2", "assets/asddRed.png");
        this.load.image("slime3", "assets/asddGreen.png");

        this.load.image("title", "assets/title.png"); //
        this.load.image("tile", "assets/tile.png"); //
        this.load.image("logo", "assets/logo.png");
        this.load.image("play", "assets/UI/PNG/menu/play.png")
        this.load.spritesheet("icons", "assets/icons.png", {
            frameWidth: 150,
            frameHeight: 150
        });

        //endGame assets

        this.load.image("backBoard", "assets/UI/PNG/you_win/bg.png");
        this.load.image("win", "assets/UI/PNG/you_win/header.png");
        this.load.image("lose", "assets/UI/PNG/you_lose/header.png");
        this.load.image("table", "assets/UI/PNG/you_win/table.png");

        //select Menu


    }

    create() {
        /*
        this.anims.create({
            key: "left",
            frames: this.anims.generateFrameNumbers("slime", {start: 0, end: 3}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: "turn",
            frames: [{key: "slime", frame: 4}],
            frameRate: 20
        });

        this.anims.create({
            key: "right",
            frames: this.anims.generateFrameNumbers("slime", {start: 5, end: 8}),
            frameRate: 10,
            repeat: -1
        });

         */

        this.scene.start("SelectMenu");
    }
}

class menuGame extends Phaser.Scene {

    constructor() {
        super("MenuGame");
    }

    create() {
        score1 = 0;
        score2 = 0;
        this.addGameTitle();
    }


    addGameTitle() {
        this.guiGroup = this.add.group();

        let Overlay = this.add.sprite(0, 0, "background");

        Overlay.setOrigin(0, 0);
        Overlay.displayWidth = game.config.width;
        Overlay.displayHeight = game.config.height;
        Overlay.alpha = 0.8;

        this.guiGroup.add(Overlay);

        let title = this.add.sprite(game.config.width / 2, 50, "title");
        title.setOrigin(0.5, 0);

        this.guiGroup.add(title);

        let playButtonX = game.config.width / 2;
        let playButtonY = game.config.height / 2 - 20;
        let playButton = this.add.sprite(playButtonX, playButtonY, "play").setScale(window.devicePixelRatio / 3);

        playButton.setInteractive();

        playButton.on("pointerup", function () {
            this.guiGroup.toggleVisible();
            this.guiGroup.active = false;
            this.scene.start("PlayGame");
        }, this);

        this.guiGroup.add(playButton);
    }
}

class playGame extends Phaser.Scene {
    constructor() {
        super("PlayGame");
    }

    create() {
        this.addBackground();
        this.addPlayers();
        this.addGameObjects();
        this.addScore();
        this.addColliders();
        this.addKeyboard();
    }

    addBackground() {
        background = this.add.sprite(0, 0, "background");
        background.setOrigin(0, 0);
        background.displayWidth = game.config.width + 100;
        background.displayHeight = game.config.height + 100;

        ground = this.physics.add.staticGroup();
        ground.create(0, game.config.height, "ground").setScale(2).refreshBody();
        ground.setOrigin(0, 10);

        balizaCollider = this.physics.add.staticGroup();
        balizaCollider.create(157, game.config.height - 120, "balizaCollider").setScale(0.3).refreshBody();


        balizaCollider2 = this.physics.add.staticGroup();
        balizaCollider2.create(game.config.width - 157, game.config.height - 120, "balizaCollider").setScale(0.3).refreshBody();


    }

    addPlayers() {
        player = this.physics.add.sprite(100, 450, selectedSlimePlayer1).setScale(0.20);
        player.setBounce(0.2);
        player.tint = 0xff0000;
        player.setCollideWorldBounds(true);

        player2 = this.physics.add.sprite(game.config.width - 100, 450, selectedSlimePlayer2).setScale(0.20);
        player2.flipX = true;
        player2.setBounce(0.2);
        player2.setCollideWorldBounds(true);
    }

    addGameObjects() {
        baliza = this.add.sprite(95, game.config.height - 120, "baliza").setScale(0.3);
        baliza.flipX = true;

        baliza2 = this.add.sprite(game.config.width - 95, game.config.height - 120, "baliza").setScale(0.3);

        ball = this.physics.add.image(game.config.width / 2, game.config.height / 2, "ball").setScale(0.15);

        ball.body.setCircle(375);

        ball.body.setBounce(0.3);
        ball.body.setCollideWorldBounds(true, 1, 1);

    }

    addScore() {
        score1Text = this.add.text(16, 16, "Score: 0", {fontSize: "32px", fill: "#000"});
        score2Text = this.add.text(game.config.width - 200, 16, "Score: 0", {fontSize: "32px", fill: "#000"});

    }

    addColliders() {
        this.physics.add.collider(ball, balizaCollider, this.goal2, null, this);
        this.physics.add.collider(ball, balizaCollider2, this.goal1, null, this);

        // this.physics.add.collider(ball,balizaCollider,goal2,endgame,null,this);
        // this.physics.add.collider(ball,balizaCollider2,goal1,endgame,null,this);

        this.physics.add.collider(ball, ground);
        this.physics.add.collider(player, ball);
        this.physics.add.collider(ball, baliza);
        this.physics.add.collider(ball, baliza2);
        this.physics.add.collider(player, ground);
        this.physics.add.collider(player2, ground);
        this.physics.add.collider(player2, ball);
    }

    addKeyboard() {
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        wasd = {
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
        };
        cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        if (cursors.left.isDown) {
            player.setVelocityX(-160);
            // player.anims.play("left");
        } else if (cursors.right.isDown) {
            player.setVelocityX(160);
            //player.anims.play("right");
        } else {
            player.setVelocityX(0);
            // player.anims.play("turn");
        }
        if (cursors.up.isDown && player.body.touching.down) {
            player.setVelocityY(-330);
        }
        if (keyA.isDown) {
            player2.setVelocityX(-160);
            //player2.anims.play("left");
        } else if (keyD.isDown) {
            player2.setVelocityX(160);
            // player2.anims.play("right");
        } else {
            player2.setVelocityX(0);
            //player2.anims.play("turn");
        }
        if (keyW.isDown && player2.body.touching.down) {
            player2.setVelocityY(-330);
        }
    }

    goal1() {
        score1 += 1;
        score1Text.setText("Score: " + score1);
        this.gameStatus();
    }

    goal2() {
        score2 += 1;
        score2Text.setText("Score: " + score2);
        this.gameStatus();
    }

    gameStatus() {
        ball.setPosition(game.config.width / 2, game.config.height / 2);
        player.setPosition(100, 450);
        player2.setPosition(game.config.width - 100, 450);
        if (score1 === 2 || score2 === 2) {
            if (score1 > score2) {
                winnerScore = score1;
                loserScore = score2;
            } else {
                winnerScore = score2;
                loserScore = score1;
            }
            this.scene.start("EndGame");
        }
    }

}

class endGame extends Phaser.Scene {
    constructor() {
        super("EndGame");
    }

    create() {
        this.addFinalInfo()
    }

    addFinalInfo() {
        let Overlay2 = this.add.sprite(0, 0, "background");

        Overlay2.setOrigin(0, 0);

        Overlay2.displayWidth = game.config.width;
        Overlay2.displayHeight = game.config.height;
        Overlay2.alpha = 0.8;


        let BackBoard = this.add.sprite(game.config.width / 2, game.config.height / 8, "backBoard").setScale(game.config.height / game.config.width);

        BackBoard.setOrigin(0.5, 0);

        let winner = this.add.sprite((game.config.width * 3 / 8) + 100, game.config.height / 8 + 100, "win").setScale(window.devicePixelRatio / 4);
        winner.setOrigin(0.5, 0);

        let winnerScoreText = this.add.text((game.config.width * 3 / 8), game.config.height / 2, ("Score: " + winnerScore), {
            fontSize: "32px",
            fill: "#000"
        });

        let winnerUser = this.add.image((game.config.width * 3 / 8) + 100, game.config.height * 3 / 8, "slime");

        let loser = this.add.sprite(game.config.width - ((game.config.width * 3 / 8) + 100), game.config.height / 8 + 100, "lose").setScale(window.devicePixelRatio / 4);
        loser.setOrigin(0.5, 0);

        let loserScoreText = this.add.text((game.config.width / 2 + (game.config.width / 32)), game.config.height / 2, ("Score: " + loserScore), {
            fontSize: "32px",
            fill: "#000"
        });

        let playButton2X = game.config.width / 2;
        let playButton2Y = game.config.height * 3 / 4 - 100;
        let playButton2 = this.add.sprite(playButton2X, playButton2Y, "play").setScale(window.devicePixelRatio / 3);

        playButton2.setInteractive();

        playButton2.on("pointerup", function () {
            this.scene.start("MenuGame");
        }, this);

    }

}

class selectMenu extends Phaser.Scene {
    constructor() {
        super("SelectMenu");
    }

    create() {
        this.addImage();
    }

    addImage() {

        let Overlay3 = this.add.sprite(0, 0, "background");

        Overlay3.setOrigin(0, 0);

        Overlay3.displayWidth = game.config.width;
        Overlay3.displayHeight = game.config.height;
        Overlay3.alpha = 0.8;

        let BackGround2 = this.add.image(game.config.width / 2, game.config.height / 8, "backBoard").setScale(game.config.height / game.config.width);

        BackGround2.setOrigin(0.5, 0);



        //Slime direito
        let slimeslectPlayer2 = this.add.image(game.config.width / 2 + 150, game.config.height / 2 - 100, "slime").setScale(window.devicePixelRatio / 6).setOrigin(0.5, 0.5);
        slimeslectPlayer2.flipX = true;
        let rightSelectPlayer2 = this.add.image(game.config.width / 2 + 200, game.config.height / 2, "play").setScale(window.devicePixelRatio / 6);
        let leftSelectPlayer2 = this.add.image(game.config.width / 2+ 100, game.config.height / 2, "play").setScale(window.devicePixelRatio / 6);
        leftSelectPlayer2.flipX = true;

        let selectedPlayer2 = 0
        rightSelectPlayer2.setInteractive();
        rightSelectPlayer2.on("pointerup", function () {
            selectedPlayer2++;
            switch (selectedPlayer2) {
                case 0: {
                    slimeslectPlayer2.setTexture("slime");
                    selectedSlimePlayer2 = "slime";
                    break;
                }
                case 1: {
                    slimeslectPlayer2.setTexture("slime1");
                    selectedSlimePlayer2 = "slime1";
                    break;
                }
                case 2: {
                    slimeslectPlayer2.setTexture("slime2");
                    selectedSlimePlayer2 = "slime2";
                    break;
                }
                case 3: {
                    slimeslectPlayer2.setTexture("slime3");
                    selectedSlimePlayer2 = "slime3";
                    break;
                }
                default: {
                    selectedPlayer2 = 3;
                }
            }


        }, this);
        leftSelectPlayer2.setInteractive();
        leftSelectPlayer2.on("pointerup", function () {
            selectedPlayer2--;
            switch (selectedPlayer2) {

                case 0: {
                    slimeslectPlayer2.setTexture("slime");
                    selectedSlimePlayer2 = "slime";
                    break;
                }
                case 1: {
                    slimeslectPlayer2.setTexture("slime1");
                    selectedSlimePlayer2 = "slime1";
                    break;
                }
                case 2: {
                    slimeslectPlayer2.setTexture("slime2");
                    selectedSlimePlayer2 = "slime2";
                    break;
                }
                case 3: {
                    slimeslectPlayer2.setTexture("slime3");
                    selectedSlimePlayer2 = "slime3";
                    break;
                }
                default: {
                    selectedPlayer2 = 0;
                }

            }


        }, this);
        //

        //Slime esquerdo
        let slimeslectPlayer1 = this.add.image(game.config.width / 2 - 150, game.config.height / 2 - 100, "slime").setScale(window.devicePixelRatio / 6).setOrigin(0.5, 0.5);
        let rightSelectPlayer1 = this.add.image(game.config.width / 2 - 100, game.config.height / 2, "play").setScale(window.devicePixelRatio / 6);
        let leftSelectPlayer1 = this.add.image(game.config.width / 2- 200, game.config.height / 2, "play").setScale(window.devicePixelRatio / 6);
        leftSelectPlayer1.flipX = true;

        let selectedPlayer1 = 0
        rightSelectPlayer1.setInteractive();
        rightSelectPlayer1.on("pointerup", function () {
            selectedPlayer1++;
            switch (selectedPlayer1) {
                case 0: {
                    slimeslectPlayer1.setTexture("slime");
                    selectedSlimePlayer1 = "slime";
                    break;
                }
                case 1: {
                    slimeslectPlayer1.setTexture("slime1");
                    selectedSlimePlayer1 = "slime1";
                    break;
                }
                case 2: {
                    slimeslectPlayer1.setTexture("slime2");
                    selectedSlimePlayer1 = "slime2";
                    break;
                }
                case 3: {
                    slimeslectPlayer1.setTexture("slime3");
                    selectedSlimePlayer1 = "slime3";
                    break;
                }
                default: {
                    selectedPlayer1 = 3;
                }
            }


        }, this);
        leftSelectPlayer1.setInteractive();
        leftSelectPlayer1.on("pointerup", function () {
            selectedPlayer1--;
            switch (selectedPlayer1) {

                case 0: {
                    slimeslectPlayer1.setTexture("slime");
                    selectedSlimePlayer1 = "slime";
                    break;
                }
                case 1: {
                    slimeslectPlayer1.setTexture("slime1");
                    selectedSlimePlayer1 = "slime1";
                    break;
                }
                case 2: {
                    slimeslectPlayer1.setTexture("slime2");
                    selectedSlimePlayer1 = "slime2";
                    break;
                }
                case 3: {
                    slimeslectPlayer1.setTexture("slime3");
                    selectedSlimePlayer1 = "slime3";
                    break;
                }
                default: {
                    selectedPlayer1 = 0;
                }

            }


        }, this);
        //

        let gameButton = this.add.image(game.config.width /2, game.config.height/2+ game.config.height /6,"play").setScale(window.devicePixelRatio/3);
        gameButton.setInteractive();

        gameButton.on("pointerup", function(){
            this.scene.start("PlayGame");
        },this);
    }
}



