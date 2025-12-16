const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");

//####################
// Classes
class Piece{
    type: string;
    color: "white" | "black";

    constructor(t: string, c: "white" | "black"){
        this.type = t;
        this.color = c
    }
}

class Square{
    piece: Piece | null;
    color: "white" | "black";

    constructor(p: Piece | null, c: "white" | "black"){
        this.piece = p;
        this.color = c;
    }
}

class Board{
    squares: Square[][] = [];
    squareSize: number;

    constructor(s: number){
        this.squareSize = s;
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

    drawSquares(){
        for(let y = 0; y < 8; y++){
            for (let x = 0; x < 8; x++){
                ctx?.save();
                ctx!.fillStyle = this.squares[y][x].color;
                ctx?.fillRect(x * this.squareSize + 2, y * this.squareSize + 2, this.squareSize, this.squareSize);
                ctx?.restore();
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

    drawPieces(){
        
    }
}
//####################

const board = new Board(32);

function gameLoop() {
    ctx?.clearRect(0, 0, canvas.width, canvas.height);

    board.initSquares();
    board.drawSquares();
    //requestAnimationFrame(gameLoop);
}


gameLoop();