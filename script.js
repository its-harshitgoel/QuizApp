let currentQuestionIndex = 0;
let score = 0;
let timer;
let questions = [];
let totalQuestions = 0;

async function loadQuestions() {
    try {
        const response = await fetch('questions.json'); 
        questions = await response.json();
        totalQuestions = questions.length;

        document.getElementById("total-questions").innerText = totalQuestions;

        loadQuestion(); 
    } catch (error) {
        console.error("Error fetching questions:", error);
    }
}

function loadQuestion() {
    clearInterval(timer);
    const questionObj = questions[currentQuestionIndex];
    document.getElementById("question").innerText = questionObj.question;
    const optionsBox = document.getElementById("options-box");
    optionsBox.innerHTML = ''; 

    questionObj.options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.className = 'option';
        btn.innerText = option;
        btn.onclick = () => checkAnswer(index, questionObj.answer);
        optionsBox.appendChild(btn);
    });

    document.getElementById("next-btn").style.display = 'none'; 
    document.getElementById("current-score").innerText = score; 
    startTimer();
}

function checkAnswer(selectedIndex, correctIndex) {
    const options = document.querySelectorAll('.option');

    options.forEach((option, index) => {
        option.classList.add('already-answered'); 

        if (index === correctIndex) {
            option.classList.add('correct'); 
        } else if (index === selectedIndex) {
            option.classList.add('incorrect'); 
        }
    });

    clearInterval(timer);

    if (selectedIndex === correctIndex) {
        score++;
    }

    document.getElementById("current-score").innerText = score;

    if (currentQuestionIndex < totalQuestions - 1) {
        document.getElementById("next-btn").style.display = 'block';
        document.getElementById("next-btn").innerText = 'Next Question'; 
    } else {
        document.getElementById("next-btn").style.display = 'block';
        document.getElementById("next-btn").innerText = 'Show Result'; 
        document.getElementById("next-btn").onclick = showResult; 
    }
}

function loadNextQuestion() {
    currentQuestionIndex++;
    loadQuestion();
}

function startTimer() {
    let timeRemaining = 15;
    document.getElementById("time").innerText = timeRemaining;

    timer = setInterval(() => {
        timeRemaining--;
        document.getElementById("time").innerText = timeRemaining;

        if (timeRemaining === 0) {
            clearInterval(timer);
            checkAnswer(-1, questions[currentQuestionIndex].answer); 
        }
    }, 1000);
}

function showResult() {
    window.location.href = 'result.html?score=' + score + '&total=' + totalQuestions;
}

function restartQuiz() {
    window.location.href = 'index.html';
}

window.onload = loadQuestions;
