import { Piece } from "./Piece.js";
import { Board } from "./Board.js";
import { Player } from "./Player";

export class Knight extends Piece {
    getPseudoLegalMoves(x:number, y:number, board: Board): [number, number][] {
        const   moves: [number, number][] = [];
        const   directions = [
            [-1, -2],
            [ 1, -2],
            [ 2, -1],
            [ 2,  1],
            [ 1,  2],
            [-1,  2],
            [-2,  1],
            [-2, -1],
        ];

        for (const [dx, dy] of directions) {
            let cx = x + dx;
            let cy = y + dy;

            if (cx >= 0 && cx <= 7 && cy >= 0 && cy <= 7) {
                const sq = board.squares[cy][cx];
                if (!sq.piece)
                    moves.push([cx, cy]);
                else if (sq.piece.color != this.color)
                    moves.push([cx, cy]);
            }
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
        return (new Knight(this.type, this.color));
    }
}