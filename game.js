const board = document.getElementById("gameBoard");
const scoreDisplay = document.getElementById("score");
const movesDisplay = document.getElementById("moves");
const restartBtn = document.getElementById("restartBtn");
const backBtn = document.getElementById("backBtn");

const highScoreDisplay =
    document.getElementById("highScore");
    const timerDisplay =
    document.getElementById("timer");

const livesDisplay =
    document.getElementById("lives");

let timeLeft = 60;
let lives = 3;
let timerInterval = null;
    
    const levelDisplay =
    document.getElementById("level");

let level = 1;

let levelTarget = 500;

let levelMoves = 30;

let highScore =
    Number(localStorage.getItem("jewelryHighScore")) || 0;

highScoreDisplay.textContent = highScore;

const jewels = ["💎", "💍", "👑", "📿", "💖", "✨"];

const rows = 6;
const columns = 6;

let boardData = [];
let score = 0;
let moves = 30;

let firstSelected = null;
let secondSelected = null;
let locked = false;

/* =========================
   LUXURY GAME SOUNDS
========================= */

let audioContext = null;

function getAudioContext() {

    if (!audioContext) {

        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;

        if (!AudioContext) return null;

        audioContext = new AudioContext();
    }

    if (audioContext.state === "suspended") {
        audioContext.resume();
    }

    return audioContext;
}


/* GEM MOVE / DROP SOUND */

function playMoveSound() {

    const audio = getAudioContext();

    if (!audio) return;

    const now = audio.currentTime;

    const oscillator =
        audio.createOscillator();

    const gain =
        audio.createGain();

    oscillator.type = "sine";

    oscillator.frequency.setValueAtTime(
        180,
        now
    );

    oscillator.frequency.exponentialRampToValueAtTime(
        320,
        now + 0.08
    );

    gain.gain.setValueAtTime(
        0.001,
        now
    );

    gain.gain.exponentialRampToValueAtTime(
        0.12,
        now + 0.015
    );

    gain.gain.exponentialRampToValueAtTime(
        0.001,
        now + 0.13
    );

    oscillator.connect(gain);
    gain.connect(audio.destination);

    oscillator.start(now);
    oscillator.stop(now + 0.14);
}


/* BEAUTIFUL JEWEL MATCH SOUND */

function playMatchSound() {

    const audio = getAudioContext();

    if (!audio) return;

    const now = audio.currentTime;

    const notes = [
        523.25,
        659.25,
        783.99,
        1046.50
    ];

    notes.forEach((frequency, index) => {

        const oscillator =
            audio.createOscillator();

        const gain =
            audio.createGain();

        const start =
            now + index * 0.07;

        oscillator.type = "sine";

        oscillator.frequency.setValueAtTime(
            frequency,
            start
        );

        gain.gain.setValueAtTime(
            0.001,
            start
        );

        gain.gain.exponentialRampToValueAtTime(
            0.16,
            start + 0.015
        );

        gain.gain.exponentialRampToValueAtTime(
            0.001,
            start + 0.35
        );

        oscillator.connect(gain);
        gain.connect(audio.destination);

        oscillator.start(start);

        oscillator.stop(
            start + 0.36
        );
    });


    /* Extra sparkle */

    const sparkle =
        audio.createOscillator();

    const sparkleGain =
        audio.createGain();

    sparkle.type = "triangle";

    sparkle.frequency.setValueAtTime(
        1400,
        now
    );

    sparkle.frequency.exponentialRampToValueAtTime(
        2200,
        now + 0.18
    );

    sparkleGain.gain.setValueAtTime(
        0.001,
        now
    );

    sparkleGain.gain.exponentialRampToValueAtTime(
        0.08,
        now + 0.02
    );

    sparkleGain.gain.exponentialRampToValueAtTime(
        0.001,
        now + 0.22
    );

    sparkle.connect(sparkleGain);
    sparkleGain.connect(audio.destination);

    sparkle.start(now);

    sparkle.stop(now + 0.23);
}


/* =========================
   START GAME
========================= */

function startGame() {

    boardData = [];

    score = 0;
    moves = 30;
    timeLeft = 60;

lives = 3;

timerDisplay.textContent =
    timeLeft;

updateLives();

startTimer();
levelMoves = 30;
    
    level = 1;
levelTarget = 500;

levelDisplay.textContent = level;

    firstSelected = null;
    secondSelected = null;
    locked = false;

    scoreDisplay.textContent = score;
    movesDisplay.textContent = moves;

    for (let row = 0; row < rows; row++) {

        boardData[row] = [];

        for (let col = 0; col < columns; col++) {

            boardData[row][col] =
                jewels[
                    Math.floor(
                        Math.random() * jewels.length
                    )
                ];
        }
    }

    drawBoard();
}
function startTimer() {

    clearInterval(timerInterval);

    timerInterval = setInterval(() => {

        timeLeft--;

        timerDisplay.textContent = timeLeft;

        if (timeLeft <= 0) {

            clearInterval(timerInterval);

            loseLife();
        }

    }, 1000);
}

