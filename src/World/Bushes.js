import * as THREE from "three";
import Experience from "../Experience";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";
import vertexShader from "../Shaders/Bushes/vertex.glsl";
import fragmentShader from "../Shaders/Bushes/fragment.glsl";
import { random } from "../Utils/math";

class Bushes {
  constructor(count = 1, color = "#13ae6b") {
    this.count = count;
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources.resources;
    this.time = this.experience.time;

    this.color = color;

    this.positions = [];
    this.rotations = [];
    this.scales = [];

    this.init();
  }

  init() {
    this._addBushes();
  }

  _createGeometry() {
    const geometries = [];
    const LEAVES_COUNT = 80;
    this.normalArray = [];

    for (let i = 0; i < LEAVES_COUNT; i++) {
      const rand = random(i + LEAVES_COUNT);

      const plane = new THREE.PlaneGeometry();

      const sphere = new THREE.Spherical(
        1 - Math.pow(rand(), 3),
        Math.PI * rand() * 2,
        rand() * Math.PI
      );
      const position = new THREE.Vector3().setFromSpherical(sphere);

      plane.translate(position.x, position.y, position.z);

      plane.rotateX(rand() * 9999);
      plane.rotateY(rand() * 9999);
      plane.rotateZ(rand() * 9999);

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
      uBushesColor: new THREE.Uniform(new THREE.Color(this.color)),
      uNoiseTexture: new THREE.Uniform(this.resources.noise_texture),
    };

    this.material = new CustomShaderMaterial({
      uniforms: this.uniforms,
      alphaTest: 0.3,
      // transparent: true,
      side: THREE.DoubleSide,
      vertexShader,
      fragmentShader,
      baseMaterial: THREE.MeshLambertMaterial,
      alphaMap: this.resources.leaves_alpha_texture,
    });

    this.customDepthMaterial = new THREE.MeshDepthMaterial({
      alphaMap: this.resources.leaves_alpha_texture,
      depthPacking: THREE.RGBADepthPacking,
    });
    this.customDepthMaterial.onBeforeCompile = (shader) => {
      shader.fragmentShader = shader.fragmentShader.replace(
        `#include <alphamap_fragment>`,
        `
        #include <alphamap_fragment>
        if(diffuseColor.a < .6) discard;
        `
      );
    };

    this.mesh = new THREE.InstancedMesh(
      this.geometry,
      this.material,
      this.count
    );
    this.mesh.customDepthMaterial = this.customDepthMaterial;
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.scene.add(this.mesh);
  }

  setPositions(pos = []) {
    if (pos.length != this.count) {
      console.error(
        "check bushes position length:",
        pos.length,
        " count :",
        this.count
      );
      return;
    }

    this.positions = pos;
  }

  setScales(scale = []) {
    if (scale.length != this.count) {
      console.error(
        "check bushes scales length:",
        scale.length,
        " count :",
        this.count
      );
      return;
    }

    this.scales = scale;
  }

  setRotations(rot = []) {
    if (rot.length != this.count) {
      console.error(
        "check bushes rotation length:",
        rot.length,
        " count :",
        this.count
      );
      return;
    }

    this.rotations = rot;
  }

  randomize(radius, depth) {
    for (let i = 0; i < this.count; i++) {
      const rand = random(radius + i);

      const position = new THREE.Vector3();

      const angle = rand() * Math.PI * 2;
      const offset = rand() * depth;

      let x = Math.sin(angle) * radius;
      x += x > 0 ? -1 * offset : offset;

      let z = Math.cos(angle) * radius;
      z += z > 0 ? -1 * offset : offset;

      position.x = x;
      position.z = z;
      position.y = 0;

      this.positions[i] = position;

      const rotation = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(0, rand(), 0),
        Math.PI
      );
      this.rotations[i] = rotation;

      const scale = 0.5 + rand();
      this.scales[i] = new THREE.Vector3(scale, scale, scale);
    }
    this.updateMatrix();
  }

  updateColor(col) {
    this.uniforms.uBushesColor.value.set(col);
  }

  updateMatrix() {
    const dummy = new THREE.Object3D();

    for (let i = 0; i < this.count; i++) {
      dummy.position.copy(this.positions[i]);
      dummy.quaternion.copy(this.rotations[i]);
      dummy.scale.copy(this.scales[i]);

      dummy.updateWorldMatrix();

      this.mesh.setMatrixAt(i, dummy.matrix);
    }
  }

  update() {
    this.uniforms.uTime.value = this.time.elapsed;
  }
}

export default Bushes;
