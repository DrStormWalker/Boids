import p5 from "p5";

// Declare the boid object
export type Boid = {
    pos: p5.Vector,
    vel: p5.Vector,
    flock: number,
}

// Function to draw a boid to the screen
export function drawBoid(p: p5, boid: Boid) {
    // Calculate the direction of the boid
    const angle = Math.atan2(boid.vel.y, boid.vel.x);

    // p5.js styling
    p.noStroke()
    let fill = ["#ff2600", "#177600", "#1d1dff", "#971bce"];
    p.fill(fill[boid.flock]);

    // push the transformations to the p5.js stack
    p.push();

    // apply new transformations
    p.translate(boid.pos.x, boid.pos.y)
    p.rotate(angle);

    // Draw the shape of the boid
    p.beginShape();
    p.vertex(- 15, + 5);
    p.vertex(- 15, - 5);
    p.vertex(0, 0);
    p.endShape();

    // Remove translation
    p.translate(-boid.pos.x, -boid.pos.y);

    // Pop the transformations from the p5.js stack
    p.pop();
}

export function distance(boid1: Boid, boid2: Boid) {
    return p5.Vector.sub(boid1.pos, boid2.pos).mag();
}


