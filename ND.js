let imgNDcadre, imgNDmaquette, imgNDrose, imgADF1, imgADF3;
let flecheNDDouble, flecheNDSimple, imgNDB, imgPlane;
let rose = 0;
let QDR, QDR1, QDR3;
let QDM, QDM1;
let mx1, mx2, my1, my2, mmx, mmy;
let rot;
let GT, GT1;
let reponse = false;
let baliseLH, baliseRH, avion, avion1;

function preload() {
    // Charger vos images ici
    imgNDcadre = loadImage('NDcadre.png');
    imgNDmaquette = loadImage('NDmaquette.png');
    imgNDrose = loadImage('NDrose.png');
    imgADF1 = loadImage('ADF1.png');
    imgADF3 = loadImage('ADF3.png');
    flecheNDDouble = loadImage('NDDouble.png');
    flecheNDSimple = loadImage('NDSimple.png');
    imgNDB = loadImage('NDB.png');
    imgPlane = loadImage('plane.png');
}

function setup() {
    createCanvas(940, 650);
    mmx = width / 2;
    mmy = height / 2;
    baliseLH = createVector(0, -10);
    baliseRH = createVector(0, -10);
    imageMode(CENTER);
    rectMode(CENTER);
}

function draw() {
    background(255);
    
    let NDX = 183;
    let NDY = 183;
    let NDBX1 = 553;
    let NDBY1 = 183;
    let NDBX2 = 753;
    let NDBY2 = 383;

    // Partie fixe
    image(imgNDcadre, NDX, NDY, 368, 366);
    image(imgNDmaquette, NDX, NDY+18, 31, 27);
    image(imgADF1, 60, 311, 51, 28);
    image(imgADF3, 300, 311, 54, 34);

    // Rotation de la rose
    push();
    translate(NDX, NDY+14);  
    rotate(radians(-rose));
    image(imgNDrose, 0, 0, 271, 271); 
    pop();
    
    // Rotation des flèches
    push();
    translate(NDX, NDY+15);
    rotate(radians(QDM));  
    image(flecheNDDouble, 0, 0, 17, 231);
    pop();

    push();
    translate(NDX, NDY+15);
    rotate(radians(QDM1));  
    image(flecheNDSimple, 0, 0, 20, 231);
    pop();

    // Balises
    image(imgNDB, NDBX1, NDBY1);
    image(imgNDB, NDBX2, NDBY2);

    stroke(233, 255, 3);
    strokeWeight(2);
    line(NDX, 71, NDX, 88);
    noStroke();

    // Calculs de navigation
    calculateNavigation(NDX, NDY, NDBX1, NDBY1, NDBX2, NDBY2);

    // Avion contrôlé par souris
    if (mouseX > 366) {
        noCursor();
        push();
        translate(mmx, mmy);
        rotate(radians(rose));
        image(imgPlane, 1, 5);
        pop();
    } else {
        cursor(ARROW);
    }

    // Interface
    drawInterface();
    
    if (rose > 360) rose = 0;
    if (rose < 0) rose = 360;
}

function calculateNavigation(NDX, NDY, NDBX1, NDBY1, NDBX2, NDBY2) {
    // Calcul QDR/QDM première balise
    mx1 = mmx - NDBX1;
    my1 = mmy - NDBY1;
    avion = createVector(mx1, my1);
    QDR = p5.Vector.angleBetween(baliseLH, avion);
    
    if (mmx < NDBX1) {
        QDR1 = map(QDR, PI, 0, 181, 360);
    } else {
        QDR1 = degrees(QDR);
    }

    if (QDR1 < 180) rot = 180;
    else rot = -180;
    
    QDM1 = QDR1 + rot;
    GT = QDM1 - rose;
    if (GT < 0) GT += 360;

    // Calcul QDR/QDM deuxième balise
    mx2 = mmx - NDBX2;
    my2 = mmy - NDBY2;
    avion1 = createVector(mx2, my2);
    QDR2 = p5.Vector.angleBetween(baliseRH, avion1);
    
    if (mmx < NDBX2) {
        QDR3 = map(QDR2, PI, 0, 181, 360);
    } else {
        QDR3 = degrees(QDR2);
    }

    if (QDR3 < 180) rot = 180;
    else rot = -180;
    
    QDM = QDR3 + rot;
    GT1 = QDM - rose;
    if (GT1 < 0) GT1 += 360;
}

function drawInterface() {
    // Boutons
    fill(0);
    rect(50, 554, 90, 25);
    rect(50, 584, 90, 25);
    fill(255);
    text("infos", 50, 584);
    text("menu", 50, 554);

    // Affichage des valeurs
    fill(0);
    textSize(12);
    if (reponse) {
        text(round(QDR1), 55, 400);
        text(round(QDM1), 55, 415);
        text(round(GT), 55, 430);
        text(round(rose), 55, 445);
        text(round(QDR3), 55, 460);
        text(round(QDM), 55, 475);
        text(round(GT1), 55, 490);
    }

    text("QDR1 =", 5, 400);
    text("QDM1 =", 5, 415);
    text(" GT1 =", 5, 430);
    text(" CAP =", 5, 445);
    text("QDR2 =", 5, 460);
    text("QDM2 =", 5, 475);
    text(" GT2 =", 5, 490);

    // Aide
    if (mouseX > 5 && mouseX < 95 && mouseY > 570 && mouseY < 595) {
        fill(255, 0, 0);
        text("Clic droit: changer cap", 6, 610);
        text("Touche 1: afficher/cacher réponses", 6, 625);
    }
}

function mousePressed() {
    if (mouseButton === RIGHT) {
        rose++;
    }
    
    if (mouseButton === LEFT && mouseX > 366) {
        mmx = mouseX;
        mmy = mouseY;
    }
}

function keyPressed() {
    if (key === '1') {
        reponse = !reponse;
    }
}