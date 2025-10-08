import Experience from "../Experience";
import Floor from "./Floor";
import Grass from "./Grass";
import Sky from "./Sky";
import * as THREE from "three";

export default class World {
  constructor() {
    this.experience = new Experience();
    this.resources = this.experience.resources;

    this.resources.on("finish:loaded", () => {
      this.init();
    });
  }

  init() {
    this.grass = new Grass(this.resources.resources.grass_color_texture);
    this.floor = new Floor();
    this.sky = new Sky();

    this.statue = this.resources.resources.statue_model.scene;
    this.statue.traverse((el) => {
      if (el.isMesh) {
        el.material = new THREE.MeshBasicMaterial();
      }
    });
    this.statue.position.y = 2.25;
    this.statue.scale.setScalar(4);
    this.experience.scene.add(this.statue);
  }

  update() {
    if (this.grass) {
      this.grass.update();
    }
  }

  resize() {}
}
