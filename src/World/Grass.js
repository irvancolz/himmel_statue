import * as THREE from "three";
import { WORLD_DIAMETER } from "../const";
import Experience from "../Experience";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";
import fragmentShader from "../Shaders/Grass/fragment.glsl";
import vertexShader from "../Shaders/Grass/vertex.glsl";
import { random } from "../Utils/math";

export default class Grass {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.time = this.experience.time;
    this.debug = this.experience.debug;

    this.density = 80;
    this.width = WORLD_DIAMETER;
    this.count = this.density * this.width ** 2;
    this.position = new THREE.Vector3();

    this.rotation = 0;

    this.BLADE_HEIGHT = 0.5;
    this.BLADE_WIDTH = 0.25;
    this.BLADE_HEIGHT_VARIATION = 0.2;

    this.positionsArray = [];
    this.uvsArray = [];
    this.colorsArray = [];
    this.indiciesArray = [];
    this.centersArray = [];

    this.debugConfig = {
      color: "#6e8e2e",
    };

    this.init();
  }

  _registerDebugger() {
    if (!this.debug.active) return;

    const f = this.debug.pane.addFolder({ title: "grass", expanded: false });
    f.addBinding(this.debugConfig, "color").on("change", () => {
      this.uniforms.uColor.value.set(this.debugConfig.color);
    });
  }

  initMaterial() {
    this.uniforms = {
      uColor: new THREE.Uniform(new THREE.Color(this.debugConfig.color)),
      uTime: new THREE.Uniform(0),
      uNoiseTexture: new THREE.Uniform(
        this.experience.resources.resources.noise_texture
      ),
    };
    this.material = new CustomShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: this.uniforms,
      baseMaterial: THREE.MeshLambertMaterial,
    });
  }

  initGeometry() {
    const VERT_PER_BLADE = 5;
    const SURFACE_MIN = this.width * 0.5 * -1;
    const SURFACE_MAX = this.width * 0.5;

    for (let row = 0; row < this.width; row++) {
      for (let col = 0; col < this.width; col++) {
        for (let idx = 0; idx < this.density; idx++) {
          const i = row * this.width * this.density + col * this.density + idx;
          const rand = random(i);

          let x = row - this.width * 0.5 + 0.5 + (rand() - 0.5);
          let y = col - this.width * 0.5 + 0.5 + (rand() - 0.5);

          const center = new THREE.Vector3(x, 0, y).add(this.position);

          const uv = [
            this.convertRange(center.x, SURFACE_MIN, SURFACE_MAX, 0, 1),
            this.convertRange(center.z, SURFACE_MIN, SURFACE_MAX, 0, 1),
          ];

          const blade = this.generateBlade(i * VERT_PER_BLADE, uv);
          blade.verts.forEach((vert) => {
            this.positionsArray.push(...vert.pos);
            this.uvsArray.push(...vert.uv);
            this.colorsArray.push(...vert.color);
            this.centersArray.push(center.x, center.z);
          });
          blade.indices.forEach((i) => this.indiciesArray.push(i));
        }
      }
    }

    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(new Float32Array(this.positionsArray), 3)
    );

    this.geometry.setAttribute(
      "uv",
      new THREE.Float32BufferAttribute(new Float32Array(this.uvsArray), 2)
    );
    this.geometry.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(new Float32Array(this.colorsArray), 3)
    );
    this.geometry.setAttribute(
      "aCenter",
      new THREE.Float32BufferAttribute(new Float32Array(this.centersArray), 2)
    );

    this.geometry.computeVertexNormals();
  }

  init() {
    this._registerDebugger();
    this.initMaterial();
    this.initGeometry();

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.frustumCulled = false;
    this.mesh.receiveShadow = true;
    // this.mesh.castShadow = true;

    this.scene.add(this.mesh);
  }

  initDebug() {
    if (!this.debug.active) return;
    const opt = {
      color: "#085944",
    };
    const f = this.debug.ui.addFolder({
      title: "grass",
      expanded: false,
    });
    f.addBinding(opt, "color").on("change", () => {
      this.material.uniforms.uColor.value.set(opt.color);
    });
    f.addBinding(this, "density", {
      min: 1,
      max: 300,
      step: 1,
    }).on("change", (e) => {
      if (!e.last) return;
      this.reset();
    });
    f.addBinding(this, "width", {
      min: 1,
      max: 128,
      step: 10,
    }).on("change", (e) => {
      if (!e.last) return;
      this.reset();
    });
  }

  reset() {
    this.positionsArray = [];
    this.uvsArray = [];
    this.colorsArray = [];
    this.indiciesArray = [];
    this.centersArray = [];
    this.scene.remove(this.mesh);
    this.geometry.dispose();
    this.material.dispose();

    this.init(false);
  }

  update() {
    this.uniforms.uTime.value = this.time.elapsed;
  }

  dispose() {
    this.scene.remove(this.mesh);
    this.material.dispose();
    this.geometry.dispose();
  }

  // https://github.com/James-Smyth/three-grass-demo/blob/main/src/index.js
  generateBlade(vArrOffset, uv) {
    const rand = random(vArrOffset);

    const MID_WIDTH = this.BLADE_WIDTH * 1.75;
    const TIP_OFFSET = 0.1;
    const height = this.BLADE_HEIGHT;

    const yaw = rand() * Math.PI * 2;
    const yawUnitVec = new THREE.Vector3(Math.sin(yaw), 0, -Math.cos(yaw));
    const tipBend = rand() * Math.PI * 2;
    const tipBendUnitVec = new THREE.Vector3(
      Math.sin(tipBend),
      0,
      -Math.cos(tipBend)
    );

    // Find the Bottom Left, Bottom Right, Top Left, Top right, Top Center vertex positions
    const bl = new THREE.Vector3()
      .copy(yawUnitVec)
      .multiplyScalar((this.BLADE_WIDTH / 2) * 1);

    const br = new THREE.Vector3()
      .copy(yawUnitVec)
      .multiplyScalar((this.BLADE_WIDTH / 2) * -1);

    const tc = new THREE.Vector3()
      .add(tipBendUnitVec)
      .multiplyScalar(TIP_OFFSET);

    tc.y += height;

    // Vertex Colors
    const black = [0, 0, 0];
    const gray = [0.5, 0.5, 0.5];
    const white = [1.0, 1.0, 1.0];

    const verts = [
      { pos: bl.toArray(), uv: uv, color: black },
      { pos: br.toArray(), uv: uv, color: black },
      { pos: tc.toArray(), uv: uv, color: white },
    ];

    const indices = [vArrOffset, vArrOffset + 1, vArrOffset + 2];

    return { verts, indices };
  }

  convertRange(val, oldMin, oldMax, newMin, newMax) {
    return ((val - oldMin) * (newMax - newMin)) / (oldMax - oldMin) + newMin;
  }
}
