import Experience from "../Experience";
import * as THREE from "three";
import vertexShader from "../Shaders/GrassBuffer/grassbuffer.vert.glsl";
import fragmentShader from "../Shaders/GrassBuffer/grassbuffer.frag.glsl";

export default class GrassBuffer {
  constructor() {
    this.PLANE_SIZE = 20;
    this.BLADE_COUNT = 100_000;
    this.BLADE_WIDTH = 0.1;
    this.BLADE_HEIGHT = 0.8;
    this.BLADE_HEIGHT_VARIATION = 0.6;
    this.VERTEX_COUNT = 5;

    this.experience = new Experience();
    this.resources = this.experience.resources;
    this.time = this.experience.time;
    this.scene = this.experience.scene;
    this.grassTexture = this.resources.resources.grass_color_texture;
    this.cloudTexture = this.resources.resources.cloud_noise_texture;
    this.cloudTexture.wrapS = this.cloudTexture.wrapT = THREE.RepeatWrapping;

    this.positions = [];
    this.center = [];
    this.uv = [];
    this.indices = [];
    this.colors = [];

    this.init();
  }

  init() {
    this.generateField();
    this.setMaterial();
    this.setGeometry();
    this.setMesh();
  }

  setMaterial() {
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      side: THREE.DoubleSide,
      vertexColors: true,
      uniforms: {
        uTime: { value: 0 },
        uGrassTextures: { value: this.grassTexture },
        uCloudTextures: { value: this.cloudTexture },
      },
    });
    this.material = material;
  }

  setGeometry() {
    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(this.positions), 3)
    );
    this.geometry.setAttribute(
      "center",
      new THREE.BufferAttribute(new Float32Array(this.center), 3)
    );
    this.geometry.setAttribute(
      "uv",
      new THREE.BufferAttribute(new Float32Array(this.uv), 2)
    );
    this.geometry.setAttribute(
      "color",
      new THREE.BufferAttribute(new Float32Array(this.colors), 3)
    );
    this.geometry.setIndex(this.indices);
    this.geometry.computeVertexNormals();
  }

  setMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }

  update() {
    this.material.uniforms.uTime.value = this.time.elapsed;
  }

  convertRange(val, oldMin, oldMax, newMin, newMax) {
    return ((val - oldMin) * (newMax - newMin)) / (oldMax - oldMin) + newMin;
  }

  generateBlade(center, vArrOffset, uv) {
    const MID_WIDTH = this.BLADE_WIDTH * 0.5;
    const TIP_OFFSET = 0.1;

    const height =
      this.BLADE_HEIGHT + Math.random() * this.BLADE_HEIGHT_VARIATION;

    const yaw = Math.random() * Math.PI * 2;
    const yawVectorUnit = new THREE.Vector3(Math.sin(yaw), 0, -Math.cos(yaw));
    const tipBend = Math.random() * Math.PI * 2;
    const tipBendVectorUnit = new THREE.Vector3(
      Math.sin(tipBend),
      0,
      -Math.cos(tipBend)
    );

    const br = new THREE.Vector3().addVectors(
      center,
      new THREE.Vector3()
        .copy(yawVectorUnit)
        .multiplyScalar(this.BLADE_WIDTH * 0.5 * 1)
    );
    const bl = new THREE.Vector3().addVectors(
      center,
      new THREE.Vector3()
        .copy(yawVectorUnit)
        .multiplyScalar(this.BLADE_WIDTH * 0.5 * -1)
    );
    const tr = new THREE.Vector3().addVectors(
      center,
      new THREE.Vector3()
        .copy(yawVectorUnit)
        .multiplyScalar(MID_WIDTH * 0.5 * 1)
    );
    const tl = new THREE.Vector3().addVectors(
      center,
      new THREE.Vector3()
        .copy(yawVectorUnit)
        .multiplyScalar(MID_WIDTH * 0.5 * -1)
    );
    const tc = new THREE.Vector3().addVectors(
      center,
      new THREE.Vector3()
        .copy(tipBendVectorUnit)
        .multiplyScalar(TIP_OFFSET * 0.5 * -1)
    );

    tl.y += height / 2;
    tr.y += height / 2;
    tc.y += height;

    // Vertex Colors
    const black = [0, 0, 0];
    const gray = [0.5, 0.5, 0.5];
    const white = [1.0, 1.0, 1.0];

    const verts = [
      { pos: bl.toArray(), uv: uv, color: black },
      { pos: br.toArray(), uv: uv, color: black },
      { pos: tr.toArray(), uv: uv, color: gray },
      { pos: tl.toArray(), uv: uv, color: gray },
      { pos: tc.toArray(), uv: uv, color: white },
    ];

    const indices = [
      vArrOffset,
      vArrOffset + 1,
      vArrOffset + 2,
      vArrOffset + 2,
      vArrOffset + 4,
      vArrOffset + 3,
      vArrOffset + 3,
      vArrOffset,
      vArrOffset + 2,
    ];

    return { verts, indices };
  }

  generateField() {
    for (let i = 0; i < this.BLADE_COUNT; i++) {
      const surfaceMin = (this.PLANE_SIZE / 2) * -1;
      const surfaceMax = (this.PLANE_SIZE / 2) * 1;
      const radius = this.PLANE_SIZE / 2;

      const r = radius * Math.sqrt(Math.random());
      const theta = Math.random() * Math.PI * 2;
      const x = Math.cos(theta) * r;
      const y = Math.sin(theta) * r;

      const pos = new THREE.Vector3(x, 0, y);
      const uv = [
        this.convertRange(pos.x, surfaceMin, surfaceMax, 0, 1),
        this.convertRange(pos.z, surfaceMin, surfaceMax, 0, 1),
      ];

      const blade = this.generateBlade(pos, i * this.VERTEX_COUNT, uv);

      this.center.push(pos);

      blade.verts.forEach((vert) => {
        this.positions.push(...vert.pos);
        this.uv.push(...vert.uv);
        this.colors.push(...vert.color);
      });

      blade.indices.forEach((idx) => this.indices.push(idx));
    }
  }
}
