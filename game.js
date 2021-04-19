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
let score1Text;
let score2Text;

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
            playGame
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
        this.load.spritesheet("slime", "assets/img.png",
            {frameWidth: 32, frameHeight: 48}
        );

        this.load.image("playbutton", "assets/playbutton.png"); //
        this.load.image("title", "assets/title.png"); //
        this.load.image("tile", "assets/tile.png"); //
    }

    create() {
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

        this.scene.start("MenuGame");
    }
}

class menuGame extends Phaser.Scene {

    constructor() {
        super("MenuGame");
    }

    create() {
        this.addGameTitle();
    }


    addGameTitle() {
        this.guiGroup = this.add.group();

        let blackOverlay = this.add.sprite(0, 0, "tile");

        blackOverlay.setOrigin(0, 0);
        blackOverlay.displayWidth = game.config.width;
        blackOverlay.displayHeight = game.config.height;
        blackOverlay.alpha = 0.8;

        this.guiGroup.add(blackOverlay);

        let title = this.add.sprite(game.config.width / 2, 50, "title");
        title.setOrigin(0.5, 0);

        this.guiGroup.add(title);

        let playButtonX = game.config.width / 2;
        let playButtonY = game.config.height / 2 - 20;
        let playButton = this.add.sprite(playButtonX, playButtonY, "playbutton");

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
        balizaCollider.create(180, game.config.height - 120, "balizaCollider").setScale(0.3).refreshBody();


        balizaCollider2 = this.physics.add.staticGroup();
        balizaCollider2.create(game.config.width - 180, game.config.height - 120, "balizaCollider").setScale(0.3).refreshBody();


    }

    addPlayers() {
        player = this.physics.add.sprite(100, 450, "slime");
        player.setBounce(0.2);
        player.setCollideWorldBounds(true);

        player2 = this.physics.add.sprite(game.config.width - 100, 450, "slime");
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
        this.physics.add.collider(ball, balizaCollider, this.goal2);
        this.physics.add.collider(ball, balizaCollider2, this.goal1);

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
            player.anims.play("left");
        } else if (cursors.right.isDown) {
            player.setVelocityX(160);
            player.anims.play("right");
        } else {
            player.setVelocityX(0);
            player.anims.play("turn");
        }
        if (cursors.up.isDown && player.body.touching.down) {
            player.setVelocityY(-330);
        }
        if (keyA.isDown) {
            player2.setVelocityX(-160);
            player2.anims.play("left");
        } else if (keyD.isDown) {
            player2.setVelocityX(160);
            player2.anims.play("right");
        } else {
            player2.setVelocityX(0);
            player2.anims.play("turn");
        }
        if (keyW.isDown && player2.body.touching.down) {
            player2.setVelocityY(-330);
        }
    }

    goal1() {
        score1 += 1;
        ball.setPosition(game.config.width / 2, game.config.height / 2);
        player.setPosition(100, 450);
        player2.setPosition(game.config.width - 100, 450);
        score1Text.setText("Score: " + score1);
    }

    goal2() {
        score2 += 1;
        ball.setPosition(game.config.width / 2, game.config.height / 2);
        player.setPosition(100, 450);
        player2.setPosition(game.config.width - 100, 450);
        score2Text.setText("Score: " + score2);
    }

    endgame(score1, score2) {

        if (score1 === 60 || score2 === 60) {

            gameover = true
            this.scene.restart();

        }
    }
}



