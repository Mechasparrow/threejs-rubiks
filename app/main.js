/**
Main Program for rubiks application
**/

// Imports
var THREE = require ('three');
var CubeUtil = require('cubeUtil.js');
const OrbitControls = require('three-orbitcontrols')
var Rubiks = require('rubiksCube.js');

//3D Scene
var scene = new THREE.Scene();
var moves;
var notation = [];

//Function for creating the camera
function createCamera() {
  const fov = 75;
  const aspect = 2;  // the canvas default
  const near = 0.1;
  const far = 10;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

  return camera;
}

function main() {

  //load up the canvas
  const canvas = document.querySelector("#three-dimen");
  const renderer = new THREE.WebGLRenderer({canvas});

  //Create the camera
  const camera = createCamera();
  camera.position.set(2.75, 2.75, 2.75);

  //Create the scene
  scene = new THREE.Scene();

  //Create the rubiks cube
  var rubiksCube = Rubiks.createRubiksCube();

  //Spawn in the cube
  scene.add(rubiksCube);

  //Set the renderer background
  renderer.setClearColor( 0xeeeeee );

  //Test code
  //Rubiks.Notation.decodeSingleNotation('U\'')["faceVector"];

  //End test code

  //Render and animate the cube
  let rotationProgress = 0.0;
  let angle = 90;
  let rotationComplete = false;
  let face = undefined;
  let sequence = [];

  moves = sequence.map(function (notation) {
    return Rubiks.Notation.decodeSingleNotation(notation);
  });

  let animate = function () {

      requestAnimationFrame( animate );
      //anim(rubiksCube);

      if (face == undefined && moves.length > 0) {
        //console.log("new face required!");
        face = Rubiks.grabFace(rubiksCube, moves.pop(), scene)
      }

      if (rotationComplete) {
        let faceChildrenLen = face.children.length;
        for (let i = 0; i < faceChildrenLen; i++) {
          let cubelet = face.children[i];

          if (cubelet == undefined) {
            break;
          }


          rubiksCube.attach(cubelet);
          cubelet.position.round();
        }

        if (face.children.length == 0) {
          face = undefined;
          rotationProgress = 0.0;
          rotationComplete = false;
        }
      }

      if (face != undefined) {
        if (rotationProgress <= THREE.Math.degToRad(angle)) {
          rotationProgress = Rubiks.rotateFace(face,rotationProgress);
        }else {
          Rubiks.setFaceRotation(face, THREE.Math.degToRad(angle));
          rotationComplete = true;
        }
      }

      //Render the scene
      renderer.render(scene, camera);
  }

  //Camera controls
  const controls = new OrbitControls( camera, renderer.domElement );

  controls.addEventListener( 'change', function() { renderer.render(scene, camera); } );

  //Trigger animation
  animate();

}

function logMove(layerNotation) {
    notation.push(layerNotation);
    console.log(notation);
}

function rotateLayer(layerNotation) {


  moves.push(
    Rubiks.Notation.decodeSingleNotation(layerNotation)
  )
}


function undoMove() {
  if (notation.length == 0 || moves.length != 0) {
    return;
  }

  let moveToUndo = notation.pop();
  rotateLayer(Rubiks.Notation.invertNotation(moveToUndo));
  console.log(notation);
}

function user_interface() {

    //User movements
    let notations = ["F", "B", "U", "D", "L", "R"];

    let notationMove = function (notation) {
      return () => {
        logMove(notation);
        rotateLayer(notation);
      }
    }

    //regular notations
    notations.map(function (notation) {
      let notationBtn = document.querySelector("#rotate-" + notation + "-btn");
      notationBtn.addEventListener("click", notationMove(notation));

      let inverseNotationBtn = document.querySelector("#rotate-" + notation + "-prime-btn");
      inverseNotationBtn.addEventListener("click", notationMove(notation));
    })

    //Scrambling
    let scrambleBtn = document.querySelector("#scramble-btn");
    let scrambleTextElem = document.querySelector("#scramble-text");

    scrambleBtn.addEventListener("click", () => {
      console.log("scramble!");
      let scrambleCombination = Rubiks.Notation.createScramble(10);
      let scrambleText = "";

      scrambleCombination.forEach(function (notation) {
        scrambleText += notation + " ";
      });

      let actualScramble = scrambleCombination.slice().reverse();
      let newMoves = actualScramble.map(function (notation) {
        return Rubiks.Notation.decodeSingleNotation(notation);
      });
      moves = moves.concat(newMoves);


      notation = scrambleCombination;
      console.log(notation);

      scrambleTextElem.innerHTML = "<h1>" + "Scramble: " + "" + scrambleText + "" + "</h1>";
    })

    //Reseting
    let resetBtn = document.querySelector("#reset-btn");
    resetBtn.addEventListener("click", () => {
      location.reload();
    })

    //Undo Move
    let undoBtn = document.querySelector("#undo-btn");
    undoBtn.addEventListener("click", () => {
      undoMove();
    })

}

function debug() {
  /*
  console.log("DEBUG code");

  let notation = "F";
  let flipped = Rubiks.Notation.invertNotation(notation);

  if (flipped == "F\'") {
    console.log("Success");
  }
  */

}

module.exports = {
  main: main,
  user_interface: user_interface,
  debug: debug
};
