const wordElement = document.querySelector('.js-word');
const hintElement = document.querySelector('.js-hint');
const timerElement = document.querySelector('.js-timer');
const inputElement = document.querySelector('.js-input');
const refreshButton = document.querySelector('.js-refresh-button');
const checkButton = document.querySelector('.js-check-button');

let currentWord = '';
let scrambledWord = '';
let timerInterval;

const words = [
  { word: "garden", hint: "Space for planting flowers and plants" },
  { word: "country", hint: "A politically independent region" },
  { word: "library", hint: "Place containing a collection of books" },
  { word: "scramble", hint: "The game we are playing" },
  { word: "sunshine", hint: "Bright light emitted by the sun" },
  { word: "chocolate", hint: "A sweet treat made from cacao beans" },
  { word: 'bicycle', hint: 'A two-wheeled vehicle.' },
  { word: "pancake", hint: "Fluffy breakfast food typically served with syrup" },
];

function selectRandomWord() {
  const randomIndex = Math.floor(Math.random() * words.length);
  currentWord = words[randomIndex].word;
  scrambledWord = scrambleWord(currentWord);
  wordElement.textContent = scrambledWord;
  hintElement.textContent = `Hint: ${words[randomIndex].hint}`;
}

function scrambleWord(word) {
  return word.split('').sort(() => Math.random() - 0.5).join('');
}

function startTimer() {
  let timeLeft = 60;
  timerElement.textContent = `Time Left: ${timeLeft} seconds`;

  timerInterval = setInterval(() => {
    timeLeft--;
    timerElement.textContent = `Time Left: ${timeLeft} seconds`;

    if (timeLeft === 0) {
      clearInterval(timerInterval);
      alert('Time is up!');
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function startGame() {
  selectRandomWord();
  startTimer();
  inputElement.value = '';
  inputElement.focus();
}

function checkWord() {
  const guessedWord = inputElement.value.trim().toLowerCase();
  if (guessedWord === currentWord) {
    alert('Correct! You guessed the word.');
    stopTimer();
    startGame();
  } else {
    alert('Incorrect! Try again.');
  }
}

refreshButton.addEventListener('click', () => {
  stopTimer();
  startGame();
});

checkButton.addEventListener('click', () => {
  checkWord();
});

startGame();