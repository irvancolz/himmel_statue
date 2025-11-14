import Experience from "../Experience";
import * as THREE from "three";

class Fog {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.debug = this.experience.debug;

    this.exp = 0.016;
    this.color = "#ccc";

    this.init();
  }

  init() {
    this._addFog();
  }

  _addFog() {
    this.fog = new THREE.FogExp2(this.color, this.exp);
    this.scene.fog = this.fog;
  }
}

export default Fog;
