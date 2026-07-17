//player box
let player;
let box;
let bg

// game variables
const TILE_SIZE

// world building groups


// image sprites


// menu


// sound assets


function preload() {
    box = loadImage("assets/cube2.png");
    bg = loadImage("assets/geobg.png");
}

function setup() {
    new Canvas(700,600); //Width,height
    world.gravity.y = 32;

    player = new Sprite(50,50,TILE_SIZE,TILE_SIZE); // x,y,width,height

}

function draw() {
    Image(bg,0 ,0, 800, 600); // IMAGE,X,Y,width,height
}











