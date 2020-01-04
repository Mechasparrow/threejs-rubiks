/**
Entry point for the program
**/

var Main = require('main.js');
var rubiksTimer = require('rubiksTimer.js');

document.addEventListener('DOMContentLoaded', () => {
  Main.main();
  Main.user_interface();

  Main.debug();

  rubiksTimer.initTimer();
  rubiksTimer.timerUI();
});
