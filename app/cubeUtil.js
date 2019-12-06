var THREE = require('three');

function generalPieceInfo(type, colors, pos_offset, rotational) {
  return {
    "type": type,
    "colors": colors,
    "pos_offset": pos_offset,
    "rotational": rotational
  }
}

function createEdgeInfo(color1, color2, pos_offset, rotational) {
  return generalPieceInfo("edge", [color1,color2], pos_offset, rotational);
}

function createCornerInfo(color1, color2, color3, pos_offset, rotational) {
  return generalPieceInfo("corner", [color1,color2, color3], pos_offset, rotational);
}

function createCenterInfo (color, pos_offset, rotational) {
  return generalPieceInfo("center", [color], pos_offset, rotational);
}

module.exports = {
  createEdgeInfo: createEdgeInfo,
  createCornerInfo: createCornerInfo,
  createCenterInfo: createCenterInfo
}
