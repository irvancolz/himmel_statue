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
import Stats from "three/examples/jsm/libs/stats.module.js";
import Music from "./Music";

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
    this.music = new Music();

    this.resources = new ResourcesLoader(resource);

    this.scene = new THREE.Scene();
    this.camera = new Camera();
    this.light = new Light();
    this.renderer = new Renderer();

    this.world = new World();

    this.stats = new Stats();
    document.body.append(this.stats.dom);

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
    this.stats.update();
  }

  resize() {
    this.renderer.resize();
    this.camera.resize();
    this.world.resize();
  }
}
