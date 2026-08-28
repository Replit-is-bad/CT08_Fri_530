//=========================================
// Variables
//=========================================
let handPose;

// webcam Width & Height
let videoW = 640;
let videoH = 480;

let hands = [];
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

}

function draw() {
    // Draw webCam vid
    image(video,0,0,videoW,videoH);

    // Check if model detects hand
    if (hands.length > 0) {
        console.log(hands);

        for (let i = 0; i < hands.length; i++){
            let hand = hands[i];

            let keypoint = hand.keypoints;
            circle(200,200,10);
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