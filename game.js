const board = document.getElementById("gameBoard");
const scoreDisplay = document.getElementById("score");
const gameMessage = document.getElementById("gameMessage");
const playAgainBtn = document.getElementById("playAgainBtn");
const movesDisplay = document.getElementById("moves");
const restartBtn = document.getElementById("restartBtn");
const backBtn = document.getElementById("backBtn");
const musicBtn =
    document.getElementById("musicBtn");

const soundBtn =
    document.getElementById("soundBtn");

const highScoreDisplay =
    document.getElementById("highScore");

const livesDisplay =
    document.getElementById("lives");

const levelDisplay =
    document.getElementById("level");


/* =========================
   GAME SETTINGS
========================= */

const jewels = [
    "💎",
    "💍",
    "👑",
    "📿",
    "💖",
    "✨"
];

const rows = 10;
const columns = 8;


/* =========================
   GAME VARIABLES
========================= */

let boardData = [];

let score = 0;

let moves = 30;

let lives = 3;

let level = 1;

let levelTarget = 500;

let levelMoves = 30;

let firstSelected = null;

let secondSelected = null;

let locked = false;

let gameEnded = false;


/* =========================
   LAST SWAP
========================= */

let lastSwap = null;


/* =========================
   HIGH SCORE
========================= */

let highScore =
    Number(
        localStorage.getItem(
            "jewelryHighScore"
        )
    ) || 0;

highScoreDisplay.textContent =
    highScore;


/* =========================
   AUDIO SYSTEM
========================= */

let audioContext = null;


/* =========================
   SOUND SETTINGS
========================= */

let soundEnabled =
    localStorage.getItem("jewelrySound") !== "off";

let musicEnabled =
    localStorage.getItem("jewelryMusic") !== "off";


/* =========================
   UPDATE BUTTONS
========================= */

function updateSoundButtons() {

    musicBtn.textContent =
        musicEnabled
            ? "🎵 Music ON"
            : "🔇 Music OFF";

    soundBtn.textContent =
        soundEnabled
            ? "🔊 Sound ON"
            : "🔇 Sound OFF";
}


/* =========================
   BACKGROUND MUSIC
========================= */

const backgroundMusic = new Audio("ash_music.wav");

backgroundMusic.loop = true;

backgroundMusic.volume = 0.10;


/* =========================
   START BACKGROUND MUSIC
========================= */

function startBackgroundMusic() {

    if (!musicEnabled) {
        return;
    }

    backgroundMusic
        .play()
        .catch(() => {});
}


/* =========================
   STOP BACKGROUND MUSIC
========================= */

function stopBackgroundMusic() {

    backgroundMusic.pause();

    backgroundMusic.currentTime = 0;
}


/* =========================
   MUSIC BUTTON
========================= */

musicBtn.addEventListener(
    "click",
    function() {

        musicEnabled =
            !musicEnabled;

        localStorage.setItem(
            "jewelryMusic",
            musicEnabled
                ? "on"
                : "off"
        );

        if (musicEnabled) {

            startBackgroundMusic();

        } else {

            stopBackgroundMusic();
        }

        updateSoundButtons();
    }
);

/* =========================
   START MUSIC ON FIRST TAP
========================= */

document.addEventListener(
    "pointerdown",
    function startMusicOnce() {

        if (musicEnabled) {
            startBackgroundMusic();
        }

        document.removeEventListener(
            "pointerdown",
            startMusicOnce
        );

    },
    { once: true }
);

/* =========================
   SOUND BUTTON
========================= */

soundBtn.addEventListener(
    "click",
    function() {

        soundEnabled =
            !soundEnabled;

        localStorage.setItem(
            "jewelrySound",
            soundEnabled
                ? "on"
                : "off"
        );

        updateSoundButtons();
    }
);


/* INITIAL BUTTON STATE */
let musicStarted = false;
let musicTimer = null;
updateSoundButtons();


function getAudioContext() {

    if (!audioContext) {

        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;

        if (!AudioContext) {
            return null;
        }

        audioContext =
            new AudioContext();
    }

    if (
        audioContext.state ===
        "suspended"
    ) {

        audioContext.resume();
    }

    return audioContext;
}


/* =========================
   GEM MOVE SOUND
========================= */

function playMoveSound() {
if (!soundEnabled) return;
    const audio =
        getAudioContext();

    if (!audio) return;

    const now =
        audio.currentTime;

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
        0.10,
        now + 0.015
    );

    gain.gain.exponentialRampToValueAtTime(
        0.001,
        now + 0.13
    );

    oscillator.connect(gain);

    gain.connect(
        audio.destination
    );

    oscillator.start(now);

    oscillator.stop(
        now + 0.14
    );
}


/* =========================
   MATCH SOUND
========================= */

