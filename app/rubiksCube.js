/*
Specific code for manipulation and creation of the rubiks cube
*/
var THREE = require('three');
var CubeUtil = require('cubeUtil.js');

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
  let wireframe = false;

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
      case "Middle":
        return piecePos["x"] == 0;
        break;
      case "Equator":
        return piecePos["y"] == 0;
        break;
      case "Standing":
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

function grabFace(rubiksCube, moveInfo, scene) {
  let faceV = moveInfo["faceVector"];
  let middleType = moveInfo["middleType"];

  let face = new THREE.Group();

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
      case "Middle":
        return "x";
        break;
      case "Equator":
        return "y";
        break;
      case "Standing":
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
  face.userData["rotation"] = moveInfo["rotation"];
  console.log(face.userData);
  scene.add(face);

  return face;
}

function rotateFace(face, rotationProgress) {
  let component = face.userData["component"];
  let rotation = face.userData["rotation"];

  let rotationDelta = 0.03;

  rotationProgress += rotationDelta;

  face.rotation[component] -= rotationDelta * (rotation == "clockwise" ? 1 : -1);


  return rotationProgress;
}

function setFaceRotation(face, rotationAngle) {
  let component = face.userData["component"];
  let rotation =  face.userData["rotation"];

  face.rotation[component] = rotationAngle * (rotation == "clockwise" ? -1 : 1);
}

//Takes in a string and maps it to the proper information
function decodeSingleNotation(notation) {

  const decodeInfo = {
    // ' denotes counter clock wise direction
    '\'': {
      'rotation': 'counterclockwise'
    },

    //the side currently facing the solver
    'F': {
      "faceVector": new THREE.Vector3(0,0,1),
      "rotation": "clockwise"
    },

    // the side opposite the front
    'B': {
      "faceVector": new THREE.Vector3(0,0,-1),
      "rotation": "clockwise"
    },

    //the side above or on top of the front side
    'U': {
      "faceVector": new THREE.Vector3(0,1,0),
      "rotation": "clockwise"
    },

    //the side opposite the top, underneath the Cube
    'D': {
      "faceVector": new THREE.Vector3(0,-1,0),
      "rotation": "clockwise"
    },

    //the side directly to the left of the front
    'L': {
      "faceVector": new THREE.Vector3(-1,0,0),
      "rotation": "clockwise"
    },

    // the side directly to the right of the front
    'R': {
      "faceVector": new THREE.Vector3(1,0,0),
      "rotation": "clockwise"
    },

    // the layer between left and right layer
    'M': {
      "faceVector": new THREE.Vector3(0,0,0),
      "rotation": "clockwise",
      "middleType": "Middle"
    },

    //the layer between the front and back layer
    'E': {
      "faceVector": new THREE.Vector3(0,0,0),
      "rotation": "clockwise",
      "middleType": "Equator"
    },

    'S': {
      "faceVector": new THREE.Vector3(0,0,0),
      "rotation": "clockwise",
      "middleType": "Standing"
    }
  }

  let notationInfo = {};
  let mainNotation = notation[0];
  notationInfo = decodeInfo[mainNotation];

  if (notation.length > 1) {
    let modifier = notation[1];
    notationInfo = Object.assign(notationInfo, decodeInfo[modifier]);
  }

  //Debug statement
  console.log(notationInfo);

  return notationInfo;
}

module.exports = {
  grabFace: grabFace,
  createRubiksCube: createRubiksCube,
  rotateFace: rotateFace,
  setFaceRotation: setFaceRotation,
  Notation: {
    decodeSingleNotation: decodeSingleNotation
  }
}
