import { Square } from "./square";
import { Piece } from "./piece";

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

class Board{
    squares:            Square[][] = [];
    squareSize:         number;
    lightSquareColor:   string;
    darkSquareColor:    string;

    constructor(s: number, lsc: string, dsc: string){
        this.squareSize = s;
        this.lightSquareColor = lsc;
        this.darkSquareColor = dsc;
    }

    initSquares(){
        for (let y = 0; y < 8; y++){
            this.squares[y] = [];
            for (let x = 0; x < 8; x++){
                let color: "white" | "black";
                if ((x + y) % 2 === 0)
                    color = "white";
                else
                    color = "black";
                this.squares[y][x] = new Square(null, color);
            }
        }
    }

    drawSquares(ctx: CanvasRenderingContext2D){
        for(let y = 0; y < 8; y++){
            for (let x = 0; x < 8; x++){
                ctx.save();
                ctx.fillStyle = this.squares[y][x].color == "white" ? this.lightSquareColor : this.darkSquareColor;
                ctx.fillRect(x * this.squareSize, y * this.squareSize, this.squareSize, this.squareSize);
                ctx.restore();
            }
        }
    }

    initPieces(){
        const backRowPieces = ["rook", "knight", "bishop", "queen", "king", "bishop", "knight", "rook"]
        for(let x = 0; x < 8; x++){
            this.squares[0][x].piece = new Piece(backRowPieces[x], "black");
            this.squares[1][x].piece = new Piece("pawn", "black");
            this.squares[7][x].piece = new Piece(backRowPieces[x], "white");
            this.squares[6][x].piece = new Piece("pawn", "white");
        }
    }

    drawPieces(ctx: CanvasRenderingContext2D){
        ctx.save();
        ctx.font = `${this.squareSize}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        for (let y = 0; y < 8; y++){
            for (let x = 0; x < 8; x++){
                if (this.squares[y][x].piece)
                {
                    const symbol = PIECE_SYMBOLS[this.squares[y][x].piece!.color][this.squares[y][x].piece!.type];
                    const centerX = x * this.squareSize + this.squareSize / 2;
                    const centerY = y * this.squareSize + this.squareSize / 2;
                    ctx.fillText(symbol, centerX, centerY);
                }
            }
        }
        ctx.restore();
    }
}

export { Board }