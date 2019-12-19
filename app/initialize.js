/**
Entry point for the program
**/

var Main = require('main.js');

document.addEventListener('DOMContentLoaded', () => {
  Main.main();

  var notations = ["F", "B", "U", "D", "L", "R"];

  //regular notations
  notations.map(function (notation) {
    let notationBtn = document.querySelector("#rotate-" + notation + "-btn");
    notationBtn.addEventListener("click", () => {
      Main.rotateLayer(notation);
    })

    let inverseNotationBtn = document.querySelector("#rotate-" + notation + "-prime-btn");
    inverseNotationBtn.addEventListener("click", () => {
      Main.rotateLayer(notation + "\'");
    })
  })
});
