import p5 from "p5";
import { drawBoid } from "./boid";
import { BoidHandler } from "./boidHandler";

const sketch = (p: p5) => {
    // Get the window width and height
    let width = window.innerWidth;
    let height = window.innerHeight;

    // Declare the scope of the boidHandler
    let boidHandler: BoidHandler;

    // Declare the scope of the chaging variables
    let numBoids = 100;
    let numPredators = 4;
    let numPreyFlocks = 2;

    // Declare the scope of the visual range slider element
    let visualRangeSlider: p5.Element;

    // Number of boids change callback
    const changeNumBoids = (input) => {
        numBoids = input.target.value as number;
        boidHandler = new BoidHandler(p, width, height, numBoids, numPredators, numPreyFlocks);
    }

    // Number of predators change callback
    const changeNumPredators = (input) => {
        numPredators = input.target.value as number;
        boidHandler = new BoidHandler(p, width, height, numBoids, numPredators, numPreyFlocks);
    }

    // Number of prey flocks change callback
    const changeNumPreyFlocks = (input) => {
        numPreyFlocks = input.target.value as number;
        boidHandler = new BoidHandler(p, width, height, numBoids, numPredators, numPreyFlocks);
    }

    // Create the UI to change parameters
    const createParameterInputs = () => {
        // Parent div
        let div = p.createDiv();

        // Text input for the number of boids
        let numBoidsInput = p.createInput("Number of boids", "number");

        // Give the nuber of boids input ...
        numBoidsInput
            // ... a unique identifier
            .attribute("id", "num_boids_input")
            // ... a default value
            .attribute("value", numBoids.toString())
            // ... a minimum possible value of 0
            .attribute("min", "0")
            // ... a maximum possible value of 500
            .attribute("max", "500")
            // ... a width of 60 pixels
            .style("width", "60px")
            // ... centered text
            .style("text-align", "center");

        // Apply number of boids change callback
        (numBoidsInput as any).input(changeNumBoids);

        // Create the label for the number of boids
        let numBoidsLabel = p.createElement("label", "Number of boids:");
        // ... decalring that it is for the number of boids text input
        numBoidsLabel.attribute("for", "num_boids_input");

        // Text input for the number of predators
        let numPredatorsInput = p.createInput("Number of predators:", "number");

        // Give the nuber of predators input ...
        numPredatorsInput
            // ... a unique identifier
            .attribute("id", "num_predators_input")
            // ... a default value
            .attribute("value", numPredators.toString())
            // ... a minimum possible value of 0
            .attribute("min", "0")
            // ... a width of 60 pixels
            .style("width", "60px")
            // ... centered text
            .style("text-align", "center");

        // Apply number of predators change callback
        (numPredatorsInput as any).input(changeNumPredators);

        // Create the label for the number of boids
        let numPredatorsLabel = p.createElement("label", "Number of predators:");
        // ... decalring that it is for the number of predators text input
        numPredatorsLabel.attribute("for", "num_prey_flocks_input");

        // Text input for the number of predators
        let numPreyFlocksInput = p.createInput("Number of prey flocks:", "number");

        // Give the nuber of prey flocks input ...
        numPreyFlocksInput
            // ... a unique identifier
            .attribute("id", "num_prey_flocks_input")
            // ... a default value
            .attribute("value", numPreyFlocks.toString())
            // ... a minimum possible value of 1
            .attribute("min", "1")
            // ... a maximum possible value of 3
            .attribute("max", "3")
            // ... a width of 60 pixels
            .style("width", "60px")
            // ... centered text
            .style("text-align", "center");

        // Apply number of prey flocks change callback
        (numPreyFlocksInput as any).input(changeNumPreyFlocks);

        // Create the label for the number of prey flocks
        let numPreyFlocksLabel = p.createElement("label", "Number of prey flocks:");
        // ... decalring that it is for the number of prey flocks text input
        numPredatorsLabel.attribute("for", "num_prey_flocks_input");

        // Create the visual range slider
        visualRangeSlider = p.createSlider(25, 150, 75);

        // Add all the UI Elements to the parent div
        div
            .child(numBoidsLabel)
            .child(numBoidsInput)

            .child(numPredatorsLabel)
            .child(numPredatorsInput)

            .child(numPreyFlocksLabel)
            .child(numPreyFlocksInput)

            .child(visualRangeSlider)
            // Set the parent div's location to (0, 0)
            .position(0, 0);
    }

    p.setup = () => {
        // Create the p5.js canvas
        p.createCanvas(width, height);
        
        createParameterInputs();

        // Initialise the boids
        boidHandler = new BoidHandler(p, width, height, numBoids, numPredators, numPreyFlocks);
    }

    p.draw = () => {
        // Update the visual range from the slider 
        // (unfortunately I could find no reference to slider change callbacks in p5.js)
        boidHandler.boidVisualRange = visualRangeSlider.value() as number;

        // Clear the screen
        p.background("#ffffff");

        // Update and render the boids
        boidHandler.updateBoids(p);
        boidHandler.renderBoids(p, drawBoid);
    }
}

// Initialise p5.js
new p5(sketch);
