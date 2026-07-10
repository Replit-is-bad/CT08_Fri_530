function setup() {
    new Canvas (800, 400);
    background(200);
    textSize(16);
    fill(30);

    let base = 10;
    let height = 5;
    let area = 0.5*base*height;

    
    console.log("area: ",area);
    
    let total = 0;
    for(let i = 2; i <= 20; i += 2) {
        console.log(i);
        total += i;
    }
    console.log("Sum :", total);

    let score = 19;

    if (score > 90) {
        console.log("Great");
    }
    else if (score > 70) {
        console.log("Good");
    }
    else {
        console.log("This guy bro...");
    }

    while (score >= 1) {
        if (score % 2 == 1) {
            console.log(score)
        }
        score --;

    }

    let groceries = ["apple" ,"bread" ,"milk"];

    groceries.push("orange");
    groceries.push("butter");
    groceries.shift();
    groceries.splice(1,1,"kaya");
}