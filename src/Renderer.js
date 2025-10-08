import * as THREE from "three";
import Experience from "./Experience";

export default class Renderer {
  constructor() {
    this.experience = new Experience();
    this.canvas = this.experience.canvas;
    this.camera = this.experience.camera;
    this.scene = this.experience.scene;
    this.size = this.experience.size;

    this.init();
  }

  init() {
    this.instance = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    });
    this.instance.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.instance.setSize(this.size.width, this.size.height);
    this.instance.render(this.scene, this.camera.instance);
  }

  update() {
    this.instance.render(this.scene, this.camera.instance);
  }

  resize() {
    this.instance.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.instance.setSize(this.size.width, this.size.height);
  }
}
