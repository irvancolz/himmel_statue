import Experience from "../Experience";
import * as THREE from "three";
import fragmentShader from "../Shaders/Grass/fragment.glsl";
import vertexShader from "../Shaders/Grass/vertex.glsl";

export default class Flower {
  #RADIUS = 10;
  #COUNT = 10_000;
  constructor(texture) {
    this.experience = new Experience();
    this.scene = this.experience.scene;

    this.time = this.experience.time;
    this.texture = texture;
    // this.texture.colorSpace = THREE.SRGBColorSpace;

    this.init();
  }

  init() {
    this._addFlower();
    this._setFlowerPosition();
  }

  _addFlower() {
    const geometry = new THREE.PlaneGeometry();
    geometry.translate(0, 0.5, 0);
    this.geometry = geometry;

    this.uniforms = {
      uTime: { value: 0 },
      uGrassTexture: new THREE.Uniform(this.texture),
    };

    const material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    this.material = material;

    const mesh = new THREE.InstancedMesh(
      this.geometry,
      this.material,
      this.#COUNT
    );
    this.mesh = mesh;
    this.scene.add(mesh);
  }

  _setFlowerPosition() {
    this.dummy = new THREE.Object3D();
    for (let i = 0; i < this.#COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;

      const x = Math.sin(angle) * Math.random() * this.#RADIUS;
      const z = Math.cos(angle) * Math.random() * this.#RADIUS;
      this.dummy.position.set(x, 0, z);

      this.dummy.scale.setScalar(0.5 + Math.random());

      this.dummy.rotation.y = Math.random() * Math.PI;

      this.dummy.updateMatrix();
      this.mesh.setMatrixAt(i, this.dummy.matrix);
    }
  }

  update() {
    this.material.needsUpdate = true;
    this.uniforms.uTime.value = this.time.elapsed;
  }
}
