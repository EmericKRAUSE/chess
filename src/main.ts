const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");

type PieceType = "pawn" | "rook" | "knight" | "bishop" | "queen" | "king";
type PieceColor = "white" | "black";
type ThemeName = "chesscom" | "neon";
type GameStatus = "playing" | "checkmate" | "draw" | "stalemate"; 

type ThemeConfig = {
    lightSquareColor:       string;
    darkSquareColor:        string;
    selectedLightColor:     string;
    selectedDarkColor:      string
    piecesThemePath:        string;
}

const THEMES: Record<ThemeName, ThemeConfig> = {
    chesscom: {
        lightSquareColor:       "#ebecd0",
        darkSquareColor:        "#739552",
        selectedLightColor:     "#f5f580",
        selectedDarkColor:      "#b9ca42",
        piecesThemePath:        "assets/pieces/chesscom"
    },
    neon: {
        lightSquareColor:       "#282828",
        darkSquareColor:        "#1C1C1C",
        selectedLightColor:     "#f5f580",
        selectedDarkColor:      "#b9ca42",
        piecesThemePath:        "assets/pieces/neon"
    }
}

function loadTheme(themeName: ThemeName) {
    const   theme: ThemeConfig = THEMES[themeName];
    const   pieces: PieceType[] = ["pawn", "rook", "knight", "bishop", "queen", "king"];
    const   colors: ("white" | "black")[] = ["white", "black"];
    const   images: Record<"white" | "black", Record<PieceType, HTMLImageElement>> = {
        white: {} as Record<PieceType, HTMLImageElement>,
        black: {} as Record<PieceType, HTMLImageElement>,
    }
    for (const color of colors) {
        for (const piece of pieces) {
            const img = Object.assign(new Image(), { src : `${theme.piecesThemePath}/${color}/${piece}.png`});
            images[color][piece] = img;
        }
    }
    return images;
}

const   CURRENT_THEME_NAME: ThemeName = "chesscom";
const   CURRENT_THEME: ThemeConfig = THEMES[CURRENT_THEME_NAME];
const   CURRENT_THEME_IMAGES = loadTheme(CURRENT_THEME_NAME);

