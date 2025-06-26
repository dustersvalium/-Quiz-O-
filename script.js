
// Wrap all logic inside DOMContentLoaded to ensure elements are available

document.addEventListener("DOMContentLoaded", function () {

// === GLOBAL VARIABLES ===
let currentQuestionIndex = 0;
let score = 0;

// Array to store default questions
const defaultQuestions = [
  {
    question: "Agency problem is a situation in which",
    answers: [
      "Financial intermediaries facilitate the flow of funds from surplus to deficit units",
      "Tension between management and shareholders regarding their different interests in the firm",
      "If an organisation is using its inputs in a cost effective manner to produce outputs of the cheapest possible cost",
      "The firm is able to produce the maximum output with the given inputs"
    ],
    correctAnswer: 1
  },
  {
    question: "Cap",
    answers: [
      "Market where previously issues securities are traded",
      "Rate on a transaction when instruments are traded & setteled on the same day or the following",
      "A supervisory process to ensure that a bank has sound internal processes in place",
      "Protect against increasing interest rates"
    ],
    correctAnswer: 3
  },
  {
    question: "What is the primary purpose of a central bank?",
    answers: ["To issue currency", "To regulate commercial banks", "To manage inflation", "All of the above"],
    correctAnswer: 3
  },
  {
    question: "What is Bankserv?",
    answers: [
      "PCH system operator that is responsible for clearing and settlement of all interbank transactions",
      "A measure of rate of returns to shareholders",
      "A managerial process to address risk faced by banks due to mismatch of assets and liabilities",
      "The value & time weighted measure of maturity that considers the timing of cags from assets and liabilities"
    ],
    correctAnswer: 0
  },
  {
    question: "Which of these does the Darby Feldstein theory align with?",
    answers: [
      "Argues that real interest rates are determined by the supply and demand for money",
      "The theory that the real interest rate is determined by the supply and demand for loanable funds",
      "Argues that market nominal interest rates will move in the same direction as inflation but the relaionship will be greater than one to one",
      "Nominal interest rates will decrease by the same magnitude as the change in inflation"
    ],
    correctAnswer: 2
  }
];

// Force reset logic for questions so that they are always available even after refreshing page
localStorage.removeItem("questions"); // Clear outdated questions if they exist
let questions = defaultQuestions;
localStorage.setItem("questions", JSON.stringify(questions));

// === EVENT LISTENERS ===

const startBtn = document.getElementById("start-btn");
startBtn.addEventListener("click", () => {
  score = 0;
  currentQuestionIndex = 0;
  showScreen("quiz-screen");
  loadQuestion();
});

document.getElementById("restart-btn").addEventListener("click", () => {
  score = 0;
  currentQuestionIndex = 0;
  showScreen("quiz-screen");
  loadQuestion();
});

const backToStartBtn = document.getElementById("back-to-start-btn");
const backFromViewBtn = document.getElementById("back-from-view-btn");

backToStartBtn.addEventListener("click", () => {
  showScreen("start-screen");
});

backFromViewBtn.addEventListener("click", () => {
  showScreen("start-screen");
});

const addQuestionBtn = document.getElementById("add-question-btn");
addQuestionBtn.addEventListener("click", () => {
  showScreen("add-question-screen");
});

const viewQuestionsBtn = document.getElementById("view-questions-btn");
viewQuestionsBtn.addEventListener("click", () => {
  renderQuestionList();
  showScreen("view-questions-screen");
});

const cancelAddQuestionBtn = document.getElementById("cancel-add-question");
cancelAddQuestionBtn.addEventListener("click", () => {
  showScreen("start-screen");
});

const addQuestionForm = document.getElementById("add-question-form");
addQuestionForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const questionText = document.getElementById("new-question").value;
  const answerInputs = document.querySelectorAll(".answer-input");
  const checkedRadio = document.querySelector("input[name='correct-answer']:checked");

  if (!checkedRadio) {
    alert("Please select the correct answer.");
    return;
  }

  const correctIndex = parseInt(checkedRadio.value);
  const answers = Array.from(answerInputs).map(input => input.value);

  const newQuestion = {
    question: questionText,
    answers: answers,
    correctAnswer: correctIndex
  };

  questions.push(newQuestion);
  localStorage.setItem("questions", JSON.stringify(questions));

  addQuestionForm.reset();
  alert("Question added successfully!");
  showScreen("start-screen");
});

// === FUNCTIONS ===

function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.remove("active");
  });
  document.getElementById(screenId).classList.add("active");
}

function loadQuestion() {
  const current = questions[currentQuestionIndex];
  document.getElementById("question-text").innerText = current.question;

  const answersContainer = document.getElementById("answers-container");
  answersContainer.innerHTML = "";

  current.answers.forEach((answer, index) => {
    const btn = document.createElement("button");
    btn.classList.add("answer-btn");
    btn.innerText = answer;
    btn.addEventListener("click", () => handleAnswer(index));
    answersContainer.appendChild(btn);
  });

  document.getElementById("current-question").innerText = currentQuestionIndex + 1;
  document.getElementById("total-questions").innerText = questions.length;
  const progress = ((currentQuestionIndex) / questions.length) * 100;
  document.getElementById("progress").style.width = progress + "%";
}

function handleAnswer(selectedIndex) {
  const correct = questions[currentQuestionIndex].correctAnswer;
  const buttons = document.querySelectorAll(".answer-btn");

  buttons.forEach((btn, i) => {
    if (i === correct) btn.classList.add("correct");
    else if (i === selectedIndex) btn.classList.add("incorrect");
    btn.disabled = true;
  });

  if (selectedIndex === correct) {
    score++;
    document.getElementById("score").innerText = score;
  }

  setTimeout(() => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      loadQuestion();
    } else {
      endQuiz();
    }
  }, 1000);
}

function endQuiz() {
  document.getElementById("final-score").innerText = score;
  document.getElementById("max-score").innerText = questions.length;
  document.getElementById("result-message").innerText =
    score === questions.length ? "Excellent work!" :
    score >= questions.length / 2 ? "Good effort!" :
    "Keep practicing!";
  document.getElementById("score").innerText = score;
  showScreen("result-screen");
}

function renderQuestionList() {
  const list = document.getElementById("questions-list");
  list.innerHTML = "";

  questions.forEach((q, idx) => {
    const item = document.createElement("div");
    item.classList.add("question-item");

    let answersHTML = "<ul>";
    q.answers.forEach((ans, i) => {
      const isCorrect = i === q.correctAnswer;
      answersHTML += `<li class="${isCorrect ? 'correct-answer' : ''}">${ans}</li>`;
    });
    answersHTML += "</ul>";

    item.innerHTML = `<h3>${q.question}</h3>${answersHTML}`;
    list.appendChild(item);
  });
}

}); 
