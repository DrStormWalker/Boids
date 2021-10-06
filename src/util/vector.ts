// export default class Vector {
//     components: number[];
//     _size: number;
//
//     constructor(...components: number[]) {
//         this.components = components;
//         this._size = components.length;
//     }
//
//     public static array(components: number[]) {
//         let vec = new Vector();
//         vec.components = components;
//         vec._size = components.length;
//         return vec;
//     }
//     public static zeros(size: number) {
//         return Vector.array(new Array(size).fill(0));
//     }
//
//     get size() { return this._size; }
//
//     get x() { return this.components[0]; }
//     get y() { return this.components[1]; }
//     get z() { return this.components[2]; }
//     get w() { return this.components[3]; }
//
//     set x(value: number) { this.components[0] = value; }
//     set y(value: number) { this.components[1] = value; }
//     set z(value: number) { this.components[2] = value; }
//     set w(value: number) { this.components[3] = value; }
//
//     get magnitude() {
//         let result = 0
//
//         for (let i = 0; i < this.size; i++) {
//             result += this.at(i)*this.at(i);
//         }
//         return Math.sqrt(result);
//     }
//
//     at(i: number) {
//         return this.components[i];
//     }
//
//     set(i: number, value: number) {
//         this.components[i] = value;
//     }
//
//     add(other: Vector) {
//         if (other.size != this.size)
//             throw `Mismatched vector sizes ${this.size} and ${other.size}`;
//
//         let result = Vector.zeros(this.size);
//
//         for (let i = 0; i < this.size; i++) {
//             result.set(i, this.at(i) + other.at(i));
//         }
//
//         return result
//     }
//
//     sub(other: Vector) {
//         if (other.size != this.size)
//             throw "Mismatched vector sizes";
//
//         let result = Vector.zeros(this.size);
//
//         for (let i = 0; i < this.size; i++) {
//             result.set(i, this.at(i) - other.at(i));
//         }
//
//         return result
//     }
//
//     mulScalar(scalar: number) {
//         let result = Vector.zeros(this.size);
//
//         for (let i = 0; i < this.size; i++) {
//             result.set(i, this.at(i) * scalar);
//         }
//
//         return result
//     }
//
//     divScalar(scalar: number) {
//         let result = Vector.zeros(this.size);
//
//         for (let i = 0; i < this.size; i++) {
//             result.set(i, this.at(i) / scalar);
//         }
//
//         return result
//     }
// }
