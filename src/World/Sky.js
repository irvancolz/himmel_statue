import * as THREE from "three";
import Experience from "../Experience";
class Sky {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.debug = this.experience.debug;

    this.debugConfig = {
      color: "#9ff1f5",
    };

    this.init();
    this._registerDebugger();
  }

  _registerDebugger() {
    if (!this.debug.active) return;

    const f = this.debug.pane.addFolder({ title: "sky", expanded: true });
    f.addBinding(this.debugConfig, "color").on("change", () => {
      this.material.color.set(debugConfig.color);
    });
  }

  init() {
    this.geometry = new THREE.SphereGeometry(500);
    this.material = new THREE.MeshBasicMaterial({
      color: this.debugConfig.color,
      side: THREE.BackSide,
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }
}

export default Sky;
