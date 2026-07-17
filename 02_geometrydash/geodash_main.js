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

    tine}

function setup() {
    new Canvas(700,600); //Width,height
    world.gravity.y = 32;

    player = new Sprite(50,50,TILE_SIZE,TILE_SIZE); // x,y,width,height
    player.img = box;
    player.friction = 0;
    player.bounciness = 10;
    player.collider = "none";

    startCoordinate = [50,height - TILE_SIZE / 2];
    player.x = startCoordinate[0];
    player.y = startCoordinate[1];
}

function draw() {
    clear();
    image(bg,0 ,0, 800, 600); // IMAGE,X,Y,width,height
}











