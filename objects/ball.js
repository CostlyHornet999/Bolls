import { visibleWidth, visibleHeight, gravity, elasticity} from '../config.js';

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
        this.radius = Math.random() * 5+10 ;
        this.mass = this.radius**2; // mass proportional to area
        this.inertia = 0.5 * this.mass * this.radius**2; // moment of inertia
        this.elasticity = elasticity;
        this.shrink = true;
        this.shrink_speed = 0.05;
    }
    Do_Frame_Things(dt = 1) {
        // Applies gravity
        this.vy += gravity.y * dt;
        this.vx += gravity.x * dt;

        // Move using THIS object's velocity
        this.x += this.vx * dt;
        this.y += this.vy * dt;

        // Bounce off walls
        if (this.x - this.radius < 0 || this.x + this.radius > visibleWidth) {
            this.vx *= -1 * this.elasticity; // reverse horizontal velocity
            this.vy *= 0.99; // lose some vertical velocity to simulate friction
            this.x = Math.max(this.radius, Math.min(visibleWidth - this.radius, this.x));
        }
        if (this.y - this.radius < 0 || this.y + this.radius > visibleHeight) {
            this.vy *= -1 * this.elasticity; // reverse vertical velocity
            this.vx *= 0.99;
            this.y = Math.max(this.radius, Math.min(visibleHeight - this.radius, this.y));
        }
        this.vx *= 0.999;
        this.vy *= 0.999;
        if (Math.abs(this.vx) < 0.001) this.vx = 0;
        if (Math.abs(this.vy) < 0.001) this.vy = 0;
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