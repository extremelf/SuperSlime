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

let selectedBackgroundFinal;
let selectedGoals = 1;

let winnerSlime;
let loserSlime;

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
    window.focus();
};


class preloadGame extends Phaser.Scene {
    constructor() {
        super("PreloadGame");
    }

    preload() {


        this.load.image("ground", "assets/ground.png");
        this.load.image("baliza", "assets/baliza.png");
        this.load.image("balizaCollider", "assets/balizaCollider.png");
        this.load.image("ball", "assets/ball.png");
        //Slimes
        this.load.image("slime", "assets/asdd.png");
        this.load.image("slime1", "assets/asddBlue.png");
        this.load.image("slime2", "assets/asddRed.png");
        this.load.image("slime3", "assets/asddGreen.png");

        // Backgrounds
        this.load.image("background", "assets/PNG/game_background_1/game_background_1.png");
        this.load.image("background1", "assets/PNG/game_background_2/game_background_2.png");
        this.load.image("background2", "assets/PNG/game_background_3/game_background_3.1.png");
        this.load.image("background3", "assets/PNG/game_background_4/game_background_4.png");

        this.load.image("title", "assets/SuperSlime.png"); //
        this.load.image("tile", "assets/tile.png"); //
        this.load.image("play", "assets/UI/PNG/menu/play.png")

        //endGame assets

        this.load.image("backBoard", "assets/UI/PNG/you_win/bg.png");
        this.load.image("win", "assets/UI/PNG/you_win/header.png");
        this.load.image("lose", "assets/UI/PNG/you_lose/header.png");
        this.load.image("table", "assets/UI/PNG/you_win/table.png");

        //select Menu

        this.load.image("next", "assets/UI/PNG/btn/next.png");
        this.load.image("previous", "assets/UI/PNG/btn/prew.png");

    }

