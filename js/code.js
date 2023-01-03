let text = "На краю дороги стоял дуб. Вероятно, в десять раз старше берез, составлявших лес, он был в десять раз толще, и в два раза выше каждой березы. Это был огромный, в два обхвата дуб, с обломанными, давно, видно, суками и с обломанной корой, заросшей старыми болячками. С огромными своими неуклюже, несимметрично растопыренными корявыми руками и пальцами, он старым, сердитым и презрительным уродом стоял между улыбающимися березами. Только он один не хотел подчиняться обаянию весны и не хотел видеть ни весны, ни солнца."
let words
let count_per_min = 60
let curent_word = 0
let timerID
let index = 0
let ngrams
let inProcess = false

const FULL_DASH_ARRAY = 283;
let WARNING_THRESHOLD = 30;
let ALERT_THRESHOLD = 15;

const COLOR_CODES = {
    info: {
        color: "green"
    },
    warning: {
        color: "orange",
        threshold: WARNING_THRESHOLD
    },
    alert: {
        color: "red",
        threshold: ALERT_THRESHOLD
    }
};

let TIME_LIMIT = 60;
let timePassed = 0;
let timeLeft = TIME_LIMIT;
let timerInterval = null;
let remainingPathColor = COLOR_CODES.info.color;

const Values = [60, 75, 100, 120, 160, 200, 250, 300, 350, 400, 450, 500]

function toggleForm(value) {
    let form = document.forms[0]
    for (let i = 1; i < form.length; i++) {
        form[i].disabled = value
        form[i].style.visibility = value
    }
    form[0].classList.toggle('--red')
}

function StartClick(event) {
    if(!inProcess) {
        inProcess = true
        Start()
    } else {
        inProcess = false
        WordStop()
    }
}

function Start() {
    count_per_min = document.getElementById("curentNumber").valueAsNumber
    curent_word = 0
    text = text.replace(/[,\/#$%\^&\*;:{}=\-_`~()]/g, "")
    words = text.split(' ')
    ngrams = document.getElementById("ngrams").valueAsNumber
    temp_ngrams = []
    if (ngrams != 1) {
        for (let i = 0; i < words.length; i += ngrams) {
            let temp_ngram = words[i]
            for (let j = 1; j < ngrams; j++) {
                let temp = words[i + j] || " "
                temp_ngram += (" " + temp)
            }
            temp_ngrams.push(temp_ngram)
        }
    } else {
        temp_ngrams = words
    }
    words = temp_ngrams
    console.log(document.getElementById("timerTime").valueAsNumber)
    TIME_LIMIT = (document.getElementById("timerTime").valueAsNumber / 1000)
    timePassed = 0
    timeLeft = TIME_LIMIT
    WARNING_THRESHOLD = Number(TIME_LIMIT / 2)
    ALERT_THRESHOLD = Number(WARNING_THRESHOLD / 2)
    toggleForm(true)
    timerID = setInterval(count_timer, 300)
}

function changeWord() {
    let el = document.getElementById('word')
    if (index < words.length) {
        el.innerHTML = words[index]
        index += 1
    } else {
        WordStop()
    }
}

function count_timer() {
    if (index <= 2) {
        let el = document.getElementById('word')
        el.innerHTML = index + 1
        index += 1
    } else {
        clearInterval(timerID)
        index = 0
        timerID = setInterval(changeWord, 60000 / count_per_min)
        startTimer()
    }
}

function ChangeNumber(event) {
    document.getElementById("curentNumber").value = Values[event.target.valueAsNumber]
}

window.onload = function (event) {
    //document.forms[0][0].classList.toggle('--red')
    let el = document.getElementById('volume')
    el.onchange = ChangeNumber
    document.getElementById("app").innerHTML = `<div class="base-timer"><svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><g class="base-timer__circle"><circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle><path id="base-timer-path-remaining" stroke-dasharray="283" class="base-timer__path-remaining ${remainingPathColor}" d="M 50, 50 m -45, 0 a 45,45 0 1,0 90,0 a 45,45 0 1,0 -90,0"></path></g></svg><span id="base-timer-label" class="base-timer__label">${formatTime(timeLeft)}</span></div>`;
}



function onTimesUp() {
    clearInterval(timerInterval);
    timePassed = 0
}

function WordStop() {
    index = 0
    onTimesUp()
    clearInterval(timerID)
    document.getElementById('word').innerHTML = "КОНЕЦ."
    toggleForm(false)
    timeLeft = TIME_LIMIT
    document.getElementById("base-timer-label").innerHTML = formatTime(timeLeft)
    setCircleDasharray()
}

function startTimer() {
    timerInterval = setInterval(() => {
        timePassed = timePassed += 1
        timeLeft = TIME_LIMIT - timePassed
        document.getElementById("base-timer-label").innerHTML = formatTime(timeLeft)
        setCircleDasharray()
        setRemainingPathColor(timeLeft)
        if (timeLeft === 0) WordStop()

    }, 1000);
}

function formatTime(time) {
    const minutes = Math.floor(time / 60)
    let seconds = time % 60

    if (seconds < 10) seconds = `0${seconds}`

    return `${minutes}:${seconds}`
}

function setRemainingPathColor(timeLeft) {
    const { alert, warning, info } = COLOR_CODES
    if (timeLeft <= alert.threshold) {
        document
            .getElementById("base-timer-path-remaining")
            .classList.remove(warning.color)
        document
            .getElementById("base-timer-path-remaining")
            .classList.add(alert.color);
    } else if (timeLeft <= warning.threshold) {
        document
            .getElementById("base-timer-path-remaining")
            .classList.remove(info.color)
        document
            .getElementById("base-timer-path-remaining")
            .classList.add(warning.color)
    }
}

function calculateTimeFraction() {
    const rawTimeFraction = timeLeft / TIME_LIMIT
    return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction)
}

function setCircleDasharray() {
    const circleDasharray = `${(calculateTimeFraction() * FULL_DASH_ARRAY).toFixed(0)} 283`
    document
        .getElementById("base-timer-path-remaining")
        .setAttribute("stroke-dasharray", circleDasharray)
}

