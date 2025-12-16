var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");
var PIECE_SYMBOLS = {
    white: {
        rook: "♖",
        knight: "♘",
        bishop: "♗",
        queen: "♕",
        king: "♔",
        pawn: "♙"
    },
    black: {
        rook: "♜",
        knight: "♞",
        bishop: "♝",
        queen: "♛",
        king: "♚",
        pawn: "♟"
    }
};
var CHESSCOM_THEME = {
    lightSquareColor: "#ebecd0",
    darkSquareColor: "#739552",
    highlightedLightColor: "#f5f580",
    highlightedDarkColor: "#b9ca42"
};
var CAPPUCCINO_THEME = {
    lightSquareColor: "#FFF4E6",
    darkSquareColor: "#4B3832",
    highlightedLightColor: "#f5f580",
    highlightedDarkColor: "#BE9B7B"
};
var MY_THEME = CHESSCOM_THEME;
//####################
// Classes
var Piece = /** @class */ (function () {
    function Piece(t, c) {
        this.type = t;
        this.color = c;
    }
    return Piece;
}());
var Pawn = /** @class */ (function (_super) {
    __extends(Pawn, _super);
    function Pawn() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Pawn.prototype.getLegalMoves = function (x, y, board) {
        var moves = [];
        var direction = this.color == "white" ? -1 : 1;
        var initalY = this.color == "white" ? 6 : 1;
        var forwardY = y + direction;
        ;
        if (forwardY >= 0 && forwardY <= 7 && !board[forwardY][x].piece) {
            moves.push([x, forwardY]);
            var doubleForwardY = y + direction * 2;
            if (y == initalY && doubleForwardY >= 0 && doubleForwardY <= 7 && !board[doubleForwardY][x].piece)
                moves.push([x, doubleForwardY]);
        }
        return (moves);
    };
    return Pawn;
}(Piece));
var Rook = /** @class */ (function (_super) {
    __extends(Rook, _super);
    function Rook() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rook.prototype.getLegalMoves = function (x, y, board) {
        var moves = [];
        var directions = [
            [0, -1],
            [1, 0],
            [0, 1],
            [-1, 0],
        ];
        for (var _i = 0, directions_1 = directions; _i < directions_1.length; _i++) {
            var _a = directions_1[_i], dx = _a[0], dy = _a[1];
            var cx = x + dx;
            var cy = y + dy;
            while (cx >= 0 && cx <= 7 && cy >= 0 && cy <= 7) {
                var sq = board[cy][cx];
                if (!sq.piece)
                    moves.push([cx, cy]);
                else if (sq.piece.color != this.color) {
                    moves.push([cx, cy]);
                    break;
                }
                else
                    break;
                cx += dx;
                cy += dy;
            }
        }
        return (moves);
    };
    return Rook;
}(Piece));
var Knight = /** @class */ (function (_super) {
    __extends(Knight, _super);
    function Knight() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Knight.prototype.getLegalMoves = function (x, y, board) {
        var moves = [];
        var directions = [
            [-1, -2],
            [1, -2],
            [2, -1],
            [2, 1],
            [1, 2],
            [-1, 2],
            [-2, 1],
            [-2, -1],
        ];
        for (var _i = 0, directions_2 = directions; _i < directions_2.length; _i++) {
            var _a = directions_2[_i], dx = _a[0], dy = _a[1];
            var cx = x + dx;
            var cy = y + dy;
            if (cx >= 0 && cx <= 7 && cy >= 0 && cy <= 7) {
                var sq = board[cy][cx];
                if (!sq.piece)
                    moves.push([cx, cy]);
                else if (sq.piece.color != this.color)
                    moves.push([cx, cy]);
            }
        }
        return (moves);
    };
    return Knight;
}(Piece));
var Bishop = /** @class */ (function (_super) {
    __extends(Bishop, _super);
    function Bishop() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Bishop.prototype.getLegalMoves = function (x, y, board) {
        var moves = [];
        var directions = [
            [-1, 1],
            [1, 1],
            [-1, -1],
            [1, -1],
        ];
        for (var _i = 0, directions_3 = directions; _i < directions_3.length; _i++) {
            var _a = directions_3[_i], dx = _a[0], dy = _a[1];
            var cx = x + dx;
            var cy = y + dy;
            while (cx >= 0 && cx <= 7 && cy >= 0 && cy <= 7) {
                var sq = board[cy][cx];
                if (!sq.piece)
                    moves.push([cx, cy]);
                else if (sq.piece.color != this.color) {
                    moves.push([cx, cy]);
                    break;
                }
                else
                    break;
                cx += dx;
                cy += dy;
            }
        }
        return (moves);
    };
    return Bishop;
}(Piece));
var Queen = /** @class */ (function (_super) {
    __extends(Queen, _super);
    function Queen() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Queen.prototype.getLegalMoves = function (x, y, board) {
        var moves = [];
        var directions = [
            [-1, 1],
            [1, 1],
            [-1, -1],
            [1, -1],
            [0, -1],
            [1, 0],
            [0, 1],
            [-1, 0],
        ];
        for (var _i = 0, directions_4 = directions; _i < directions_4.length; _i++) {
            var _a = directions_4[_i], dx = _a[0], dy = _a[1];
            var cx = x + dx;
            var cy = y + dy;
            while (cx >= 0 && cx <= 7 && cy >= 0 && cy <= 7) {
                var sq = board[cy][cx];
                if (!sq.piece)
                    moves.push([cx, cy]);
                else if (sq.piece.color != this.color) {
                    moves.push([cx, cy]);
                    break;
                }
                else
                    break;
                cx += dx;
                cy += dy;
            }
        }
        return (moves);
    };
    return Queen;
}(Piece));
var King = /** @class */ (function (_super) {
    __extends(King, _super);
    function King() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    King.prototype.getLegalMoves = function (x, y, board) {
        var moves = [];
        for (var dy = -1; dy <= 1; dy++) {
            for (var dx = -1; dx <= 1; dx++) {
                var cx = x + dx;
                var cy = y + dy;
                if (cx == x && cy == y)
                    continue;
                if (cx >= 0 && cx <= 7 && cy >= 0 && cy <= 7) {
                    var sq = board[cy][cx];
                    if (!sq.piece)
                        moves.push([cx, cy]);
                    else if (sq.piece.color != this.color)
                        moves.push([cx, cy]);
                }
            }
        }
        return (moves);
    };
    return King;
}(Piece));
var Square = /** @class */ (function () {
    function Square(p, c) {
        this.piece = p;
        this.color = c;
        this.highlighted = false;
    }
    return Square;
}());
var Board = /** @class */ (function () {
    function Board(s, t) {
        this.squares = [];
        this.squareSize = s;
        this.theme = t;
    }
    Board.prototype.initSquares = function () {
        for (var y_1 = 0; y_1 < 8; y_1++) {
            this.squares[y_1] = [];
            for (var x_1 = 0; x_1 < 8; x_1++) {
                var color = void 0;
                if ((x_1 + y_1) % 2 === 0)
                    color = "white";
                else
                    color = "black";
                this.squares[y_1][x_1] = new Square(null, color);
            }
        }
    };
    Board.prototype.drawSquares = function () {
        for (var y_2 = 0; y_2 < 8; y_2++) {
            for (var x_2 = 0; x_2 < 8; x_2++) {
                ctx === null || ctx === void 0 ? void 0 : ctx.save();
                ctx.fillStyle = this.squares[y_2][x_2].color == "white" ? this.theme.lightSquareColor : this.theme.darkSquareColor;
                ctx === null || ctx === void 0 ? void 0 : ctx.fillRect(x_2 * this.squareSize, y_2 * this.squareSize, this.squareSize, this.squareSize);
                if (this.squares[y_2][x_2].highlighted) {
                    ctx.fillStyle = this.squares[y_2][x_2].color == "white" ? this.theme.highlightedLightColor : this.theme.highlightedDarkColor;
                    ctx === null || ctx === void 0 ? void 0 : ctx.fillRect(x_2 * this.squareSize + 10, y_2 * this.squareSize + 10, this.squareSize - 20, this.squareSize - 20);
                }
                ctx === null || ctx === void 0 ? void 0 : ctx.restore();
            }
        }
    };
    Board.prototype.initPieces = function () {
        var backRowPieces = ["rook", "knight", "bishop", "queen", "king", "bishop", "knight", "rook"];
        for (var x_3 = 0; x_3 < 8; x_3++) {
            this.squares[1][x_3].piece = new Pawn("pawn", "black");
            this.squares[6][x_3].piece = new Pawn("pawn", "white");
        }
        for (var i = 0; i < 8; i++) {
            var type = backRowPieces[i];
            var whitePiece = void 0;
            var blackPiece = void 0;
            switch (type) {
                case "rook":
                    whitePiece = new Rook("rook", "white");
                    blackPiece = new Rook("rook", "black");
                    break;
                case "knight":
                    whitePiece = new Knight("knight", "white");
                    blackPiece = new Knight("knight", "black");
                    break;
                case "bishop":
                    whitePiece = new Bishop("bishop", "white");
                    blackPiece = new Bishop("bishop", "black");
                    break;
                case "queen":
                    whitePiece = new Queen("queen", "white");
                    blackPiece = new Queen("queen", "black");
                    break;
                case "king":
                    whitePiece = new King("king", "white");
                    blackPiece = new King("king", "black");
                    break;
                default: throw new Error("unknown piece");
            }
            this.squares[7][i].piece = whitePiece;
            this.squares[0][i].piece = blackPiece;
        }
    };
    Board.prototype.drawPieces = function () {
        ctx === null || ctx === void 0 ? void 0 : ctx.save();
        ctx.font = "".concat(this.squareSize, "px Arial");
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        for (var y_3 = 0; y_3 < 8; y_3++) {
            for (var x_4 = 0; x_4 < 8; x_4++) {
                if (this.squares[y_3][x_4].piece) {
                    var symbol = PIECE_SYMBOLS[this.squares[y_3][x_4].piece.color][this.squares[y_3][x_4].piece.type];
                    var centerX = x_4 * this.squareSize + this.squareSize / 2;
                    var centerY = y_3 * this.squareSize + this.squareSize / 2;
                    ctx === null || ctx === void 0 ? void 0 : ctx.fillText(symbol, centerX, centerY);
                }
            }
        }
        ctx === null || ctx === void 0 ? void 0 : ctx.restore();
    };
    return Board;
}());
//####################
var board = new Board(canvas.width / 8, MY_THEME);
//####################
// Events
var selectedPiece;
var x;
var y;
canvas.addEventListener("mousedown", function (event) {
    x = Math.floor(event.offsetX / board.squareSize);
    y = Math.floor(event.offsetY / board.squareSize);
    selectedPiece = board.squares[y][x].piece;
    if (!selectedPiece)
        return;
    board.squares[y][x].highlighted = true;
});
canvas.addEventListener("mouseup", function (event) {
    var mouseX = Math.floor(event.offsetX / board.squareSize);
    var mouseY = Math.floor(event.offsetY / board.squareSize);
    if (!selectedPiece)
        return;
    var moves = selectedPiece.getLegalMoves(x, y, board.squares);
    var isLegalMove = moves.some(function (_a) {
        var mx = _a[0], my = _a[1];
        return mx == mouseX && my == mouseY;
    });
    if (isLegalMove) {
        board.squares[mouseY][mouseX].piece = board.squares[y][x].piece;
        board.squares[y][x].piece = null;
    }
    board.squares[y][x].highlighted = false;
    selectedPiece = null;
});
//####################
function initGame() {
    board.initSquares();
    board.initPieces();
}
function gameLoop() {
    ctx === null || ctx === void 0 ? void 0 : ctx.clearRect(0, 0, canvas.width, canvas.height);
    board.drawSquares();
    board.drawPieces();
    requestAnimationFrame(gameLoop);
}
initGame();
gameLoop();