function loseLife() {

    lives--;

    updateLives();

    if (lives <= 0) {

        gameOver();

        return;
    }

    timeLeft = 60;

    timerDisplay.textContent = timeLeft;

    startTimer();
}
function updateLives() {

    livesDisplay.textContent =
        "❤️".repeat(lives);
}

/* =========================
   DRAW BOARD
========================= */

function drawBoard() {

    board.innerHTML = "";

    for (let row = 0; row < rows; row++) {

        for (let col = 0; col < columns; col++) {

            const cell =
                document.createElement("div");

            cell.className = "jewel";

            cell.textContent =
                boardData[row][col];

            cell.dataset.row = row;
            cell.dataset.col = col;

            cell.addEventListener(
                "click",
                selectJewel
            );

            board.appendChild(cell);
        }
    }
}


/* =========================
   SELECT JEWEL
========================= */

function selectJewel(event) {

    if (locked || moves <= 0) return;

    const cell = event.currentTarget;

    const row =
        Number(cell.dataset.row);

    const col =
        Number(cell.dataset.col);


    /* FIRST JEWEL */

    if (!firstSelected) {

        firstSelected = {
            row: row,
            col: col,
            element: cell
        };

        cell.classList.add("selected");

        return;
    }


    /* SAME JEWEL */

    if (
        firstSelected.row === row &&
        firstSelected.col === col
    ) {

        cell.classList.remove("selected");

        firstSelected = null;

        return;
    }


    /* SECOND JEWEL */

    secondSelected = {
        row: row,
        col: col,
        element: cell
    };

    cell.classList.add("selected");


    /* CHECK ADJACENT */

    if (
        isAdjacent(
            firstSelected,
            secondSelected
        )
    ) {

        locked = true;

        swapJewels();

    } else {

        setTimeout(() => {

            if (firstSelected) {
                firstSelected.element
                    .classList
                    .remove("selected");
            }

            if (secondSelected) {
                secondSelected.element
                    .classList
                    .remove("selected");
            }

            firstSelected = null;
            secondSelected = null;

        }, 300);
    }
}


/* =========================
   ADJACENT CHECK
========================= */

function isAdjacent(a, b) {

    const rowDifference =
        Math.abs(a.row - b.row);

    const colDifference =
        Math.abs(a.col - b.col);

    return (
        rowDifference + colDifference === 1
    );
}


/* =========================
   SWAP JEWELS
========================= */

function swapJewels() {
    playMoveSound();

    const r1 = firstSelected.row;
    const c1 = firstSelected.col;

    const r2 = secondSelected.row;
    const c2 = secondSelected.col;


    const temp =
        boardData[r1][c1];

    boardData[r1][c1] =
        boardData[r2][c2];

    boardData[r2][c2] =
        temp;


    firstSelected = null;
    secondSelected = null;

    moves--;

    movesDisplay.textContent = moves;

    drawBoard();

    checkMatches();
}


/* =========================
   FIND MATCHES
========================= */

function checkMatches() {

    let matches = [];


    /* HORIZONTAL */

    for (
        let row = 0;
        row < rows;
        row++
    ) {

        for (
            let col = 0;
            col < columns - 2;
            col++
        ) {

            const jewel =
                boardData[row][col];

            if (
                jewel &&
                jewel === boardData[row][col + 1] &&
                jewel === boardData[row][col + 2]
            ) {

                matches.push(
                    [row, col],
                    [row, col + 1],
                    [row, col + 2]
                );
            }
        }
    }

    /* VERTICAL */

    for (
        let row = 0;
        row < rows - 2;
        row++
    ) {

        for (
            let col = 0;
            col < columns;
            col++
        ) {

            const jewel =
                boardData[row][col];

            if (
                jewel &&
                jewel === boardData[row + 1][col] &&
                jewel === boardData[row + 2][col]
            ) {

                matches.push(
                    [row, col],
                    [row + 1, col],
                    [row + 2, col]
                );
            }
        }
    }


    /* REMOVE DUPLICATES */

    const uniqueMatches = [];

    matches.forEach(match => {

        const exists =
            uniqueMatches.some(item =>
                item[0] === match[0] &&
                item[1] === match[1]
            );

        if (!exists) {
            uniqueMatches.push(match);
        }
    });


    /* NO MATCH */
   if (uniqueMatches.length === 0) {

    locked = false;

    if (moves <= 0) {
        gameOver();
        return;
    }

    // Check if any possible move exists
    if (!hasPossibleMove()) {
        setTimeout(() => {
            shuffleBoard();
        }, 300);
    }

    return;
}


    /* SOUND */

    playMatchSound();


    /* SCORE */

    score +=
        uniqueMatches.length * 10;

    scoreDisplay.textContent = score;
    checkLevelUp();
    
if (score > highScore) {

    highScore = score;

    highScoreDisplay.textContent =
        highScore;

    localStorage.setItem(
        "jewelryHighScore",
        highScore
    );
}

    /* ANIMATION */

    uniqueMatches.forEach(match => {

        const index =
            match[0] * columns + match[1];

        const cell =
            board.children[index];

        if (cell) {

            cell.classList.add("matching");
        }
    });


    /* REMOVE AFTER ANIMATION */

    setTimeout(() => {

        uniqueMatches.forEach(match => {

            boardData[match[0]][match[1]] =
                null;
        });

        dropJewels();

    }, 450);
}
function checkLevelUp() {

    if (score >= levelTarget) {

        level++;

        levelTarget += 500;

        // Reduce moves with each level
        levelMoves = Math.max(
            10,
            30 - ((level - 1) * 2)
        );

        moves = levelMoves;

        levelDisplay.textContent = level;
        movesDisplay.textContent = moves;

        showLevelMessage();
    }
}
function showLevelMessage() {

    setTimeout(() => {

        alert(
            "✨ LEVEL UP! ✨\n\n" +
            "Welcome to Level " +
            level +
            " 💎"
        );

    }, 200);
}

