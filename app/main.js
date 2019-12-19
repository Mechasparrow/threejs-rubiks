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
        console.log("new face required!");
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

function rotateLayer(layerNotation) {
  moves.push(
    Rubiks.Notation.decodeSingleNotation(layerNotation)
  )
}

module.exports = {
  main: main,
  rotateLayer: rotateLayer
};
