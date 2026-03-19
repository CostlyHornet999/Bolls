import { visibleWidth, visibleHeight, gravity} from '../config.js';

let id = 0;
export default class Ball {
    constructor(chosen = false) {
        // Chosen!
        this.chosen = chosen;

        // Location
        this.x = Math.random() * visibleWidth;
        this.y = 50;

        // Speed
        this.vx = Math.random() * 20 - 10; // -4 to +4
        this.vy = Math.random() * 20 - 10;

        // Appearance
        const grayValue = Math.floor(Math.random() * 60) + 10; // 10 to 70
        this.color = `rgb(${grayValue}, ${grayValue}, ${grayValue})`;

        // Physical Properties
        this.id = id++;
        this.radius = Math.random() * 15 + 5;
        this.mass = this.radius**2; // mass proportional to area
        this.elasticity = 0.8;
        this.shrink = true;
        this.shrink_speed = 0.05;
    }
    Do_Frame_Things() {
        // Applies gravity
        this.vy += gravity.y;
        this.vx += gravity.x;

        // Move using THIS object's velocity
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off walls
        if (this.x - this.radius < 0 || this.x + this.radius > visibleWidth) {
            this.vx *= -1 * this.elasticity; // reverse horizontal velocity
            this.vy *= Math.sqrt(this.elasticity);
            this.x = Math.max(this.radius, Math.min(visibleWidth - this.radius, this.x));
        }
        if (this.y - this.radius < 0 || this.y + this.radius > visibleHeight) {
            this.vy *= -1 * this.elasticity; // reverse vertical velocity
            this.vx *= Math.sqrt(this.elasticity);
            this.y = Math.max(this.radius, Math.min(visibleHeight - this.radius, this.y));
        }
    }
    draw(ctx) {   
        // Draw the ball
        const relX = this.x - visibleWidth / 2;
        const relY = this.y - visibleHeight / 2;

        ctx.beginPath();
        ctx.arc(relX, relY, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        if (this.chosen) {
            ctx.lineWidth = 3;
            ctx.strokeStyle = "#ff0000";
            ctx.stroke();
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(relX, relY, this.radius*5, 0, Math.PI * 2);
            ctx.strokeStyle = "rgba(255,0,0,0.5)";
            ctx.stroke();
        }
    }
}