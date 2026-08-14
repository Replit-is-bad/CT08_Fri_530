//player box
let player; // Player sprite
let box;    // Player sprite image
let bg;     // Background image

// game variables
const TILE_SIZE = 50;
const MAX_JUMP = 1;
let jumpChance = MAX_JUMP;
// world building groups
let mapUsed;
let tileMap1;
let tileMap2;
let level = 1;
let lastLevel = 2;
let ground;     // Ground sprite group
let spikes;     // Spike sprite group
let orbs;        // Orb sprite group
let finishLine; // Finish line sprite group
let startGame = false;
let gameOver = false;
let endTimer = 0;
let particles;

// image sprites
let spike;
let startGameImg;
let endGameImg;
let startSprite;
let endSprite;

// menu


// sound assets
let backgroundTrack;
let passSound;
let failSound;


let lost = false;

function preload() {
    box = loadImage("assets/cube2.png");
    bg = loadImage("assets/geobg.png");
    spike = loadImage("assets/spike.png");

    endGameImg = loadImage('assets/clear.png');
    startGameImg = loadImage('assets/startgame.png');

    tileMap1 = loadStrings("stages/tiles2.txt");
    tileMap2 = loadStrings("stages/tiles3.txt");

    backgroundTrack = createAudio("assets/stereo-madness.mp3");
    passSound = createAudio("asset/game-start.mp3");
    failSound = createAudio("asset/geometry-dash-death-sound.mp3");
}

function setup() {
    new Canvas(700, 600);   // (width, height)
    world.gravity.y = 32;

    jumpChance = MAX_JUMP;
    // Player sprite
    player = new Sprite(TILE_SIZE, TILE_SIZE, TILE_SIZE, TILE_SIZE);  // (x, y, width, height)
    player.img = box;
    player.friction = 0;
    player.bounciness = 0;
    player.collider = "dynamic";

    // Spawn point [x, y]
    startCoordinate = [TILE_SIZE, height - TILE_SIZE];
    player.x = startCoordinate[0];
    player.y = startCoordinate[1];

    // Ground sprite group
    ground = new Group();
    ground.tile = "g";  // "g" represents a ground tile
    ground.w = TILE_SIZE;   // Width
    ground.h = TILE_SIZE;   // Height
    ground.color = "black"; // Tile colour
    ground.stroke = "white";    // Outline colour
    ground.collider = "static"; // Cannot move

    // Spikes sprite group
    spikes = new Group();
    spikes.tile = "s";
    spikes.img = spike;
    spikes.collider = "static";

    // Orbs sprite group
    orbs = new Group();
    orbs.tile = "o";
    orbs.d = 24;    // Diameter
    orbs.color = "#e9f502";
    orbs.stroke = "white";
    orbs.collider = "static"; // Cannot move

    // Finish line sprite group
    finishLine = new Group();
    finishLine.tile = "f";
    finishLine.w = TILE_SIZE;
    finishLine.h = height * 2;
    finishLine.color = "#021af5";
    finishLine.stroke = "black";
    finishLine.collider = "static";
    finishLine.visible = true; // Show or hide

    //particles
    particles = new Group();

    // Create map using tile map and sprite groups
    new Tiles(tileMap1, 0, 0, TILE_SIZE, TILE_SIZE);    // (map, x, y, width, height)

    startSprite = new Sprite(width / 2 , height / 2, 190 , 90);
    startSprite.img = startGameImg;
    startSprite.collider = "none";

    new Tiles(tileMap1, 0, 0, 50, 50);
    
    mapUsed = tileMap1;
} 



