import Experience from "../Experience";
import * as THREE from "three";
import fragmentShader from "../Shaders/Butterfly/fragment.glsl";
import vertexShader from "../Shaders/Butterfly/vertex.glsl";
import { WORLD_DIAMETER } from "../const";

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
      uNoiseTexture: new THREE.Uniform(this.resources.fbm_texture),
      uButterflyTexture: new THREE.Uniform(this.texture),
    };

    this.angleArray = new Float32Array(this.#COUNT);
    this.radiusArray = new Float32Array(this.#COUNT);
    this.speedArray = new Float32Array(this.#COUNT);
    this.directionArray = new Float32Array(this.#COUNT);

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

  _calcButterflyPosition() {
    const radius = WORLD_DIAMETER * 0.5 * 0.75;

    for (let i = 0; i < this.#COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * radius;
      const speed = Math.random();
      const direction = Math.random() - 0.5 > 0 ? 1 : -1;

      this.angleArray[i] = angle;
      this.radiusArray[i] = r;
      this.speedArray[i] = speed;
      this.directionArray[i] = direction;
    }
  }

  _setButterFliesPosition() {
    this.dummy = new THREE.Object3D();
    for (let i = 0; i < this.#COUNT; i++) {
      const x = Math.sin(this.angleArray[i]) * this.radiusArray[i];
      const z = Math.cos(this.angleArray[i]) * this.radiusArray[i];
      const y = Math.random() * 2 + 0.3;
      this.dummy.position.set(x, y, z);

      // this.dummy.rotateY(this.angleArray[i]);

      this.dummy.updateMatrix();

      this.mesh.setMatrixAt(i, this.dummy.matrix);
    }
  }

  _addButterFlies() {
    this._calcButterflyPosition();

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

    for (let i = 0; i < this.#COUNT; i++) {
      this.mesh.getMatrixAt(i, this.dummy.matrix);

      this.dummy.matrix.decompose(
        this.dummy.position,
        this.dummy.quaternion,
        this.dummy.scale
      );

      const speed = 0.0001 * this.speedArray[i] * this.directionArray[i];
      const angle = this.time.elapsed * speed + this.angleArray[i];

      const x = Math.sin(angle) * this.radiusArray[i];
      const z = Math.cos(angle) * this.radiusArray[i];

      this.dummy.position.x = x;
      this.dummy.position.z = z;

      // fly forward
      const target = new THREE.Vector3(
        Math.sin(angle + 0.01) * this.radiusArray[i],
        this.dummy.position.y,
        Math.cos(angle + 0.01) * this.radiusArray[i]
      );
      this.dummy.lookAt(target);

      this.dummy.updateMatrix();

      this.mesh.setMatrixAt(i, this.dummy.matrix);
      this.mesh.instanceMatrix.needsUpdate = true;

      this.mesh.computeBoundingSphere();
    }
  }
}

export default ButterFlies;
