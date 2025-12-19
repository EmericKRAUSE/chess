import { GameStatus } from "./type.js";
import { Board } from "./Board.js";
import { Player } from "./Player";

export class Game {
    players:        [Player, Player];
    board:          Board;
    currentPlayer:  0 | 1;
    gameStatus:     GameStatus;

    constructor(p1: Player, p2: Player, b: Board) {
        this.players = [p1, p2];
        this.board = b;
        this.currentPlayer = 0;
        this.gameStatus = "playing";
    }

    nextTurn() {
        this.currentPlayer = this.currentPlayer === 0 ? 1 : 0;
    }

    updateGameStatus() {
        const currentPlayer = this.players[this.currentPlayer];
        if (!this.board.hasAnyLegalMoves(currentPlayer)) {
            this.gameStatus = "checkmate";
        }
    }
}