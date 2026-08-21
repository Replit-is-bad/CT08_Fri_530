//=========================================
// Variables
//=========================================
let handPose;

// webcam Width & Height
let videoW = 640;
let videoH = 4
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

function setup() {}

function draw() {}

//=========================================
// Function Created
//=========================================
