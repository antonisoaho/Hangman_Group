import { celebrities, cities, animals } from './words.js';

const svgFigure = document.querySelectorAll('svg .hidden');

const btnPlay = document.querySelector('btn-play'),
  wordBox = document.querySelector('#secretword'),
  letterBox = document.querySelector('#wrongletters'),
  guessLetter = document.querySelector('#letterinput');

let tryCounter = 0,
  newWord,
  secretWord,
  guessedLetters = [],
  wrongLetters = [],
  points = 0;

const showPart = (part) => {
  svgFigure[part].classList.toggle('hidden');
  tryCounter++;
  return tryCounter;
};

const gameReset = () => {
  tryCounter = 0;
};

const randomWord = (words) => {
  newWord = words[Math.floor(Math.random() * words.length)].toUpperCase();

  const secretArray = [];

  for (let word of newWord.split(' ')) {
    const secret = '_'.repeat(word.length);
    secretArray.push(secret);
  }

  secretWord = secretArray.join(' ');
  wordBox.textContent = secretWord;
  return [secretWord, newWord];
};

const testLetter = (letter, word, secret) => {
  const positions = [];
  for (let i = 0; i < word.length; i++) {
    if (word[i] === letter) {
      positions.push(i);
    }
  }

  if (positions.length) {
    const result = secret.split('');
    positions.forEach((position) => {
      if (position < resultArray.length) {
        result[position] = letter;
        points++;
      }
    });

    const resultString = result.join('');
    wordBox.textContent = resultString;
    secretWord = resultString;
    guessedLetters.push(letter);
    return [secretWord, guessedLetters];
  } else {
    guessedLetters.push(letter);
    wrongLetters.push(letter);
    letterBox.textContent = wrongLetters;
    return [guessedLetters, wrongLetters];
  }
};

newWord = randomWord(celebrities);
console.log(newWord);
testLetter('T', newWord, secretWord);
