import p5 from "p5";

export type Boid = {
    pos: p5.Vector,
    vel: p5.Vector,
}

export function drawBoid(p: p5, boid: Boid) {
    const angle = Math.atan2(boid.vel.y, boid.vel.x);

    p.push();

    p.translate(boid.pos.x, boid.pos.y)
    p.rotate(angle);

    p.beginShape();
    p.vertex(- 15, + 5);
    p.vertex(- 15, - 5);
    p.vertex(0, 0);
    p.endShape();

    p.translate(-boid.pos.x, -boid.pos.y);

    p.pop();
    p.noStroke();
    p.fill("#0000ff");
}

export function distance(boid1: Boid, boid2: Boid) {
    return p5.Vector.sub(boid1.pos, boid2.pos).mag();
}

export function keepWithinBounds(boid: Boid, width: number, height: number) {
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

export function limitSpeed(boid: Boid) {
    const speedLimit = 5;

    const speed = boid.vel.mag();
    if (speed > speedLimit)
        boid.vel.div(speed).mult(speedLimit);
}

export abstract class BoidHandler {
    protected p: p5;
    width: number;
    height: number;

    protected constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }

    abstract updateBoids(p: p5): void;
    abstract renderBoids(p: p5, renderFn: (p: p5, boid: Boid) => void): void;
}
