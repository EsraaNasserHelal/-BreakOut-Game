// select canavs elements

const cvs = document.getElementById("breakout");
const ctx = cvs.getContext("2d");
const BG_IMG = new Image();
const play = document.getElementById("play");
BG_IMG.src = "../../images/back.png";
BG_IMG.style.backgroundSize = "cover";
// BG_IMG.style.backgroundRepeat = "repeat";
cvs.style.border = "border: 0.2rem solid #fff";
cvs.style.boxShadow = "0 0 .2rem #fff,0 0 .2rem #fff,0 0 2rem #bc13fe,0 0 0.8rem #bc13fe,0 0 2.8rem #bc13fe,inset 0 0 1.3rem #bc13fe";
cvs.style.borderRadius = "2rem";

const LIFE_IMG = new Image();
LIFE_IMG.src = "../../images/life.jpg"
const pausebtn = document.getElementById("pause");

play.addEventListener("click", loop)
//make line thik when drawing to canvas
ctx.lineWidth = 3;
const game_over = document.getElementById("gameover");
const refresh = document.getElementById("restart");
const Pause = document.getElementById("pause");
const resume_btn = document.getElementById("resume");

//game variables
const PADDLE_WIDTH = 80;
const PADDLE_MARGIN_BOTTOM = 50;
const PADDLE_HEIGHT = 20;
let leftArrow = false;
let rightArrow = false;
const BALL_RADIUS = 15;
let LIFE = 3; //player has 3 lives
let LEVEL = 3;
const MAX_LEVEL = 3;
let GAME_OVER = false;
var crack = new Image();
crack.src = '../../images/crack_effect.png';
var scoreimg = new Image();
scoreimg.src = '../../images/score.png';
let SCORE = 0;
const SCORE_UNIT = 10;
var COLL_COUNT = 0;
var tempx;
var tempy;
var tempWidth;
var temphigtht;
var remveX = 0;
var PAUSED = false;
var STOPPED = true
let enter = true;


// sounds
const HITBRICK = new Audio();
HITBRICK.src = "../../sounds/hit.wav";

const CRACK = new Audio();
CRACK.src = "../../sounds/crack.wav";

const HITWALL = new Audio();
HITWALL.src = "../../sounds/wall.mp3";

const LOSELIVE = new Audio();
LOSELIVE.src = "../../sounds/lose live.wav";

const GAMEOVER = new Audio();
GAMEOVER.src = "../../sounds/GameOver.wav";

const HITPADDLE = new Audio();
HITPADDLE.src = "../../sounds/paddlehit2.mp3";

const WIN = new Audio();
WIN.src = "../../sounds/win.mp3";

const BG = new Audio();
BG.src = "../../sounds/start game.wav";
// BG.loop = true;
// BG.volume = 0.2
BG.play();





function stop() {
    if (typeof NEXT_ANIMATION_FRAME != "undefined") {
        clearTimeout(NEXT_ANIMATION_FRAME);
    }
    PAUSED = false;
    STOPPED = true;
    ctx.clearRect(0, 0, 850, 500);
    ctx.font = "25pt Helvetica";
    ctx.fillText("Game stopped!", 850 / 2, 500 / 2);
}
function pause() {
    if (STOPPED) {
        return;
    }
    if (PAUSED) {
        PAUSED = false;
        update();
    }
    else {
        PAUSED = true;
    }
}
pausebtn.addEventListener("click", pause);
//create the paddle
const paddle = {
    x: cvs.width / 2 - PADDLE_WIDTH / 2,
    y: cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    dx: 5,
};
// draw paddle
function drawPaddle() {
    ctx.fillStyle = "white";
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.strokeStyle = "rgb(225, 63, 233)";
    ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
}
//control the paddle
document.addEventListener("keydown", function (event) {
    if (event.keyCode == 37) {
        leftArrow = true;
    } else if (event.keyCode == 39) {
        rightArrow = true;
    }
});

document.addEventListener("keyup", function (event) {
    if (event.keyCode == 37) {
        leftArrow = false;
    } else if (event.keyCode == 39) {
        rightArrow = false;
    }

});
document.addEventListener("click", function (event) {
    if (!ball.isMoving) {
        moveBall();
        ball.isMoving = true;
    }

});

