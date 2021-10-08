import p5 from "p5";
import { Boid, BoidHandler, drawBoid } from "./boid";
import { RawBoids } from "./handlers/rawBoids";


const sketch = (p: p5) => {
    let width = window.innerWidth;
    let height = window.innerHeight;

    let boidHandler: BoidHandler;

    p.setup = () => {
        p.createCanvas(width, height);

        boidHandler = new RawBoids(p, width, height);
    }

    p.draw = () => {
        p.background("#ffffff");

        // let t0 = performance.now();
        boidHandler.updateBoids(p);
        // let t1 = performance.now();
        boidHandler.renderBoids(p, drawBoid);
        // let t2 = performance.now();

        // console.log(`update: ${t1 - t0}, render ${t2 - t1}`);
    }
}

new p5(sketch);
