function setup() {
    new Canvas (800, 400);
    background(200);
    textSize(16);
    FileList(0);

    let base = 10;
    let height = 5;
    let area = 0.5*base*height;

    
    console.log("area: ",area);
    
    let total = 0;
    for( i = 2; i <= 20; i += 2) {
        console.log(i);
        total += i;
    }
    console.log("Sum :", total);
}