import { PieceType, PieceColor } from "./type";
import { Board } from "./Board.js";
import { Player } from "./Player.js";

export abstract class Piece {
    type:   PieceType;
    color:  PieceColor;

    constructor(t: PieceType, c: PieceColor) {
        this.type = t;
        this.color = c
    }

    abstract getPseudoLegalMoves(x: number, y: number, board: Board): [number, number][];
    abstract getLegalMoves(x: number, y: number, board: Board, player: Player): [number, number][];

    abstract clone() : Piece;
}