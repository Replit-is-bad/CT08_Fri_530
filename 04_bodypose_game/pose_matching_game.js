// ====================================================
// Canvas and layout variables
// ====================================================

// Width of the webcam/game area.
let cameraWidth = 800;

// Height of the webcam/game area.
let cameraHeight = 450;

// Width of each side panel.
let sidePanelWidth = 220;

// Total canvas width = left panel + webcam area + right panel.
let totalCanvasWidth = cameraWidth + sidePanelWidth * 2;

// x-position where the webcam area starts.
let cameraX = sidePanelWidth;

// x-position of the left panel.
let leftPanelX = 0;
let leftPanelCenterX = sidePanelWidth / 2;

// x-position of the right panel.
let rightPanelX = sidePanelWidth + cameraWidth;
let rightPanelCenterX = rightPanelX + sidePanelWidth / 2 ;

// Setup variables
let video;
let bodyPose; // ML Model
let detectedPeople = []; // Array to store people the model detects

// Game variables
let skeletonColour;
let player1Colour;
let player2Colour;
let player1Person = null;
let player2Person = null;
let poseArray = [];
let currentPose = null;
let totalRounds = 5;
let playerScored = false;
let roundNumber = 0;


let botHandsUpImg;
let leftHandsUpImg;
let rightHandsUpImg;
let handsOnHeadImg;
let tPoseImg;

let player1Score = 0;
let player2Score = 0;

// ====================================================
// Preload
// ====================================================

function preload(){
    // Load the Body Pose model
    bodyPose = ml5.bodyPose("MoveNet", { flipped: true });

    botHandsUpImg = loadImage("assets/poseBattle_bothHandsUp.png");
    leftHandsUpImg = loadImage("assets/poseBattle_leftHandUp.png");
    rightHandsUpImg = loadImage("assets/poseBattle_rightHandUp.png");
    handsOnHeadImg = loadImage("assets/poseBattle_handsOnHead.png");
    tPoseImg = loadImage("assets/poseBattle_tpose.png");

}

// ====================================================
// Setup
// ====================================================

// setup() runs once at the start.
function setup() {
    // Set up Canvas
    new Canvas(totalCanvasWidth, cameraHeight);

    // Set up webcam video
    let constraints = {
        video: {
            width: cameraWidth,
            height: cameraHeight,
            aspectRatio: cameraWidth / cameraHeight
        },
        audio: false,
        flipped: true
    };
    video = createCapture(constraints);
    video.hide();

    // Give video feed to model to start detecting
    // Send result to gotPeople function
    bodyPose.detectStart(video, gotPeople);

    // Set up text.
    textAlign(CENTER, CENTER);

    // Set game variables
    skeletonColour = color(255, 255, 0); // color(r, g, b)
    player1Colour = color(255, 0, 0);
    player2Colour = color(0, 0, 255);

    setupPoseArray();
    currentPose = poseArray[0];

    startRound();

}


// ====================================================
// Main draw loop
// ====================================================

// draw() runs again and again.
function draw() {
    // Clear the canvas with a dark background.
    background(30);
    // Draw the side panels.
    drawUIPanel();
    // Draw the middle line that separates Player 1 and Player 2 areas.
    drawMiddleLine();

    // Draw webcam video
    image(video, cameraX, 0, cameraWidth, cameraHeight);

    // Draw debug info
    drawPlayerStatus();

    // Draw a skeleton for all detected people
    

    findPlayers();
    drawPlayerSkeleton();

    drawGameUI();
    drawPlayerStatus();
    drawPlayerScore("player 1", leftPanelCenterX, player1Score, player1Colour);
    drawPlayerScore("player 2", rightPanelCenterX, player2Score, player2Colour);
    if(playerScored === true) {
        endRound();
    }
}

// ====================================================
// Draw side UI panels
// ====================================================

