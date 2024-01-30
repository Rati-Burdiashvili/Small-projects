let wins = parseInt(localStorage.getItem('wins')) || 0;
let losses = parseInt(localStorage.getItem('losses')) || 0;

function playGame() {
  const randomNumber = Math.floor(Math.random() * 2);
  let result;

  if (randomNumber === 0) {
    result = 'heads';
  } else if (randomNumber === 1) {
    result = 'tails';
  } else {
    result = 'unknown';
  }

  return result;
}

document.querySelector('.js-heads-button').addEventListener('click', function() {
  const result = playGame();

  if (result === 'heads') {
    document.querySelector('.js-result').innerHTML = 'You win!';
    wins++;
  } else {
    document.querySelector('.js-result').innerHTML = 'You lose.';
    losses++;
  }

  localStorage.setItem('wins', wins);
  localStorage.setItem('losses', losses);

  updateScore();
});

document.querySelector('.js-tails-button').addEventListener('click', function() {
  const result = playGame();

  if (result === 'tails') {
    document.querySelector('.js-result').innerHTML = 'You win!';
    wins++;
  } else {
    document.querySelector('.js-result').innerHTML = 'You lose.';
    losses++;
  }

  localStorage.setItem('wins', wins);
  localStorage.setItem('losses', losses);

  updateScore();
});

document.querySelector('.js-score-reset-button').addEventListener('click', function() {
  wins = 0;
  losses = 0;

  localStorage.setItem('wins', wins);
  localStorage.setItem('losses', losses);
  
  updateScore();
});

function updateScore() {
  document.querySelector('.js-score').innerHTML = `Wins: ${wins} Losses: ${losses}`;
}