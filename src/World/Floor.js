import Experience from "../Experience";
import * as THREE from "three";
export default class Floor {
  constructor() {
    this.experience = new Experience();
    this.debug = this.experience.debug;
    this.scene = this.experience.scene;

    this.geometry = null;
    this.material = null;

    this.width = 10;
    this.subdivision = this.width * 4;

    this.init();

    if (this.debug.active) {
      this.debugFolder = this.debug.pane.addFolder({
        title: "Floor",
      });

      this.debugFolder
        .addBinding(this, "width", {
          min: 1,
          max: 20,
          step: 1,
        })
        .on("change", (ev) => {
          if (ev.last) this.init();
        });
    }
  }

  initGeometry() {
    const geometry = new THREE.PlaneGeometry(
      this.width,
      this.width,
      this.subdivision,
      this.subdivision
    );
    geometry.rotateX(-Math.PI * 0.5);

    this.geometry = geometry;
  }

  initMaterial() {
    const material = new THREE.MeshBasicMaterial();
    this.material = material;
  }

  initMesh() {
    const mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh = mesh;
  }

  init() {
    if (this.material != null || this.geometry != null) {
      this.material.dispose();
      this.geometry.dispose();
      this.scene.remove(this.mesh);
    }

    this.initGeometry();
    this.initMaterial();
    this.initMesh();
    this.scene.add(this.mesh);
  }
}
