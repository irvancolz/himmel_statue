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

    this.target = new THREE.Vector3();
    this.offset = new THREE.Vector3();

    this.init();
    this.addControls();
  }

  _calcFov() {
    if (window.innerWidth <= 768) {
      return 100;
    }
    return 75;
  }

  _calcOffset() {
    if (window.innerWidth <= 768) {
      this.offset.set(20, 15, -10).multiplyScalar(0.75);
      return;
    }
    this.offset.set(20, 15, -10).multiplyScalar(0.45);
  }

  init() {
    const camera = new THREE.PerspectiveCamera(
      this._calcFov(),
      this.size.width / this.size.height,
      0.1,
      WORLD_DIAMETER * 1.25
    );

    this._calcOffset();
    camera.position.copy(this.offset);

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

  lookAt(target) {
    this.instance.lookAt(target);
    this.instance.position.copy(target.clone()).add(this.offset);
    this.controls.target = target;
  }

  resize() {
    this._calcOffset();

    this.instance.fov = this._calcFov();
    this.instance.position.copy(this.offset);
    this.instance.aspect = this.size.width / this.size.height;
    this.instance.updateProjectionMatrix();
  }
}
