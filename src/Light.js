import * as THREE from "three";
import Experience from "./Experience";

class Light {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;

    this.init();
  }

  init() {
    this.ambient = new THREE.AmbientLight(0xffffff, 2);
    this.scene.add(this.ambient);
  }
}

export default Light;
