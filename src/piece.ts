class Piece{
    type: string;
    color: "white" | "black";

    constructor(t: string, c: "white" | "black"){
        this.type = t;
        this.color = c
    }
}

export { Piece }