
// Inputs
export const ballNumber = 250;
export const drawQuadTree = false;

// Visible area size
export const visibleWidth = 600;
export const visibleHeight = 400;

// Make canvas larger to accommodate rotation (diagonal + margin)
const diagonal = Math.sqrt(visibleWidth**2 + visibleHeight**2);
export const canvasSize = Math.ceil(diagonal * 1.2);  // 20% extra safety

// Gravity variables and function
export let gravityStrength = 0.3;    // How strong gravity is
export let gravity = { x: 0, y: gravityStrength };

export function updateGravity(rotationAngle) { // Recalculate gravity when the screen is rotated
    gravity.x = gravityStrength * Math.sin(rotationAngle);  // horizontal pull
    gravity.y = gravityStrength * Math.cos(rotationAngle);  // vertical pull (down when angle=0)
}
