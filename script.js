// Secret word
const secretWord = "morgan";
let currentGuess = "";
let currentRow = 0;

const board = document.getElementById("board");
const message = document.getElementById("message");
const body = document.body;
const container = document.querySelector(".container");
const scoreEl = document.getElementById("score");
const timerEl = document.getElementById("timer");

// Fake timer and score (optional but fun)
let fakeTime = 30;
let fakeScore = 0;
const timerInterval = setInterval(() => {
  if (fakeTime > 0) {
    fakeTime--;
    fakeScore += 10;
    timerEl.textContent = fakeTime + "s";
    scoreEl.textContent = fakeScore;
  } else {
    clearInterval(timerInterval);
    timerEl.textContent = "0s";
  }
}, 1000);

// Board setup
for (let i = 0; i < 8; i++) {
  const row = document.createElement("div");
  row.className = "row";
  for (let j = 0; j < 6; j++) {
    const tile = document.createElement("div");
    tile.className = "tile";
    row.appendChild(tile);
  }
  board.appendChild(row);
}

// Typing logic
document.addEventListener("keydown", (e) => {
  if (message.classList.contains("revealed")) return;

  const key = e.key;

  if (key === "Backspace" && currentGuess.length > 0) {
    currentGuess = currentGuess.slice(0, -1);
    updateRow();
  } else if (/^[a-zA-Z]$/.test(key) && currentGuess.length < 6) {
    currentGuess += key.toLowerCase();
    updateRow();
  } else if (key === "Enter" && currentGuess.length === 6) {
    checkGuess();
  }
});

function updateRow() {
  const row = board.children[currentRow];
  for (let i = 0; i < 6; i++) {
    const tile = row.children[i];
    tile.textContent = currentGuess[i] ? currentGuess[i].toUpperCase() : "";
  }
}

function checkGuess() {
  const row = board.children[currentRow];
  const guess = currentGuess;
  const result = [];

  const secretArray = secretWord.split("");
  const guessArray = guess.split("");

  // First pass: correct
  for (let i = 0; i < 6; i++) {
    if (guessArray[i] === secretArray[i]) {
      result[i] = "correct";
      secretArray[i] = null;
    } else {
      result[i] = null;
    }
  }

  // Second pass
  for (let i = 0; i < 6; i++) {
    if (result[i] === "correct") continue;
    const index = secretArray.indexOf(guessArray[i]);
    if (index !== -1) {
      result[i] = "present";
      secretArray[index] = null;
    } else {
      result[i] = "absent";
    }
  }

  for (let i = 0; i < 6; i++) {
    row.children[i].classList.add(result[i]);
  }

  if (guess === secretWord) {
    revealSecret();
  } else {
    currentRow++;
    currentGuess = "";
    if (currentRow >= 8) {
      message.textContent = `Oops... it was "${secretWord}". 😢`;
      message.classList.add("revealed");
    }
  }
}

function revealSecret() {
  clearInterval(timerInterval);
  message.textContent = "You guessed it... 💗";
  message.classList.add("revealed");
  body.classList.add("love-mode");
  container.classList.add("love-mode");
  createHearts(60);

  setTimeout(() => {
    window.location.href = "love-letter.html";
  }, 5000);
}

function createHearts(count) {
  for (let i = 0; i < count; i++) {
    const heart = document.createElement("div");
    heart.className = "heart";
    heart.style.left = Math.random() * 100 + "vw";
    heart.style.animationDuration = (Math.random() * 3 + 3) + "s";
    heart.style.animationDelay = Math.random() * 2 + "s";
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 8000);
  }
}