// Draws the left and right UI panels.
function drawUIPanel() {
    // Remove outlines.
    noStroke();

    // Set panel colour.
    fill(20);

    // Draw left panel.
    rect(leftPanelX, 0, sidePanelWidth, cameraHeight);

    // Draw right panel.
    rect(rightPanelX, 0, sidePanelWidth, cameraHeight);

    // Set divider line colour.
    stroke(255, 180);

    // Set divider line thickness.
    strokeWeight(2);

    // Draw line between left panel and webcam.
    line(sidePanelWidth, 0, sidePanelWidth, cameraHeight);

    // Draw line between webcam and right panel.
    line(rightPanelX, 0, rightPanelX, cameraHeight);
}


// ====================================================
// Draw middle divider line
// ====================================================

// Draws the vertical line that separates Player 1 and Player 2.
function drawMiddleLine() {
    // Set line colour to white with transparency.
    stroke(255, 180);

    // Set line thickness.
    strokeWeight(2);

    // Draw the middle line inside the webcam area.
    line(width / 2, 0, width / 2, cameraHeight);
}

// ====================================================
// Pose Functions
// ====================================================

// results parameter received from the model
function gotPeople(results) {
    // Store results into array
    detectedPeople = results;
}

// Draws debug info on screen and console
function drawDetectionStatus() {
    // Set up text
    fill(0);
    textSize(24);
    text("People Detected: " + detectedPeople.length, width / 2, height * 0.1);
}

// Check confidence of each keypoint
function pointIsReady(point) {
    // Check if point exists
    if (point === null | point === undefined) {
        return false;
    }

    if (point.confidence > 0.25) {
        return true;
    } else {
        return false;
    }
}

// Draw line between two body points
function drawBodyLine(point1, point2) {
    if (pointIsReady(point1) && pointIsReady(point2)) {
        line(point1.x + cameraX, point1.y, point2.x + cameraX, point2.y); // line(x pos 1, y pos 1, x pos 2, y pos 2)
    }
}

// Draw circle on body point
function drawBodyPoint(point) {
    if (pointIsReady(point)) {
        circle(point.x + cameraX, point.y, 10); // circle(x pos, y pos, diameter)
    }
}

// Draws one person's skeleton.
function drawSkeleton(person, skeletonColor) {
    // Set skeleton line colour.
    stroke(skeletonColor);

    // Set skeleton line thickness.
    strokeWeight(3);

    // Draw shoulder line.
    drawBodyLine(person.left_shoulder, person.right_shoulder);

    // Draw left upper arm.
    drawBodyLine(person.left_shoulder, person.left_elbow);

    // Draw left lower arm.
    drawBodyLine(person.left_elbow, person.left_wrist);

    // Draw right upper arm.
    drawBodyLine(person.right_shoulder, person.right_elbow);

    // Draw right lower arm.
    drawBodyLine(person.right_elbow, person.right_wrist);

    // Draw left body side.
    drawBodyLine(person.left_shoulder, person.left_hip);

    // Draw right body side.
    drawBodyLine(person.right_shoulder, person.right_hip);

    // Draw hip line.
    drawBodyLine(person.left_hip, person.right_hip);

    // Remove outlines for the body point circles.
    noStroke();

    // Set circle colour.
    fill(skeletonColor);

    // Draw important body points.
    drawBodyPoint(person.nose);
    drawBodyPoint(person.left_shoulder);
    drawBodyPoint(person.right_shoulder);
    drawBodyPoint(person.left_elbow);
    drawBodyPoint(person.right_elbow);
    drawBodyPoint(person.left_wrist);
    drawBodyPoint(person.right_wrist);
    drawBodyPoint(person.left_hip);
    drawBodyPoint(person.right_hip);
}

// Draw all detected people's skeletons
function drawAllSkeletons() {
    // Loop through detectedPeople
    for (let i = 0; i < detectedPeople.length; i++) {
        // For each detected person call drawSkeleton
        let person = detectedPeople[i];
        drawSkeleton(person, skeletonColour);
    }
}