function playMatchSound() {
if (!soundEnabled) return;
    const audio =
        getAudioContext();

    if (!audio) return;

    const now =
        audio.currentTime;

    const notes = [
        523.25,
        659.25,
        783.99,
        1046.50
    ];

    notes.forEach(
        (frequency, index) => {

            const oscillator =
                audio.createOscillator();

            const gain =
                audio.createGain();

            const start =
                now + index * 0.07;

            oscillator.type =
                "sine";

            oscillator.frequency.setValueAtTime(
                frequency,
                start
            );

            gain.gain.setValueAtTime(
                0.001,
                start
            );

            gain.gain.exponentialRampToValueAtTime(
                0.14,
                start + 0.015
            );

            gain.gain.exponentialRampToValueAtTime(
                0.001,
                start + 0.35
            );

            oscillator.connect(gain);

            gain.connect(
                audio.destination
            );

            oscillator.start(start);

            oscillator.stop(
                start + 0.36
            );
        }
    );


    /* EXTRA SPARKLE */

    const sparkle =
        audio.createOscillator();

    const sparkleGain =
        audio.createGain();

    sparkle.type =
        "triangle";

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
        0.06,
        now + 0.02
    );

    sparkleGain.gain.exponentialRampToValueAtTime(
        0.001,
        now + 0.22
    );

    sparkle.connect(
        sparkleGain
    );

    sparkleGain.connect(
        audio.destination
    );

    sparkle.start(now);

    sparkle.stop(
        now + 0.23
    );
}


/* =========================
   WRONG MOVE SOUND
========================= */

function playWrongSound() {
if (!soundEnabled) return;
    const audio =
        getAudioContext();

    if (!audio) return;

    const now =
        audio.currentTime;

    const oscillator =
        audio.createOscillator();

    const gain =
        audio.createGain();

    oscillator.type =
        "triangle";

    oscillator.frequency.setValueAtTime(
        260,
        now
    );

    oscillator.frequency.exponentialRampToValueAtTime(
        120,
        now + 0.20
    );

    gain.gain.setValueAtTime(
        0.001,
        now
    );

    gain.gain.exponentialRampToValueAtTime(
        0.10,
        now + 0.02
    );

    gain.gain.exponentialRampToValueAtTime(
        0.001,
        now + 0.22
    );

    oscillator.connect(gain);

    gain.connect(
        audio.destination
    );

    oscillator.start(now);

    oscillator.stop(
        now + 0.23
    );
}


/* =========================
   SHUFFLE SOUND
========================= */

function playShuffleSound() {
if (!soundEnabled) return;
    const audio =
        getAudioContext();

    if (!audio) return;

    const now =
        audio.currentTime;

    const notes = [
        260,
        340,
        450,
        600,
        760
    ];

    notes.forEach(
        (frequency, index) => {

            const oscillator =
                audio.createOscillator();

            const gain =
                audio.createGain();

            const start =
                now + index * 0.055;

            oscillator.type =
                "triangle";

            oscillator.frequency.setValueAtTime(
                frequency,
                start
            );

            gain.gain.setValueAtTime(
                0.001,
                start
            );

            gain.gain.exponentialRampToValueAtTime(
                0.055,
                start + 0.015
            );

            gain.gain.exponentialRampToValueAtTime(
                0.001,
                start + 0.12
            );

            oscillator.connect(gain);

            gain.connect(
                audio.destination
            );

            oscillator.start(start);

            oscillator.stop(
                start + 0.13
            );
        }
    );
}


/* =========================
   LEVEL UP SOUND
========================= */

function playLevelUpSound() {
if (!soundEnabled) return;
    const audio =
        getAudioContext();

    if (!audio) return;

    const now =
        audio.currentTime;

    const notes = [
        392,
        523.25,
        659.25,
        783.99,
        1046.50
    ];

    notes.forEach(
        (frequency, index) => {

            const oscillator =
                audio.createOscillator();

            const gain =
                audio.createGain();

            const start =
                now + index * 0.09;

            oscillator.type =
                "sine";

            oscillator.frequency.setValueAtTime(
                frequency,
                start
            );

            gain.gain.setValueAtTime(
                0.001,
                start
            );

            gain.gain.exponentialRampToValueAtTime(
                0.12,
                start + 0.02
            );

            gain.gain.exponentialRampToValueAtTime(
                0.001,
                start + 0.42
            );

            oscillator.connect(gain);

            gain.connect(
                audio.destination
            );

            oscillator.start(start);

            oscillator.stop(
                start + 0.44
            );
        }
    );
}


/* =========================
   GAME OVER SOUND
========================= */

function playGameOverSound() {
if (!soundEnabled) return;
    const audio =
        getAudioContext();

    if (!audio) return;

    const now =
        audio.currentTime;

    const notes = [
        392,
        330,
        262,
        196
    ];

    notes.forEach(
        (frequency, index) => {

            const oscillator =
                audio.createOscillator();

            const gain =
                audio.createGain();

            const start =
                now + index * 0.16;

            oscillator.type =
                "sine";

            oscillator.frequency.setValueAtTime(
                frequency,
                start
            );

            gain.gain.setValueAtTime(
                0.001,
                start
            );

            gain.gain.exponentialRampToValueAtTime(
                0.10,
                start + 0.025
            );

            gain.gain.exponentialRampToValueAtTime(
                0.001,
                start + 0.30
            );

            oscillator.connect(gain);

            gain.connect(
                audio.destination
            );

            oscillator.start(start);

            oscillator.stop(
                start + 0.31
            );
        }
    );
}





