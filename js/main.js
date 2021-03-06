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
let messageEl = document.getElementById("messages");





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
    setScoresAndMessages();
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
    if (idxI < 0 || idxI > 9 || idxJ < 0 || idxJ > 9 || board[idxI][idxJ].mine === true) return;
    board[idxI][idxJ].number = board[idxI][idxJ].number + 1;
}

function setScoresAndMessages() {
    winScoreEl.textContent = `Wins: ${gamesWon}`;
    loseScoreEl.textContent = `Loses ${gamesLost}`;
    bombNumEl.textContent = `Bombs: ${bombsToFind}`;
    flagNumEl.textContent = `Flags: ${flagsPlaced}`;
    if (gameStatus === null) {
        messageEl.textContent = "Let's Play!";
    } else if (gameStatus === "W") {
        messageEl.textContent = "You Win!";
        
    }
}

function handleGuesses(evt) {
    let i = parseInt(evt.target.id[1]);
    let j = parseInt(evt.target.id[3]);
    //guards
    if (gameStatus !== null ||
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
        if (board[i][j].number === 0) {
            setFloodZerosToNull(i, j)
        } else if (board[i][j] !== 0) {
            board[i][j].visible = true;
        }
    }
    console.log(board)
    gameStatus = checkGameStatus(i, j);
    setScoresAndMessages();
    render()
}

function checkGameStatus(i, j) {
    if (board[i][j].number === -1 && setFlag !== true) {
        ++gamesLost;
        return "L"
    } 

    //check if all bombs have flags &&...
    let bombs = Object.entries(bombLookup)
    console.log(bombs, "bombs")
    let every = bombs.every(function(bomb) {
        console.log(board[bomb[1][0]][bomb[1][1]], "board")
        return board[bomb[1][0]][bomb[1][1]].flag === true ? true : false
    })
    if(every) {
        ++gamesWon;
        return "W";
    }
    return null;
}

function render() {
    
    board.forEach(function(row, idxI) {
        row.forEach(function(cell, idxJ){
            
            if (cell.mine) {
                document.getElementById(`r${idxI}c${idxJ}`).classList.remove("null-setup");
                document.getElementById(`r${idxI}c${idxJ}`).classList.add("testing");
            }
            if (cell.flag) {
                document.getElementById(`r${idxI}c${idxJ}`).classList.remove("null-setup");
                document.getElementById(`r${idxI}c${idxJ}`).classList.remove("testing"); 
                document.getElementById(`r${idxI}c${idxJ}`).classList.add("flag"); 
            }
            if (cell.flag === false) {
                document.getElementById(`r${idxI}c${idxJ}`).classList.remove("flag");
                document.getElementById(`r${idxI}c${idxJ}`).classList.add("null-setup"); 
            }
            if (cell.number === null) {
                document.getElementById(`r${idxI}c${idxJ}`).classList.remove("flag");
                document.getElementById(`r${idxI}c${idxJ}`).classList.remove("null-setup");
                document.getElementById(`r${idxI}c${idxJ}`).classList.add("empty"); 
            }
            if (cell.visible) {
                document.getElementById(`r${idxI}c${idxJ}`).textContent = board[idxI][idxJ].number;
            }
            
        })
    })

}

function setFloodZerosToNull(i, j) {
    if (i < 0 || j < 0 || i === 10 || j === 10 || board[i][j].number !== 0) return;
    if (board[i][j].number === 0) board[i][j].number = null;
    
    setSurroundingCellsToShowNums(i - 1, j - 1);
    setSurroundingCellsToShowNums(i - 1, j);
    setSurroundingCellsToShowNums(i - 1, j + 1);
    setSurroundingCellsToShowNums(i, j - 1);
    setSurroundingCellsToShowNums(i, j + 1);
    setSurroundingCellsToShowNums(i + 1, j - 1);
    setSurroundingCellsToShowNums(i + 1, j);
    setSurroundingCellsToShowNums(i + 1, j + 1);
    
    setFloodZerosToNull(i - 1, j);
    setFloodZerosToNull(i, j - 1);
    setFloodZerosToNull(i, j + 1);
    setFloodZerosToNull(i + 1, j);
    
}

function setSurroundingCellsToShowNums (i, j) {
    if (i < 0 || j < 0 || i === 10 || j === 10) return;
    board[i][j].visible = true;

}