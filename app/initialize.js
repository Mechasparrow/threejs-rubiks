/**
Entry point for the program
**/

var Main = require('main.js');

document.addEventListener('DOMContentLoaded', () => {
  Main.main();
  Main.user_interface();

  Main.debug();

});
