import { visibleHeight, visibleWidth } from "../config.js";

export default class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;    

    }
        Do_Frame_Things() {
        
        }
        draw(ctx){
        // Draw the point
        ctx.beginPath();
        ctx.arc(this.x - visibleWidth / 2, this.y - visibleHeight / 2, 5, 0, Math.PI * 2); // visible width/height to displace to center
        ctx.fillStyle = "#780000";
        ctx.fill();
    }
}