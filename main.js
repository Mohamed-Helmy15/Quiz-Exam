// variables
let box;
let heading;
let questions;
let randomIndex;
let randomNumber;
let randomAnswers;
let numbersArrayQuestions = createArrayOfNumber(0, 19);
let numbersArrayAnswers = createArrayOfNumber(1, 4);
let span;
let counter, time, minutes, seconds;
let correct = 0,
  inCorrect = 0;
let result, state;
let numberOfQuestions = 10,
  quizCount = 0;
// variables

// Elements
let count = document.querySelector(
  ".quiz-container .header div:last-child .count"
);
let bullets = document.querySelector(".bullets");
let quizElement = document.querySelector(".quiz-area");
let options = document.querySelector(".options");
let submit = document.querySelector(".submit");
let answers;
let overlay = document.querySelector(".overlay");
let button = document.querySelector(".overlay > div");
// Elements

// main function
button.onclick = function () {
  overlay.remove();
  getQuestionsFromJson();
};
// main function

// functions
function getQuestionsFromJson() {
  let myRequest = new XMLHttpRequest();
  myRequest.onreadystatechange = function () {
    if (this.status === 200 && this.readyState === 4) {
      questions = JSON.parse(myRequest.responseText);
      count.innerHTML = numberOfQuestions;
      createBullets();
      addQuestionToPage(questions, generateRandom(numbersArrayQuestions));
      timer();
    }
  };
  myRequest.open("GET", "quiz.json", true);
  myRequest.send();
}

function createBullets() {
  for (let i = 0; i < numberOfQuestions; i++) {
    span = document.createElement("span");
    if (i === 0) {
      span.className = "active";
    }
    bullets.append(span);
  }
}

function addQuestionToPage(quiz, currentIndex) {
  heading = document.createElement("h3");
  heading.className = "question";
  heading.append(document.createTextNode(quiz[currentIndex].title));
  quizElement.prepend(heading);
  addAnswers(quiz, currentIndex);
  answers = document.querySelectorAll(
    ".quiz-container .quiz-area .options .box input"
  );

  // submit click
  submit.onclick = function () {
    quizCount++;
    clearInterval(counter);
    time.remove();
    timer();
    answers.forEach((answer) => {
      if (answer.checked) {
        if (answer.dataset.answer == quiz[currentIndex]["correct-answer"]) {
          correct++;
        } else {
          inCorrect++;
        }
      }
    });

    // customize question title and answers
    heading.remove();
    document.querySelectorAll(".box").forEach((box) => {
      box.remove();
    });
    numbersArrayAnswers = createArrayOfNumber(1, 4);
    let randomQuestions = generateRandom(numbersArrayQuestions);
    if (randomQuestions != undefined && quizCount != numberOfQuestions) {
      addQuestionToPage(questions, randomQuestions);
    } else {
      submit.remove();
      bullets.remove();
      quizElement.remove();
      clearInterval(counter);
      result = document.createElement("div");
      result.className = "result";
      state = document.createElement("span");
      state.className = "state";
      if (correct == numberOfQuestions) {
        state.innerHTML = `Perfect`;
        state.style.color = "#0075ff";
      } else if (correct > numberOfQuestions / 2) {
        state.innerHTML = `Good`;
        state.style.color = "#ffc107";
      } else {
        state.innerHTML = `Bad`;
        state.style.color = "#f44336";
      }
      result.append(state);
      result.append(` you answered ${correct} from ${numberOfQuestions}`);
      document.querySelector(".quiz-container").append(result);
      let reset = document.createElement("button");
      reset.className = "reset";
      reset.append("Reset Quiz");
      reset.style.backgroundColor = "#f44336";
      reset.onclick = function () {
        window.location.reload();
      };
      document.querySelector(".quiz-container").append(reset);
    }
    // customize question title and answers

    //customize bullets
    let spans = document.querySelectorAll(".bullets span.active + span");
    spans.forEach((span) => {
      span.classList.add("active");
    });
    //customize bullets
  };
  // submit click
}

function addAnswers(quiz, currentIndex) {
  for (let i = 1; i <= 4; i++) {
    randomAnswers = generateRandom(numbersArrayAnswers);
    box = document.createElement("div");
    box.className = "box";
    let input = document.createElement("input");
    input.type = "radio";
    input.id = `answer-${randomAnswers}`;
    input.name = "answer";
    input.dataset.answer = `${quiz[currentIndex][`answer-${randomAnswers}`]}`;
    if (i === 1) {
      input.checked = true;
    }
    let label = document.createElement("label");
    label.htmlFor = `answer-${randomAnswers}`;
    label.append(`${quiz[currentIndex][`answer-${randomAnswers}`]}`);
    box.append(input);
    box.append(label);
    options.append(box);
  }
}

function timer() {
  time = document.createElement("div");
  time.className = "time";
  minutes = document.createElement("span");
  minutes.className = "minutes";
  minutes.innerHTML = `00`;
  seconds = document.createElement("span");
  seconds.className = "seconds";
  seconds.innerHTML = `5`;
  time.append(minutes);
  time.append(":");
  time.append(seconds);
  bullets.append(time);
  counter = setInterval(() => {
    +seconds.innerHTML--;
    if (+seconds.innerHTML < 10 && +seconds.innerHTML) {
      seconds.innerHTML = `0${+seconds.innerHTML}`;
    } else if (+seconds.innerHTML == 0) {
      clearInterval(counter);
      submit.click();
    } else {
      seconds.innerHTML = `${+seconds.innerHTML--}`;
    }
  }, 1000);
}

function getRandomNumber(min, max) {
  let totalEle = max - min + 1;
  let result = Math.floor(Math.random() * totalEle) + min;
  return result;
}

function createArrayOfNumber(start, end) {
  let myArray = [];
  for (let i = start; i <= end; i++) {
    myArray.push(i);
  }
  return myArray;
}

function generateRandom(array) {
  if (array.length === 0) {
    return;
  }
  randomIndex = getRandomNumber(0, array.length - 1);
  randomNumber = array[randomIndex];
  array.splice(randomIndex, 1);
  return randomNumber;
}
//functions
