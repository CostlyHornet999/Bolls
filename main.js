// npx http-server . -p 8080 -c-1


import Ball from './objects/ball.js';
import Line from './objects/line.js';
import Point from './objects/point.js';
import { QuadTree, Rectangle } from './physcic/quadtree.js';
import { drawQuadTree, ballNumber, visibleWidth, visibleHeight, canvasSize, updateGravity, gravityStrength } from './config.js';

const myCanvas = document.getElementById("myCanvas");

myCanvas.width = canvasSize;
myCanvas.height = canvasSize;

const ctx = myCanvas.getContext("2d");

// Arrays of objects in sequence to be drawn
const Lines = [];
const Points = [];
const Balls = [];


let rotationAngle = 0;        // Current rotation in radians (0 = normal)


document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
        rotationAngle -= Math.PI / 50;  // rotate counterclockwise
    } else if (e.key === "ArrowRight") {
        rotationAngle += 0.1;  // rotate clockwise
    } else if (e.key === "ArrowUp") {
        gravityStrength += 0.05;
    } else if (e.key === "ArrowDown") {
        gravityStrength = Math.max(0, gravityStrength - 0.05);
    }

    updateGravity(rotationAngle);
});



// Create 40 balls
for (let i = 0; i < ballNumber; i++) {
    Balls.push(new Ball());
    console.log("new ball")
}

// Create some lines
//Lines.push(new Line(50, 300, 550, 300));
//Lines.push(new Line(100, 200, 500, 250));
//Lines.push(new Line(200, 100, 400, 150));

// Create some points
//Points.push(new Point(150, 350));
//Points.push(new Point(450, 50));

// Animation loop
let quadTree;
let frame = 0, _totalInitial = 0, _totalDraw = 0, _totalQuery = 0;

let query = new Rectangle(50,350,100,100);

function animate() {
    ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
    while (Balls.length < ballNumber) {
        Balls.push(new Ball());
    }

    // Save the unrotated context
    ctx.save();

    // Move origin to center for nice rotation
    ctx.translate(myCanvas.width / 2, myCanvas.height / 2);

    // Apply rotation
    ctx.rotate(rotationAngle);
    //Draw canvas
    ctx.fillStyle = "#ebb000ff";
    ctx.fillRect(-visibleWidth / 2, -visibleHeight / 2, visibleWidth, visibleHeight);

    for (let i = 0; i < Lines.length; i++) {
        Lines[i].Do_Frame_Things();
        Lines[i].draw(ctx);
    }

    for (let i = 0; i < Points.length; i++) {
        Points[i].Do_Frame_Things();
        Points[i].draw(ctx)
    }

    for (let i = 0; i < Balls.length; i++) {
        const ball = Balls[i];
        // Update shrinking
        if (ball.shrink) {
            ball.radius -= ball.shrink_speed;
        }

        // If too small, remove it
        if (ball.radius < 2) {
            Balls.splice(i, 1);  // Remove this ball from the array
            i--;
            continue;              // Skip drawing this dead ball
        }
        Balls[i].Do_Frame_Things();
        Balls[i].draw(ctx);
    }



    frame++;

    const t0 = performance.now();
    quadTree = new QuadTree(new Rectangle(visibleWidth / 2, visibleHeight / 2, visibleWidth, visibleHeight), 1);
    Balls.forEach(ball => {
        quadTree.insert(ball);

    });
    const t1 = performance.now();
    _totalInitial += (t1 - t0)
    Time_InitialQuadTree.innerHTML = (_totalInitial / frame).toFixed(4);

    if (drawQuadTree) {
        const t2 = performance.now();
        quadTree.draw(ctx);
        const t3 = performance.now();
        _totalDraw += (t3 - t2)
        Time_DrawQuadTree.innerHTML = (_totalDraw / frame).toFixed(4);
    }
    
    const t4 = performance.now();
    Query_QuadTree.innerHTML = quadTree.Query(query).length
    const t5 = performance.now();
    _totalQuery += (t5-t4);
    QueryTime_QuadTree.innerHTML = (_totalQuery/frame).toFixed(4); 
 
    ctx.strokeStyle = "#a03e3e";
    ctx.strokeRect(query.x-query.w/2-visibleWidth/2, query.y-query.h/2-visibleHeight/2, query.w, query.h)
    
    
    //Balls.forEach(ball => {
    //    ball.draw(ctx);
    //});
    // Restore the context (undo rotation/translation)
    ctx.restore();

    requestAnimationFrame(animate);
}

// Start it!
animate();