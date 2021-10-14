import p5 from "p5";
import { Boid, distance, drawBoid, keepWithinBounds, limitSpeed } from "./boid";

export class BoidHandler {
    width: number;
    height: number;

    numBoids = 200;
    visualRange = 75;
    boids: Boid[] = [];

    constructor(p: p5, width: number, height: number) {
        // Set the width and height of the area for the boids
        this.width = width;
        this.height = height;

        // Initialise the boids
        for (let i = 0; i < this.numBoids; i++) {
            // Generate a random flock for the boid
            let flock = Math.random() * 2.05;
            // Small chance for the boid to be a predator
            flock = flock < 0.05
                ? 0
                : Math.floor(flock + 0.95);

            // Initialise the boid object
            const boid = {
                pos: p.createVector(Math.random() * width, Math.random() * height),
                vel: p.createVector(Math.random() * 10 - 5, Math.random() * 10 - 5),
                flock,
            };

            // Add the boid to the array of boids
            this.boids.push(boid);
        }
    }

    applyRules(p: p5, boid: Boid, neighbours: Boid[]) {
        // Initialise parameters
        const coherenceFactor = 0.01;
        const alignmentFactor = 0.05;
        const minDistance = 20;
        const separationFactor = 0.1;

        // Initialise variables
        let center = p.createVector(0, 0);
        let avg = p.createVector(0, 0);
        let move = p.createVector(0, 0);
        let numNeighboursCoherence = 0;
        let numNeighboursAlignment = 0;

        // For each boid on the screen
        for (let i = 0; i < neighbours.length; i++) {
            let otherBoid = neighbours[i];

            // Skip all calculations if the target is the boid
            if (boid === otherBoid)
                continue;

            // Calculate the distance between the two boids
            let dist = distance(boid, otherBoid);

            // Pre-calculate common flags
            let sameFlock = boid.flock === otherBoid.flock;
            let predator = boid.flock === 0;
            let otherPredator = otherBoid.flock === 0;

            // If the boid is a predator (flock 0) and the target is prey,
            // then the visual range of the boid is increased
            let range = predator && !otherPredator
                ? this.visualRange * 4
                : this.visualRange;

            // If the target boid is in range
            if (dist < range && (sameFlock !== predator)) {
                // If the boid is a predator and the target is prey,
                // then the boid is more likely to stear towards the target
                const factor = predator && !otherPredator
                    ? 3
                    : 1;

                // Apply the other boid's position and the prey factor
                // to the total position
                center.add(p5.Vector.mult(otherBoid.pos, factor));

                // Increment the value used to calculate the average
                numNeighboursCoherence += factor;
            }

            // If the target is within normal visual range
            if (dist < this.visualRange && (sameFlock !== predator)) {
                // Add to the total velocity
                avg.add(otherBoid.vel);

                // Increment the value used to calculate the average velocity
                numNeighboursAlignment++;
            }

            let minDist = minDistance * (otherPredator && predator
                ? 5
                : 1);

            // If the target is within range
            if (dist < minDist) {
                // If the target is a predator and the boid is prey,
                // then increase then move the boid away from the predator quicker
                const factor = otherPredator
                    ? 10
                    : 1;

                // Increase the movement vector away from the target
                move.add(p5.Vector.sub(boid.pos, otherBoid.pos).mult(factor));
            }
        }

        // Prevent division by zero
        if (numNeighboursCoherence) {
            // Calculate the center of mass, of neighbouring boids
            center.div(numNeighboursCoherence);

            // Change the velocity of the boid to move towards the center of mass
            boid.vel.add(
                p5.Vector.mult(
                    p5.Vector.sub(center, boid.pos),
                    coherenceFactor));
        }

        // Prevent division by zero
        if (numNeighboursAlignment) {
            // Calculate the average velocity
            avg.div(numNeighboursAlignment);

            // Change the velocity of the boid to make it more like that of the average
            boid.vel.add(
                p5.Vector.mult(
                    p5.Vector.sub(avg, boid.vel),
                    alignmentFactor));
        }

        // Change the velocity of the boid to move it away from other boids
        boid.vel.add(p5.Vector.mult(move, separationFactor));
    }

    renderBoids(p: p5, renderFn: (p: p5, boid: Boid) => void): void {
        // Loop through the array of boids and render them
        for (let boid of this.boids)
            drawBoid(p, boid);
    }

    updateBoids(p: p5): void {
        // Loop through the array of boids
        for (let boid of this.boids) {
            // Update the boid's velocity based on the rules
            this.applyRules(p, boid, this.boids);
            // Limit the boid's speed
            limitSpeed(boid);
            // Keep it within the bounds of the screen
            keepWithinBounds(boid, this.width, this.height);

            // Update the boid's position with its velocity
            boid.pos.add(boid.vel);
        }
    }
}
