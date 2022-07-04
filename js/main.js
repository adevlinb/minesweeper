/*----- constants -----*/
let SQUARE = {
    mine: false,
    flag: false,
    empty: false,
}


/*----- app's state (variables) -----*/
let gameStatus; //null to start "w" for all bombs / no more moves "L" for clicked on mine
let setFlag; // flag setting selected to drop a flag on selected spot
let setClick; // regular cursor selected for regular click functions
let gamesWon;
let gamesLost;
let board; 
let numOfMines;
let currentPosition;
let bombLookup;



/*----- cached element references -----*/
let winScoreEl = document.getElementById("games-won");
let loseScoreEl = document.getElementById("games-lost");
let boardEl = document.getElementById("board");





/*----- event listeners -----*/
document.getElementById("set-flag")
    .addEventListener("click", function(evt) {
        setFlag = true;
        setClick = false; 
        console.log("flag", setFlag, setClick);
    });
document.getElementById("set-click")
    .addEventListener("click", function(evt) {
        setFlag = false;
        setClick = true; 
    });

boardEl.addEventListener("click", updateGuesses)
boardEl.addEventListener("dblclick", update)
function update(evt) {
    console.log("dbl")
}




/*----- functions -----*/
init ();

function init() {
    gamesWon = 0;
    gamesLost = 0;
    numOfMines = 15;
    bombLookup = {};
    board = [
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
    ]
    board = board.map(function(array) {
        let newArr = array.map(function(ele) {
            let newEl = {mine: false, flag: false, empty: false, startNum: 0};
            return newEl;
        });
        return newArr;
    })

    console.log(board, "board");
    setBoard();
    
    setScores();
    render();
}

function setBoard() {
    let count = 0;
    while (count < numOfMines) {
        let rndIdxI = getRandomIdx();
        let rndIdxJ = getRandomIdx();

        if (board[rndIdxI][rndIdxJ].mine === true) {
            rndIdxI = getRandomIdx();
            rndIdxJ = getRandomIdx();
        };
        board[rndIdxI][rndIdxJ].mine = true;
        bombLookup[count] = [rndIdxI, rndIdxJ];
        count ++;
    }
    console.log(bombLookup, "lookup", board)
}

function getRandomIdx() {
    return Math.floor(Math.random() * 10);
}

function setScores() {
    winScoreEl.textContent = `Wins: ${gamesWon}`;
    loseScoreEl.textContent = `Loses ${gamesLost}`;
}

function updateGuesses(evt) {
    console.log(evt, "evt", window);
    let i = evt.target.id[1];
    let j = evt.target.id[3];
    board[i][j]
    board[i][j] = "flag"
    console.log(board);
    checkGameSatus();
    render()
}

function checkGameSatus() {
    if(currentPosition === -1) return "l"

}

function render() {

    board.forEach(function(row, idxI) {
        row.forEach(function(square, idxJ){

            if(square.mine === true) {
                document.getElementById(`r${idxI}c${idxJ}`).classList.remove("null-setup") 
                document.getElementById(`r${idxI}c${idxJ}`).classList.add("testing") 
            }
            if(square.flag === true) {
                document.getElementById(`r${idxI}c${idxJ}`).classList.remove("null-setup") 
                document.getElementById(`r${idxI}c${idxJ}`).classList.remove("testing") 
                document.getElementById(`r${idxI}c${idxJ}`).classList.add("flag") 
                document.getElementById(`r${idxI}c${idxJ}`).src = "./imgs/flag.png" 


            }

        })
    })

}