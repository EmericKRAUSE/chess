const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");

const PIECE_SYMBOLS: Record<"white" | "black", Record<string, string>> = {
    white: {
        rook: "♖",
        knight: "♘",
        bishop: "♗",
        queen: "♕",
        king: "♔",
        pawn: "♙",
    },
    black: {
        rook: "♜",
        knight: "♞",
        bishop: "♝",
        queen: "♛",
        king: "♚",
        pawn: "♟",
    }
}

type Theme = {
    lightSquareColor:       string;
    darkSquareColor:        string;
    highlightedLightColor:  string;
    highlightedDarkColor:   string
}

const CHESSCOM_THEME: Theme = {
    lightSquareColor:       "#ebecd0",
    darkSquareColor:        "#739552",
    highlightedLightColor:  "#f5f580",
    highlightedDarkColor:   "#b9ca42",
}

const CAPPUCCINO_THEME: Theme = {
    lightSquareColor:       "#FFF4E6",
    darkSquareColor:        "#4B3832",
    highlightedLightColor:  "#f5f580",
    highlightedDarkColor:   "#BE9B7B",
}

const MY_THEME = CHESSCOM_THEME;

//####################
// Classes
abstract class Piece {
    type: string;
    color: "white" | "black";

    constructor(t: string, c: "white" | "black") {
        this.type = t;
        this.color = c
    }

    abstract getLegalMoves(x: number, y: number, board: Square[][]): [number, number][];
}

class Pawn extends Piece {
    getLegalMoves(x:number, y:number, board: Square[][]): [number, number][] {
        const   moves: [number, number][] = [];
        const   direction = this.color == "white" ? -1 : 1;
        const   initalY = this.color == "white" ? 6 : 1;
        const   forwardY = y + direction;;

        if (forwardY >= 0 && forwardY <= 7 && !board[forwardY][x].piece) {
            moves.push([x, forwardY]);
            const doubleForwardY = y + direction * 2;
            if (y == initalY && doubleForwardY >= 0 && doubleForwardY <= 7 && !board[doubleForwardY][x].piece)
                moves.push([x, doubleForwardY]);
        }
        return (moves);
    }
}

class Rook extends Piece {
    getLegalMoves(x: number, y: number, board: Square[][]): [number, number][] {
        const moves: [number, number][] = [];
        const   directions = [
            [ 0, -1],
            [ 1,  0],
            [ 0,  1],
            [-1,  0],
        ];

        for (const [dx, dy] of directions) {
            let cx = x + dx;
            let cy = y + dy;

            while (cx >= 0 && cx <= 7 && cy >= 0 && cy <= 7) {
                const sq = board[cy][cx];
                if (!sq.piece)
                    moves.push([cx, cy]);
                else if (sq.piece.color != this.color) {
                    moves.push([cx, cy]);
                    break ;
                }
                else
                    break ;
                cx += dx;
                cy += dy;
            }
        }
        return (moves);
    }
}

class Knight extends Piece {
    getLegalMoves(x:number, y:number, board: Square[][]): [number, number][] {
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
                const sq = board[cy][cx];
                if (!sq.piece)
                    moves.push([cx, cy]);
                else if (sq.piece.color != this.color)
                    moves.push([cx, cy]);
            }
        }
        return (moves);
    }
}

class Bishop extends Piece {
    getLegalMoves(x:number, y:number, board: Square[][]): [number, number][] {
        const   moves: [number, number][] = [];
        const   directions = [
            [-1,  1],
            [ 1,  1],
            [-1, -1],
            [ 1, -1],
        ];

        for (const [dx, dy] of directions) {
            let cx = x + dx;
            let cy = y + dy;

            while (cx >= 0 && cx <= 7 && cy >= 0 && cy <= 7) {
                const sq = board[cy][cx];
                if (!sq.piece)
                    moves.push([cx, cy]);
                else if (sq.piece.color != this.color) {
                    moves.push([cx, cy]);
                    break ;
                }
                else
                    break ;
                cx += dx;
                cy += dy;
            }
        }
        return (moves);
    }
}

class Queen extends Piece {
    getLegalMoves(x:number, y:number, board: Square[][]): [number, number][] {
        const   moves: [number, number][] = [];
        const   directions = [
            [-1,  1],
            [ 1,  1],
            [-1, -1],
            [ 1, -1],
            [ 0, -1],
            [ 1,  0],
            [ 0,  1],
            [-1,  0],
        ];

        for (const [dx, dy] of directions) {
            let cx = x + dx;
            let cy = y + dy;

            while (cx >= 0 && cx <= 7 && cy >= 0 && cy <= 7) {
                const sq = board[cy][cx];
                if (!sq.piece)
                    moves.push([cx, cy]);
                else if (sq.piece.color != this.color) {
                    moves.push([cx, cy]);
                    break ;
                }
                else
                    break ;
                cx += dx;
                cy += dy;
            }
        }
        return (moves);
    }
}

