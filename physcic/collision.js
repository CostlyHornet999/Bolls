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

    // Turn the impulse scalar into a vector
    const impulseX = impulse * nx;
    const impulseY = impulse * ny;

    // Apply the impulse to the balls' velocities
    ball1.vx -= impulseX / ball1.mass;
    ball1.vy -= impulseY / ball1.mass;
    ball2.vx += impulseX / ball2.mass;
    ball2.vy += impulseY / ball2.mass;

    // Correction
    const margin = 0.001; // Small margin where we ignore overlap to prevent jittering
    const WorkPercent = 0.9; // 90% of the overlap is fixed this frame to prevent jittering and explosions

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
}

export class BallLine {
    collisionCheck(ball, line) {
        return (ball.x * line.normal.x + ball.y * line.normal.y) < ball.radius;
    }
    resolveCollision(ball, line) {
        const nx = line.normal.x;
        const ny = line.normal.y;
        const dot = ball.vx * nx + ball.vy * ny;

        impulse = (1 + ball.elasticity) * dot;
        // 

        //new velocity = old velocity − 2 * (perpendicular component)
        // The perpendicular component is (v·n) * n 
        if (dot > 0) return; // Already moving away, no need to resolve
        ball.vx -= impulse * nx;
        ball.vy -= impulse * ny;

    }
}
