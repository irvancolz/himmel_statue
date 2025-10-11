import * as THREE from "three";
import { WORLD_DIAMETER } from "../const";
import Experience from "../Experience";

class Tree {
  #RADIUS = WORLD_DIAMETER * 0.5;
  #TREE_COUNT = 150;
  #FOREST_DEPTH = WORLD_DIAMETER * 0.1;
  constructor() {
    this.experience = new Experience();
    this.resources = this.experience.resources.resources;
    this.scene = this.experience.scene;

    this.init();
  }

  init() {
    this._extractModelParts();
    this._addTree();
    this._setTreePosition();
  }

  _extractModelParts() {
    this.resources.tree_model.scene.traverse((el) => {
      if (el.isMesh) {
        this.geometry = el.geometry;
        this.material = el.material;
      }
    });
  }

  _addTree() {
    this.mesh = new THREE.InstancedMesh(
      this.geometry,
      this.material,
      this.#TREE_COUNT
    );
    this.mesh.receiveShadow = true;
    this.mesh.castShadow = true;
    this.scene.add(this.mesh);
  }

  _setTreePosition() {
    const dummy = new THREE.Object3D();

    for (let i = 0; i < this.#TREE_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;

      const offset = Math.random() * this.#FOREST_DEPTH;
      let x = Math.sin(angle) * this.#RADIUS;
      x += x > 0 ? -1 * offset : offset;
      let z = Math.cos(angle) * this.#RADIUS;
      z += z > 0 ? -1 * offset : offset;
      dummy.position.x = x;
      dummy.position.z = z;

      dummy.rotateY(Math.random() * Math.PI * 0.5);

      dummy.updateWorldMatrix();

      this.mesh.setMatrixAt(i, dummy.matrix);
    }
  }
}

export default Tree;
