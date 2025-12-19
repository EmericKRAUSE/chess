import { Piece } from "./Piece.js";
import { Board } from "./Board.js";
import { Player } from "./Player";

export class King extends Piece {
    getPseudoLegalMoves(x:number, y:number, board: Board): [number, number][] {
        const   moves: [number, number][] = [];

        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                const cx = x + dx;
                const cy = y + dy;
                if (cx == x && cy == y)
                    continue ;
                if (cx >= 0 && cx <= 7 && cy >= 0 && cy <= 7) {
                    const sq = board.squares[cy][cx];
                    if (!sq.piece)
                        moves.push([cx, cy]);
                    else if (sq.piece.color != this.color)
                        moves.push([cx, cy]);
                }
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
        return (new King(this.type, this.color));
    }
}