// Mouse and Keyboard Movement
function mouseMoveHandler(e) {
    var relativeX = e.clientX - cvs.offsetLeft;
    if (relativeX > 0 && relativeX < cvs.width) {
        var newPaddleX = relativeX - paddle.width / 2;

        if (newPaddleX >= 0 && newPaddleX + paddle.width <= cvs.width) {
            paddle.x = newPaddleX;
        }
    }
}
function keyDownHandler(e) {
    if (e.keyCode == 39 || e.keyCode == 68) {
        rightPressed = true;
    } else if (e.keyCode == 37 || e.keyCode == 65) {
        leftPressed = true;
    }
}
function keyUpHandler(e) {
    if (e.keyCode == 39 || e.keyCode == 68) {
        rightPressed = false;
    } else if (e.keyCode == 37 || e.keyCode == 65) {
        leftPressed = false;
    }
}
// function pauseKeyPress(e) {
//     if (e.keyCode == 27) {
//         paused = !paused;
//     }
// }

document.addEventListener("mousemove", mouseMoveHandler);
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);
// document.addEventListener("keyup", pauseKeyPress);





// move paddle

function movePaddle() {
    if (rightArrow && paddle.x + paddle.width < cvs.width) {
        paddle.x += paddle.dx;
    } else if (leftArrow && paddle.x > 0) {
        paddle.x -= paddle.dx;
    }
}
//create Ball
const ball = {
    x: cvs.width / 2,
    y: paddle.y - BALL_RADIUS,
    radius: BALL_RADIUS,
    speed: 7,
    dx: 3 * (Math.random() * 2 - 1),
    dy: -3,
    isMoving: false,

};
//draw the Ball
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
    // ctx.style.boxShadow="0 0 15px 5px #08f";

    // ctx.width="30";
    // ctx.strokeStyle="rgb(58, 5, 61)";
    // ctx.stroke();
    ctx.closePath();
}
//move the Ball
function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;
}
//ball and wall collision detection
function ballWallCollision() {
    if (ball.x + ball.radius > cvs.width || ball.x - ball.radius < 0) {
        ball.dx = -ball.dx;
        HITWALL.play();
    }
    if (ball.y - ball.radius < 0) {
        ball.dy = -ball.dy;
        HITWALL.play();
    }
    if (ball.y + ball.radius > cvs.height) {
        LIFE--;
        resetBall();
        LOSELIVE.play();
    }
}
//reset the ball
function resetBall() {
    ball.x = cvs.width / 2;
    ball.y = paddle.y - BALL_RADIUS;
    ball.dx = 3 * (Math.random() * 2 - 1);
    ball.dy = -3;
    ball.isMoving = "false";

}
//ball and paddle collision
function ballPaddleCollision() {


    if (
        ball.x < paddle.x + paddle.width &&
        ball.x > paddle.x &&
        paddle.y < paddle.y + paddle.height &&
        ball.y > paddle.y
    ) {
        HITPADDLE.play();
        //check where the ball hit the paddle
        let collidePoint = ball.x - (paddle.x + paddle.width / 2);
        //normalize the value
        collidePoint = collidePoint / (paddle.width / 2);
        //calculate the angle of the ball
        let angle = (collidePoint * Math.PI) / 3;
        ball.dx = ball.speed * Math.sin(angle);
        ball.dy = -ball.speed * Math.cos(angle);
    }
}
//moveBallOnPaddle________
function moveBallOnPaddle() {
    ball.x = paddle.x + ball.radius + (paddle.width / 2);
    ball.y = paddle.y - ball.radius;
    ballMoveAnimation_paddle = requestAnimationFrame(moveBallOnPaddle);
}
const brick = {
    row: 7,
    column: 11,
    halfcol: 4,
    width: 55,
    height: 20,
    offSetLeft: 20,
    offSetTop: 20,
    marginTop: 20,
    fillColor1: "white",
    fillColor2: "aqua",
    strokeColor: "#bc13fe"

}

let bricks = [];

