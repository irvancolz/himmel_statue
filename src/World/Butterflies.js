import Experience from "../Experience";
import * as THREE from "three";
import fragmentShader from "../Shaders/Butterfly/fragment.glsl";
import vertexShader from "../Shaders/Butterfly/vertex.glsl";

class ButterFlies {
  #COUNT = 10;
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.debug = this.experience.debug;
    this.time = this.experience.time;

    this.resources = this.experience.resources.resources;
    this.model = this.resources.butterfly_model;
    this.texture = this.resources.butterfly_texture;
    this.texture.colorSpace = THREE.SRGBColorSpace;

    this.uniforms = {
      uTime: new THREE.Uniform(0),
      uButterflyTexture: new THREE.Uniform(this.texture),
    };

    this.positionArray = new Float32Array(this.#COUNT * 3);

    this.init();
  }

  _registerDebugger() {
    if (!this.debug.active) return;
    const f = this.debug.pane.addFolder({
      title: "ButterFlies",
      expanded: true,
    });
  }

  init() {
    this._registerDebugger();
    this._addButterFlies();
  }

  _setButterFliesPosition() {
    const radius = 15;
    const dummy = new THREE.Object3D();
    for (let i = 0; i < this.#COUNT; i++) {
      const i3 = i * 3;

      const x = (Math.random() - 0.5) * 2 * radius;
      const z = (Math.random() - 0.5) * 2 * radius;

      const y = Math.random() * radius * 0.5;
      dummy.position.set(x, y, z);

      dummy.rotateY(Math.random() * Math.PI * 0.5);

      dummy.updateMatrix();

      this.mesh.setMatrixAt(i, dummy.matrix);
    }
  }

  _addButterFlies() {
    this.model.scene.traverse((el) => {
      if (el.isMesh) this.geometry = el.geometry;
    });

    this.material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      side: THREE.DoubleSide,
      transparent: true,
      fragmentShader,
      vertexShader,
      depthWrite: false,
    });

    this.mesh = new THREE.InstancedMesh(
      this.geometry,
      this.material,
      this.#COUNT
    );
    this.scene.add(this.mesh);

    this._setButterFliesPosition();
  }

  update() {
    this.uniforms.uTime.value = this.time.elapsed;
  }
}

export default ButterFlies;
