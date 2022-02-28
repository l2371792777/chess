import {Chess} from "./module/chess.js"
import {chessAi} from "./AI.js"

// NOTE: this example uses the chess.js library:
// https://github.com/jhlywa/chess.js

let board = null
let game = new Chess()
let fenStack=[]

function onDragStart (source, piece, position, orientation) {
    // do not pick up pieces if the game is over
    if (game.game_over()) return false

    // only pick up pieces for White
    if (piece.search(/^b/) !== -1) return false
}

function makeCpuMove(){

}

function makeRandomMove () {
    let position=chessAi.calculateBestMove(game);
    if(position!=="$#"){
        fenStack.push(game.fen());
    }
    console.log("calculateBestMove "+position)
    game.move(position);
    board.position(game.fen());
}


function onDrop (source, target) {
    fenStack.push(game.fen());
    // see if the move is legal
    var move = game.move({
        from: source,
        to: target,
        promotion: 'q' // NOTE: always promote to a queen for example simplicity
    })
    // illegal move
    if (move === null) {
        fenStack.pop();
        return 'snap back'
    }
    // make random legal move for black
    window.setTimeout(makeRandomMove, 250)
}

// update the board position after the piece snap
// for castling, en passant, pawn promotion
function onSnapEnd () {
    board.position(game.fen())
}

function restart(){
    board.start();
    game.reset();
    fenStack=[];
}
function reFen(){
    console.log("reFen");
    if(!fenStack.length)return;
    let str=fenStack.pop();
    game.load(str);
    board.position(str);
}

var config = {
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd
}

board = Chessboard('myBoard', config)
console.log(game.board())
$('#setStartBtn').on('click', restart)
$('#re').on('click', reFen)