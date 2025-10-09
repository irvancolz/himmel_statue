import Experience from "../Experience";
import * as THREE from "three";
import { WORLD_DIAMETER } from "../const";

export default class Floor {
  constructor() {
    this.experience = new Experience();
    this.debug = this.experience.debug;
    this.scene = this.experience.scene;

    this.geometry = null;
    this.material = null;

    this.width = WORLD_DIAMETER;
    this.subdivision = this.width * 4;

    this.debugConfig = {
      color: "#20c57e",
    };

    this.init();
    this._registerDebugger();
  }

  _registerDebugger() {
    if (this.debug.active) {
      this.debugFolder = this.debug.pane.addFolder({
        title: "Floor",
      });

      this.debugFolder
        .addBinding(this.debugConfig, "color")
        .on("change", () => {
          this.material.color.set(this.debugConfig.color);
        });
    }
  }

  initGeometry() {
    const geometry = new THREE.PlaneGeometry(this.width, this.width);
    geometry.rotateX(-Math.PI * 0.5);

    this.geometry = geometry;
  }

  initMaterial() {
    const material = new THREE.MeshStandardMaterial({
      color: this.debugConfig.color,
    });
    this.material = material;

    // this.material.onBeforeCompile = (shader) => {
    //   console.log(shader.fragmentShader);
    // };
  }

  initMesh() {
    const mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh = mesh;
    this.mesh.receiveShadow = true;
  }

  init() {
    this.initGeometry();
    this.initMaterial();
    this.initMesh();
    this.scene.add(this.mesh);
  }
}
