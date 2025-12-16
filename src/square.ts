import { Piece } from "./piece"

class Square{
    piece: Piece | null;
    color: "white" | "black";

    constructor(p: Piece | null, c: "white" | "black"){
        this.piece = p;
        this.color = c;
    }
}

export { Square }