function createBricks() {
    for (let r = 0; r < brick.row; r++) {
        bricks[r] = [];
        for (let c = 0; c < brick.column; c++) {
            bricks[r][c] = {
                x: c * (brick.offSetLeft + brick.width) + brick.offSetLeft,
                y: r * (brick.offSetTop + brick.height) + brick.offSetTop + brick.marginTop,
                status: true,
            }
        }
    }
}
createBricks();
//draw bricks
function drawbricks() {
    for (let r = 0; r < brick.row; r++) {
        for (let c = 0; c < brick.halfcol; c++) {
            let b = bricks[r][c];
            //if the brick isnt broken
            if (b.status) {
                ctx.beginPath();
                ctx.fillStyle = brick.fillColor1;
                ctx.fillRect(b.x, b.y, brick.width, brick.height);
                ctx.strokeStyle = brick.strokeColor;
                ctx.strokeRect(b.x, b.y, brick.width, brick.height);
                ctx.closePath();
            }
        }
        for (let c = brick.halfcol; c < brick.column; c++) {
            let b = bricks[r][c];
            //if the brick isnt broken
            if (b.status) {
                ctx.beginPath();
                ctx.fillStyle = brick.fillColor2;
                ctx.fillRect(b.x, b.y, brick.width, brick.height);
                ctx.strokeStyle = brick.strokeColor;
                ctx.strokeRect(b.x, b.y, brick.width, brick.height);
                ctx.closePath();
                // addCrack(crack, b.x,b.y, brick.width, brick.height);
            }
        }
    }
}
var all = []
function addCrack() {
    all.push({ x: tempx, y: tempy, w: tempWidth, h: temphigtht })
    ctx.beginPath();
    if (remveX != 0) {
        all = all.filter((i) => i.x != remveX)
        remveX = 0;
    }
    for (let i = 0; i < all.length; i++) {
        ctx.drawImage(crack, all[i].x, all[i].y, all[i].w, all[i].h);
    }
    // ctx.clearRect(b.x,b.y, brick.width, brick.height);
    //                        
    //                         ctx.rect(b.x, b.y, brick.width, brick.height);
    //                         ctx.fillStyle = brick.fillColor2;
    // ctx.fill();
    ctx.closePath();


}
var maxScore=brick.row*brick.column*SCORE_UNIT;
function ballBrickCollision() {

    var COLL_COUNT = 0;
    //var countcoll=0;
    for (let r = 0; r < brick.row; r++) {
        for (let c = 0; c < brick.column; c++) {
            let b = bricks[r][c];
            //if the brick isnt broken
            if (b.status == 1 && COLL_COUNT == 0) {
                if (ball.x + ball.radius > b.x && ball.x - ball.radius < b.x + brick.width
                    && ball.y + ball.radius > b.y && ball.y - ball.radius < b.y + brick.height) {
                    //  countcoll++;
                    HITBRICK.play();
                    
                    ball.dy = - ball.dy;
                    b.status = false;
                    remveX = b.x;
                    SCORE += SCORE_UNIT;
                }
            }
        }
    }
    if(SCORE == maxScore)
    {
        WIN.play();
    }
}

//show game status
function showGameStatus(text, textX, textY, img, imgX, imgY) {
    //draw text
    ctx.fillStyle = "white"
    ctx.font = "25px Tahoma One"
    ctx.fillText(text, textX, textY);

    //draw image of level
    ctx.drawImage(img, imgX, imgY, width = 25, height = 25)
}
//draw function
function draw() {
    // ctx.clearRect(0, 0, cvs.width, cvs.height);

    drawPaddle();
    drawBall();
    drawbricks();
    ballBrickCollision();

    //show lives
    showGameStatus(LIFE, cvs.width - 25, 25, LIFE_IMG, cvs.width - 55, 5);
    //score
    showGameStatus(SCORE, 35, 25, scoreimg, 5, 5);
    showGameStatus(LEVEL, cvs.width/2, 25, scoreimg, cvs.width/2-30, 5);


}

//Game Over
function gameover() {
    if (LIFE == 0) {
        ctx.clearRect(0, 0, cvs.width, cvs.height)
        youlose();
        GAMEOVER.play();
        GAME_OVER = true;
        refresh.d
    }
}
//update game function
function update() {
    movePaddle();
    moveBall();
    ballWallCollision();
    ballPaddleCollision();
    ballBrickCollision();
    gameover();
    addCrack()
}

//game loop
function loop() {
    ctx.drawImage(BG_IMG, 0, 0, 850, 600);
    draw();
    update();
    gameover();
    if (!GAME_OVER && enter) {
        requestAnimationFrame(loop);
    }
}

Pause.addEventListener("click",function(){
  enter=false;
})
resume_btn.addEventListener("click",function(){
    enter=true;
    requestAnimationFrame(loop);
})
refresh.addEventListener("click",function(){
    window.location.reload();

})
function youlose() {
    game_over.style.display = "block";
    lose.style.display = "block";
}
// loop();
let buttonclicked =false;
document.getElementById("Sound").addEventListener("click",function(){
   if(buttonclicked){
    document.getElementById("Sound").innerHTML="muted"
   }
   else{
    document.getElementById("Sound").innerHTML="Sound"
    HITBRICK.muted=HITBRICK.muted ? false :true ;
    CRACK.muted=CRACK.muted ? false :true ;
    HITWALL.muted=HITWALL.muted ? false :true ;
    LOSELIVE.muted=LOSELIVE.muted ? false :true ;
    GAMEOVER.muted=GAMEOVER.muted ? false :true ;
    HITPADDLE.muted=HITPADDLE.muted ? false :true ;
    WIN.muted=WIN.muted ? false :true ;
    BG.muted=BG.muted ? false :true ;}
    document.getElementById("Sound").innerHTML="unmuted";
    // let buttonclicked =false;
})