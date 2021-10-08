import p5 from "p5";
// Function to draw a boid to the screen
export function drawBoid(p, boid) {
    // Calculate the direction of the boid
    const angle = Math.atan2(boid.vel.y, boid.vel.x);
    // p5.js styling
    p.noStroke();
    let fill = ["#ff2600", "#177600", "#1d1dff", "#971bce"];
    p.fill(fill[boid.flock]);
    // push the transformations to the p5.js stack
    p.push();
    // apply new transformations
    p.translate(boid.pos.x, boid.pos.y);
    p.rotate(angle);
    // Draw the shape of the boid
    p.beginShape();
    p.vertex(-15, +5);
    p.vertex(-15, -5);
    p.vertex(0, 0);
    p.endShape();
    // Remove translation
    p.translate(-boid.pos.x, -boid.pos.y);
    // Pop the transformations from the p5.js stack
    p.pop();
}
export function distance(boid1, boid2) {
    return p5.Vector.sub(boid1.pos, boid2.pos).mag();
}
export function keepWithinBounds(boid, width, height) {
    // Initialise parameters
    const margin = 100;
    const turnFactor = 0.4;
    // For each edge of the screen apply velocity to move the boid towards the middle of the screen
    if (boid.pos.x < margin)
        boid.vel.x += turnFactor;
    if (boid.pos.x > width - margin)
        boid.vel.x -= turnFactor;
    if (boid.pos.y < margin)
        boid.vel.y += turnFactor;
    if (boid.pos.y > height - margin)
        boid.vel.y -= turnFactor;
}
export function limitSpeed(boid) {
    // Is the boid is a predatior it has a higher speed limit
    const speedLimit = boid.flock === 0
        ? 8
        : 5;
    // Apply the speed limit
    const speed = boid.vel.mag();
    if (speed > speedLimit)
        boid.vel.div(speed).mult(speedLimit);
}
