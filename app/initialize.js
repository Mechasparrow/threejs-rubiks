var THREE = require ('three');
var CubeUtil = require('cubeUtil.js');
const OrbitControls = require('three-orbitcontrols')

var scene = new THREE.Scene();

//NOTE
//Rubiks colors
/*

white, red, blue, orange, green, and yellow

*/

//TODO general piece constructor
function createPiece(pieceInfo) {
  //Create empty piece
  let piece = new THREE.Object3D();

  let side_geo = new THREE.PlaneGeometry(1,1,32);

  let colors = pieceInfo["colors"];

  //F R B L
  for (let i = 0; i < 4; i++) {

    //TODO create 6 sides
    let side_mat = new THREE.MeshBasicMaterial({color: colors[i]});
    let side_mesh = new THREE.Mesh(side_geo, side_mat);

    let pivot = new THREE.Group()
    pivot.add(side_mesh);

    side_mesh.position.z += 0.5;
    pivot.rotation.y += THREE.Math.degToRad(90 * i);

    //Add the sides
    piece.add(pivot);

  }

  // T B
  for (let i = 0; i < 2; i++) {
    let cidx = 4 + i; //color index;

    let side_mat = new THREE.MeshBasicMaterial({color: colors[cidx]});
    let side_mesh = new THREE.Mesh(side_geo, side_mat);

    let pivot = new THREE.Group()
    pivot.add(side_mesh);

    side_mesh.rotation.x -= THREE.Math.degToRad(90);
    side_mesh.position.y += 0.5;

    pivot.rotation.x += THREE.Math.degToRad(180 * i);

    //Add the sides
    piece.add(pivot);

  }

  piece = CubeUtil.applyTransformations(piece, pieceInfo.pos_offset, pieceInfo.rotational);

  // return the piece
  return piece;
}

function createCamera() {
  const fov = 75;
  const aspect = 2;  // the canvas default
  const near = 0.1;
  const far = 5;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

  return camera;
}


function createRubiksCube() {
  let cube = new THREE.Object3D()

  //Corner test
  /** Corner
  let cubeCornerInfo = CubeUtil.createCornerInfo("blue", "white", "red", new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,0));
  let corner = createPiece(cubeCornerInfo);
  cube.add(corner);
  **/

  //Edge test
  /** Edge
  let cubeEdgeInfo = CubeUtil.createEdgeInfo("blue", "white", new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,0))
  let edge = createPiece(cubeEdgeInfo);
  cube.add(edge);
  **/

  //Center test
  let centerInfo = CubeUtil.createCenterInfo("blue", new THREE.Vector3(0,0,0),new THREE.Vector3(0,0,0));
  let center = createPiece(centerInfo);
  cube.add(center);


  //Center piece for testing purposes
  let geometry = new THREE.SphereGeometry( 0.1, 32, 32 );
  let material = new THREE.MeshBasicMaterial( {color: "blue"} );
  let sphere = new THREE.Mesh( geometry, material );
  cube.add( sphere );

  return cube;

}


function main() {

  //load up the canvas
  const canvas = document.querySelector("#three-dimen");
  const renderer = new THREE.WebGLRenderer({canvas});

  //Create the camera
  const camera = createCamera();
  camera.position.z = 3;

  //Create the scene
  const scene = new THREE.Scene();

  //Create the rubiks cube
  const rubiksCube = createRubiksCube();


  //Spawn in the cube
  scene.add(rubiksCube);

  //Set the renderer background
  renderer.setClearColor( 0xeeeeee );

  //Render the scene
  renderer.render(scene, camera);

  //Camera controls
  const controls = new OrbitControls( camera, renderer.domElement );

  controls.addEventListener( 'change', function() { renderer.render(scene, camera); } );
}

function anim() {

}


document.addEventListener('DOMContentLoaded', () => {
  main();

});
