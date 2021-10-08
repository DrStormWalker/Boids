import p5 from "p5";
export function drawBoid(p, boid) {
    const angle = Math.atan2(boid.vel.y, boid.vel.x);
    p.noStroke();
    let fill = ["#ff2600", "#177600", "#1d1dff", "#971bce"];
    p.fill(fill[boid.flock]);
    p.push();
    p.translate(boid.pos.x, boid.pos.y);
    p.rotate(angle);
    p.beginShape();
    p.vertex(-15, +5);
    p.vertex(-15, -5);
    p.vertex(0, 0);
    p.endShape();
    p.translate(-boid.pos.x, -boid.pos.y);
    p.pop();
}
export function distance(boid1, boid2) {
    return p5.Vector.sub(boid1.pos, boid2.pos).mag();
}
export function keepWithinBounds(boid, width, height) {
    const margin = 100;
    const turnFactor = 0.4;
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
    const speedLimit = boid.flock === 0
        ? 8
        : 5;
    const speed = boid.vel.mag();
    if (speed > speedLimit)
        boid.vel.div(speed).mult(speedLimit);
}
export class BoidHandler {
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }
}
