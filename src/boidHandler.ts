import p5 from "p5";
import { Boid, distance } from "./boid";

// All parameters for calculating next boid iteration
export interface BoidHandlerParameters {
    visualRange: number;
    coherenceFactor: number;
    alignmentFactor: number;
    minDistance: number;
    separationFactor: number;

    predatorAvoidanceFactor: number;
    preyAttractionFactor: number;
    predatorToPreyVisualRangeMultiplier: number;

    predatorSpeedLimit: number;
    preySpeedLimit: number;

    containerMargin: number;
    turningForce: number;
}

export interface Boundary {
    // Top left point
    x1: number;
    y1: number;
    // Bottom right point
    x2: number;
    y2: number;
};

// Helper function to create boundary
export function createBoundary(x1: number, y1: number, x2: number, y2: number);
// Allow use of p5.js vectors
export function createBoundary(pos1: p5.Vector, pos2: p5.Vector);

export function createBoundary(
    arg1: number | p5.Vector,
    arg2: number | p5.Vector,
    arg3?: number,
    arg4?: number,
): Boundary {
    let x1, x2, y1, y2;
    // Account for passing vectors
    if (arg1 instanceof p5.Vector) {
        if (!(arg2 instanceof p5.Vector))
            throw "Unreachable";
        
        x1 = arg1.x; y1 = arg1.y;
        x2 = arg2.x; y2 = arg2.y;
    } else {
        x1 = arg1; y1 = arg2;
        x2 = arg3; y2 = arg4;
    }

    // Calculate the top left point and the bottom right point
    return {
        x1: Math.min(x1, x2),
        y1: Math.min(y1, y2),
        x2: Math.max(x1, x2),
        y2: Math.max(y1, y2),
    };
}

export class BoidHandler {
    private boids: Boid[] = [];

    // area for the boids to fly within
    private boundary: Boundary;

    // Set parameter defaults
    public params: BoidHandlerParameters = {
        visualRange: 75,
        coherenceFactor: 0.01,
        alignmentFactor: 0.05,
        minDistance: 20,
        separationFactor: 0.1,

        predatorAvoidanceFactor: 10,
        preyAttractionFactor: 3,
        predatorToPreyVisualRangeMultiplier: 4,

        predatorSpeedLimit: 8,
        preySpeedLimit: 5,

        containerMargin: 100,
        turningForce: 0.4,
    };

    constructor(
        p: p5, 
        boundary: Boundary,
        numBoids: number = 200, 
        numPredators: number = 4,
        numPreyFlocks: number = 2,
    ) {
        // Set the width and height of the area for the boids
        this.boundary = boundary;

        let width = boundary.x2 - boundary.x1;
        let height = boundary.y2 - boundary.y1;

        // Initialise the boids
        for (let i = 0; i < numBoids; i++) {
            // Generate a random flock for the boid
            let flock = Math.random() * numPreyFlocks;

            // The first `numPredators` boids will be predators
            flock = i < numPredators
                ? 0
                : Math.floor(flock) + 1;

            // Initialise the boid object
            const boid = {
                pos: p.createVector(Math.random() * width + boundary.x1, Math.random() * height + boundary.y1),
                vel: p.createVector(Math.random() * 10 - 5, Math.random() * 10 - 5),
                flock,
            };

            // Add the boid to the array of boids
            this.boids.push(boid);
        }
    }
    
    keepWithinBounds(boid: Boid) {
        // Initialise parameters
        const margin = this.params.containerMargin;
        const turnFactor = this.params.turningForce;

        // For each edge of the boundary apply velocity to move the boid towards the middle of the screen
        if (boid.pos.x < this.boundary.x1 + margin)
            boid.vel.x += turnFactor;
        if (boid.pos.x > this.boundary.x2 - margin)
            boid.vel.x -= turnFactor;
        if (boid.pos.y < this.boundary.y1 + margin)
            boid.vel.y += turnFactor;
        if (boid.pos.y > this.boundary.y2 - margin)
            boid.vel.y -= turnFactor;
    }

    limitSpeed(boid: Boid) {
        // Is the boid is a predatior it has a higher speed limit
        const speedLimit = boid.flock === 0
            ? this.params.predatorSpeedLimit
            : this.params.preySpeedLimit;

        // Apply the speed limit
        const speed = boid.vel.mag();
        if (speed > speedLimit)
            boid.vel.div(speed).mult(speedLimit);
    }

    applyRules(p: p5, boid: Boid, neighbours: Boid[]) {
        // Initialise parameters
        const coherenceFactor = this.params.coherenceFactor;
        const alignmentFactor = this.params.alignmentFactor;
        const minDistance = this.params.minDistance;
        const separationFactor = this.params.separationFactor;

        const visualRange = this.params.visualRange;

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
                ? visualRange * this.params.predatorToPreyVisualRangeMultiplier
                : visualRange;

            // If the target boid is in range
            if (dist < range && (sameFlock !== predator)) {
                // If the boid is a predator and the target is prey,
                // then the boid is more likely to stear towards the target
                const factor = predator && !otherPredator
                    ? this.params.preyAttractionFactor
                    : 1;

                // Apply the other boid's position and the prey factor
                // to the total position
                center.add(p5.Vector.mult(otherBoid.pos, factor));

                // Increment the value used to calculate the average
                numNeighboursCoherence += factor;
            }

            // If the target is within normal visual range
            if (dist < visualRange && sameFlock && !predator) {
                // Add to the total velocity
                avg.add(otherBoid.vel);

                // Increment the value used to calculate the average velocity
                numNeighboursAlignment++;
            }

            // If the target is within range
            if (dist < minDistance) {
                // If the target is a predator and the boid is prey,
                // then increase then move the boid away from the predator quicker
                const factor = otherPredator && !predator
                    ? this.params.predatorAvoidanceFactor
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
            renderFn(p, boid);
    }

    updateBoids(p: p5): void {
        // Loop through the array of boids
        for (let boid of this.boids) {
            // Update the boid's velocity based on the rules
            this.applyRules(p, boid, this.boids);
            // Limit the boid's speed
            this.limitSpeed(boid);
            // Keep it within the bounds of the screen
            this.keepWithinBounds(boid);

            // Update the boid's position with its velocity
            boid.pos.add(boid.vel);
        }
    }
}
