import * as THREE from "three";
import Experience from "./Experience";
import { OrbitControls } from "three/examples/jsm/Addons.js";

export default class Camera {
  constructor() {
    this.experience = new Experience();
    this.size = this.experience.size;
    this.scene = this.experience.scene;
    this.canvas = this.experience.canvas;

    this.init();
    this.addControls();
  }

  init() {
    const camera = new THREE.PerspectiveCamera(
      75,
      this.size.width / this.size.height,
      0.1,
      1000
    );
    camera.position.z = 20;
    camera.position.y = 8;
    camera.position.x = -10;

    camera.position.multiplyScalar(0.3);

    this.instance = camera;
    this.scene.add(this.instance);
  }

  addControls() {
    this.controls = new OrbitControls(this.instance, this.canvas);
    this.controls.enableDamping = true;
  }

  update() {
    this.controls.update();
  }

  resize() {
    this.instance.aspect = this.size.width / this.size.height;
    this.instance.updateProjectionMatrix();
  }
}
