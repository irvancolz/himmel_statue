import Experience from "../Experience";
import * as THREE from "three";

class Fog {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.debug = this.experience.debug;

    this.exp = 0.01;
    this.color = "#ccc";

    this.init();
  }

  _registerDebugger() {
    if (!this.debug.active) return;

    const f = this.debug.pane.addFolder({ title: "fog", expanded: true });
    f.addBinding(this, "exp", { min: 0.01, max: 2, step: 0.01 });
  }

  init() {
    this._registerDebugger();
    this._addFog();
  }

  _addFog() {
    this.fog = new THREE.FogExp2(this.color, this.exp);
    this.scene.fog = this.fog;
  }
}

export default Fog;
