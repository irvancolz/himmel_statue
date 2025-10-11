import * as THREE from "three";
import Size from "./Utils/Sizes";
import Time from "./Utils/Time";
import Camera from "./Camera";
import Renderer from "./Renderer";
import World from "./World/World";
import resource from "./Utils/resource";
import ResourcesLoader from "./Utils/ResourceLoader";
import Debug from "./Debug";
import Light from "./Light";

let instance = null;

export default class Experience {
  constructor() {
    if (instance != null) {
      return instance;
    }

    instance = this;

    this.canvas = document.getElementById("canvas");
    this.size = new Size();
    this.time = new Time();
    this.debug = new Debug();

    this.resources = new ResourcesLoader(resource);

    this.scene = new THREE.Scene();
    this.camera = new Camera();
    this.light = new Light();
    this.renderer = new Renderer();

    this.world = new World();

    // const helper = new THREE.GridHelper(24, 24);
    // this.scene.add(helper);

    this.size.on("resize", () => {
      this.resize();
    });

    this.time.on("tick", () => {
      this.update();
    });
  }

  update() {
    this.light.update();
    this.world.update();
    this.camera.update();
    this.renderer.update();
  }

  resize() {
    this.renderer.resize();
    this.camera.resize();
    this.world.resize();
  }
}
