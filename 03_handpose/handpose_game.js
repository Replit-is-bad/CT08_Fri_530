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
    fingerTip.collider = "kinematic";
    fingerTip.color = "rgba(225, 255, 0, 0.1)";

    balloon = new Sprite();
    balloon.diameter =60 ;
    balloon.collider ="dynamic";
    balloon.color = "rgb(255,0,0)";
    balloon.x =width / 2;
    balloon.y  =height/2;
    balloon.bounciness = 1;
    

}   

function draw() {
    // Draw webCam vid
    image(video,0,0,videoW,videoH);

    // Check if model detects hand
    if (hands.length > 0) {
        console.log(hands);
        let hand = hands[0];                        
        let keypoint = hand.keypoints[8];

        fingerTip.x = keypoint.x;
        fingerTip.y = keypoint.y;
        fingerTip.visible = true;
        
    }

}


//=========================================
// Function Created
//=========================================

function gotHands(results) {
    // Model detecting hand and saving output
    hands = results;

}