class King extends Piece {
    getLegalMoves(x:number, y:number, board: Square[][]): [number, number][] {
        const   moves: [number, number][] = [];

        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                const cx = x + dx;
                const cy = y + dy;
                if (cx == x && cy == y)
                    continue ;
                if (cx >= 0 && cx <= 7 && cy >= 0 && cy <= 7) {
                    const sq = board[cy][cx];
                    if (!sq.piece)
                        moves.push([cx, cy]);
                    else if (sq.piece.color != this.color)
                        moves.push([cx, cy]);
                }
            }
        }
        return (moves);
    }
}

class Square {
    piece:                 Piece | null;
    color:              "white" | "black";
    highlighted:        boolean;

    constructor(p: Piece | null, c: "white" | "black") {
        this.piece = p;
        this.color = c;
        this.highlighted = false;
    }
}

class Board {
    squares:            Square[][] = [];
    squareSize:         number;
    theme:              Theme;

    constructor(s: number, t: Theme) {
        this.squareSize = s;
        this.theme = t;
    }

    initSquares() {
        for (let y = 0; y < 8; y++) {
            this.squares[y] = [];
            for (let x = 0; x < 8; x++) {
                let color: "white" | "black";
                if ((x + y) % 2 === 0)
                    color = "white";
                else
                    color = "black";
                this.squares[y][x] = new Square(null, color);
            }
        }
    }

    drawSquares() {
        for(let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                ctx?.save();
                ctx!.fillStyle = this.squares[y][x].color == "white" ? this.theme.lightSquareColor : this.theme.darkSquareColor;
                ctx?.fillRect(x * this.squareSize, y * this.squareSize, this.squareSize, this.squareSize);
                if (this.squares[y][x].highlighted) {
                    ctx!.fillStyle = this.squares[y][x].color == "white" ? this.theme.highlightedLightColor : this.theme.highlightedDarkColor;
                    ctx?.fillRect(x * this.squareSize + 10, y * this.squareSize + 10, this.squareSize - 20, this.squareSize - 20);
                }
                ctx?.restore();
            }
        }
    }

    initPieces() {
        const backRowPieces = ["rook", "knight", "bishop", "queen", "king", "bishop", "knight", "rook"];

        for(let x = 0; x < 8; x++) {
            this.squares[1][x].piece = new Pawn("pawn", "black");
            this.squares[6][x].piece = new Pawn("pawn", "white");
        }
        for (let i = 0; i < 8; i++) {
            const   type = backRowPieces[i];
            let     whitePiece;
            let     blackPiece;

            switch (type) {
                case "rook":
                    whitePiece = new Rook("rook", "white");
                    blackPiece = new Rook("rook", "black");
                    break ;
                case "knight":
                    whitePiece = new Knight("knight", "white");
                    blackPiece = new Knight("knight", "black");
                    break ;
                case "bishop":
                    whitePiece = new Bishop("bishop", "white");
                    blackPiece = new Bishop("bishop", "black");
                    break ;
                case "queen":
                    whitePiece = new Queen("queen", "white");
                    blackPiece = new Queen("queen", "black");
                    break ;
                case "king":
                    whitePiece = new King("king", "white");
                    blackPiece = new King("king", "black");
                    break ;
                default: throw new Error("unknown piece");
            }
            this.squares[7][i].piece = whitePiece;
            this.squares[0][i].piece = blackPiece;
        }
    }

    drawPieces() {
        ctx?.save();
        ctx!.font = `${this.squareSize}px Arial`;
        ctx!.textAlign = "center";
        ctx!.textBaseline = "middle";

        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                if (this.squares[y][x].piece) {
                    const symbol = PIECE_SYMBOLS[this.squares[y][x].piece!.color][this.squares[y][x].piece!.type];
                    const centerX = x * this.squareSize + this.squareSize / 2;
                    const centerY = y * this.squareSize + this.squareSize / 2;
                    ctx?.fillText(symbol, centerX, centerY);
                }
            }
        }
        ctx?.restore();
    }
}
//####################

const board = new Board(canvas.width / 8, MY_THEME);

//####################
// Events
let selectedPiece: Piece | null;
let x: number;
let y: number;

canvas.addEventListener("mousedown", (event) => {
    x = Math.floor(event.offsetX / board.squareSize);
    y = Math.floor(event.offsetY / board.squareSize);

    selectedPiece = board.squares[y][x].piece;
    if (!selectedPiece)
        return ;
    board.squares[y][x].highlighted = true;
})

canvas.addEventListener("mouseup", (event) => {
    const mouseX = Math.floor(event.offsetX / board.squareSize);
    const mouseY = Math.floor(event.offsetY / board.squareSize);

    if (!selectedPiece)
        return ;
    const moves = selectedPiece.getLegalMoves(x, y, board.squares);
    const isLegalMove = moves.some(([mx, my]) => mx == mouseX && my == mouseY);
    if (isLegalMove) {
        board.squares[mouseY][mouseX].piece = board.squares[y][x].piece;
        board.squares[y][x].piece = null;
    }
    board.squares[y][x].highlighted = false;
    selectedPiece = null;
})
//####################

function initGame() {
    board.initSquares();
    board.initPieces();
}

function gameLoop() {
    ctx?.clearRect(0, 0, canvas.width, canvas.height);

    board.drawSquares();
    board.drawPieces();
    requestAnimationFrame(gameLoop);
}

initGame();
gameLoop();