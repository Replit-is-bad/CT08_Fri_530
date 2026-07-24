//player box
let player;
let box;
let bg

// game variables
const TILE_SIZE = 50;
let tileMap1;
let ground;
let spikes;
let orb;
let finishLine;
// world building groups


// image sprites


// menu


// sound assets


function preload() {
    box = loadImage("assets/cube2.png");
    bg = loadImage("assets/geobg.png");
    spike

    tileMap1 = loadStrings("stages/tiles1.txt");
}

function setup() {
    new Canvas(700,600); //Width,height
    world.gravity.y = 32;

    player = new Sprite(50,50,TILE_SIZE,TILE_SIZE); // x,y,width,height
    player.img = box;
    player.friction = 0;
    player.bounciness = 10;
    player.collider = "static";

    startCoordinate = [TILE_SIZE, height - TILE_SIZE];
    player.x = startCoordinate[0];
    player.y = startCoordinate[1];

    // Ground sprite group
    ground = new Group();
    ground.tile = "g";
    ground.w = TILE_SIZE;
    ground.h = TILE_SIZE;
    ground.color = 'black';
    ground.stroke = 'white';
    ground.collider ='static';

    // spike
    spike = new Group();
    spike.tile = "s";
    spike.w = TILE_SIZE;
    spike.h = TILE_SIZE;
    spike.color = 'black';
    spike.stroke = 'white';
    spike.collider = 'static';

    // Orb
    
    // map
    new Tiles(tileMap1, 0 ,0,TILE_SIZE,TILE_SIZE);
}   

function draw() {
    clear();
    image(bg,0 ,0, 800, 600); // IMAGE,X,Y,width,height
}