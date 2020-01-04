var Timer = require('easytimer.js').Timer;

var timer;

function updateTimer(timer, timerElem) {
  timerElem.innerHTML = timer.getTimeValues().toString();
}


function initTimer() {
  timer = new Timer();
}

function timerUI() {

  let timerText = document.querySelector("#timer-text");

  //Timer binding for display
  timer.addEventListener('secondsUpdated', function (e) {
    updateTimer(timer, timerText);
  })
  timer.addEventListener('secondsUpdated', function (e) {
    updateTimer(timer, timerText);
  });
  timer.addEventListener('started', function (e) {
    updateTimer(timer, timerText);
  });
  timer.addEventListener('reset', function (e) {
    updateTimer(timer, timerText);
  });

  //Button bindings
  let timerStartBtn = document.querySelector("#timer-start-btn");
  let timerStopBtn = document.querySelector("#timer-stop-btn");
  let timerRestartBtn = document.querySelector("#timer-restart-btn");

  timerStartBtn.addEventListener("click", function (e) {
    startTimer();
  })

  timerStopBtn.addEventListener("click", function (e) {
    stopTimer();
  })

  timerRestartBtn.addEventListener("click", function (e) {
    resetTimer();
  })

}

function startTimer() {
  timer.start();
}

function stopTimer() {
  timer.stop();
}

function resetTimer() {
  timer.reset();
  stopTimer();
}

module.exports = {
  timerUI: timerUI,
  initTimer: initTimer,
  startTimer: startTimer
}