/* =========================
   START GAME
========================= */

function startGame() {

    gameMessage.classList.add(
        "hidden"
    );

    boardData = [];

    score = 0;

    moves = 30;

    lives = 3;

    level = 1;

    levelTarget = 500;

    levelMoves = 30;

    firstSelected = null;

    secondSelected = null;

    lastSwap = null;

    locked = false;

    gameEnded = false;


    updateLives();


    scoreDisplay.textContent =
        score;

    movesDisplay.textContent =
        moves;

    levelDisplay.textContent =
        level;


    for (
        let row = 0;
        row < rows;
        row++
    ) {

        boardData[row] = [];

        for (
            let col = 0;
            col < columns;
            col++
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
}


/* =========================
   UPDATE LIVES
========================= */

function updateLives() {

    livesDisplay.textContent =
        "❤️".repeat(lives);
}


/* =========================
   DRAW BOARD
========================= */

function drawBoard() {

    board.innerHTML = "";

    for (
        let row = 0;
        row < rows;
        row++
    ) {

        for (
            let col = 0;
            col < columns;
            col++
        ) {

            const cell =
                document.createElement(
                    "div"
                );

            cell.className =
                "jewel";

            cell.textContent =
                boardData[row][col];

            cell.dataset.row =
                row;

            cell.dataset.col =
                col;

            cell.addEventListener(
                "click",
                selectJewel
            );

            board.appendChild(
                cell
            );
        }
    }
}


/* =========================
   SELECT JEWEL
========================= */

function selectJewel(event) {
    if (
        locked ||
        gameEnded
    ) {
        return;
    }


    const cell =
        event.currentTarget;

    const row =
        Number(
            cell.dataset.row
        );

    const col =
        Number(
            cell.dataset.col
        );


    /* FIRST JEWEL */

    if (!firstSelected) {

        firstSelected = {
            row: row,
            col: col,
            element: cell
        };

        cell.classList.add(
            "selected"
        );

        return;
    }


    /* SAME JEWEL */

    if (
        firstSelected.row === row &&
        firstSelected.col === col
    ) {

        cell.classList.remove(
            "selected"
        );

        firstSelected = null;

        return;
    }


    /* SECOND JEWEL */

    secondSelected = {
        row: row,
        col: col,
        element: cell
    };

    cell.classList.add(
        "selected"
    );


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
                    .remove(
                        "selected"
                    );
            }

            if (secondSelected) {

                secondSelected.element
                    .classList
                    .remove(
                        "selected"
                    );
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
        Math.abs(
            a.row - b.row
        );

    const colDifference =
        Math.abs(
            a.col - b.col
        );

    return (
        rowDifference +
        colDifference ===
        1
    );
}


/* =========================
   SWAP JEWELS
========================= */

function swapJewels() {

    playMoveSound();


    const r1 =
        firstSelected.row;

    const c1 =
        firstSelected.col;

    const r2 =
        secondSelected.row;

    const c2 =
        secondSelected.col;


    /* SAVE SWAP */

    lastSwap = {
        r1: r1,
        c1: c1,
        r2: r2,
        c2: c2
    };


    /* SWAP */

    const temp =
        boardData[r1][c1];

    boardData[r1][c1] =
        boardData[r2][c2];

    boardData[r2][c2] =
        temp;


    firstSelected = null;

    secondSelected = null;


    /* ONE MOVE */

    moves--;

    movesDisplay.textContent =
        moves;


    drawBoard();

    checkMatches(true);
}


/* =========================
   FIND MATCHES
========================= */

function checkMatches(
    isPlayerMove = true
) {

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
                jewel ===
                boardData[row][col + 1] &&
                jewel ===
                boardData[row][col + 2]
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
                jewel ===
                boardData[row + 1][col] &&
                jewel ===
                boardData[row + 2][col]
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

    matches.forEach(
        match => {

            const exists =
                uniqueMatches.some(
                    item =>
                        item[0] ===
                            match[0] &&
                        item[1] ===
                            match[1]
                );

            if (!exists) {
                uniqueMatches.push(
                    match
                );
            }
        }
    );


    /* NO MATCH */

    if (
        uniqueMatches.length === 0
    ) {

        /*
        Sirf player ke direct move par
        wrong move count hoga.
        Cascade ke baad nahi.
        */

        if (isPlayerMove) {

            playWrongSound();

            undoWrongMove();

            loseLife();

        } else {

            locked = false;
        }

        return;
    }


    /* MATCH FOUND */

    playMatchSound();


    /* SCORE */

    score +=
        uniqueMatches.length * 10;

    scoreDisplay.textContent =
        score;


    /* HIGH SCORE */

  