function resetGame() {
    box.rotation = 0;

    player.x = startCoordinate[0];
    player.y = startCoordinate[1];

    jumpChance = MAX_JUMP;

    camera.x = width / 2;

    
    backgroundTrack.stop();
}
function triggerGameover() {
    gameOver = true;

    player.vel.y = 0;
    jumpChance = 0;
    endTimer = frameCount;

    if (endSprite) {
        endSprite.remove();
    }
    endSprite = new Sprite(player.x, height / 2 , 126, 24);
    endSprite.collider = "none";
    endSprite.img = endGameImg;

    backgroundTrack.stop();
}
function loadLevel() {
    ground.removeALL();
    sharp.removeALL();
    orbs.removeALL();
    finishLine.removeALL();

    if (lastLevel < level) {
        level = 1;
    }
    if (level === 1) {
        new Tiles(tileMap1, 0, 0, 50, 50);
    }else if (level === 2){
        new Tiles(tileMap2, 0, 0, 50, 50);
    }

}
function draw() {
    drawBackground();
    clear();    // Clear the previous frame before drawing
    image(bg, 0, 0, 800, 600);  // (image, x, y, width, height)
    
    if (!startGame && (mouse.presses() || kb.presses("space"))) {
        startGame = true;
        startSprite.visible = false;
    }  else if(!startGame) {
            if(frameCount % 60 <30) {
                   startSprite.visible = true;
            } else{
                    startSprite.visible = false;
            }
    }
    if (startGame){
        if (backgroundTrack.elt.paused){
            backgroundTrack.play();
        }
    // camera
        if (player.x >= width / 2) {
            camera.x = player.x;
        }else {
            camera.x = width / 2;
        }
        // player movement
        player.vel.x = 5;

        if ((kb.presses("space") || mouse.presses("left")) && jumpChance > 0) {
            jumpChance -= 1;
            player.vel.y = -10;
            player.rotateTo(player.rotation + 359, 15);
        }

        if (player.collides(ground) && jumpChance < MAX_JUMP) {
            jumpChance = MAX_JUMP;
        }
        
        for (let orb of orbs) {
            if (player.collides(orb)) {
                orb.collider = "none";
                jumpChance = MAX_JUMP;
            }
            
        }
        for (let tile of ground) {
            if (player.collides(tile)) {

                let LeftEdge = tile.x - tile.w / 2;
                let LeftEdgeHight = tile.y - tile.h / 2;
                if (player.x <LeftEdge && player.y > LeftEdgeHight) {
                    lost = true;
                    resetGame();
                    break;
                }
            }
        }

        if (player.collides(spikes)) {
            lost = true;
            resetGame();
        }

        if (player.collides(finishLine)) {
            lost = false;
            triggerGameover();
        }

        if (gameOver) {
            if (frameCount - endTimer > 120) {
                if(endSprite){
                    endSprite.remove();
                }
                startGame =false;
                gameOver = false;
                resetGame();

                level += 1;
                loadLevel();
            }
        }
    
        if(frameCount % 3 === 0 && player.colliding(ground) && player.vel.x >= 0.5){

            // small particles below box
            let particle = new Sprite(player.x , player.y + player.h / 2 , 8 ,8,"none");

            // no outline for particles
            particle.color = "white";
            particle.strokeWeight = 0;

            // particle go backwards
            particle.vel.x = -5;

            // random movement
            particle.vel.y = random(-2 ,0);

            //life
            particle.life = 30;

            // particle add to group
            particles.add(particle);

            // upright cube
            box.rotation = 0;
        }

    }
    drawBackground();
}

function drawBackground() {

  let lastRow = mapUsed[mapUsed.length - 1]; //Get the final row of the current tile map.
  let numCols = lastRow.length; //Count how many tiles are in the row.
  let totalJourney = numCols * 50; //each tile is around 50px. this gives the total length

  let progress = map(player.x, 0, totalJourney, -100, 0);

  let c1 = color("#9933ff"); //colours for lerping
  let c2 = color("#4169e1");

  let amt = (sin(frameCount * 0.5) + 1) / 2; //Create a value that repeatedly changes between 0 and 1.
  let blend = lerpColor(c1, c2, amt); //lerp between two colours

  tint(blend); //turn on the tint
  image(bg, progress, 0, 800, 600); //draw and move background 
  noTint(); //remove tint on all other objects
}