//=========================================
// Variables
//=========================================
let handPose;

// webcam Width & Height
let videoW = 640;
let videoH = 480;
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

    handPose.detectStart(video, gotHands);
    
}

function draw() {}

//=========================================
// Function Created
//=========================================