// Check positions of each person and assign player1 and player2
function findPlayers() {
    // Reset player1 and player2
    player1Person = null;
    player2Person = null;

    // Checking which person is closest to player1CenterX and player2CenterX
    let closestPlayer1Distance = Number.MAX_VALUE;
    let closestPlayer2Distance = Number.MAX_VALUE;

    // Center x pos of left, right and middle
    let player1CenterX = cameraWidth / 4 + cameraX;
    let player2CenterX = cameraWidth / 4 * 3 + cameraX;
    let middleX = cameraWidth / 2 + cameraX;

     // Loop through detectedPeople
    for (let i = 0; i < detectedPeople.length; i++) {
        // For each detected person call drawSkeleton
        let person = detectedPeople[i];
        let nose = person.nose;

        // Check if nose is detected confidently
        if (pointIsReady(nose)) {
            // Get x pos of nose
            let noseX = nose.x + cameraX;

            // Check if on left
            if (noseX < middleX) {
                let distanceFromPlayer1Center = abs(noseX - player1CenterX);
                // Update who is closer
                if(distanceFromPlayer1Center < closestPlayer1Distance) {
                    closestPlayer1Distance = distanceFromPlayer1Center;
                    player1Person = person;
                }
            } else {
                // if on right
                let distanceFromPlayer2Center = abs(noseX - player2CenterX);
                // Update who is closer
                if(distanceFromPlayer2Center < closestPlayer2Distance) {
                    closestPlayer2Distance = distanceFromPlayer2Center;
                    player2Person = person;
                }
            }
        }
    }   
}

// draw p1 and p2
function drawPlayerSkeleton() {
    //
    if(player1Person != null) {
        drawSkeleton(player1Person, player1Colour);
        console.log(player1Person);
        console.log(player1Colour);
    }
    if(player2Person != null) {
        drawSkeleton(player2Person, player2Colour);
    }
}

function setupPoseArray() {
    poseArray = [
        {
            name:"Both Hands Up",
            image: botHandsUpImg,
            id: "bothHandsUp"
        },
        {
            name:"Left Hand Up",
            image: leftHandsUpImg,
            id: "leftHandsUp"
        },
        {
            name:"Right Hand Up",
            image: rightHandsUpImg,
            id: "rightHandsUp"
        },
        {
            name:"Hands On HEad",
            image: handsOnHeadImg,
            id: "handsOnHead"
        },
        {
            name:"T Pose",
            image: tPoseImg,
            id: "tPoseImg"
        }
    ]
}

function drawGameUI(){
    if(currentPose === null || currentPose === undefined) {
        return;
    }
    //Text
    fill(20, 90, 300);
    textSize(28)
    text(currentPose.name, width / 2 , height * 0.2);

    imageMode(CENTER);
    image(currentPose.image, width/2, height * 0.7 ,230,230);

    imageMode(CORNER);

    fill(255);
    textSize(34);
    text("Round " + (roundNumber + 1) + "/" + totalRounds, width/2, height * 0.1);
}

function drawPlayerStatus() {
    textSize(27);
    noStroke();
    
    if(player1Person != null) {
        fill(player1Colour);
        text("Detected", leftPanelCenterX, height * 0.5);

        if(checkCurrentPose(player1Person) === true) {
            text("Match", leftPanelCenterX,height*0.7);
        } else {
            text("Not Matching", leftPanelCenterX,height*0.7);
        }
    } else {
        fill(player1Colour);
        text("Not Detected", leftPanelCenterX, height * 0.5);
    }

    if(player2Person != null) {
        fill(player2Colour);
        text("Detected", rightPanelCenterX, height * 0.5);

        if(checkCurrentPose(player2Person) === true) {
            text("Match", rightPanelCenterX,height*0.7);
        } else {
            text("Not Matching", rightPanelCenterX,height*0.7);
        }
    } else {
        fill(player2Colour);
        text("Not Detected", rightPanelCenterX, height * 0.5);
    }
}
  // Checks whether both hands are clearly above the head.
