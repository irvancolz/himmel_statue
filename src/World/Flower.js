import Experience from "../Experience";
import * as THREE from "three";
import fragmentShader from "../Shaders/Flower/fragment.glsl";
import vertexShader from "../Shaders/Flower/vertex.glsl";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";

export default class Flower {
  #RADIUS = 10;
  #COUNT = 10_000;
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources.resources;

    this.time = this.experience.time;
    this.texture = this.resources.grass_color_texture;
    this.texture.colorSpace = THREE.SRGBColorSpace;

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
      uNoiseTexture: new THREE.Uniform(this.resources.noise_texture),
    };

    const material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      // baseMaterial: THREE.MeshStandardMaterial,
    });
    this.material = material;

    const mesh = new THREE.InstancedMesh(
      this.geometry,
      this.material,
      this.#COUNT
    );
    mesh.castShadow = true;
    // mesh.receiveShadow = true;
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
