import p5 from "p5";
import { drawBoid } from "./boid";
import { BoidHandler } from "./boidHandler";

const sketch = (p: p5) => {
    // Get the window width and height
    let width = window.innerWidth;
    let height = window.innerHeight;

    let boidHandler: BoidHandler;

    let numBoids = 100;
    let numPredators = 4;

    const changeNumBoids = (input) => {
        numBoids = input.target.value as number;
        boidHandler = new BoidHandler(p, width, height, numBoids, numPredators);
    }

    const changeNumPredators = (input) => {
        numPredators = input.target.value as number;
        boidHandler = new BoidHandler(p, width, height, numBoids, numPredators);
    }

    const createParameterInputs = () => {
        let div = p.createDiv();

        let numBoidsInput = p.createInput("Number of boids", "number");

        numBoidsInput.attribute("id", "num_boids_input")
            .attribute("value", "100")
            .attribute("min", "0")
            .attribute("max", "500")
            .style("width", "60px")
            .style("text-align", "center");

        (numBoidsInput as any).input(changeNumBoids);

        let numBoidsLabel = p.createElement("label", "Number of boids:");

        numBoidsLabel.attribute("for", "num_boids_input");

        let numPredatorsInput = p.createInput("Number of predators:", "number");

        numPredatorsInput.attribute("id", "num_predators_input")
            .attribute("value", "4")
            .attribute("min", "0")
            .style("width", "60px")
            .style("text-align", "center");

        (numPredatorsInput as any).input(changeNumPredators);

        let numPredatorsLabel = p.createElement("label", "Number of predators:");

        numPredatorsLabel.attribute("for", "num_predators_input");

        div.child(numBoidsLabel)
            .child(numBoidsInput)
            .child(numPredatorsLabel)
            .child(numPredatorsInput)
            .position(0, 0);
    }

    p.setup = () => {
        // Create the p5.js canvas
        p.createCanvas(width, height);
        
        createParameterInputs();

        // Initialise the boids
        boidHandler = new BoidHandler(p, width, height, numBoids, numPredators);
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