/* =========================
   CHECK POSSIBLE MOVE
========================= */

function hasPossibleMove() {

    for (let row = 0; row < rows; row++) {

        for (let col = 0; col < columns; col++) {

            // RIGHT
            if (col < columns - 1) {

                swapBoardCells(row, col, row, col + 1);

                if (hasMatchOnBoard()) {

                    swapBoardCells(row, col, row, col + 1);

                    return true;
                }

                swapBoardCells(row, col, row, col + 1);
            }

            // DOWN
            if (row < rows - 1) {

                swapBoardCells(row, col, row + 1, col);

                if (hasMatchOnBoard()) {

                    swapBoardCells(row, col, row + 1, col);

                    return true;
                }

                swapBoardCells(row, col, row + 1, col);
            }
        }
    }

    return false;
}


/* TEMPORARY SWAP */

function swapBoardCells(r1, c1, r2, c2) {

    const temp = boardData[r1][c1];

    boardData[r1][c1] =
        boardData[r2][c2];

    boardData[r2][c2] =
        temp;
}


/* CHECK EXISTING MATCH */

function hasMatchOnBoard() {

    // Horizontal
    for (let row = 0; row < rows; row++) {

        for (let col = 0; col < columns - 2; col++) {

            const a = boardData[row][col];

            if (
                a &&
                a === boardData[row][col + 1] &&
                a === boardData[row][col + 2]
            ) {
                return true;
            }
        }
    }


    // Vertical
    for (let row = 0; row < rows - 2; row++) {

        for (let col = 0; col < columns; col++) {

            const a = boardData[row][col];

            if (
                a &&
                a === boardData[row + 1][col] &&
                a === boardData[row + 2][col]
            ) {
                return true;
            }
        }
    }

    return false;
}

/* =========================
   AUTOMATIC SHUFFLE
========================= */

function shuffleBoard() {

    locked = true;

    let allJewels = [];

    for (let row = 0; row < rows; row++) {

        for (let col = 0; col < columns; col++) {

            allJewels.push(
                boardData[row][col]
            );
        }
    }


    // Shuffle until playable
    let attempts = 0;

    do {

        allJewels.sort(
            () => Math.random() - 0.5
        );

        let index = 0;

        for (let row = 0; row < rows; row++) {

            for (let col = 0; col < columns; col++) {

                boardData[row][col] =
                    allJewels[index++];

            }
        }

        attempts++;

    } while (
        !hasPossibleMove() &&
        attempts < 100
    );


    drawBoard();

    locked = false;
}
/* =========================
   DROP JEWELS
========================= */

function dropJewels() {

    for (
        let col = 0;
        col < columns;
        col++
    ) {

        let emptySpaces = 0;


        /* MOVE JEWELS DOWN */

        for (
            let row = rows - 1;
            row >= 0;
            row--
        ) {

            if (
                boardData[row][col] === null
            ) {

                emptySpaces++;

            } else if (
                emptySpaces > 0
            ) {

                boardData[
                    row + emptySpaces
                ][col] =
                    boardData[row][col];

                boardData[row][col] =
                    null;
            }
        }


        /* CREATE NEW JEWELS */

        for (
            let row = 0;
            row < emptySpaces;
            row++
        ) {

            boardData[row][col] =
                jewels[
                    Math.floor(
                        Math.random() *
                        jewels.length
                    )
                ];
        }
    }


    drawBoard();


    /* CHECK CASCADE */

    setTimeout(() => {

        checkMatches();

    }, 250);
}


/* =========================
   GAME OVER
========================= */

function gameOver() {
clearInterval(timerInterval);
    locked = true;

    setTimeout(() => {

        alert(
            "💎 Game Over! 💎\n\n" +
            "Your Score: " +
            score
        );

    }, 200);
}


/* =========================
   RESTART
========================= */

restartBtn.addEventListener(
    "click",
    startGame
);


/* =========================
   BACK TO ASH LAVISH JEWELS
========================= */

backBtn.addEventListener(
    "click",
    function() {

        window.location.href =
            "index.html";
    }
);


/* =========================
   START
========================= */

startGame();