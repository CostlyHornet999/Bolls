import { visibleWidth, visibleHeight } from "../config.js";
export function resolveBallBall(ball1, ball2) {
    let dx = ball2.x - ball1.x;
    let dy = ball2.y - ball1.y;
    const r = ball1.radius + ball2.radius;
    let distSq = dx * dx + dy * dy;
    if (distSq === 0) { dx += 0.01; dy += 0.01; distSq = dx * dx + dy * dy; } // Prevent balls from being exactly on top of each other, which would cause division by zero
    if (distSq > r * r) return; // Prevent division by zero


    const distance = Math.sqrt(distSq);
    // Normal vector
    const nx = dx / distance;
    const ny = dy / distance;

    // Relative velocity
    const vx = ball2.vx - ball1.vx;
    const vy = ball2.vy - ball1.vy;
    // Velocity along the normal (positive if moving apart, negative if moving together)
    const velAlongNormal = vx * nx + vy * ny;

    if (velAlongNormal > 0) return; // Already moving apart, no need to resolve

    // Figure out the restitution (elasticity), the less elastic ball dominates the collision
    const elasticity = Math.min(ball1.elasticity, ball2.elasticity);

    // Calculate impulse scalar using good ol formula
    const impulse = -(1 + elasticity) * velAlongNormal / (1 / ball1.mass + 1 / ball2.mass);

    // Correction
    const margin = 0.5; // Small margin where we ignore overlap to prevent jittering
    const WorkPercent = 0.95; // 95% of the overlap is fixed this frame to prevent jittering and explosions

    // How much the balls are overlapping
    const overlap = r - distance;

    // The correction is how much we actually move the balls this frame
    const correction = WorkPercent * Math.max(overlap - margin, 0) / (1 / ball1.mass + 1 / ball2.mass);

    // Turn into a vector!
    const correctionX = correction * nx;
    const correctionY = correction * ny;

    // Apply the correction
    ball1.x -= correctionX / ball1.mass;
    ball1.y -= correctionY / ball1.mass;
    ball2.x += correctionX / ball2.mass;
    ball2.y += correctionY / ball2.mass;

    // APPLY MORE CORRECTION
    ball1.x = Math.max(ball1.radius, Math.min(visibleWidth - ball1.radius, ball1.x));
    ball2.x = Math.max(ball2.radius, Math.min(visibleWidth - ball2.radius, ball2.x));
    ball1.y = Math.max(ball1.radius, Math.min(visibleHeight - ball1.radius, ball1.y));
    ball2.y = Math.max(ball2.radius, Math.min(visibleHeight - ball2.radius, ball2.y));


    // Turn the impulse scalar into a vector
    const impulseX = impulse * nx;
    const impulseY = impulse * ny;




    // Apply the impulse to the balls' velocities
    ball1.vx -= impulseX / ball1.mass;
    ball1.vy -= impulseY / ball1.mass;
    ball2.vx += impulseX / ball2.mass;
    ball2.vy += impulseY / ball2.mass;


}


export function resolveBallLine(ball, line) {

        const closest = line.closestPointTo(ball.x, ball.y);
        let dx = closest.x - ball.x;
        let dy = closest.y - ball.y;
        const distSq = dx * dx + dy * dy;
        const r = ball.radius;
        
        // Fast path:
        if (distSq > r * r) return; // No collision

        // Collision detected
        const distance = Math.sqrt(distSq);
        if (distance === 0) { // Prevent division by zero
            dx = line.normal.x * 0.01;
            dy = line.normal.y * 0.01;
        }

        // Normal vector
        const nx = dx / distance;
        const ny = dy / distance;

        // Push the ball out of the line
        const overlap = r - distance;
        const margin = 0.01;
        const WorkPercent = 0.95;
        const correction = WorkPercent * Math.max(overlap - margin, 0);
        ball.x -= correction * nx;
        ball.y -= correction * ny;

        // Reflect the velocity
        // Velocity along the normal (positive if moving apart, negative if moving together)
        const dot = ball.vx * nx + ball.vy * ny;
        if (dot < 0) return; // Already moving apart, no need to resolve

        const elasticity = ball.elasticity;
        const impulse = -(1 + elasticity) * dot;
        ball.vx += impulse * nx;
        ball.vy += impulse * ny;
}
