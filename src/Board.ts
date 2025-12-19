import { Player } from "./Player.js";
import { Square } from "./Square.js";
import { CURRENT_THEME } from "./theme.js";
import { CURRENT_THEME_IMAGES } from "./theme.js";
import { PieceColor, PieceType } from "./type.js";
import { Rook } from "./Rook.js";
import { Knight } from "./Knight.js";
import { Bishop } from "./Bishop.js";
import { Queen } from "./Queen.js";
import { King } from "./King.js";
import { Pawn } from "./Pawn.js";

export class Board {
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

    drawSquares(ctx: CanvasRenderingContext2D) {
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

    drawPieces(ctx: CanvasRenderingContext2D) {
        ctx?.save();
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                if (this.squares[y][x].piece) {
                    const   pieceColor: PieceColor = this.squares[y][x].piece!.color;
                    const   pieceType: PieceType = this.squares[y][x].piece!.type;
                    const   img = CURRENT_THEME_IMAGES[pieceColor][pieceType as PieceType];
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
                    const canAttackKing = moves.some(([mx, my]) => kingPos && mx == kingPos[0] && my == kingPos[1]);
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