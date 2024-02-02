let calculation = localStorage.getItem('calculation') || '';

displayCalculation();

function updateCalculation(value) {
  if (isSymbol(value)) {
    if (isSymbol(calculation.slice(-1))) {
      calculation = calculation.slice(0, -1) + value;
    } else {
      calculation += value;
    }
  } else {
    calculation += value;
  }

  displayCalculation();
  localStorage.setItem('calculation', calculation);
}

function isSymbol(value) {
  const symbols = ['+', '-', '*', '/'];
  return symbols.includes(value);
}

function displayCalculation() {
  document.querySelector('.js-calculation')
    .innerHTML = calculation;
}

function deleteLastCharacter() {
  calculation = calculation.slice(0, - 1);

  displayCalculation();

  localStorage.setItem('calculation', calculation);
}