    create() {
        this.scene.start("MenuGame");
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
            this.scene.start("SelectMenu");
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
        background = this.add.sprite(0, 0, selectedBackgroundFinal);
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
            player2.setVelocityX(-160);

        } else if (cursors.right.isDown) {
            player2.setVelocityX(160);

        } else {
            player2.setVelocityX(0);

        }
        if (cursors.up.isDown && player2.body.touching.down) {
            player2.setVelocityY(-330);
        }
        if (keyA.isDown) {
            player.setVelocityX(-160);

        } else if (keyD.isDown) {
            player.setVelocityX(160);

        } else {
            player.setVelocityX(0);
        }
        if (keyW.isDown && player.body.touching.down) {
            player.setVelocityY(-330);
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
        if (score1 === selectedGoals || score2 === selectedGoals) {
            if (score1 > score2) {
                winnerScore = score1;
                winnerSlime = selectedSlimePlayer1;
                loserScore = score2;
                loserSlime = selectedSlimePlayer2;
            } else {
                winnerScore = score2;
                winnerSlime = selectedSlimePlayer2;
                loserScore = score1;
                loserSlime = selectedSlimePlayer1;
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
        let Overlay2 = this.add.sprite(0, 0, selectedBackgroundFinal);

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

        let winnerUser = this.add.image((game.config.width * 3 / 8) + 100, game.config.height * 3 / 8, winnerSlime).setScale(window.devicePixelRatio / 6).setOrigin(0.5, 0.5);

        let loser = this.add.sprite(game.config.width - ((game.config.width * 3 / 8) + 100), game.config.height / 8 + 100, "lose").setScale(window.devicePixelRatio / 4);
        loser.setOrigin(0.5, 0);

        let loserScoreText = this.add.text((game.config.width / 2 + (game.config.width / 32)), game.config.height / 2, ("Score: " + loserScore), {
            fontSize: "32px",
            fill: "#000"
        });
        let loserUser = this.add.image(game.config.width - ((game.config.width * 3 / 8) + 100), game.config.height * 3 / 8, loserSlime).setScale(window.devicePixelRatio / 6).setOrigin(0.5, 0.5);

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

        let Background3 = this.add.image(0, 0, "background");

        Background3.setOrigin(0, 0);

        Background3.displayWidth = game.config.width;
        Background3.displayHeight = game.config.height;
        Background3.alpha = 0.8;

        let BackBoard = this.add.image(game.config.width / 2, game.config.height / 8, "backBoard").setScale(game.config.height / game.config.width);

        BackBoard.setOrigin(0.5, 0);

        //Background choice
        let BackgroundTable = this.add.image(game.config.width / 2, (game.config.height * 3 / 8) - 150, "table").setOrigin(0.5, 0.5);
        BackgroundTable.displayWidth = game.config.width / 5;
        BackgroundTable.displayHeight = game.config.height / 5;
        let miniBackground = this.add.image(game.config.width / 2, (game.config.height * 3 / 8) - 150, "background").setScale(window.devicePixelRatio / 6).setOrigin(0.5, 0.5);
        let selectedBackground = 0;
        let backgroundRightSelect = this.add.image((game.config.width / 2) + 50, game.config.height * 3 / 8, "play").setScale(window.devicePixelRatio / 6);
        let backgroundLeftSelect = this.add.image((game.config.width / 2) - 50, game.config.height * 3 / 8, "play").setScale(window.devicePixelRatio / 6);
        backgroundLeftSelect.flipX = true;
        selectedBackgroundFinal = "background";

        backgroundLeftSelect.setInteractive();
        backgroundLeftSelect.on("pointerup", function () {
            selectedBackground--;

            switch (selectedBackground) {
                case 0: {
                    Background3.setTexture("background");
                    miniBackground.setTexture("background");
                    selectedBackgroundFinal = "background";
                    break;
                }
                case 1: {
                    Background3.setTexture("background1");
                    miniBackground.setTexture("background1");
                    selectedBackgroundFinal = "background1";
                    break;
                }
                case 2: {
                    Background3.setTexture("background2");
                    miniBackground.setTexture("background2");
                    selectedBackgroundFinal = "background2";
                    break;
                }
                case 3: {
                    Background3.setTexture("background3");
                    miniBackground.setTexture("background3");
                    selectedBackgroundFinal = "background3";
                    break;
                }
                default: {
                    selectedBackground = 0;
                }
            }
        }, this);

        backgroundRightSelect.setInteractive();
        backgroundRightSelect.on("pointerup", function () {
            selectedBackground++;

            switch (selectedBackground) {
                case 0: {
                    Background3.setTexture("background");
                    miniBackground.setTexture("background");
                    selectedBackgroundFinal = "background";
                    break;
                }
                case 1: {
                    Background3.setTexture("background1");
                    miniBackground.setTexture("background1");
                    selectedBackgroundFinal = "background1";
                    break;
                }
                case 2: {
                    Background3.setTexture("background2");
                    miniBackground.setTexture("background2");
                    selectedBackgroundFinal = "background2";
                    break;
                }
                case 3: {
                    Background3.setTexture("background3");
                    miniBackground.setTexture("background3");
                    selectedBackgroundFinal = "background3";
                    break;
                }
                default: {
                    selectedBackground = 3;
                }
            }
        }, this);

        //

        //Slime direito
        let slimeslectPlayer2 = this.add.image(game.config.width / 2 + 150, game.config.height / 2 - 75, "slime").setScale(window.devicePixelRatio / 8).setOrigin(0.5, 0.5);
        slimeslectPlayer2.flipX = true;
        let rightSelectPlayer2 = this.add.image(game.config.width / 2 + 200, game.config.height / 2, "play").setScale(window.devicePixelRatio / 8);
        let leftSelectPlayer2 = this.add.image(game.config.width / 2 + 100, game.config.height / 2, "play").setScale(window.devicePixelRatio / 8);
        leftSelectPlayer2.flipX = true;
        selectedSlimePlayer2 = "slime";

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
        let slimeslectPlayer1 = this.add.image(game.config.width / 2 - 150, game.config.height / 2 - 75, "slime").setScale(window.devicePixelRatio / 8).setOrigin(0.5, 0.5);
        let rightSelectPlayer1 = this.add.image(game.config.width / 2 - 100, game.config.height / 2, "play").setScale(window.devicePixelRatio / 8);
        let leftSelectPlayer1 = this.add.image(game.config.width / 2 - 200, game.config.height / 2, "play").setScale(window.devicePixelRatio / 8);
        leftSelectPlayer1.flipX = true;
        selectedSlimePlayer1 = "slime";
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

        //ojetivo de jogo
        let goalsTable = this.add.image(game.config.width / 2, game.config.height * 5 / 8, "table").setOrigin(0.5, 0.5);
        goalsTable.displayWidth = game.config.width / 6;
        goalsTable.displayHeight = game.config.height / 6;
        let ball = this.add.image(game.config.width / 2, game.config.height * 5 / 8 - 25, "ball").setScale(window.devicePixelRatio / 8).setOrigin(0.5, 0.5);
        let maxGoalsText = this.add.text(game.config.width / 2, game.config.height * 6.7 / 10, (selectedGoals), {
            fontSize: "32px",
            fill: "#000"
        }).setOrigin(0.5, 0.5);

        let addGoals = this.add.image(game.config.width / 2 + 50, game.config.height * 6.7 / 10, "next").setOrigin(0.5, 0.5).setScale(window.devicePixelRatio / 6);
        addGoals.setInteractive();

        addGoals.on("pointerup", function () {
            selectedGoals++;
            maxGoalsText.setText(selectedGoals);
        })
        let removeGoals = this.add.image(game.config.width / 2 - 50, game.config.height * 6.7 / 10, "previous").setOrigin(0.5, 0.5).setScale(window.devicePixelRatio / 6);
        removeGoals.setInteractive();

        removeGoals.on("pointerup", function () {
            if (selectedGoals > 1) {

                selectedGoals--;
            }
            maxGoalsText.setText(selectedGoals);
        })
        //

        // PlayButton
        let gameButton = this.add.image(game.config.width / 2, game.config.height / 2 + game.config.height / 4, "play").setScale(window.devicePixelRatio / 8).setOrigin(0.5, 0.5);
        gameButton.setInteractive();

        gameButton.on("pointerup", function () {
            this.scene.start("PlayGame");
        }, this);
        //
    }
}