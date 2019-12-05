var THREE = require ('three');
const OrbitControls = require('three-orbitcontrols')

var scene = new THREE.Scene();

//NOTE
//Rubiks colors
/*

white, red, blue, orange, green, and yellow

*/

function createCorner(color1, color2, color3) {

  //Plane geometry
  let plane_geo = new THREE.PlaneGeometry( 1, 1, 32 );

  //Create materials
  let mat_side1 = new THREE.MeshBasicMaterial({color: color1});  // greenish blue
  let mat_side2 = new THREE.MeshBasicMaterial({color: color2});  // greenish blue
  let mat_side3 = new THREE.MeshBasicMaterial({color: color3});  // greenish blue

  //Create meshes
  let side1_mesh = new THREE.Mesh(plane_geo, mat_side1);
  let side2_mesh = new THREE.Mesh(plane_geo, mat_side2);
  let side3_mesh = new THREE.Mesh(plane_geo, mat_side3);

  //Side 2 transformations
  side2_mesh.rotation.y += THREE.Math.degToRad (90);
  side2_mesh.position.x += 0.5;
  side2_mesh.position.z -= 0.5;

  //Side 3 transformations
  side3_mesh.rotation.x -= THREE.Math.degToRad(90);
  side3_mesh.position.y += 0.5;
  side3_mesh.position.z -= 0.5;

  let corner = new THREE.Object3D()

  corner.add(side1_mesh);
  corner.add(side2_mesh);
  corner.add(side3_mesh);

  return corner;
}

function createEdge(color1, color2) {

  //Plane geometry
  let plane_geo = new THREE.PlaneGeometry( 1, 1, 32 );

  //Create materials
  let mat_side1 = new THREE.MeshBasicMaterial({color: color1});  // greenish blue
  let mat_side2 = new THREE.MeshBasicMaterial({color: color2});  // greenish blue

  //Create meshes
  let side1_mesh = new THREE.Mesh(plane_geo, mat_side1);
  let side2_mesh = new THREE.Mesh(plane_geo, mat_side2);

  //Side 2 transformations
  side2_mesh.rotation.x -= THREE.Math.degToRad(90);
  side2_mesh.position.y += 0.5;
  side2_mesh.position.z -= 0.5;

  let edge = new THREE.Object3D()

  edge.add(side1_mesh);
  edge.add(side2_mesh);

  return edge;
}

function createCenter(color) {

    //Plane geometry
    let plane_geo = new THREE.PlaneGeometry( 1, 1, 32 );

    //Create materials
    let mat_side1 = new THREE.MeshBasicMaterial({color: color});  // greenish blue

    //Create meshes
    let side1_mesh = new THREE.Mesh(plane_geo, mat_side1);

    let center = new THREE.Object3D()

    center.add(side1_mesh);

    return center;
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

  const corner = createCorner("orange", "blue", "white");

  const edge = createEdge("orange", "white");
  edge.position.x -= 1;

  const corner2 = createCorner("blue", "orange", "white");

  //Corner transformation
  corner2.rotation.y += THREE.Math.degToRad(-90);
  corner2.position.x -= 2.5;
  corner2.position.z -= 0.5;

  //Center
  const center = createCenter("orange");
  center.position.y -= 1;
  center.position.x -= 1;

  cube.add(corner);
  cube.add(corner2);
  cube.add(edge);
  cube.add(center);


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
