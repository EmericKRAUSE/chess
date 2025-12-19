import { Board } from "./Board.js";
import { Player } from "./Player.js";
import { Game } from "./Game.js";
import { Piece } from "./Piece.js";

const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");

//####################
// Classes
//####################

const board = new Board(canvas.width / 8);
const player1 = new Player("white");
const player2 = new Player("black");
const game = new Game(player1, player2, board);

//####################
// Events
let selectedPiece: Piece | null;
let x: number;
let y: number;

function enableHighlighting(moves: [number, number][]) {
    for (const [dx, dy] of moves) {
        board.squares[dy][dx].highlighted = "move";
    }
}

function disableHighlighting(moves: [number, number][]) {
    for (const [dx, dy] of moves) {
        board.squares[dy][dx].highlighted = "none";
    }
}

canvas.addEventListener("mousedown", (event) => {
    x = Math.floor(event.offsetX / board.squareSize);
    y = Math.floor(event.offsetY / board.squareSize);

    selectedPiece = board.squares[y][x].piece;
    if (!selectedPiece)
        return ;

    board.squares[y][x].highlighted = "selected";

    if (game.players[game.currentPlayer].color == selectedPiece.color) {
        const moves = selectedPiece.getLegalMoves(x, y, board, game.players[game.currentPlayer]);
        enableHighlighting(moves);
    }
})

// canvas.addEventListener("mousemove", (event) => {
//     if (!selectedPiece)
//         return ;

//     board.squares[y][x].piece
// })

canvas.addEventListener("mouseup", (event) => {
    const mouseX = Math.floor(event.offsetX / board.squareSize);
    const mouseY = Math.floor(event.offsetY / board.squareSize);

    if (!selectedPiece)
        return ;
    
    const moves = selectedPiece.getLegalMoves(x, y, board, game.players[game.currentPlayer]);
    board.squares[y][x].highlighted = "none";
    disableHighlighting(moves);

    if (game.players[game.currentPlayer].color != selectedPiece.color) {
        selectedPiece = null;
        return ;
    }

    const isLegalMove = moves.some(([mx, my]) => mx == mouseX && my == mouseY);
    if (isLegalMove) {
        board.squares[mouseY][mouseX].piece = board.squares[y][x].piece;
        board.squares[y][x].piece = null;
        game.nextTurn();
        game.updateGameStatus();
    }
    selectedPiece = null;
})
//####################

function initGame() {
    board.initSquares();
    board.initPieces();
}

function gameLoop() {
    if (!ctx) return;

    ctx?.clearRect(0, 0, canvas.width, canvas.height);
    game.board.drawSquares(ctx);
    game.board.drawPieces(ctx);

    if (game.gameStatus != "playing") {
        console.log(game.gameStatus);
    }
    
    requestAnimationFrame(gameLoop);
}

initGame();
gameLoop();