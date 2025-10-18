import * as THREE from "three";
import { WORLD_DIAMETER } from "../const";
import Experience from "../Experience";
import Bushes from "./Bushes";

class Tree {
  #RADIUS = WORLD_DIAMETER * 0.5;
  #FOREST_DEPTH = WORLD_DIAMETER * 0.1;
  constructor(count = 50, color = "#858425") {
    this.experience = new Experience();
    this.resources = this.experience.resources.resources;
    this.scene = this.experience.scene;
    this.debug = this.experience.debug;

    this.count = count;

    this.positions = [];
    this.rotations = [];
    this.scales = [];

    this.leaves = {
      color: color,
      count: 0,
      reffs: [],
      positions: [],
      rotations: [],
      scales: [],
    };

    this.init();
  }

  init() {
    this._extractModelParts();
    this._calcTreePositions();
    this._addTree();
    this._setTreePosition();

    this._calcLeavesPositions();
    this._addLeaves();
  }

  updateColor(color) {
    this.leaves.foliages.updateColor(color);
  }

  _extractModelParts() {
    this.resources.tree_model.scene.traverse((el) => {
      if (el.name.includes("Foliage")) {
        this.leaves.reffs.push(el);
      }

      if (el.isMesh) {
        this.model = el;

        this.geometry = el.geometry;
        this.material = el.material;
      }
    });
  }

  _addTree() {
    this.mesh = new THREE.InstancedMesh(
      this.geometry,
      this.material,
      this.count
    );
    this.mesh.receiveShadow = true;
    this.mesh.castShadow = true;
    this.scene.add(this.mesh);
  }

  _calcTreePositions() {
    for (let i = 0; i < this.count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const offset = Math.random() * this.#FOREST_DEPTH;

      let x = Math.sin(angle) * this.#RADIUS;
      x += x > 0 ? -1 * offset : offset;

      let z = Math.cos(angle) * this.#RADIUS;
      z += z > 0 ? -1 * offset : offset;

      const position = new THREE.Vector3(x, 0, z);
      this.positions.push(position);

      const rotate = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(0, Math.random(), 0),
        Math.PI
      );
      this.rotations.push(rotate);

      const scale = 0.5 + Math.random();
      this.scales[i] = new THREE.Vector3(scale, scale, scale);
    }
  }

  _setTreePosition() {
    const dummy = new THREE.Object3D();

    for (let i = 0; i < this.count; i++) {
      dummy.position.copy(this.positions[i]);
      dummy.quaternion.copy(this.rotations[i]);
      dummy.scale.copy(this.scales[i]);

      dummy.updateWorldMatrix();

      this.mesh.setMatrixAt(i, dummy.matrix);
    }
  }

  _calcLeavesPositions() {
    this.leaves.count = this.count * this.leaves.reffs.length;

    for (let i = 0; i < this.count; i++) {
      const p = this.leaves.reffs.map((el) => {
        return el
          .clone()
          .position.multiply(this.scales[i])
          .applyQuaternion(this.rotations[i])
          .add(this.positions[i]);
      });
      this.leaves.positions.push(...p);

      const r = this.leaves.reffs.map((el) => el.quaternion);
      this.leaves.rotations.push(...r);

      const s = this.leaves.reffs.map((el) => el.scale);
      this.leaves.scales.push(...s);
    }
  }

  _addLeaves() {
    this.leaves.foliages = new Bushes(this.leaves.count, this.leaves.color);
    this.leaves.foliages.setPositions(this.leaves.positions);
    this.leaves.foliages.setRotations(this.leaves.rotations);
    this.leaves.foliages.setScales(this.leaves.scales);
    this.leaves.foliages.updateMatrix();
  }

  update() {
    this.leaves.foliages.update();
  }
}

export default Tree;
