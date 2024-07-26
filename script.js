let board = [];
const row = 8;
const col = 8;
let minesCount = 10;
let minesLocations = [];
let tilesClicked = 0;
let gameOver = false;
let flagEnabled = false;

window.onload = function() {
    startGame();
}

function setMines() {
    let minesSet = new Set();

    while (minesSet.size < minesCount) {
        let r = Math.floor(Math.random() * row);
        let c = Math.floor(Math.random() * col);
        minesSet.add(r.toString() + "-" + c.toString());
    }

    minesLocations = Array.from(minesSet);
    console.log(minesLocations);        
}

function startGame() {
    document.getElementById("mines-count").innerText = minesCount;
    document.getElementById("flag-button").addEventListener("click", setFlag);
    document.getElementById("reset-button").addEventListener("click", resetGame);

    setMines();
    board = [];
    tilesClicked = 0;
    gameOver = false;
    flagEnabled = false;
    document.getElementById("flag-button").style.backgroundColor = "lightgray";

    const boardElement = document.getElementById("board");
    boardElement.innerHTML = ""; // Clear the board

    for (let r = 0; r < row; r++) {
        let rowArr = [];
        for (let c = 0; c < col; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.addEventListener("click", clickTile);
            boardElement.append(tile);
            rowArr.push(tile);
        }
        board.push(rowArr);
    }
}

function setFlag() {
    flagEnabled = !flagEnabled;
    document.getElementById("flag-button").style.backgroundColor = flagEnabled ? "darkgray" : "lightgray";
}

function clickTile() {
    if (gameOver) return;
    let tile = this;
    if (flagEnabled) {
        if (tile.innerText == "") {
            tile.innerText = "🚩";
        } else if (tile.innerText == "🚩") {
            tile.innerText = "";
        }
        return;
    }
    if (minesLocations.includes(tile.id)) {
        gameOver = true;
        revealMines();
        document.getElementById("mines-count").innerText = "Game Over";
        return;
    }
    
    let coords = tile.id.split("-");
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);
    checkMine(r, c);
    checkWin();
}

function revealMines() {
    for (let r = 0; r < row; r++) {
        for (let c = 0; c < col; c++) {
            let tile = board[r][c];
            if (minesLocations.includes(tile.id)) {
                tile.innerText = "💣";
                tile.style.backgroundColor = "red";
            }
        }
    }
}

function checkMine(r, c) {
    if (r < 0 || r >= row || c < 0 || c >= col) return;
    if (board[r][c].classList.contains("tile-clicked")) return;

    board[r][c].classList.add("tile-clicked");
    tilesClicked += 1;
    let minesFound = 0;

    // Top 3
    minesFound += checkTile(r - 1, c - 1); // left
    minesFound += checkTile(r - 1, c); // top
    minesFound += checkTile(r - 1, c + 1); // right
    // Left and right
    minesFound += checkTile(r, c - 1);
    minesFound += checkTile(r, c + 1);
    // Bottom 3
    minesFound += checkTile(r + 1, c - 1); // left
    minesFound += checkTile(r + 1, c); // bottom
    minesFound += checkTile(r + 1, c + 1); // right

    if (minesFound > 0) {
        board[r][c].innerText = minesFound;
        board[r][c].classList.add("x" + minesFound.toString());
    } else {
        // Top 3
        checkMine(r - 1, c - 1);
        checkMine(r - 1, c);
        checkMine(r - 1, c + 1);
        // Left and right
        checkMine(r, c - 1);
        checkMine(r, c + 1);
        // Bottom 3
        checkMine(r + 1, c - 1);
        checkMine(r + 1, c);
        checkMine(r + 1, c + 1);
    }

    checkWin();
}

function checkTile(r, c) {
    if (r < 0 || r >= row || c < 0 || c >= col) return 0;
    if (minesLocations.includes(r.toString() + "-" + c.toString())) return 1;
    return 0;
}

function checkWin() {
    if (tilesClicked == row * col - minesCount) {
        document.getElementById("mines-count").innerText = "You Win!";
        gameOver = true;
    }
}

function resetGame() {
    board = [];
    minesLocations = [];
    tilesClicked = 0;
    gameOver = false;
    flagEnabled = false;
    document.getElementById("mines-count").innerText = minesCount;
    document.getElementById("flag-button").style.backgroundColor = "lightgray";
    startGame();
}