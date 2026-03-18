import { visibleWidth, visibleHeight } from "../config.js";
import Point from "./point.js";
export default class Line {
    constructor(x1, y1, x2, y2) {
        this.P1 = new Point(x1, y1);
        this.P2 = new Point(x2, y2);

        this.P1.normal = {
            x: x1 - x2,
            y: y1 - y2
        };
        const lengthP1 = Math.sqrt(this.P1.normal.x ** 2 + this.P1.normal.y ** 2);
        this.P1.normal.x /= lengthP1;
        this.P1.normal.y /= lengthP1;

        this.P2.normal = {
            x: x2 - x1,
            y: y2 - y1
        };
        const lengthP2 = Math.sqrt(this.P2.normal.x ** 2 + this.P2.normal.y ** 2);
        this.P2.normal.x /= lengthP2;
        this.P2.normal.y /= lengthP2;
        
        this.normal = {
            x: y2 - y1,
            y: x1 - x2
        };
        // Normalize the normal vector
        const length = Math.sqrt(this.normal.x ** 2 + this.normal.y ** 2); // Pythagorean theorem
        this.normal.x /= length;
        this.normal.y /= length;
    }
    Do_Frame_Things() {
        
    }
    draw(ctx) {         
        // Draw the line
        ctx.beginPath();
        ctx.moveTo(this.P1.x - visibleWidth / 2, this.P1.y - visibleHeight / 2); // visible width/height to displace to center
        ctx.lineTo(this.P2.x - visibleWidth / 2, this.P2.y - visibleHeight / 2);
        ctx.strokeStyle = "#573100";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw the normal for visualization
        ctx.beginPath();
        ctx.strokeStyle = "#0000ff";
        const midX = (this.P1.x + this.P2.x) / 2 - visibleWidth / 2;
        const midY = (this.P1.y + this.P2.y) / 2 - visibleHeight / 2;
        ctx.moveTo(midX, midY);
        ctx.lineTo(midX + this.normal.x * 20, midY + this.normal.y * 20);
        ctx.stroke();


        // Draw endpoint normals for visualization
        ctx.beginPath();
        ctx.strokeStyle = "#00aa00";
        ctx.moveTo(this.P1.x - visibleWidth / 2, this.P1.y - visibleHeight / 2);
        ctx.lineTo(this.P1.x + this.P1.normal.x * 10 - visibleWidth / 2, this.P1.y + this.P1.normal.y * 10 - visibleHeight / 2);
        ctx.moveTo(this.P2.x - visibleWidth / 2, this.P2.y - visibleHeight / 2);
        ctx.lineTo(this.P2.x + this.P2.normal.x * 10 - visibleWidth / 2, this.P2.y + this.P2.normal.y * 10 - visibleHeight / 2);
        ctx.stroke();

        this.P1.draw(ctx);
        this.P2.draw(ctx);

    }
}

