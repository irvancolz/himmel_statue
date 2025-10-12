import Experience from "../Experience";
import * as THREE from "three";

class Fireflies {
  #COUNT = 100;
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.debug = this.experience.debug;

    this.positionArray = new Float32Array(this.#COUNT * 3);

    this.init();
  }

  _registerDebugger() {
    if (!this.debug.active) return;
    const f = this.debug.pane.addFolder({ title: "fireflies", expanded: true });
  }

  init() {
    this._registerDebugger();
    this._addFireflies();
  }

  _setFirefliesPosition() {
    const radius = 30;
    for (let i = 0; i < this.#COUNT; i++) {
      const i3 = i * 3;

      const x = (Math.random() - 0.5) * 2 * radius;
      const z = (Math.random() - 0.5) * 2 * radius;

      const y = Math.random() * radius;

      this.positionArray[i3 + 0] = x;
      this.positionArray[i3 + 1] = y;
      this.positionArray[i3 + 2] = z;
    }
  }

  _addFireflies() {
    this._setFirefliesPosition();

    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(this.positionArray, 3)
    );

    this.material = new THREE.PointsMaterial({
      sizeAttenuation: true,
      size: 0.5,
    });
    this.mesh = new THREE.Points(this.geometry, this.material);

    this.scene.add(this.mesh);
  }
}

export default Fireflies;
