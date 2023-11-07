import { celebrities, cities, animals, mix } from './words.js';

const svgField = document.querySelector('svg'),
  svgFigure = Array.from(svgField.children);

const btnPlay = document.querySelector('.btn-play'),
  btnCategory = document.querySelector('.btn-category'),
  btnReset = document.querySelector('.btn-reset'),
  statusBox = document.querySelector('.status'),
  wordBox = document.querySelector('#secretword'),
  letterBox = document.querySelector('#wrongletters'),
  guessLetter = document.querySelector('#letterinput'),
  timer = document.querySelector('#timer'),
  categoryCont = document.querySelector('.category'),
  multiplayer = document.querySelector('.multiplayer'),
  btnMultiplayer = document.querySelector('.btn-multiplayer'),
  multipInput = document.getElementById('multiplayerword');

let tryCounter = 0,
  newWord,
  secretWord,
  guessedLetters = [],
  wrongLetters = [],
  score = 0,
  points = 0,
  chosenCategory = mix,
  gameTimer,
  multimode = false,
  start = Date.now();

// EventListener för att titta vad användare har gissat på för bokstav
guessLetter.addEventListener('keyup', (keyPress) => {
  if (isNaN(guessLetter.value)) {
    if (!guessedLetters.includes(guessLetter.value.toUpperCase())) {
      guessLetter.style.color = 'green';
      if (keyPress.key === 'Enter') {
        newLetter();
      }
    } else {
      guessLetter.style.color = 'red';
    }
  } else {
    guessLetter.value = '';
  }
});

//EventListener för att starta spelet
btnPlay.addEventListener('click', () => {
  gameReset();
  btnPlay.textContent = 'Reset';
  [newWord, secretWord] = randomWord(chosenCategory);
  multimode = false;
  startTimer();
});

//EventListener för att resetta spelet efter att man spelat klart
btnReset.addEventListener('click', () => {
  gameReset();
  startTimer();
  if (!multimode) {
    [newWord, secretWord] = randomWord(chosenCategory);
  statusBox.classList.add('hidden');
  } else if (multimode){
    multiplayer.classList.remove('hidden');
    statusBox.classList.add('hidden');
    multiplayerWord();
  }
  
});

//EventListener för att få välja kategorier
btnCategory.addEventListener('click', () => {
  categoryCont.classList.remove('hidden');
});

btnMultiplayer.addEventListener('click', () => {
  multiplayer.classList.remove('hidden');
  multiplayerWord();
});

const multiplayerWord = () => {
  const multipInput = document.getElementById('multiplayerword');
  const multiplayerSecretWord = multipInput.value.toUpperCase();
  [newWord, secretWord] = randomWord([multiplayerSecretWord]);
};

multipInput.addEventListener('keyup', (keyPress) => {
  if (keyPress.key === 'Enter') {
    multiplayer.classList.add('hidden');
    multimode = true;
    multiplayerWord();
    startTimer();
  }
});

//EventListener för att veta vilken knapp vi ska klicka på
categoryCont.querySelectorAll('button').forEach((btn) => {
  btn.addEventListener('click', () => {
    if (btn.id === 'cities') {
      chosenCategory = cities;
    } else if (btn.id === 'celebrities') {
      chosenCategory = celebrities;
    } else if (btn.id === 'animals') {
      chosenCategory = animals;
    } else if (btn.id === 'mix') {
      chosenCategory = mix;
    }
    categoryCont.classList.add('hidden');
    return chosenCategory;
  });
});

//Funktion som anropas när rätt format på inputfältet är.
const newLetter = () => {
  testLetter(guessLetter.value.toUpperCase(), newWord, secretWord);
  guessLetter.value = '';
};

//Funktion som visar del av figur
const showPart = (part) => {
  svgFigure[part].classList.remove('hidden');
};

//Funktion som återställer spelet till grundinställningar
const gameReset = () => {
  tryCounter = 0;
  guessedLetters = [];
  wrongLetters = [];
  score = 0;
  points = 0;

  svgFigure.forEach((part) => {
    part.classList.add('hidden');
  });

  letterBox.textContent = wrongLetters;
};

//Funktion som generar ett nytt ord ur array från vald kategori
const randomWord = (words) => {
  newWord = words[Math.floor(Math.random() * words.length)].toUpperCase();

  const secretArray = [];

  for (let word of newWord.split(' ')) {
    const secret = '_'.repeat(word.length);
    secretArray.push(secret);
  }

  secretWord = secretArray.join(' ');
  wordBox.textContent = secretWord;
  return [newWord, secretWord];
};

//Funktion som visar en box som berättar status och frågar om man vill spela igen
const endGame = (gameStatus) => {
  statusBox.classList.remove('hidden');
  if (gameStatus) {
    score =
      Math.floor(100 - (Date.now() - start) / 10000 - wrongLetters.length * 5) +
      points;
    statusBox.querySelector(
      'h1'
    ).textContent = `You won mothafucka, gained: ${score} points`;
  } else {
    statusBox.querySelector(
      'h1'
    ).textContent = `You lose sucka, gained: ${points} points`;
    stopTimer();
  }
};

//Funktion som testar bokstav samt matas med vårt secretWord och newWord
const testLetter = (letter, word, secret) => {
  const positions = [];
  //En loop som tittar om det är några positioner som passar till gissade bokstaven
  for (let i = 0; i < word.length; i++) {
    if (word[i] === letter) {
      positions.push(i);
    }
  }
  //Tittar om det fanns några träffar och byter isf ut _ -> rätt bokstav
  if (positions.length) {
    const result = secret.split('');
    positions.forEach((position) => {
      if (position < result.length) {
        result[position] = letter;
        points++;
      }
    });

    const resultString = result.join('');
    wordBox.textContent = resultString;
    secretWord = resultString;
    guessedLetters.push(letter);

    if (!secretWord.includes('_')) {
      endGame(true);
    }

    return [secretWord, guessedLetters];
  } else {
    //Om man gissade fel bokstav så får man konsekvenserna här.
    showPart(tryCounter);
    tryCounter++;

    guessedLetters.push(letter);
    wrongLetters.push(letter);
    letterBox.textContent = wrongLetters;

    if (tryCounter === 6) {
      endGame(false);
    }
    return [guessedLetters, wrongLetters, tryCounter];
  }
};

gameReset();

//Timer för att kunna räkna ut bonuspoäng
const startTimer = () => {
  stopTimer();
  const start = Date.now();

  gameTimer = setInterval(() => {
    const seconds = Math.floor((Date.now() - start) / 1000);
    let minutes = Math.floor(seconds / 60);
    if (minutes < 10) {
      minutes = '0' + minutes;
    }
    let extraSeconds = seconds % 60;
    if (extraSeconds < 10) {
      extraSeconds = '0' + extraSeconds;
    }

    timer.innerHTML = `${minutes} : ${extraSeconds}`;
  }, 1000);
  return gameTimer;
};

//Funktion för att stoppa timern
const stopTimer = () => {
  clearInterval(gameTimer);
};
