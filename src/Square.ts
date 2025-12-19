import { Piece } from "./Piece.js";

export class Square {
    piece:          Piece | null;
    color:          "white" | "black";
    highlighted:    "none" | "selected" | "move" | "capture";

    constructor(p: Piece | null, c: "white" | "black") {
        this.piece = p;
        this.color = c;
        this.highlighted = "none";
    }

    clone(): Square {
        const clone = new Square(this.piece ? this.piece.clone() : null, this.color);
        clone.highlighted = this.highlighted;
        return (clone);
    }
}