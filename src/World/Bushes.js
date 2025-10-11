import * as THREE from "three";
import { WORLD_DIAMETER } from "../const";
import Experience from "../Experience";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";
import vertexShader from "../Shaders/Bushes/vertex.glsl";
import fragmentShader from "../Shaders/Bushes/fragment.glsl";

class Bushes {
  #RADIUS = WORLD_DIAMETER * 0.5;
  #BUSHES_COUNT = 100;
  #BUSHES_DEPTH = WORLD_DIAMETER * 0.15;
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources.resources;
    this.debug = this.experience.debug;
    this.time = this.experience.time;

    this.debugConfig = {
      // color: "#fff",
      color: "#13ae6b",
    };

    this.init();
  }

  init() {
    this._registerDebugger();
    this._addBushes();
    this._setBushesPosition();
  }

  _registerDebugger() {
    if (!this.debug.active) return;

    const f = this.debug.pane.addFolder({ title: "bushes", expanded: true });
    f.addBinding(this.debugConfig, "color").on("change", () => {
      this.uniforms.uBushesColor.value.set(this.debugConfig.color);
    });
  }

  _createGeometry() {
    const geometries = [];
    const LEAVES_COUNT = 80;
    this.normalArray = [];

    for (let i = 0; i < LEAVES_COUNT; i++) {
      const plane = new THREE.PlaneGeometry();

      const sphere = new THREE.Spherical(
        1 - Math.pow(Math.random(), 3),
        Math.PI * Math.random() * 2,
        Math.random() * Math.PI
      );
      const position = new THREE.Vector3().setFromSpherical(sphere);

      plane.translate(position.x, position.y, position.z);

      plane.rotateX(Math.random() * 9999);
      plane.rotateY(Math.random() * 9999);
      plane.rotateZ(Math.random() * 9999);

      this._calcNormal(plane, position);

      geometries.push(plane);
    }

    this.geometry = mergeGeometries(geometries);
    this.geometry.translate(0, 0.8, 0);
    this.geometry.setAttribute(
      "normal",
      new THREE.BufferAttribute(new Float32Array(this.normalArray), 3)
    );
  }

  _calcNormal(plane, pos) {
    const normal = pos.clone().normalize();

    for (let i = 0; i < 4; i++) {
      const i3 = i * 3;

      const position = new THREE.Vector3(
        plane.attributes.position.array[i3],
        plane.attributes.position.array[i3 + 1],
        plane.attributes.position.array[i3 + 2]
      );

      const mixedNormal = position.lerp(normal, 0.05);

      this.normalArray.push(mixedNormal.x, mixedNormal.y, mixedNormal.z);
    }
  }

  _addBushes() {
    this._createGeometry();

    this.uniforms = {
      uTime: new THREE.Uniform(0),
      uLeavesTexture: new THREE.Uniform(this.resources.leaves_alpha_texture),
      uBushesColor: new THREE.Uniform(new THREE.Color(this.debugConfig.color)),
    };

    this.material = new CustomShaderMaterial({
      uniforms: this.uniforms,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      vertexShader,
      fragmentShader,
      baseMaterial: THREE.MeshStandardMaterial,
      // alphaMap: this.resources.leaves_alpha_texture,
    });

    this.mesh = new THREE.InstancedMesh(
      this.geometry,
      this.material,
      this.#BUSHES_COUNT
    );
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.scene.add(this.mesh);
  }

  _setBushesPosition() {
    const dummy = new THREE.Object3D();

    for (let i = 0; i < this.#BUSHES_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;

      const offset = Math.random() * this.#BUSHES_DEPTH;
      let x = Math.sin(angle) * this.#RADIUS;
      x += x > 0 ? -1 * offset : offset;
      let z = Math.cos(angle) * this.#RADIUS;
      z += z > 0 ? -1 * offset : offset;
      dummy.position.x = x;
      dummy.position.z = z;
      dummy.position.y = 0;

      dummy.rotateY(Math.random() * Math.PI * 0.5);

      // dummy.scale.setScalar(0.5 + Math.random());

      dummy.updateWorldMatrix();

      this.mesh.setMatrixAt(i, dummy.matrix);
    }
  }

  update() {
    this.uniforms.uTime.value = this.time.elapsed;
  }
}

export default Bushes;
