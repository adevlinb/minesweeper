/*----- constants -----*/



/*----- app's state (variables) -----*/
let gameStatus; //null to start "w" for all bombs / no more moves "L" for clicked on mine
let setFlag; // flag setting selected to drop a flag on selected spot
let setClick; // regular cursor selected for regular click functions
let board; 
let numOfMines;
let currentPosition;
let bombLookup;
let flagCount;
let bombsToFind;
let gamesWon = 0;
let gamesLost = 0;




/*----- cached element references -----*/
let winScoreEl = document.getElementById("games-won");
let loseScoreEl = document.getElementById("games-lost");
let boardEl = document.getElementById("board");
let bombNumEl = document.getElementById("bombs-found");
let flagNumEl = document.getElementById("flags-placed");





/*----- event listeners -----*/
document.getElementById("set-flag")
    .addEventListener("click", function(evt) {
        setFlag = true;
        setClick = false; 
    });
document.getElementById("set-click")
    .addEventListener("click", function(evt) {
        setFlag = false;
        setClick = true; 
    });

boardEl.addEventListener("click", handleGuesses)


/*----- functions -----*/
init ();

function init() {
    numOfMines = 15;
    bombsToFind = 15;
    flagsPlaced = 0;
    bombLookup = {};
    gameStatus = null;
    setClick = true;
    setFlag = false;
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
            let newEl = {mine: false, flag: false, empty: false, number: 0, visible: false};
            return newEl;
        });
        return newArr;
    })

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
        board[rndIdxI][rndIdxJ].number = -1;
        setNumsAroundBombs(rndIdxI - 1, rndIdxJ - 1);
        setNumsAroundBombs(rndIdxI - 1, rndIdxJ);
        setNumsAroundBombs(rndIdxI - 1, rndIdxJ + 1);
        setNumsAroundBombs(rndIdxI, rndIdxJ - 1);
        setNumsAroundBombs(rndIdxI, rndIdxJ + 1);
        setNumsAroundBombs(rndIdxI + 1, rndIdxJ - 1);
        setNumsAroundBombs(rndIdxI + 1, rndIdxJ);
        setNumsAroundBombs(rndIdxI + 1, rndIdxJ + 1);
        bombLookup[count] = [rndIdxI, rndIdxJ];
        count ++;
    }
}

function getRandomIdx() {
    return Math.floor(Math.random() * 10);
}

function setNumsAroundBombs(idxI, idxJ) {

    // guard to stay in bounds
    if (idxI < 0 || idxI > 9 || idxJ < 0 || idxJ > 9 || board[idxI][idxJ].mine === true) return;
    board[idxI][idxJ].number = board[idxI][idxJ].number + 1;
}

function setScores() {
    winScoreEl.textContent = `Wins: ${gamesWon}`;
    loseScoreEl.textContent = `Loses ${gamesLost}`;
    bombNumEl.textContent = `Bombs: ${bombsToFind}`;
    flagNumEl.textContent = `Flags: ${flagsPlaced}`;
}

function handleGuesses(evt) {
    let i = parseInt(evt.target.id[1]);
    let j = parseInt(evt.target.id[3]);
    //guards
    if (gameStatus === "L" ||
       (board[i][j].flag === true && setFlag !== true) ||
       board[i][j].number === null) return;

    if (setFlag) {
        // setFlag = true... if this position has a flag -> remove it; if it doesn't -> add it
        if(board[i][j].flag === true) {
            board[i][j].flag = false
            --flagsPlaced;
            ++bombsToFind;
        } else {
            board[i][j].flag = true;
            ++flagsPlaced;
            --bombsToFind;
        }
    }
    
    if (setClick) {
        console.log("im here")
        if (board[i][j].number === 0)
        setFloodZerosToNull(i, j)
    }
    console.log(board, "im here")
    setScores();
    gameStatus = checkGameStatus(i, j);
    render()
}

function checkGameStatus(i, j) {
    if (board[i][j].number === -1 && setFlag !== true) {
        return "L"
    } 
    //check if all bombs have flags &&...
    for (let array in bombLookup) {
        let i = bombLookup[array][0];
        let j = bombLookup[array][1];
        
    
    }
    
    return null;
}

function render() {

    board.forEach(function(row, idxI) {
        row.forEach(function(square, idxJ){
            document.getElementById(`r${idxI}c${idxJ}`).textContent = board[idxI][idxJ].number
            
            if(square.mine === true) {
                document.getElementById(`r${idxI}c${idxJ}`).classList.remove("null-setup") 
                document.getElementById(`r${idxI}c${idxJ}`).classList.add("testing") 
            }
            if(square.flag === true) {
                console.log("flag true");
                document.getElementById(`r${idxI}c${idxJ}`).classList.remove("null-setup")
                document.getElementById(`r${idxI}c${idxJ}`).classList.remove("testing") 
                document.getElementById(`r${idxI}c${idxJ}`).classList.add("flag") 
                // document.getElementById(`r${idxI}c${idxJ}`).src = "./imgs/flag.png" 
            }
            if(square.flag === false) {
                document.getElementById(`r${idxI}c${idxJ}`).classList.remove("flag")
                document.getElementById(`r${idxI}c${idxJ}`).classList.add("null-setup") 
            }
            if(square.number === null) {
                document.getElementById(`r${idxI}c${idxJ}`).classList.remove("flag")
                document.getElementById(`r${idxI}c${idxJ}`).classList.remove("null-setup")
                // document.getElementById(`r${idxI}c${idxJ}`).classList.add("testing") 
                document.getElementById(`r${idxI}c${idxJ}`).classList.add("empty") 
                
            }
            
        })
    })

}

function setFloodZerosToNull(i, j) {

    if (i < 0 || j < 0 || i === 10 || j === 10 || board[i][j].number !== 0) return;
    if (board[i][j].number === 0) board[i][j].number = null;
    
    setFloodZerosToNull(i - 1, j);
    setFloodZerosToNull(i, j - 1);
    setFloodZerosToNull(i, j + 1);
    setFloodZerosToNull(i + 1, j);

}