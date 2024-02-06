let gameCount = 0;
let winsCount = 0;
let lossesCount = 0;

const wordList = [
  { word: 'Cat', hint: 'It has nine lives.' },
  { word: 'Sun', hint: 'It\'s a bright celestial object.' },
  { word: 'Apple', hint: 'A fruit that comes in various colors.' },
  { word: 'Bicycle', hint: 'A two-wheeled vehicle.' },
  { word: 'Elephant', hint: 'A large mammal with tusks.' },
  { word: 'Castle', hint: 'A fortified building, often with towers.' },
  { word: 'Cobweb', hint: 'A spider\'s web, typically found in corners.' },
  { word: 'Subway', hint: 'An underground railway.' },
  { word: 'Strength', hint: 'The quality or state of being strong.' },
];

let selectedWord = '';
let wordLength = 0;
let guessedLetters = [];
let remainingAttempts = 6;
let lastSelectedWord = '';
let wordsRemaining = [...wordList];

function getFromLocalStorage(key) {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : null;
}

updateCountersOnPage();

function getRandomWord() {
  if (wordsRemaining.length === 0) {
    showCongratulationsPopup();
    return;
  }

  let randomIndex;
  
  do {
    randomIndex = Math.floor(Math.random() * wordsRemaining.length);
  } while (wordsRemaining[randomIndex].word.toUpperCase() === lastSelectedWord);

  const wordObject = wordsRemaining[randomIndex];
  wordLength = wordObject.word.length;
  selectedWord = wordObject.word.toUpperCase();
  lastSelectedWord = selectedWord;

  wordsRemaining.splice(randomIndex, 1);

  return { word: selectedWord, hint: wordObject.hint, length: wordLength };
}

function showCongratulationsPopup() {
  alert('Congratulations! You have guessed all the words.');
}

function initializeGame() {
  const { word, hint, length } = getRandomWord();
  guessedLetters = [];
  remainingAttempts = 6;
  updateDisplay(Array(length).fill('_'));
  updateHint(hint);
  resetHealthDisplay();
}

function playGame() {
  initializeGame();
}

function updateDisplay(displayArray) {
  const wordElement = document.querySelector('.js-word');
  wordElement.innerHTML = displayArray.join(' ');
}

function updateHint(hint) {
  const hintElement = document.querySelector('.js-hint');
  hintElement.innerHTML = 'Hint: ' + hint;
}

function resetHealthDisplay() {
  const heartElements = document.querySelectorAll('.heart');
  heartElements.forEach(heart => {
    heart.style.visibility = 'visible';
  });
}

function updateHealthDisplay(remainingAttempts) {
  const heartElements = document.querySelectorAll('.heart');

  for (let i = 0; i < heartElements.length; i++) {
    if (i < remainingAttempts) {
      heartElements[i].style.visibility = 'visible';
    } else {
      heartElements[i].style.visibility = 'hidden';
    }
  }

  if (remainingAttempts === 0) {
    showLosePopup();
    setTimeout(() => {
      playGame();
    }, 1000);
  }
}

function showWinPopup() {
  alert('You win!');
  winsCount++;
  updateCountersOnPage();
}

function showLosePopup() {
  alert('You lose!');
  lossesCount++;
  updateCountersOnPage();
}

document.querySelector('.js-start').addEventListener('click', playGame);

document.querySelector('.js-start').addEventListener('click', () => {
  gameCount++;
  document.querySelector('.js-games').innerHTML = `Games: ${gameCount}`
});

document.querySelector('.js-restart').addEventListener('click', restartGame);

function restartGame() {
  gameCount = 0;
  winsCount = 0;
  lossesCount = 0;
  updateLocalStorageCounters();

  selectedWord = '';
  wordLength = 0;
  guessedLetters = [];
  remainingAttempts = 6;
  lastSelectedWord = '';
  wordsRemaining = [...wordList];

  initializeGame();
  updateCountersOnPage();
}

const letterButtons = document.querySelectorAll('.letter');

letterButtons.forEach(button => {
  button.addEventListener('click', () => handleLetterClick(button.innerHTML));
});

function handleLetterClick(letter) {
  const isLetterInWord = selectedWord.includes(letter);

  if (!guessedLetters.includes(letter.toUpperCase())) {
    guessedLetters.push(letter.toUpperCase());

    if (!isLetterInWord) {
      remainingAttempts--;
      updateHealthDisplay(remainingAttempts);
    }

    const updatedDisplay = updateDisplayWithGuess(selectedWord, guessedLetters);
    updateDisplay(updatedDisplay);

    if (!updatedDisplay.includes('_')) {
      showWinPopup();
      setTimeout(() => {
        playGame();
      }, 1000);
    }
  }
}

function updateDisplayWithGuess(word, guessedLetters) {
  return word.split('').map(letter => (guessedLetters.includes(letter.toUpperCase()) ? letter : '_'));
}

function updateCountersOnPage() {
  document.querySelector('.js-games').innerHTML = `Games: ${gameCount}`;
  document.querySelector('.js-wins').innerHTML = `Wins: ${winsCount}`;
  document.querySelector('.js-losses').innerHTML = `Losses: ${lossesCount}`;
}