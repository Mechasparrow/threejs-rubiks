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

function genCubeletPositions() {
  // x = [1,1]
  // y = [1,1]
  // z = [1,1]
  // Exclude (0,0,0)

  let positions = []; //List of Vector3 positions

  let totalPieces = 0;

  for (let x = -1; x <= 1; x+=1) {

    for (let y = -1; y <= 1; y+=1) {

      for (let z = -1; z <= 1; z+=1) {

        //Push the position vector to the list
        positions.push (new THREE.Vector3(x,y,z));

        totalPieces++;

      }

    }

  }

  return positions;
}

function returnFacePositions(faceUnitPos) {

  let potentialComp = ["x", "y", "z"];
  let componentFilter = "";
  let componentValue = undefined;

  let filteredPositions = [];

  for (let i = 0; i < potentialComp.length; i++) {
    if (faceUnitPos[potentialComp[i]] != 0) {
      componentFilter = potentialComp[i];
      componentValue = faceUnitPos[componentFilter];
      break;
    }
  }

  let unfilteredPositions = genCubeletPositions();

  filteredPositions = unfilteredPositions.filter(function (elem) {
    return elem[componentFilter] == componentValue;
  })

  return filteredPositions;

}

// rowType
// May be row or column

function returnMiddlePositions(middleType) {


  let unfilteredPositions = genCubeletPositions();

  let filteredPositions = unfilteredPositions.filter(function (piecePos) {

    switch (middleType) {
      case "row":
        return piecePos["y"] == 0;
        break;
      case "column":
        return piecePos["z"] == 0;
        break;
      default:
        return false;
        break;
    }
  });

  return filteredPositions;

}

function getCubeletsFromPositions(cube, positions) {
  let cubelets = [];

  let cubeChildren = cube.children;

  cubelets = cubeChildren.filter (function (cubelet) {

    let matchedPos = -1 != positions.findIndex(function (position) {
      return position.equals(cubelet.position);
    })

    return matchedPos;
  })

  return cubelets;
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
  var rubiksCube = createRubiksCube();

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
        face = grabFace(rubiksCube, faces.pop(), scene)
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
          rotationProgress = rotateFace(face,rotationProgress);
        }else {
          setFaceRotation(face, THREE.Math.degToRad(angle));
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

function grabFace(rubiksCube, faceV, scene) {
  let face = new THREE.Group();
  let middleType = undefined;

  if (faceV.equals(new THREE.Vector3(1,1,1))) {
    middleType = "row";
  }

  if (faceV.equals(new THREE.Vector3(-1,-1,-1))) {
    middleType = "column";
  }

  let facePositions;

  if (middleType == undefined) {
    facePositions = returnFacePositions(faceV);
  }else {
    facePositions = returnMiddlePositions(middleType);
  }

  let faceCubelets = getCubeletsFromPositions(rubiksCube, facePositions)

  for (let i = 0; i < faceCubelets.length; i++) {
    face.add(faceCubelets[i]);
  }

  let getComponent = function (vec3, middleType) {
    switch(middleType) {
      case "row":
        return "y";
        break;
      case "column":
        return "z";
        break;
    }

    let component = "";
    let components = ["x", "y", "z"];

    for (let i = 0; i < components.length; i++) {
      if (vec3[components[i]] != 0) {
        component = components[i];
        break;
      }
    }

    return component;
  }

  face.userData["component"] = getComponent(faceV, middleType);
  scene.add(face);

  return face;
}

function anim(cube) {
  /**
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  **/


}

function rotateFace(face, rotationProgress) {
  let component = face.userData["component"];

  let rotationDelta = 0.03;

  face.rotation[component] += rotationDelta;
  rotationProgress += rotationDelta;

  return rotationProgress;
}

function setFaceRotation(face, rotationAngle) {
  let component = face.userData["component"];

  face.rotation[component] = rotationAngle;
}



function rotateMiddle(middleSet, middleMode) {
  if (middleMode == "row") {
    middleSet.rotation.y += 0.03;
  }else {
    middleSet.rotation.z += 0.03;
  }
}


document.addEventListener('DOMContentLoaded', () => {
  main();

});