function checkBothHandsUp(person) {
    let leftWrist = person.left_wrist;
    let rightWrist = person.right_wrist;
    let leftShoulder = person.left_shoulder;
    let rightShoulder = person.right_shoulder;
    let nose = person.nose;

    if (pointIsReady(leftWrist) === false) {
        return false;
    }

    if (pointIsReady(rightWrist) === false) {
        return false;
    }

    if (pointIsReady(leftShoulder) === false) {
        return false;
    }

    if (pointIsReady(rightShoulder) === false) {
        return false;
    }

    if (pointIsReady(nose) === false) {
        return false;
    }

    let shoulderWidth = abs(leftShoulder.x - rightShoulder.x);
    let margin = shoulderWidth * 0.25;

    let leftHandHigh = false;
    let rightHandHigh = false;

    if (leftWrist.y < nose.y - margin) {
        leftHandHigh = true;
    }

    if (rightWrist.y < nose.y - margin) {
        rightHandHigh = true;
    }

    if (leftHandHigh === true && rightHandHigh === true) {
        return true;
    } else {
        return false;
    }
}


// Checks whether only the left hand is up.
function checkLeftHandUp(person) {
    let leftWrist = person.left_wrist;
    let rightWrist = person.right_wrist;
    let leftShoulder = person.left_shoulder;
    let rightShoulder = person.right_shoulder;

    if (pointIsReady(leftWrist) === false) {
        return false;
    }

    if (pointIsReady(rightWrist) === false) {
        return false;
    }

    if (pointIsReady(leftShoulder) === false) {
        return false;
    }

    if (pointIsReady(rightShoulder) === false) {
        return false;
    }

    let shoulderWidth = abs(leftShoulder.x - rightShoulder.x);
    let margin = shoulderWidth * 0.25;

    let leftIsUp = false;
    let rightIsDown = false;

    if (leftWrist.y < leftShoulder.y - margin) {
        leftIsUp = true;
    }

    if (rightWrist.y > rightShoulder.y + margin) {
        rightIsDown = true;
    }

    if (leftIsUp === true && rightIsDown === true) {
        return true;
    } else {
        return false;
    }
}


// Checks whether only the right hand is up.
function checkRightHandUp(person) {
    let leftWrist = person.left_wrist;
    let rightWrist = person.right_wrist;
    let leftShoulder = person.left_shoulder;
    let rightShoulder = person.right_shoulder;

    if (pointIsReady(leftWrist) === false) {
        return false;
    }

    if (pointIsReady(rightWrist) === false) {
        return false;
    }

    if (pointIsReady(leftShoulder) === false) {
        return false;
    }

    if (pointIsReady(rightShoulder) === false) {
        return false;
    }

    let shoulderWidth = abs(leftShoulder.x - rightShoulder.x);
    let margin = shoulderWidth * 0.25;

    let rightIsUp = false;
    let leftIsDown = false;

    if (rightWrist.y < rightShoulder.y - margin) {
        rightIsUp = true;
    }

    if (leftWrist.y > leftShoulder.y + margin) {
        leftIsDown = true;
    }

    if (rightIsUp === true && leftIsDown === true) {
        return true;
    } else {
        return false;
    }
}


// Checks whether both arms are stretched sideways like a T.
function checkTPose(person) {
    let leftWrist = person.left_wrist;
    let rightWrist = person.right_wrist;
    let leftShoulder = person.left_shoulder;
    let rightShoulder = person.right_shoulder;

    if (pointIsReady(leftWrist) === false) {
        return false;
    }

    if (pointIsReady(rightWrist) === false) {
        return false;
    }

    if (pointIsReady(leftShoulder) === false) {
        return false;
    }

    if (pointIsReady(rightShoulder) === false) {
        return false;
    }

    let shoulderWidth = abs(leftShoulder.x - rightShoulder.x);
    let levelMargin = shoulderWidth * 0.5;

    let leftWristLevel = false;
    let rightWristLevel = false;
    let armsAreWide = false;

    if (abs(leftWrist.y - leftShoulder.y) < levelMargin) {
        leftWristLevel = true;
    }

    if (abs(rightWrist.y - rightShoulder.y) < levelMargin) {
        rightWristLevel = true;
    }

    let wristDistance = abs(leftWrist.x - rightWrist.x);

    if (wristDistance > shoulderWidth * 2) {
        armsAreWide = true;
    }

    if (leftWristLevel === true && rightWristLevel === true && armsAreWide === true) {
        return true;
    } else {
        return false;
    }
}


