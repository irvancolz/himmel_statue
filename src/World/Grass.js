import Experience from "../Experience";
import * as THREE from "three";
import fragmentShader from "../Shaders/Grass/fragment.glsl";
import vertexShader from "../Shaders/Grass/vertex.glsl";

export default class Grass {
  constructor(texture) {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.count = 100;
    this.time = this.experience.time;
    this.texture = texture;

    this.initGeometry();
    this.initMaterial();
    this.initMesh();
  }

  initGeometry() {
    const geometry = new THREE.PlaneGeometry();
    geometry.translate(0, 0.5, 0);
    this.geometry = geometry;
  }

  initMaterial() {
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
  }

  initMesh() {
    const mesh = new THREE.InstancedMesh(
      this.geometry,
      this.material,
      Math.pow(this.count, 2)
    );
    this.mesh = mesh;
    this.scene.add(mesh);

    this.dummy = new THREE.Object3D();
    for (let i = 0; i < Math.pow(this.count, 2); i++) {
      this.dummy.position.set(
        (Math.random() - 0.5) * 10,
        0,
        (Math.random() - 0.5) * 10
      );

      this.dummy.scale.setScalar(0.5 + Math.random());

      this.dummy.rotation.y = Math.random() * Math.PI;

      this.dummy.updateMatrix();
      mesh.setMatrixAt(i, this.dummy.matrix);
      mesh.instanceMatrix.needsUpdate = true;
    }
    mesh.instanceMatrix.needsUpdate = true;
  }

  update() {
    this.material.needsUpdate = true;
    this.uniforms.uTime.value = this.time.elapsed;
  }
}
