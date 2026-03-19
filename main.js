// npx http-server . -p 8080 -c-1


import Ball from './objects/ball.js';
import Line from './objects/line.js';
import Point from './objects/point.js';
import { QuadTree, Rectangle, Circle } from './physcic/quadtree.js';
import { iterations, drawChosen, drawQuadTree, ballNumber, visibleWidth, visibleHeight, canvasSize, updateGravity, gravityStrength, gravity } from './config.js';
import { resolveBallBall } from './physcic/collision.js';

const myCanvas = document.getElementById("myCanvas");

myCanvas.width = canvasSize;
myCanvas.height = canvasSize;

const ctx = myCanvas.getContext("2d");

// Arrays of objects in sequence to be drawn
const Lines = [];
const Points = [];
const Balls = [];


let rotationAngle = 0;        // Current rotation in radians (0 = normal)
let gravitySTR = gravityStrength; // Store gravity strength separately as otherwise it's read only

document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
        rotationAngle -= Math.PI / 50;  // rotate counterclockwise
    } else if (e.key === "ArrowRight") {
        rotationAngle += Math.PI / 50;  // rotate clockwise
    } else if (e.key === "ArrowUp") {
        gravitySTR += 0.05;
    } else if (e.key === "ArrowDown") {
        gravitySTR -= 0.05;
    }

    updateGravity(rotationAngle, gravitySTR);
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
let frame = 0, _totalInitial = 0, _totalDraw = 0, _totalCollision = 0;
let chosen = false;

function animate() {
    frame++;
    ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
    while (Balls.length < ballNumber) {
        if (chosen === false && drawChosen) {
            console.log("A chosen ball has been reborn :)");
            Balls.push(new Ball(true));
            chosen = true;
        } else {
            Balls.push(new Ball());
        }

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

    // Update and draw balls, also handle shrinking and removal of small balls
    for (let i = 0; i < Balls.length; i++) {
        const ball = Balls[i];
        // Update shrinking
        if (ball.shrink) {
            ball.radius -= ball.shrink_speed;
            ball.mass = ball.radius ** 2; // Update mass as well since it's proportional to area
        }

        // If too small, remove it
        if (ball.radius < 2) {
            if (ball.chosen === true) {
                console.log("A chosen ball has died :(");
                chosen = false;
            }
            Balls.splice(i, 1);  // Remove this ball from the array
            i--;
            continue;              // Skip drawing this dead ball
        }
        Balls[i].Do_Frame_Things();
    }




    const t2 = performance.now();
    // Detection using QuadTree
    for (let k = 0; k < iterations; k++) { // Multiple iterations for more accuracy
        // Rebuild QuadTree each frame with updated ball positions
        const t0 = performance.now();

        quadTree = new QuadTree(new Rectangle(visibleWidth / 2, visibleHeight / 2, visibleWidth, visibleHeight));
        Balls.forEach(ball => { quadTree.insert(ball); });
        
        const t1 = performance.now();
        _totalInitial += (t1 - t0)
        Time_InitialQuadTree.innerHTML = (_totalInitial / frame).toFixed(4);

        for (let i = 0; i < Balls.length; i++) {
            const ball = Balls[i];

            // Broad phase:
            const range = new Rectangle(ball.x, ball.y, ball.radius * 5 + 10, ball.radius * 5 + 10);
            const candidates = quadTree.QueryRect(range);

            // Narrow phase:
            for (const other of candidates) {
                if (other === ball) continue; // Don't check against itself

                // prevent double resolve
                if (other.id <= ball.id) continue;

                resolveBallBall(ball, other);
            }
        }
    }
    const t3 = performance.now();
    _totalCollision += (t3 - t2);
    Time_Collision.innerHTML = (_totalCollision / frame).toFixed(4);

    // Optionally draw the QuadTree for debugging
    if (drawQuadTree) {
        const t4 = performance.now();
        quadTree.draw(ctx);
        const t5 = performance.now();
        _totalDraw += (t5 - t4);
        Time_DrawQuadTree.innerHTML = (_totalDraw / frame).toFixed(4);
    }



    Balls.forEach(ball => {
        if (ball.chosen) {
            Query_QuadTreeChosen.innerHTML = quadTree.QueryCircle(new Circle(ball.x, ball.y, ball.radius * 5), [], true, ctx).length;
        }
        ball.draw(ctx);
    });
    // Restore the context (undo rotation/translation)
    ctx.restore();

    requestAnimationFrame(animate);
}

// Start it!
animate();