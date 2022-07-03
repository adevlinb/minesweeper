/*----- constants -----*/






/*----- app's state (variables) -----*/
let gameStatus; //null to start "w" for all bombs / no more moves "L" for clicked on bomb
let minesFlagged; // mines with flags
let gamesWon;
let gamesLost;
let board; 
let numOfMines;




/*----- cached element references -----*/
let winScoreEl = document.getElementById("games-won");
let loseScoreEl = document.getElementById("games-lost");
let boardEl = document.getElementById("board");





/*----- event listeners -----*/
boardEl.addEventListener("click", updateGuesses)




/*----- functions -----*/
init ();

function init() {
    gamesWon = 0;
    gamesLost = 0;
    numOfMines = 15;
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
    setBoard()
    console.log(board);
    setScores()
    render()
}

function setBoard() {
    let count = 0;
    while (count < numOfMines) {
        let rndIdxI = getRandomIdx();
        let rndIdxJ = getRandomIdx();
        console.log(rndIdxI, rndIdxJ);
        if (board[rndIdxI][rndIdxJ] === -1) {
                rndIdxI = getRandomIdx();
                rndIdxJ = getRandomIdx();
        };
        board[rndIdxI][rndIdxJ] = -1;
        count ++;
    }
}

function getRandomIdx() {
    return Math.floor(Math.random() * 10);
}

function setScores() {
    winScoreEl.textContent = `Wins: ${gamesWon}`;
    loseScoreEl.textContent = `Loses ${gamesLost}`;
}

function updateGuesses(evt) {
    console.log(evt.target.id, 'hello');
    let i = evt.target.id[1]
    let j = evt.target.id[3]
    if(board[i][j] === -1) console.log("boom!")
    render()
}

function render() {

}