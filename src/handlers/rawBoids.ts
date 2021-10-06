import { createRect } from "../util/quadtree";
import p5 from "p5";
import { Boid, BoidHandler, distance, keepWithinBounds, limitSpeed } from "../boid";

export class RawBoids extends BoidHandler {
    numBoids = 100;
    visualRange = 75;
    boids: Boid[] = [];

    constructor(p: p5, width: number, height: number) {
        super(width, height);
        for (let i = 0; i < this.numBoids; i++) {
            const boid = {
                pos: p.createVector(Math.random() * width, Math.random() * height),
                vel: p.createVector(Math.random() * 10 - 5, Math.random() * 10 - 5),
            };
            const index = this.boids.push(boid);
        }
    }

    applyCoherence(p: p5, boid: Boid, neighbours: Boid[]) {
        const coherenceFactor = 0.005;

        let center = p.createVector(0, 0);
        let numNeighbours = 0;

        for (let otherBoid of neighbours) {
            if (distance(boid, otherBoid) < this.visualRange) {
                center.add(otherBoid.pos);

                numNeighbours += 1;
            }
        }

        if (numNeighbours) {
            center.div(numNeighbours);

            boid.vel.add(
                p5.Vector.mult(
                    p5.Vector.sub(center, boid.pos),
                    coherenceFactor));
        }
    }

    applySeparation(p: p5, boid, neighbours: Boid[]) {
        const minDistance = 20;
        const separationFactor = 0.05;

        let move = p.createVector(0, 0);

        for (let otherBoid of neighbours) {
            if (otherBoid !== boid) {
                if (distance(boid, otherBoid) < minDistance) {
                    move.add(p5.Vector.sub(boid.pos, otherBoid.pos));
                }
            }
        }

        boid.vel.add(p5.Vector.mult(move, separationFactor));
    }

    applyAlignment(p: p5, boid: Boid, neighbours: Boid[]) {
        const alignmentFactor = 0.05;

        let avg = p.createVector(0, 0);
        let numNeighbours = 0;

        for (let otherBoid of neighbours) {
            if (distance(boid, otherBoid) < this.visualRange) {
                avg.add(otherBoid.vel);
                numNeighbours++;
            }
        }

        if (numNeighbours) {
            avg.div(numNeighbours);

            boid.vel.add(
                p5.Vector.mult(
                    p5.Vector.sub(avg, boid.vel),
                    alignmentFactor));
        }
    }

    renderBoids(p: p5, renderFn: (p: p5, boid: Boid) => void): void {
        for (let boid of this.boids)
            renderFn(p, boid);
    }

    updateBoids(p: p5): void {
        for (let boid of this.boids) {
            // const visible = boidTree.retrieve(createRect(
            //     boid.pos.copy().sub(visualRange, visualRange),
            //     visualRange * 2,
            //     visualRange * 2,
            // )).map(value => boids[value[1]]);

            // console.log(visible.length);

            // const pos = boid.pos.copy().sub(visualRange, visualRange)

            // p.noFill();
            // p.stroke(0, 0, 0);
            // p.rect(pos.x, pos.y, visualRange * 2, visualRange * 2);
            // p.circle(pos.x + visualRange, pos.y + visualRange, visualRange * 2)

            this.applyCoherence(p, boid, this.boids);
            this.applySeparation(p, boid, this.boids);
            this.applyAlignment(p, boid, this.boids);
            limitSpeed(boid);
            keepWithinBounds(boid, this.width, this.height);

            boid.pos.add(boid.vel);
        }
    }
}
