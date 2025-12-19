import { Piece } from "./Piece.js";
import { Board } from "./Board.js";
import { Player } from "./Player";

export class Pawn extends Piece {
    getPseudoLegalMoves(x:number, y:number, board: Board): [number, number][] {
        const   moves: [number, number][] = [];
        const   direction = this.color == "white" ? -1 : 1;
        const   initalY = this.color == "white" ? 6 : 1;
        const   forwardY = y + direction;

        for (const dx of [-1, 1]) {
            const cx = x + dx;
            if (forwardY >= 0 && forwardY <= 7 && cx >= 0 && cx <= 7 && board.squares[forwardY][cx].piece && board.squares[forwardY][cx].piece?.color != this.color)
                moves.push([cx, forwardY]);
        }

        if (forwardY >= 0 && forwardY <= 7 && !board.squares[forwardY][x].piece) {
            moves.push([x, forwardY]);
            const doubleForwardY = y + direction * 2;
            if (y == initalY && doubleForwardY >= 0 && doubleForwardY <= 7 && !board.squares[doubleForwardY][x].piece)
                moves.push([x, doubleForwardY]);
        }
        return (moves);
    }

    getLegalMoves(x: number, y: number, board: Board, player: Player): [number, number][] {
        const moves = this.getPseudoLegalMoves(x, y, board);
        const legalMoves: [number, number][] = [];
        
        for (const [mx, my] of moves) {
            if (board.isLegalMove(player, x, y, mx, my))
                legalMoves.push([mx, my]);
        }
        return (legalMoves);
    }

    clone (): Piece {
        return (new Pawn(this.type, this.color));
    }
}