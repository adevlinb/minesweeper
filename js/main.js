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
boardEl.addEventListener("click", handleGuesses)
document.getElementById("set-flag").addEventListener("click", function(evt) {
        setFlag = true;
        setClick = false;
    });
document.getElementById("set-click").addEventListener("click", function(evt) {
        setFlag = false;
        setClick = true;
    });

document.getElementById("play-again").addEventListener("click", function() {
    init();
    resetDOM();
})


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
    render();
}

function setBoard() {
    let count = 0;
    while (count < numOfMines) {
        let rndIdxI = Math.floor(Math.random() * 10);
        let rndIdxJ = Math.floor(Math.random() * 10);

        if (!board[rndIdxI][rndIdxJ].mine) {
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
        };
    }
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
    if (gameStatus === null) messageEl.textContent = "Let's Play!";
    if (gameStatus === "W") messageEl.textContent = "You Win!";
    if (gameStatus === "L") messageEl.textContent = "You Lost!";

}

function handleGuesses(evt) {
    let i = parseInt(evt.target.id[1]);
    let j = parseInt(evt.target.id[3]);
    //guards
    if (gameStatus ||
        board[i][j].flag && !setFlag ||
        board[i][j].number === null)
        return;

    if (setFlag) {
        if(board[i][j].flag) {
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
        if (board[i][j].number === 0) setFloodZerosToNull(i, j)
        if (board[i][j] !== 0) board[i][j].visible = true;
    }

    gameStatus = checkGameStatus(i, j);
    render()
}

function checkGameStatus(i, j) {
    if (board[i][j].number === -1 && setFlag !== true) {
        ++gamesLost;
        return "L"
    }

    //check if all bombs have flags &&...
    let bombs = Object.entries(bombLookup)
    let every = bombs.every(function(bomb) {
        return board[bomb[1][0]][bomb[1][1]].flag === true ? true : false
    })

    let allCells = allRevealed();

    if(every && allCells) {
        ++gamesWon;
        return "W";
    }
    return null;
}

function render() {
    renderBoard()
    setScoresAndMessages();
}

function setFloodZerosToNull(i, j) {
    if (i < 0 || j < 0 || i === 10 || j === 10 || board[i][j].number !== 0 || board[i][j].bomb) return;
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

function allRevealed() {
    let all = true;
    board.forEach(function(rowArr) {
        rowArr.forEach(function(cell) {
            if (!cell.mine) {
                if (!cell.visible) all = false;
            }
        });
    });
    return all;
}

function renderBoard() {
    board.forEach(function(row, idxI) {
        row.forEach(function(cell, idxJ){
            if (cell.mine && cell.visible) {
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
            if (cell.visible && cell.number > 0) {
                document.getElementById(`r${idxI}c${idxJ}`).textContent = cell.number;
            }
            if (gameStatus === "L" && cell.mine) {
                document.getElementById(`r${idxI}c${idxJ}`).classList.remove("null-setup");
                document.getElementById(`r${idxI}c${idxJ}`).classList.add("testing");
            }
        })
    })
}

function resetDOM() {
    board.forEach(function(row, idxI) {
        row.forEach(function(cell, idxJ){
            document.getElementById(`r${idxI}c${idxJ}`).classList.add("null-setup");
            document.getElementById(`r${idxI}c${idxJ}`).classList.remove("testing");
            document.getElementById(`r${idxI}c${idxJ}`).classList.remove("empty");
            document.getElementById(`r${idxI}c${idxJ}`).innerHTML = ""

        })
    })
}