//####################
// Classes
abstract class Piece {
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

class Pawn extends Piece {
    getPseudoLegalMoves(x:number, y:number, board: Board): [number, number][] {
        const   moves: [number, number][] = [];
        const   direction = this.color == "white" ? -1 : 1;
        const   initalY = this.color == "white" ? 6 : 1;
        const   forwardY = y + direction;

        for (const dx of [-1, 1]) {
            const cx = x + dx;
            if (forwardY >= 0 && forwardY <= 7 && cx >= 0 && cx <= 7 && board.squares[forwardY][cx].piece && board.squares[forwardY][cx].piece.color != this.color)
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

class Rook extends Piece {
    getPseudoLegalMoves(x: number, y: number, board: Board): [number, number][] {
        const   moves: [number, number][] = [];
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
                const sq = board.squares[cy][cx];
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
        return (new Rook(this.type, this.color));
    }
}

class Knight extends Piece {
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

class Bishop extends Piece {
    getPseudoLegalMoves(x:number, y:number, board: Board): [number, number][] {
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
                const sq = board.squares[cy][cx];
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
        return (new Bishop(this.type, this.color));
    }
}

class Queen extends Piece {
    getPseudoLegalMoves(x:number, y:number, board: Board): [number, number][] {
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
                const sq = board.squares[cy][cx];
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
        return (new Queen(this.type, this.color));
    }
}

class King extends Piece {
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

class Square {
    piece:          Piece | null;
    color:          "white" | "black";
    highlighted:    "none" | "selected" | "move" | "capture";

    constructor(p: Piece | null, c: "white" | "black") {
        this.piece = p;
        this.color = c;
        this.highlighted = "none";
    }

    clone(): Square {
        const clone = new Square(this.piece ? this.piece.clone() : null, this.color);
        clone.highlighted = this.highlighted;
        return (clone);
    }
}

class Board {
    squares:    Square[][] = [];
    squareSize: number;

    constructor(s: number) {
        this.squareSize = s;
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
                const key = this.squares[y][x].highlighted;
                const posX = x * this.squareSize;
                const posY = y * this.squareSize;
                
                ctx?.save();
                ctx!.fillStyle = this.squares[y][x].color == "white" ? CURRENT_THEME.lightSquareColor : CURRENT_THEME.darkSquareColor;
                ctx?.fillRect(posX, posY, this.squareSize, this.squareSize);

                switch (key) {
                    case "selected":
                        ctx!.fillStyle = this.squares[y][x].color == "white" ? CURRENT_THEME.selectedLightColor : CURRENT_THEME.selectedDarkColor;
                        ctx?.fillRect(posX, posY, this.squareSize, this.squareSize);
                        break;
                    case "move":
                        ctx!.fillStyle = "rgba(0, 0, 0, 0.15)";
                        ctx?.beginPath();
                        ctx?.arc(posX + this.squareSize / 2, posY + this.squareSize / 2, this.squareSize * 0.2, 0, Math.PI * 2);
                        ctx?.fill();
                        break;
                    default:
                        break;
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
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                if (this.squares[y][x].piece) {
                    const   pieceColor: PieceColor = this.squares[y][x].piece!.color;
                    const   pieceType: PieceType = this.squares[y][x].piece!.type;
                    const   img = CURRENT_THEME_IMAGES[pieceColor][pieceType];
                    const   posX = x * this.squareSize;
                    const   posY = y * this.squareSize;
                    ctx?.drawImage(img, posX, posY, this.squareSize, this.squareSize);
                }
            }
        }
        ctx?.restore();
    }

    isPlayerInCheck(player: Player): boolean {
        let kingPos: [number, number] | null = null;
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                if (this.squares[y][x].piece?.type == "king" && this.squares[y][x].piece?.color == player.color) {
                    kingPos = [x, y];
                    break ;
                }
            }
        }
        if (!kingPos)
            return (false);
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                if (this.squares[y][x].piece && this.squares[y][x].piece?.color != player.color) {
                    const moves = this.squares[y][x].piece?.getPseudoLegalMoves(x, y, this);
                    if (!moves)
                        return (false);
                    const canAttackKing = moves.some(([mx, my]) => mx == kingPos[0] && my == kingPos[1]);
                    if (canAttackKing)
                        return (true);
                }
            }
        }
        return (false);
    }

    clone(): Board {
        const clone = new Board(this.squareSize);

        for (let y = 0; y < 8; y++) {
            clone.squares[y] = [];
            for (let x = 0; x < 8; x++) {
                clone.squares[y][x] = this.squares[y][x].clone();
            }
        }
        return (clone);
    }

    isLegalMove(player: Player, fromX: number, fromY: number, toX: number, toY: number): boolean {
        let testBoard = this.clone();

        testBoard.squares[toY][toX].piece = testBoard.squares[fromY][fromX].piece;
        testBoard.squares[fromY][fromX].piece = null;
        return (!testBoard.isPlayerInCheck(player));
    }

    hasAnyLegalMoves(player: Player): boolean {
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                const piece = this.squares[y][x].piece;
                if (piece && piece.color == player.color) {
                    const moves = this.squares[y][x].piece?.getLegalMoves(x, y, this, player);
                    if (moves?.length && moves.length > 0)
                        return (true);
                }
            }
        }
        return (false);
    }
}

class Player {
    color:      "white" | "black";
    isInCheck:  boolean;

    constructor(c: "white" | "black") {
        this.color = c;
        this.isInCheck = false;
    }
}

class Game {
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
    ctx?.clearRect(0, 0, canvas.width, canvas.height);

    game.board.drawSquares();
    game.board.drawPieces();

    if (game.gameStatus != "playing") {
        console.log(game.gameStatus);
    }
    requestAnimationFrame(gameLoop);
}

initGame();
gameLoop();