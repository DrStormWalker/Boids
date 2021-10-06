import p5 from "p5";
import QuadTree, { createRect } from "./util/quadtree";
import { Boid, BoidHandler, drawBoid } from "./boid";
import { RawBoids } from "./handlers/rawBoids";
import {QuadTreeBoids} from "./handlers/quadtreeBoids";


const sketch = (p: p5) => {
    let width = window.innerWidth;
    let height = window.innerHeight;

    let boidHandler: BoidHandler;

    let boids: Boid[] = [];
    let boidTree: QuadTree<number> = new QuadTree(createRect(
        p.createVector(0, 0),
        width,
        height,
    ), 10, 8);

    p.setup = () => {
        p.createCanvas(width, height);

        boidHandler = new RawBoids(p, width, height);
    }

    p.draw = () => {
        p.background("#ffffff");

        boidHandler.updateBoids(p);
        boidHandler.renderBoids(p, drawBoid);
    }
}

new p5(sketch);
