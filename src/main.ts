const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");

const keys = {
    w: false,
    a: false,
    s: false,
    d: false,
};

//####################
// Classes
class Player
{
    x:      number;
    y:      number;
    dx:     number;
    dy:     number;
    width:  number;
    height: number;
    speed:  number;

    constructor(x: number, y: number, width: number, height: number, speed: number) {
        this.x = x;
        this.y = y;
        this.dx = 0;
        this.dy = 0;
        this.width = width;
        this.height = height;
        this.speed = speed;
    }

    draw() {
        ctx?.save();
        ctx!.fillStyle = "white";
        ctx?.fillRect(this.x, this.y, this.width, this.height);
        ctx?.restore();
    }

    update() {
        let tempDx = 0;
        let tempDy = 0;

        if (keys.w)
            tempDy -= this.speed;
        if (keys.a)
            tempDx -= this.speed;
        if (keys.s)
            tempDy += this.speed;
        if (keys.d)
            tempDx += this.speed;

        this.dx = tempDx;
        this.dy = tempDy;

        this.x += this.dx;
        this.y += this.dy;

        if (this.x <= 0)
            this.x = 0;
        if (this.y <= 0)
            this.y = 0;
        if (this.x >= canvas.width - this.width)
            this.x = canvas.width - this.width;
        if (this.y >= canvas.height - this.height)
            this.y = canvas.height - this.height;
    }
}

// class Monster
// {
//     x:      number;
//     y:      number;
//     dx:     number;
//     dy:     number;
//     width:  number;
//     height: number;
//     speed:  number;

//     constructor(x: number, y: number, width: number, height: number, speed: number) {
//         this.x = x;
//         this.y = y;
//         this.dx = 0;
//         this.dy = 0;
//         this.width = width;
//         this.height = height;
//         this.speed = speed;
//     }

//     draw() {
//         ctx?.save();
//         ctx!.fillStyle = "red";
//         ctx?.fillRect(this.x, this.y, this.width, this.height);
//         ctx?.restore();
//     }

//     update(player: Player) {
//         let dx = player.x - this.x;
//         let dy = player.y - this.y;
//         let distance = Math.sqrt(dx*dx + dy*dy);
        
//         this.x += this.dx;
//         this.y += this.dy;
//         if (this.x <= 0)
//             this.x = 0;
//         if (this.y <= 0)
//             this.y = 0;
//         if (this.x >= canvas.width - this.width)
//             this.x = canvas.width - this.width;
//         if (this.y >= canvas.height - this.height)
//             this.y = canvas.height - this.height;
//     }
// }
//####################

const player = new Player(canvas.width / 2, canvas.height / 2, 50, 50, 10);
//const monster = new Monster(0, 0, 50, 50, 5);

document.addEventListener("keydown", (e) => {
    if (e.key in keys)
        keys[e.key as keyof typeof keys] = true;
})

document.addEventListener("keyup", (e) => {
    if (e.key in keys)
        keys[e.key as keyof typeof keys] = false;
})

function gameLoop() {
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
    player.update();
    player.draw();

    // monster.update();
    // monster.draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();