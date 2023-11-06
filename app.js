import { celebrities, cities, animals, mix } from "./words.js";

const svgField = document.querySelector("svg"),
  svgFigure = Array.from(svgField.children);

const btnPlay = document.querySelector("btn-play"),
  wordBox = document.querySelector("#secretword"),
  letterBox = document.querySelector("#wrongletters"),
  guessLetter = document.querySelector("#letterinput"),
  timer = document.querySelector("#timer");

let tryCounter = 0,
  newWord,
  secretWord,
  guessedLetters = [],
  wrongLetters = [],
  points = 0,
  chosenCategory = mix,
  start = Date.now();

// EventListener för att titta vad användare har gissat på för bokstav
guessLetter.addEventListener("keyup", (keyPress) => {
  if (isNaN(guessLetter.value)) {
    if (!guessedLetters.includes(guessLetter.value.toUpperCase())) {
      guessLetter.style.color = "green";
      if (keyPress.key === "Enter") {
        newLetter();
      }
    } else {
      guessLetter.style.color = "red";
    }
  } else {
    guessLetter.value = "";
  }
});

//Funktion som anropas när rätt format på inputfältet är.
const newLetter = () => {
  testLetter(guessLetter.value.toUpperCase(), newWord, secretWord);
  guessLetter.value = "";
};

//Funktion som visar del av figur
const showPart = (part) => {
  svgFigure[part].classList.remove("hidden");
};

//Funktion som återställer spelet till grundinställningar
const gameReset = () => {
  tryCounter = 0;

  svgFigure.forEach((part) => {
    part.classList.add("hidden");
  });
};

//Funktion som generar ett nytt ord ur array från vald kategori
const randomWord = (words) => {
  newWord = words[Math.floor(Math.random() * words.length)].toUpperCase();

  const secretArray = [];

  for (let word of newWord.split(" ")) {
    const secret = "_".repeat(word.length);
    secretArray.push(secret);
  }

  secretWord = secretArray.join(" ");
  wordBox.textContent = secretWord;
  return [newWord, secretWord];
};

//Funktion som visar en box som berättar status och frågar om man vill spela igen
const endGame = (gameStatus) => {
  const statusBox = document.querySelector(".status");
  statusBox.classList.remove("hidden");
  if (gameStatus) {
    let score = Math.floor(
      100 - (Date.now() - start) / 10000 - wrongLetters.length * 5
    );
    statusBox.querySelector(
      "h1"
    ).textContent = `You won mothafucka, gained: ${score} points`;
  } else {
    statusBox.querySelector(
      "h1"
    ).textContent = `You lose sucka, gained: ${points} points`;
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
    const result = secret.split("");
    positions.forEach((position) => {
      if (position < result.length) {
        result[position] = letter;
        points++;
      }
    });

    const resultString = result.join("");
    wordBox.textContent = resultString;
    secretWord = resultString;
    guessedLetters.push(letter);

    if (!secretWord.includes("_")) {
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
[newWord, secretWord] = randomWord(chosenCategory);
console.log(newWord);

const startTimer = () => {
  setInterval(() => {
    timer.innerHTML = ``;
    const seconds = Math.floor((Date.now() - start) / 1000);
    let minutes = Math.floor(seconds / 60);
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    let extraSeconds = seconds % 60;
    if (extraSeconds < 10) {
      extraSeconds = "0" + extraSeconds;
    }

    timer.innerHTML = `${minutes} : ${extraSeconds}`;
  }, 1000);
};

startTimer();
