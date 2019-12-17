var THREE = require ('three');
var CubeUtil = require('cubeUtil.js');
const OrbitControls = require('three-orbitcontrols')

var Rubiks = require('rubiksCube.js');

var scene = new THREE.Scene();

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
  camera.position.z = 5;

  //Create the scene
  const scene = new THREE.Scene();

  //Create the rubiks cube
  var rubiksCube = Rubiks.createRubiksCube();

  //Spawn in the cube
  scene.add(rubiksCube);

  //TEST CODE


  //END TEST CODE


  //Set the renderer background
  renderer.setClearColor( 0xeeeeee );

  //Render and animate the cube
  let rotationProgress = 0.0;
  let angle = 90;
  let rotationComplete = false;
  let face = undefined;
  let faces = [new THREE.Vector3(0,1,0), new THREE.Vector3(0,1,0), new THREE.Vector3(0,0,1), new THREE.Vector3(1,1,1), new THREE.Vector3(-1,-1,-1)];

  let animate = function () {

      requestAnimationFrame( animate );
      //anim(rubiksCube);

      if (face == undefined && faces.length > 0) {
        console.log("new face required!");
        face = Rubiks.grabFace(rubiksCube, faces.pop(), scene)
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
          console.log("all destroyed");
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

module.exports = main;
