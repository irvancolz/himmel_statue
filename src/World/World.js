import Experience from "../Experience";
import Floor from "./Floor";
import Sky from "./Sky";
import Tree from "./Tree";
import Statue from "./Statue";
import Bushes from "./Bushes";
import Flower from "./Flower";
import Grass from "./Grass";

export default class World {
  constructor() {
    this.experience = new Experience();
    this.resources = this.experience.resources;

    this.resources.on("finish:loaded", () => {
      this.init();
    });
  }

  init() {
    this.floor = new Floor();
    this.bushes = new Bushes();
    this.flower = new Flower(this.resources.resources.grass_color_texture);
    this.sky = new Sky();
    this.tree = new Tree();
    this.statue = new Statue();

    this.grass = new Grass();
  }

  update() {
    if (this.flower) {
      this.flower.update();
    }
    if (this.bushes) {
      this.bushes.update();
    }
    if (this.sky) {
      this.sky.update();
    }
  }

  resize() {}
}
