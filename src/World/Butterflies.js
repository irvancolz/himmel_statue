import Experience from "../Experience";
import * as THREE from "three";
import fragmentShader from "../Shaders/Butterfly/fragment.glsl";
import vertexShader from "../Shaders/Butterfly/vertex.glsl";
import { WORLD_DIAMETER } from "../const";
import { random } from "../Utils/math";

class ButterFlies {
  #COUNT = 15;
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
    this.heightArray = new Float32Array(this.#COUNT);
    this.delayArray = new Float32Array(this.#COUNT);
    this.directionArray = new Float32Array(this.#COUNT);

    this.init();
  }

  init() {
    this._addButterFlies();
  }

  _calcButterflyPosition() {
    const radius = WORLD_DIAMETER * 0.5 * 0.75;

    for (let i = 0; i < this.#COUNT; i++) {
      const rand = random(i + this.#COUNT);
      const angle = rand() * Math.PI * 2;
      const r = 0.3 + rand() * radius;
      const speed = rand();
      const direction = rand() - 0.5 > 0 ? 1 : -1;
      const height = 1 + rand() * 5;
      const delay = rand() * 10;

      this.delayArray[i] = delay;
      this.heightArray[i] = height;
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
      const y = this.heightArray[i];
      this.dummy.position.set(x, y, z);

      //todo: set size on model
      this.dummy.scale.setScalar(0.5);

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
      this.dummy.position.y =
        this.heightArray[i] +
        Math.sin(this.time.elapsed * (0.0005 * this.delayArray[i])) * 0.5;

      // fly forward
      const target = new THREE.Vector3(
        Math.sin(angle + 0.01 * this.directionArray[i]) * this.radiusArray[i],
        this.dummy.position.y,
        Math.cos(angle + 0.01 * this.directionArray[i]) * this.radiusArray[i]
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
