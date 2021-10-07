import { Rect } from "./quadtree";
import p5 from "p5";

export default class SpacialHashMap<T> {
    cellSize: number;
    dict: { [key: string]: T[] };

    constructor(cellSize: number) {
        this.cellSize = cellSize;
        this.dict = {};
    }

    hash(point: p5.Vector): [number, number] {
        let x = Math.round(point.x / this.cellSize) * this.cellSize;
        let y = Math.round(point.y / this.cellSize) * this.cellSize;

        return [x, y];
    }

    addPoint(point: p5.Vector, object: T) {
        let hash = this.hash(point).join(",");
        if (this.dict[hash] === undefined)
            this.dict[hash] = [];

        this.dict[hash].push(object);
    }

    addBounds(bounds: Rect, object: T) {
        let minHash = this.hash(bounds.pos.copy()),
            maxHash = this.hash(bounds.pos.copy().add(bounds.width, bounds.height));

        for (let i = minHash[0]; i <= maxHash[0]; i++) {
            for (let j = minHash[1]; j <= maxHash[1]; j++) {
                this.dict[i + "," + j].push(object);
            }
        }
    }

    queryBounds(bounds: Rect): T[] {
        let minHash = this.hash(bounds.pos.copy()),
            maxHash = this.hash(bounds.pos.copy().add(bounds.width, bounds.height));

        let objects = new Set<T>();

        for (let i = minHash[0]; i <= maxHash[0]; i++) {
            for (let j = minHash[1]; j <= maxHash[1]; j++) {
                for (let object of this.dict[i + "," + j]) {
                    objects.add(object);
                }
            }
        }

        return [...objects];
    }
}