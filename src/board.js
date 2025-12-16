"use strict";
exports.__esModule = true;
exports.Board = void 0;
var square_js_1 = require("./square.js");
var piece_js_1 = require("./piece.js");
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
var Board = /** @class */ (function () {
    function Board(s, lsc, dsc) {
        this.squares = [];
        this.squareSize = s;
        this.lightSquareColor = lsc;
        this.darkSquareColor = dsc;
    }
    Board.prototype.initSquares = function () {
        for (var y = 0; y < 8; y++) {
            this.squares[y] = [];
            for (var x = 0; x < 8; x++) {
                var color = void 0;
                if ((x + y) % 2 === 0)
                    color = "white";
                else
                    color = "black";
                this.squares[y][x] = new square_js_1.Square(null, color);
            }
        }
    };
    Board.prototype.drawSquares = function (ctx) {
        for (var y = 0; y < 8; y++) {
            for (var x = 0; x < 8; x++) {
                ctx.save();
                ctx.fillStyle = this.squares[y][x].color == "white" ? this.lightSquareColor : this.darkSquareColor;
                ctx.fillRect(x * this.squareSize, y * this.squareSize, this.squareSize, this.squareSize);
                ctx.restore();
            }
        }
    };
    Board.prototype.initPieces = function () {
        var backRowPieces = ["rook", "knight", "bishop", "queen", "king", "bishop", "knight", "rook"];
        for (var x = 0; x < 8; x++) {
            this.squares[0][x].piece = new piece_js_1.Piece(backRowPieces[x], "black");
            this.squares[1][x].piece = new piece_js_1.Piece("pawn", "black");
            this.squares[7][x].piece = new piece_js_1.Piece(backRowPieces[x], "white");
            this.squares[6][x].piece = new piece_js_1.Piece("pawn", "white");
        }
    };
    Board.prototype.drawPieces = function (ctx) {
        ctx.save();
        ctx.font = "".concat(this.squareSize, "px Arial");
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        for (var y = 0; y < 8; y++) {
            for (var x = 0; x < 8; x++) {
                if (this.squares[y][x].piece) {
                    var symbol = PIECE_SYMBOLS[this.squares[y][x].piece.color][this.squares[y][x].piece.type];
                    var centerX = x * this.squareSize + this.squareSize / 2;
                    var centerY = y * this.squareSize + this.squareSize / 2;
                    ctx.fillText(symbol, centerX, centerY);
                }
            }
        }
        ctx.restore();
    };
    return Board;
}());
exports.Board = Board;
