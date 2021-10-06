import p5 from "p5";

export default class QuadTree<T> {
    maxObjects: number;
    maxLevels: number;

    level: number;
    bounds: Rect;

    objects: [Rect, T][] = [];
    nodes: QuadTree<T>[] = [];

    constructor(bounds: Rect, maxObjects?: number, maxLevels?: number, level?: number) {
        this.maxObjects = maxObjects ?? 10;
        this.maxLevels = maxLevels ?? 4;

        this.level = level ?? 0;
        this.bounds = bounds;
    }

    split() {
        let nextLevel = this.level + 1;
        let subWidth = this.bounds.width / 2;
        let subHeight = this.bounds.height / 2;
        let pos = this.bounds.pos.copy();

        this.nodes[0] = new QuadTree({
            pos: pos.copy(),
            width: subWidth,
            height: subHeight,
        }, this.maxObjects, this.maxLevels, nextLevel);

        this.nodes[1] = new QuadTree({
            pos: pos.copy().add(subWidth, 0),
            width: subWidth,
            height: subHeight,
        }, this.maxObjects, this.maxLevels, nextLevel);

        this.nodes[2] = new QuadTree({
            pos: pos.copy().add(0, subHeight),
            width: subWidth,
            height: subHeight,
        }, this.maxObjects, this.maxLevels, nextLevel);

        this.nodes[3] = new QuadTree({
            pos: pos.copy().add(subWidth, subHeight),
            width: subWidth,
            height: subHeight,
        }, this.maxObjects, this.maxLevels, nextLevel);
    }

    getIndex(object: Rect) {
        let indexes = [];
        let midpoint = this.bounds.pos.copy()
                .add(this.bounds.width / 2, this.bounds.height / 2);

        let startIsNorth = object.pos.y < midpoint.y;
        let startIsWest = object.pos.x < midpoint.x;
        let endIsSouth = object.pos.y + object.height > midpoint.y;
        let endIsEast = object.pos.x + object.width > midpoint.x;

        if (startIsNorth && startIsWest)
            indexes.push(0);
        if (startIsNorth && endIsEast)
            indexes.push(1);
        if (startIsWest && endIsSouth)
            indexes.push(2);
        if (endIsEast && endIsSouth)
            indexes.push(3);

        return indexes
    }

    insert(bounds: Rect, data: T) {
        if (this.nodes.length) {
            let indexes = this.getIndex(bounds);

            for (let i of indexes)
                this.nodes[i].insert(bounds, data);

            return
        }

        this.objects.push([bounds, data]);

        if (this.objects.length > this.maxObjects && this.level < this.maxLevels) {
            if (!this.nodes.length) {
                this.split();
            }

            for (let object of this.objects) {
                let indexes = this.getIndex(object[0]);
                console.log(indexes);
                for (let i of indexes)
                    this.nodes[i].insert(object[0], object[1]);
            }

            this.objects = [];
        }
    }

    retrieve(bounds) {
        let indexes = this.getIndex(bounds);
        let returnObjects = this.objects;

        if (this.nodes.length) {
            for (let i of indexes)
                returnObjects = returnObjects.concat(this.nodes[i].retrieve(bounds));
        }

        // console.log("1 " + returnObjects.length);

        returnObjects = returnObjects.filter((item, i) => returnObjects.indexOf(item) >= i);

        // console.log("2 " + returnObjects.length);

        return returnObjects;
    }

    clear() {
        this.objects = [];

        for (let node of this.nodes) {
            if (this.nodes.length)
                node.clear();
        }

        this.nodes = [];
    }
}

export interface Rect {
    pos: p5.Vector,
    width: number,
    height: number,
}

export function createRect(x: number, y: number, width: number, height: number): Rect;
export function createRect(pos: p5.Vector, width: number, height: number): Rect;
export function createRect(topLeft: p5.Vector, bottomRight: p5.Vector): Rect;
export function createRect(
    arg1: number | p5.Vector,
    arg2: number | p5.Vector,
    arg3?: number,
    arg4?: number,
): Rect {
    let pos = new p5.Vector(), width = 0, height = 0;

    if (arg1 instanceof p5.Vector) {
        if (arg2 instanceof p5.Vector) {
            let [ pos, other ] = arg2.x < arg1.x
                && arg2.y < arg1.y
                && arg2.z < arg1.z
                ? [ arg2, arg1 ]
                : [ arg1, arg2 ];

            let distVec = p5.Vector.sub(pos, other);

            return {
                pos,
                width: distVec.x,
                height: distVec.y,
            };
        }

        return {
            pos: arg1,
            width: arg2,
            height: arg3,
        }
    }

    if (arg2 instanceof p5.Vector)
        throw "This code is unreachable";

    return {
        pos: new p5.Vector().set(arg1, arg2),
        width: arg3,
        height: arg4,
    }
}

