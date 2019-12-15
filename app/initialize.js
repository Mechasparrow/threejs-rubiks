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

  //Draw outline
  //Could optimize as wireframe cube tbh
  let wireframe = true;

  if (wireframe) {
    let lineMat = new THREE.LineBasicMaterial({color: "black"});
    let lineGeo = new THREE.Geometry();

    lineGeo.vertices.push(new THREE.Vector3(0,0,0));
    lineGeo.vertices.push(new THREE.Vector3(0,1,0));
    lineGeo.vertices.push(new THREE.Vector3(1,1,0));
    lineGeo.vertices.push(new THREE.Vector3(1,0,0));
    lineGeo.vertices.push(new THREE.Vector3(0,0,0));

    let outline1 = new THREE.Line(lineGeo, lineMat);

    outline1.position.x -= 0.5;
    outline1.position.z -= 0.55;
    outline1.position.y -= 0.5;

    let outline2 = outline1.clone();
    outline2.position.z *= -1;

    let outline3 = outline1.clone();
    outline3.position.set(0,0,0);
    outline3.rotation.y = THREE.Math.degToRad(-90);
    outline3.position.set(0.55,-0.5,-0.5);

    let outline4 = outline3.clone();
    outline3.position.x *= -1

    let outline5 = outline1.clone();
    outline5.position.set(0,0,0);
    outline5.rotation.x = THREE.Math.degToRad(90);
    outline5.position.set(-0.5,0.55,-0.5);

    let outline6 = outline5.clone();
    outline6.position.y *= -1;

    piece.add(outline1);
    piece.add(outline2);
    piece.add(outline3);
    piece.add(outline4);
    piece.add(outline5);
    piece.add(outline6);
  }

  piece = CubeUtil.applyTransformations(piece, pieceInfo.pos_offset, pieceInfo.rotational);

  // return the piece
  return piece;
}

function createCamera() {
  const fov = 75;
  const aspect = 2;  // the canvas default
  const near = 0.1;
  const far = 10;
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
  let centerInfo;

  centerInfo = CubeUtil.createCenterInfo("white", new THREE.Vector3(0,0,1),new THREE.Vector3(0,0,0));
  cubePieces.push(centerInfo);

  centerInfo = CubeUtil.createCenterInfo("blue", new THREE.Vector3(-1,0,0),new THREE.Vector3(0,THREE.Math.degToRad(-90),0));
  cubePieces.push(centerInfo);

  centerInfo = CubeUtil.createCenterInfo("orange", new THREE.Vector3(0,-1,0),new THREE.Vector3(THREE.Math.degToRad(90),0,0));
  cubePieces.push(centerInfo);

  centerInfo = CubeUtil.createCenterInfo("yellow", new THREE.Vector3(0,0,-1),new THREE.Vector3(0,THREE.Math.degToRad(180),0));
  cubePieces.push(centerInfo);

  centerInfo = CubeUtil.createCenterInfo("red", new THREE.Vector3(0,1,0),new THREE.Vector3(THREE.Math.degToRad(270),0,0));
  cubePieces.push(centerInfo);

  centerInfo = CubeUtil.createCenterInfo("green", new THREE.Vector3(1,0,0),new THREE.Vector3(0,THREE.Math.degToRad(90),0));
  cubePieces.push(centerInfo);

  //Create edges
  let edgeInfo;

  //Edge set 1
  edgeInfo = CubeUtil.createEdgeInfo("white", "green", new THREE.Vector3(1,0,1),new THREE.Vector3(0,0,-THREE.Math.degToRad(90)))
  cubePieces.push(edgeInfo);

  edgeInfo = CubeUtil.createEdgeInfo("white", "blue", new THREE.Vector3(-1,0,1),new THREE.Vector3(0,0,THREE.Math.degToRad(90)))
  cubePieces.push(edgeInfo);

  edgeInfo = CubeUtil.createEdgeInfo("white", "red", new THREE.Vector3(0,1,1),new THREE.Vector3(0,0,0))
  cubePieces.push(edgeInfo);

  edgeInfo = CubeUtil.createEdgeInfo("white", "orange", new THREE.Vector3(0,-1,1),new THREE.Vector3(THREE.Math.degToRad(180),THREE.Math.degToRad(180),0))
  cubePieces.push(edgeInfo);


  //Edge set 2

  edgeInfo = CubeUtil.createEdgeInfo("green", "yellow", new THREE.Vector3(1,0,-1),new THREE.Vector3(THREE.Math.degToRad(0),THREE.Math.degToRad(90),THREE.Math.degToRad(-90)))
  cubePieces.push(edgeInfo);

  edgeInfo = CubeUtil.createEdgeInfo("blue", "yellow", new THREE.Vector3(-1,0,-1),new THREE.Vector3(THREE.Math.degToRad(-90),THREE.Math.degToRad(-90),THREE.Math.degToRad(0)))
  cubePieces.push(edgeInfo);

  edgeInfo = CubeUtil.createEdgeInfo("yellow", "red", new THREE.Vector3(0,1,-1),new THREE.Vector3(0,THREE.Math.degToRad(180),0))
  cubePieces.push(edgeInfo);

  edgeInfo = CubeUtil.createEdgeInfo("yellow", "orange", new THREE.Vector3(0,-1,-1),new THREE.Vector3(THREE.Math.degToRad(180),THREE.Math.degToRad(0),0))
  cubePieces.push(edgeInfo);

  //Edge set 3
  edgeInfo = CubeUtil.createEdgeInfo("green", "orange", new THREE.Vector3(1,-1,0),new THREE.Vector3(THREE.Math.degToRad(180),THREE.Math.degToRad(90),THREE.Math.degToRad(0)))
  cubePieces.push(edgeInfo);

  edgeInfo = CubeUtil.createEdgeInfo("blue", "orange", new THREE.Vector3(-1,-1,0),new THREE.Vector3(THREE.Math.degToRad(180),THREE.Math.degToRad(-90),THREE.Math.degToRad(0)))
  cubePieces.push(edgeInfo);

  edgeInfo = CubeUtil.createEdgeInfo("green", "red", new THREE.Vector3(1,1,0),new THREE.Vector3(THREE.Math.degToRad(0),THREE.Math.degToRad(90),THREE.Math.degToRad(0)))
  cubePieces.push(edgeInfo);

  edgeInfo = CubeUtil.createEdgeInfo("blue", "red", new THREE.Vector3(-1,1,0),new THREE.Vector3(THREE.Math.degToRad(0),THREE.Math.degToRad(-90),THREE.Math.degToRad(0)))
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
  camera.position.z = 5;

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
