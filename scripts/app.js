import { celebrities, cities, animals, mix } from './words.js';
import {
  animalSound,
  celebSound,
  citySound,
  deathSound,
  startSound,
  winSound,
} from './sounds.js';

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
  multipInput = document.getElementById('multiplayerword'),
  muteBtns = document.querySelectorAll('.btn-sound');

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

const pattern = /[^a-zA-ZåäöÅÄÖ]/g;
const wsPattern = /[^a-zA-ZåäöÅÄÖ ]/g;

let muteStatus = false;

//EventListener för att se om man vill ha avstängt ljud
muteBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    swapMute(btn.id === 'sound');
  });
});

const swapMute = (bool) => {
  muteBtns.forEach((btn) => {
    btn.classList.toggle('hidden');
  });
  muteStatus = bool;
  return muteStatus;
};

//EventListener för att starta spelet
btnPlay.addEventListener('click', () => {
  gameReset();
  btnPlay.textContent = 'Reset';
  [newWord, secretWord] = randomWord(chosenCategory);
  multimode = false;
  startTimer();
  guessLetter.focus();
});

// EventListener för att titta vad användare har gissat på för bokstav
guessLetter.addEventListener('keyup', (keyPress) => {
  const replacedValue = guessLetter.value;
  guessLetter.value = replacedValue.replace(pattern, '');

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

//EventListener för att resetta spelet efter att man spelat klart
btnReset.addEventListener('click', () => {
  gameReset();
  multimode ? '' : startTimer();
  if (!multimode) {
    [newWord, secretWord] = randomWord(chosenCategory);
    statusBox.classList.add('hidden');
    guessLetter.focus();
  } else if (multimode) {
    multiplayer.classList.remove('hidden');
    statusBox.classList.add('hidden');
    multipInput.focus();
  }
});

//EventListener för att få välja kategorier
btnCategory.addEventListener('click', () => {
  categoryCont.classList.remove('hidden');
});

//EventListener för att starta multiplayermode
btnMultiplayer.addEventListener('click', () => {
  multiplayer.classList.remove('hidden');
  multipInput.focus();
});

//EventListener för att stänga ner om man ångrat sig
multiplayer.querySelector('.btn-close').addEventListener('click', () => {
  multiplayer.classList.add('hidden');
  gameReset();
});

//Funktion för att ta user-input på ordet
const multiplayerWord = () => {
  const multiplayerSecretWord = multipInput.value.toUpperCase();

  multipInput.value = '';
  [newWord, secretWord] = randomWord([multiplayerSecretWord]);
  guessLetter.focus();
};

//EventListener för att titta så att användaren har skrivit klart
multipInput.addEventListener('keyup', (keyPress) => {
  //För att kontrollera så att man inte skriver i en siffra
  let value = multipInput.value;
  const newValue = value.replace(wsPattern, '');
  // value = newValue.replace(symPattern, '');
  multipInput.value = newValue;

  if (keyPress.key === 'Enter') {
    multiplayer.classList.add('hidden');
    multimode = true;
    multiplayerWord();
    startTimer();
  }
});

//EventListener för att veta vilken kategori det klickats på
categoryCont.querySelectorAll('button').forEach((btn) => {
  btn.addEventListener('click', () => {
    if (btn.id === 'cities') {
      chosenCategory = cities;
      !muteStatus ? citySound.play() : '';
    } else if (btn.id === 'celebrities') {
      chosenCategory = celebrities;
      !muteStatus ? celebSound.play() : '';
    } else if (btn.id === 'animals') {
      chosenCategory = animals;
      !muteStatus ? animalSound.play() : '';
    } else if (btn.id === 'mix') {
      chosenCategory = mix;
    }
    btnPlay.textContent = 'Play';
    gameReset();
    categoryCont.classList.add('hidden');
    return chosenCategory;
  });
});

//Funktion som anropas för att göra om gissad bokstav till upperCase och återställa fältet
const newLetter = () => {
  testLetter(guessLetter.value.toUpperCase(), newWord, secretWord);
  guessLetter.value = '';
};

//Funktion som visar del av figur
const showPart = (part) => {
  svgFigure[part].classList.remove('hidden');
};

//Funktion för att stoppa timern
const stopTimer = () => {
  clearInterval(gameTimer);
};

//Funktion som återställer spelet till grundinställningar
const gameReset = () => {
  tryCounter = 0;
  guessedLetters = [];
  wrongLetters = [];
  score = 0;
  points = 0;
  stopTimer();
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
  const correctWord = statusBox.querySelector('.correctword');
  if (gameStatus) {
    score =
      Math.floor(100 - (Date.now() - start) / 10000 - wrongLetters.length * 5) +
      points;
    muteStatus ? '' : winSound.play();
    statusBox.querySelector(
      'h1'
    ).textContent = `Winner winner chicken dinner: ${score} points`;
    correctWord.textContent = '';
    correctWord.classList.remove('spinner');
  } else {
    muteStatus ? '' : deathSound.play();
    statusBox.querySelector(
      'h1'
    ).textContent = `You lose, gained: ${points} points`;
    statusBox.querySelector(
      '.correctword'
    ).textContent = `Correct word: ${newWord}`;
    correctWord.classList.add('spinner');
    stopTimer();
  }
};

//EventListener för att stänga statusfönstret efter en match
statusBox.querySelector('.btn-close').addEventListener('click', () => {
  statusBox.classList.add('hidden');
});

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

//Timer för att kunna räkna ut bonuspoäng
const startTimer = () => {
  stopTimer();
  muteStatus ? '' : startSound.play();
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

gameReset();
