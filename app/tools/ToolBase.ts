/// <reference path="../../typings/tsd.d.ts" />
import THREE = require('three');

import wi from '../WorkerInterface';

module ToolBase {
  export interface Context {
    scene:THREE.Scene;
    type:number;
    workerInterface:wi.WorkerInterface;
    getPositionOfMouseAlongXZPlane(xPlane:number, zPlane:number):THREE.Vector3;
    finished():void;
  }

  export interface Tool {
    onBlockClick(pos:THREE.Vector3):void;
    onMouseClick(mouse:THREE.Vector2, pos:THREE.Vector3):void;
    onMouseMove(mouse:THREE.Vector2, pos:THREE.Vector3):void;
    cancel():void;
  }
}

export default ToolBase
