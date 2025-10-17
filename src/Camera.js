import * as THREE from "three";
import Experience from "./Experience";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { WORLD_DIAMETER } from "./const";

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
      WORLD_DIAMETER * 1.25
    );
    camera.position.z = 20;
    camera.position.y = 15;
    camera.position.x = -10;

    camera.position.multiplyScalar(0.45);

    this.instance = camera;
    this.scene.add(this.instance);
  }

  addControls() {
    this.controls = new OrbitControls(this.instance, this.canvas);
    this.controls.enableDamping = true;
    this.controls.minPolarAngle = Math.PI * 0.25;
    this.controls.maxPolarAngle = Math.PI * 0.45;
    this.controls.maxDistance = WORLD_DIAMETER * 0.4;
    this.controls.minDistance = 1;
  }

  update() {
    this.controls.update();
  }

  resize() {
    this.instance.aspect = this.size.width / this.size.height;
    this.instance.updateProjectionMatrix();
  }
}
