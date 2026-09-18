//=========================================
// Variables
//=========================================
let handPose;

// webcam Width & Height
let videoW = 640;
let videoH = 480;

let hands = [];

let fingerTip;
let balloon;
let leftWall, rightWall, topWall, botWall;

let gameStart = false;
let gameOver = false;
//=========================================
// Code
//=========================================

function preload() {
    // Model settings
    let options = {
        flipped: true,
        runtime: "tfjs",
        modelType: "full",
        detectorModelUrl: undefined,
        landmarkModelUrl: undefined,
    }

    //load the model
    handPose = ml5.handPose(options);
}

function setup() {
    createCanvas(videoW,videoH);
    world.gravity.y = 5;
    //Setup webcam vid
    let constraints = {
        video: {
            mandatory: {
            minWidth:videoW,
            minHeight:videoH
            },
            optional: [{minFrameRate:60}]
        },
        audio: false,
        flipped: true
    };
    
    
    video = createCapture(constraints);
    video.size(videoW,videoH);
    video.hide();
    //send vid to the model to detect the hands
    handPose.detectStart(video, gotHands);

    fingerTip = new Sprite();
    fingerTip.diameter = 60;
    fingerTip.collider = "none";
    fingerTip.color = "rgba(225, 255, 0, 0.1)";
    fingerTip.visible = false;

    balloon = new Sprite();
    balloon.diameter =60 ;
    balloon.collider ="none";
    balloon.color = "rgb(255,0,0)";
    balloon.x =width / 2;
    balloon.y  =height/10;
    balloon.bounciness = 1;
    balloon.mass = 1;
    balloon.drag =0.3;

    leftWall = new Sprite();
    leftWall.x = 0;
    leftWall.y = height/2;
    leftWall.width = 10;
    leftWall.height = height;
    leftWall.collider = "static";
    leftWall.color = "yellow";

    rightWall = new Sprite();
    rightWall.x = width;
    rightWall.y = height/2;
    rightWall.width = 10;
    rightWall.height = height;
    rightWall.collider = "static";
    rightWall.color = "yellow";

    topWall = new Sprite();
    topWall.x = width/2;
    topWall.y = 0;
    topWall.width = width;
    topWall.height = 10;
    topWall.collider = "static";
    topWall.color = "yellow";

    botWall = new Sprite();
    botWall.x = width/2;
    botWall.y = height;
    botWall.width = width;
    botWall.height = 10;
    botWall.collider = "static";
    botWall.color = "yellow";

}   

function draw() {
    // Draw webCam vid
    image(video,0,0,videoW,videoH);

    if(gameStart === false){
        textSize(40);
        textAlign(CENTER , CENTER);
        fill("rgb(8, 8, 255)");
        text('START', width/2, height/2);

        textSize(26);
        fill("rgb(2, 2, 145)");
        text('PRESS SPACE TO START', width/2, height*0.6);
        keyPressed();

    } else if(gameStart === true){
        // Check if model detects hand
        if (hands.length > 0) {
            let hand = hands[0];                        
            let keypoint = hand.keypoints[8];

            fingerTip.x = keypoint.x;
            fingerTip.y = keypoint.y;
            fingerTip.visible = true;
            
        }   else {
            fingerTip.visible = false;
        }

        // chaeck collision
        if (balloon.collides(botWall)) {
            //gameover
            gameOver = true
        }

        if (gameOver === true) {
            textSize(40);
            textAlign(CENTER , CENTER);
            fill("rgb(255, 8, 8)");
            text('GAME OVER', width/2, height/2);

            textSize(26);
            fill("rgb(145, 2, 2)");
            text('PRESS SPACE TO RESTART', width/2, height*0.6);
            keyPressed();
        }
    }
    

}


//=========================================
// Function Created
//=========================================

function gotHands(results) {
    // Model detecting hand and saving output
    hands = results;
}

function keyPressed( ) {
    if (kb.pressed("space")) {
        gameStart = true;

        fingerTip.collider = "kinematic";
        balloon.collider = "dynamic"
        balloon.bounciness = 1;
        balloon.mass = 5;
        balloon.drag = 0.1;

        fingerTip.collider = "kinematic";
    }
}