/**
Entry point for the program
**/

var Main = require('main.js');
var Timer = require('easytimer.js').Timer;

document.addEventListener('DOMContentLoaded', () => {
  Main.main();
  Main.user_interface();

  Main.debug();

});
