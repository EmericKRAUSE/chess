var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");
//####################
// Classes
var Piece = /** @class */ (function () {
    function Piece(t, c) {
        this.type = t;
        this.color = c;
    }
    return Piece;
}());
var Square = /** @class */ (function () {
    function Square(p, c) {
        this.piece = p;
        this.color = c;
    }
    return Square;
}());
var Board = /** @class */ (function () {
    function Board(s) {
        this.squares = [];
        this.squareSize = s;
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
                this.squares[y][x] = new Square(null, color);
            }
        }
    };
    Board.prototype.drawSquares = function () {
        for (var y = 0; y < 8; y++) {
            for (var x = 0; x < 8; x++) {
                ctx === null || ctx === void 0 ? void 0 : ctx.save();
                ctx.fillStyle = this.squares[y][x].color;
                ctx === null || ctx === void 0 ? void 0 : ctx.fillRect(x * this.squareSize + 2, y * this.squareSize + 2, this.squareSize, this.squareSize);
                ctx === null || ctx === void 0 ? void 0 : ctx.restore();
            }
        }
    };
    return Board;
}());
//####################
var board = new Board(32);
function gameLoop() {
    ctx === null || ctx === void 0 ? void 0 : ctx.clearRect(0, 0, canvas.width, canvas.height);
    board.initSquares();
    board.drawSquares();
    //requestAnimationFrame(gameLoop);
}
gameLoop();
