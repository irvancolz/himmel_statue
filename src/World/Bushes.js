import * as THREE from "three";
import { WORLD_DIAMETER } from "../const";
import Experience from "../Experience";

class Bushes {
  #RADIUS = WORLD_DIAMETER * 0.5;
  #BUSHES_COUNT = 200;
  #BUSHES_DEPTH = WORLD_DIAMETER * 0.15;
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;

    this.init();
  }

  init() {
    this._addBushes();
    this._setBushesPosition();
  }

  _addBushes() {
    this.geometry = new THREE.OctahedronGeometry(1, 1);
    this.geometry.translate(0, 1, 0.0);
    this.material = new THREE.MeshStandardMaterial({
      color: 0x00ff00,
    });

    this.mesh = new THREE.InstancedMesh(
      this.geometry,
      this.material,
      this.#BUSHES_COUNT
    );
    this.scene.add(this.mesh);
  }

  _setBushesPosition() {
    const dummy = new THREE.Object3D();

    for (let i = 0; i < this.#BUSHES_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;

      const offset = Math.random() * this.#BUSHES_DEPTH;
      let x = Math.sin(angle) * this.#RADIUS;
      x += x > 0 ? -1 * offset : offset;
      let z = Math.cos(angle) * this.#RADIUS;
      z += z > 0 ? -1 * offset : offset;
      dummy.position.x = x;
      dummy.position.z = z;

      dummy.scale.setScalar(0.75 + Math.random());

      dummy.updateWorldMatrix();

      this.mesh.setMatrixAt(i, dummy.matrix);
    }
  }
}

export default Bushes;
