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

//NOTE naive approach
// Cube has these constituent components
//8 corners
//6 centers
//12 edges
// 1 centroid
// 1 + 12 + 6 + 8 = 27 = (3^3) pieces

function createRubiksCube() {

  //Create the cubeObject
  let cube = new THREE.Object3D()

  let cubePieces = [];

  //Create center
  let centerInfo = CubeUtil.createCenterInfo("white", new THREE.Vector3(0,0,1),new THREE.Vector3(0,0,0));
  cubePieces.push(centerInfo);

  //Create edges
  let edgeInfo;

  edgeInfo = CubeUtil.createEdgeInfo("white", "green", new THREE.Vector3(1,0,1),new THREE.Vector3(0,0,-THREE.Math.degToRad(90)))
  cubePieces.push(edgeInfo);

  edgeInfo = CubeUtil.createEdgeInfo("white", "blue", new THREE.Vector3(-1,0,1),new THREE.Vector3(0,0,THREE.Math.degToRad(90)))
  cubePieces.push(edgeInfo);

  edgeInfo = CubeUtil.createEdgeInfo("white", "red", new THREE.Vector3(0,1,1),new THREE.Vector3(0,0,0))
  cubePieces.push(edgeInfo);

  edgeInfo = CubeUtil.createEdgeInfo("white", "orange", new THREE.Vector3(0,-1,1),new THREE.Vector3(THREE.Math.degToRad(180),THREE.Math.degToRad(180),0))
  cubePieces.push(edgeInfo);


  //Create corners
  let cornerInfo;


  //Front corners
  cornerInfo = CubeUtil.createCornerInfo("white", "green", "red", new THREE.Vector3(1,1,1), new THREE.Vector3(0,0,0));
  cubePieces.push(cornerInfo);

  cornerInfo = CubeUtil.createCornerInfo("white", "red", "blue", new THREE.Vector3(-1,1,1), new THREE.Vector3(0,0,THREE.Math.degToRad(90)));
  cubePieces.push(cornerInfo);

  cornerInfo = CubeUtil.createCornerInfo("white", "orange", "green", new THREE.Vector3(1,-1,1), new THREE.Vector3(0,0,THREE.Math.degToRad(270)));
  cubePieces.push(cornerInfo);

  cornerInfo = CubeUtil.createCornerInfo("white", "blue", "orange", new THREE.Vector3(-1,-1,1), new THREE.Vector3(0,0,THREE.Math.degToRad(180)));
  cubePieces.push(cornerInfo);

  //Back corners
  cornerInfo = CubeUtil.createCornerInfo("green", "yellow", "red", new THREE.Vector3(1,1,-1), new THREE.Vector3(0,THREE.Math.degToRad(90),0));
  cubePieces.push(cornerInfo);

  cornerInfo = CubeUtil.createCornerInfo("blue", "red", "yellow", new THREE.Vector3(-1,1,-1), new THREE.Vector3(0,THREE.Math.degToRad(-90),THREE.Math.degToRad(90)));
  cubePieces.push(cornerInfo);

  cornerInfo = CubeUtil.createCornerInfo("green", "orange", "yellow", new THREE.Vector3(1,-1,-1), new THREE.Vector3(0,THREE.Math.degToRad(90),THREE.Math.degToRad(270)));
  cubePieces.push(cornerInfo);

  cornerInfo = CubeUtil.createCornerInfo("blue", "yellow", "orange", new THREE.Vector3(-1,-1,-1), new THREE.Vector3(0,THREE.Math.degToRad(-90),THREE.Math.degToRad(180)));
  cubePieces.push(cornerInfo);


  //Centroid
  let centroid_info = CubeUtil.generalPieceInfo("centroid", ["white", "green","yellow", "blue", "red", "orange"], new THREE.Vector3(0,0,0),new THREE.Vector3(0,0,0));
  cubePieces.push(centroid_info);

  //Generate Pieces
  for (let i = 0; i < cubePieces.length; i++) {

    let piece = createPiece(cubePieces[i]);

    cube.add(piece);

  }

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
