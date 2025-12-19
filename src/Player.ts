export class Player {
    color:      "white" | "black";
    isInCheck:  boolean;

    constructor(c: "white" | "black") {
        this.color = c;
        this.isInCheck = false;
    }
}