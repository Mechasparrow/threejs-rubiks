var THREE = require('three');

function generalPieceInfo(type, colors, pos_offset, rotational) {


  let pieceInfo =  {
    "type": type,
    "colors": colors,
    "pos_offset": pos_offset,
    "rotational": rotational
  };

  //pad out with black sides
  for (let i = colors.length; i < 6; i++) {
    pieceInfo["colors"].push("black");
  }

  return pieceInfo;
}

function createEdgeInfo(color1, color2, pos_offset, rotational) {
  return generalPieceInfo("edge", [color1,"black", "black", "black", color2, "black"], pos_offset, rotational);
}

function createCornerInfo(color1, color2, color3, pos_offset, rotational) {
  return generalPieceInfo("corner", [color1, color2, "black", "black", color3, "black"], pos_offset, rotational);
}

function createCenterInfo (color, pos_offset, rotational) {
  return generalPieceInfo("center", [color], pos_offset, rotational);
}

//Converts a euler angle vector3 to radians
function convertToRadians(rotational) {
  return;
}

//applies transformations to an object and returns the objects
function applyTransformations(object, pos_offset, rotational) {

    //apply position offset
    object.position.add(pos_offset);

    //apply rotational
    object.rotation.x += rotational.x;
    object.rotation.y += rotational.y;
    object.rotation.z += rotational.z;

    return object;
}

module.exports = {
  generalPieceInfo: generalPieceInfo,
  createEdgeInfo: createEdgeInfo,
  createCornerInfo: createCornerInfo,
  createCenterInfo: createCenterInfo,
  applyTransformations: applyTransformations
}
