import p5 from "p5";
import { BoidHandler, distance, keepWithinBounds, limitSpeed } from "../boid";
export class RawBoids extends BoidHandler {
    constructor(p, width, height) {
        super(width, height);
        this.numBoids = 300;
        this.visualRange = 75;
        this.boids = [];
        for (let i = 0; i < this.numBoids; i++) {
            const flockNum = Math.random() * 2;
            const boid = {
                pos: p.createVector(Math.random() * width, Math.random() * height),
                vel: p.createVector(Math.random() * 10 - 5, Math.random() * 10 - 5),
                flock: flockNum < 0.05
                    ? 0
                    : Math.floor(flockNum) + 1,
            };
            this.boids.push(boid);
        }
    }
    applyCoherence(p, boid, neighbours) {
        const coherenceFactor = 0.01;
        let center = p.createVector(0, 0);
        let numNeighbours = 0;
        for (let otherBoid of neighbours) {
            let range = boid.flock === 0 && otherBoid.flock !== 0
                ? this.visualRange * 4
                : this.visualRange;
            if (distance(boid, otherBoid) < range
                && ((boid.flock === otherBoid.flock && boid.flock !== 0) || boid.flock === 0)) {
                const factor = boid.flock === 0 && otherBoid.flock !== 0
                    ? 2
                    : 1;
                center.add(p5.Vector.mult(otherBoid.pos, factor));
                numNeighbours += factor;
            }
        }
        if (numNeighbours) {
            center.div(numNeighbours);
            boid.vel.add(p5.Vector.mult(p5.Vector.sub(center, boid.pos), coherenceFactor));
        }
        p.line(boid.pos.x, boid.pos.y, center.x, center.y);
    }
    applySeparation(p, boid, neighbours) {
        const minDistance = 20;
        const separationFactor = 0.1;
        let move = p.createVector(0, 0);
        for (let otherBoid of neighbours) {
            if (otherBoid !== boid) {
                if (distance(boid, otherBoid) < minDistance) {
                    const factor = boid.flock !== 0 && otherBoid.flock === 0
                        ? 10
                        : 1;
                    move.add(p5.Vector.sub(boid.pos, otherBoid.pos).mult(factor));
                }
            }
        }
        boid.vel.add(p5.Vector.mult(move, separationFactor));
    }
    applyAlignment(p, boid, neighbours) {
        const alignmentFactor = 0.05;
        let avg = p.createVector(0, 0);
        let numNeighbours = 0;
        for (let otherBoid of neighbours) {
            if (distance(boid, otherBoid) < this.visualRange && boid.flock === otherBoid.flock) {
                avg.add(otherBoid.vel);
                numNeighbours++;
            }
        }
        if (numNeighbours) {
            avg.div(numNeighbours);
            boid.vel.add(p5.Vector.mult(p5.Vector.sub(avg, boid.vel), alignmentFactor));
        }
    }
    applyRules(p, boid, neighbours) {
        const coherenceFactor = 0.01;
        const alignmentFactor = 0.05;
        const minDistance = 20;
        const separationFactor = 0.1;
        let center = p.createVector(0, 0);
        let avg = p.createVector(0, 0);
        let move = p.createVector(0, 0);
        let numNeighboursCoherence = 0;
        let numNeighboursAlignment = 0;
        for (let i = 0; i < neighbours.length; i++) {
            let otherBoid = neighbours[i];
            let dist = distance(boid, otherBoid);
            let sameFlock = boid.flock === otherBoid.flock;
            let predator = boid.flock === 0;
            let range = predator && otherBoid.flock !== 0
                ? this.visualRange * 4
                : this.visualRange;
            if (dist < range && ((sameFlock && !predator) || predator)) {
                const factor = predator && otherBoid.flock !== 0
                    ? 2
                    : 1;
                center.add(p5.Vector.mult(otherBoid.pos, factor));
                numNeighboursCoherence += factor;
            }
            if (dist < this.visualRange && sameFlock) {
                avg.add(otherBoid.vel);
                numNeighboursAlignment++;
            }
            if (otherBoid !== boid && dist < minDistance) {
                const factor = boid.flock !== 0 && otherBoid.flock === 0
                    ? 10
                    : 1;
                move.add(p5.Vector.sub(boid.pos, otherBoid.pos).mult(factor));
            }
        }
        if (numNeighboursCoherence) {
            center.div(numNeighboursCoherence);
            boid.vel.add(p5.Vector.mult(p5.Vector.sub(center, boid.pos), coherenceFactor));
        }
        if (numNeighboursAlignment) {
            avg.div(numNeighboursAlignment);
            boid.vel.add(p5.Vector.mult(p5.Vector.sub(avg, boid.vel), alignmentFactor));
        }
        boid.vel.add(p5.Vector.mult(move, separationFactor));
    }
    renderBoids(p, renderFn) {
        for (let boid of this.boids)
            renderFn(p, boid);
    }
    updateBoids(p) {
        for (let boid of this.boids) {
            this.applyRules(p, boid, this.boids);
            limitSpeed(boid);
            keepWithinBounds(boid, this.width, this.height);
            boid.pos.add(boid.vel);
        }
    }
}