// Checks whether both hands are near the head.
function checkHandsOnHead(person) {
    let leftWrist = person.left_wrist;
    let rightWrist = person.right_wrist;
    let leftShoulder = person.left_shoulder;
    let rightShoulder = person.right_shoulder;
    let nose = person.nose;

    if (pointIsReady(leftWrist) === false) {
        return false;
    }

    if (pointIsReady(rightWrist) === false) {
        return false;
    }

    if (pointIsReady(leftShoulder) === false) {
        return false;
    }

    if (pointIsReady(rightShoulder) === false) {
        return false;
    }

    if (pointIsReady(nose) === false) {
        return false;
    }

    let shoulderWidth = abs(leftShoulder.x - rightShoulder.x);

    let closeToHeadDistance = shoulderWidth * 0.8;
    let headHeightMargin = shoulderWidth * 0.45;
    let aboveShoulderMargin = shoulderWidth * 0.3;

    let leftHandNearHead = false;
    let rightHandNearHead = false;

    let leftDistanceFromHead = dist(leftWrist.x, leftWrist.y, nose.x, nose.y);
    let rightDistanceFromHead = dist(rightWrist.x, rightWrist.y, nose.x, nose.y);

    if (
        leftDistanceFromHead < closeToHeadDistance &&
        abs(leftWrist.y - nose.y) < headHeightMargin &&
        leftWrist.y < leftShoulder.y - aboveShoulderMargin
    ) {
        leftHandNearHead = true;
    }

    if (
        rightDistanceFromHead < closeToHeadDistance &&
        abs(rightWrist.y - nose.y) < headHeightMargin &&
        rightWrist.y < rightShoulder.y - aboveShoulderMargin
    ) {
        rightHandNearHead = true;
    }

    if (leftHandNearHead === true && rightHandNearHead === true) {
        return true;
    } else {
        return false;
    }

}
function checkCurrentPose(person) {
    if (currentPose === null || currentPose === undefined) {
        return false;
    }

    if (currentPose.id === "bothHandsUp") {
        return checkBothHandsUp(person);
    }
    else if (currentPose.id === "leftHandsUp") {
        return checkLeftHandUp(person);
    }
    else if (currentPose.id === "rightHandsUp") {
        return checkRightHandUp(person);
    }
    else if (currentPose.id === "handsOnHead") {
        return checkHandsOnHead(person);
    }
}

function keyPressed() {
    if (key === "1") {
        currentPose = poseArray[0];
    }
    if (key === "2") {
        currentPose = poseArray[1];
    }
    if (key === "3") {
        currentPose = poseArray[2];
    }
    if (key === "4") {
        currentPose = poseArray[3];
    }

    if (key === "5") {
        currentPose = poseArray[4];
    }
}
function drawPlayerScore(playerName, panelCenterX, score, playerColour) {
    fill(playerColour);
    textSize(30);
    text(playerName, panelCenterX, height * 0.2);
    text("SCORE: "+ score, panelCenterX, height * 0.3)
}
         
function checkPlayerScores() {
    if(playerScored === false && player1Person !== null){
        if (checkCurrentPose(player1Person)=== true){
            player1Score += 1;

            playerScored = true;
            return;
        }
    }
    if(playerScored === false && player2Person !== null){
        if (checkCurrentPose(player2Person)=== true){
            player2Score += 1;

            playerScored = true;
            return;
        }
    }
}

function startRound(){
    currentPose = poseArray[roundNumber];

    playerScored = false;
}

function endRound() {
    if (roundNumber < totalRounds) {
        roundNumber += 1;
        startRound
    }
}