//player box
let player; // Player sprite
let box;    // Player sprite image
let bg;     // Background image

// game variables
const TILE_SIZE = 50;
const MAX_JUMP = 1;
let jumpChance = MAX_JUMP;
// world building groups
let tileMap1;
let ground;     // Ground sprite group
let spikes;     // Spike sprite group
let orbs;        // Orb sprite group
let finishLine; // Finish line sprite group
let startGame = false;
let gameOver = false;
let endTimer = 0;

// image sprites
let spike;
let startGameImg;
let endGameImg;
let startSprite;
let endSprite;

// menu


// sound assets


function preload() {
    box = loadImage("assets/cube2.png");
    bg = loadImage("assets/geobg.png");
    spike = loadImage("assets/spike.png");

    endGameImg = loadImage('assets/clear.png');
    startGameImg = loadImage('assets/startgame.png');

    tileMap1 = loadStrings("stages/tiles3.txt");
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

    // Create map using tile map and sprite groups
    new Tiles(tileMap1, 0, 0, TILE_SIZE, TILE_SIZE);    // (map, x, y, width, height)

    startSprite = new Sprite(width / 2 , height / 2, 190 , 90);
    startSprite.img = startGameImg;
    startSprite.collider = "none"


}
function resetGame() {
    box.rotation = 0;

    player.x = startCoordinate[0];
    player.y = startCoordinate[1];

    jumpChance = MAX_JUMP;

    camera.x = width / 2;
}
function draw() {
    clear();    // Clear the previous frame before drawing
    image(bg, 0, 0, 800, 600);  // (image, x, y, width, height)

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
                
                resetGame();
                break;
            }
        }
    }

    if (!startGame && (mouse.presses() || kb.presses("space"))) {
        startGame = true;
        startSprite.visible = false;
    }  else if(!startGame) {
        i
    }

    if (player.collides(spikes)) {
        resetGame();
    }
}
