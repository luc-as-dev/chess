const board = document.querySelector("#board-inner");
const knockedOutDivs = {
    "white": document.querySelector("#knocked-out-whites"),
    "black": document.querySelector("#knocked-out-blacks")
}
let whiteTurn = true;
let selectedPiece = null;
let validMoves = [];
function getPieveAtr(pieceEl) {
    return { 
        piece : pieceEl.classList[1].substr(6,2),
        color : pieceEl.classList[1].substr(9),
        pos   : {
            x: "ABCDEFGH".indexOf(pieceEl.parentElement.id[0]), 
            y: parseInt(pieceEl.parentElement.id[1])-1
        }
    }
}
const toLetter = (num) => "ABCDEFGH"[num];
function updateValidMoves({piece, color, pos}) {
    const getPiece = (x,y) => document.querySelector("#"+toLetter(x)+(y+1)).children[0];
    const addValidMove = (x,y) => validMoves.push(toLetter(x)+(y+1));
    if(piece === "pa") {
        const dir = color==="white" ? 1 : -1;
        //Om det inte är någon 1 ruta framför.
        if(!getPiece(pos.x, pos.y+dir)) addValidMove(pos.x, pos.y+dir);
        //Om pjäsen är på start-raden och det inte är någon 2 rutor framför.
        if((pos.y == (color==="white" ? 1 : 6)) && !getPiece(pos.x, pos.y+dir*2)) addValidMove(pos.x, pos.y+dir*2);
        //Om pjäsen inte är längst till vänster och det är någon 1 steg diagonalt åt vänster.
        if(pos.x !== 0 && getPiece(pos.x-1, pos.y+dir)) addValidMove(pos.x-1, pos.y+dir);
        //Om pjäsen inte är längst till höger och det är någon 1 steg diagonalt åt höger.
        if(pos.x !== 7 && getPiece(pos.x+1, pos.y+dir)) addValidMove(pos.x+1, pos.y+dir);
    }
    else {
        const movements = {
            "ro": [[1,0,7],[0,1,7],[-1,0,7],[0,-1,7]],
            "kn": [[1,2,1],[2,1,1],[2,-1,1],[1,-2,1],[-1,-2,1],[-2,-1,1],[-2,1,1],[-1,2,1]],
            "bi": [[1,1,7],[1,-1,7],[-1,1,7],[-1,-1,7]],
            "qu": [[1,0,7],[0,1,7],[-1,0,7],[0,-1,7],[1,1,7],[1,-1,7],[-1,1,7],[-1,-1,7]],
            "ki": [[1,0,1],[0,1,1],[-1,0,1],[0,-1,1],[1,1,1],[1,-1,1],[-1,1,1],[-1,-1,1]]
        }
        for(let movement of movements[piece]) {
            for(let i=1; i<=movement[2]; i++) {
                const x = pos.x+i*movement[0];
                const y = pos.y+i*movement[1];
                if(x < 0 || x > 7 || y < 0 || y > 7) break;
                addValidMove(x, y);
                if(getPiece(x, y)) break;
            }
        }
    }
    for(let validMove of validMoves) {
        let square = document.querySelector("#"+validMove);
        if(!square.children[0] || (square.children[0] && getPieveAtr(square.children[0]).color !== color)){
            square.classList.add("board-square-valid-move");
        }
    }
}
for(let i=8; i>0; i--) { // Spelbrädets bredd.
    for(let j=0; j<8; j++) { // Spelbrädets höjd
        const square = document.createElement("div");
        square.classList.add("board-square", "board-square-"+((i+j)%2===0 ? "white" : "black"));
        square.id = "ABCDEFGH"[j]+(i);
        square.addEventListener("mousedown", function() {
            if(square.children[0] && getPieveAtr(square.children[0]).color === (whiteTurn ? "white" : "black")) {
                selectedPiece = square.children[0];
                updateValidMoves(getPieveAtr(selectedPiece));
            }
        } )
        square.addEventListener("mouseup", function() {
            if(selectedPiece) {
                if(square.classList.contains("board-square-valid-move")) {
                    const knockedOut = square.children[0];
                    if(knockedOut) knockedOutDivs[getPieveAtr(knockedOut).color].appendChild(knockedOut);
                    square.appendChild(selectedPiece);
                    whiteTurn = !whiteTurn;
                }
                for(let validMove of validMoves) {
                    document.querySelector("#"+validMove).classList.remove("board-square-valid-move");
                }
                validMoves = [];
                selectedPiece = null;
            }
        } )
        board.appendChild(square);
    }
}
function generatePiece(pieceName, color) { // pa|wn ro|ok kn|ight bi|shop qu|een ki|ng
    const piece = document.createElement("div");
    piece.classList.add("piece", `piece-${pieceName}-${color}`);
    return piece;
}
for(color of ["white", "black"]) { // Genererar en uppsättning pjäser för vit och en för svart.
    for(let i=0; i<8; i++) { // ABCDEFGH[i] => bokstav (horizontel position)
        for(let j=0; j<2; j++) { //  2-j om vit, 7+j om svart. (vertikal position)
            const pieceName = j===0 ? "pa": ["ro","kn","bi","qu","ki","bi","kn","ro"][i];
            const id = "#"+toLetter(i)+(color === "white" ? 2-j: 7+j);
            document.querySelector(id).appendChild(generatePiece(pieceName, color));
        }
    }
}