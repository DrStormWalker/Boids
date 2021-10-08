import p5 from "p5";
import { drawBoid } from "./boid";
import { BoidHandler } from "./boidHandler";


const sketch = (p: p5) => {
    // Get the window width and height
    let width = window.innerWidth;
    let height = window.innerHeight;

    let boidHandler: BoidHandler;

    p.setup = () => {
        // Create the p5.js canvas
        p.createCanvas(width, height);

        // Initialise the boids
        boidHandler = new BoidHandler(p, width, height);
    }

    p.draw = () => {
        // Clear the screen
        p.background("#ffffff");

        // Update and render the boids
        boidHandler.updateBoids(p);
        boidHandler.renderBoids(p, drawBoid);
    }
}

// Initialise p5.js
new p5(sketch);
