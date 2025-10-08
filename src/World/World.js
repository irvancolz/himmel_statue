import Experience from "../Experience";
import Floor from "./Floor";
import Grass from "./Grass";
import Sky from "./Sky";
import Tree from "./Tree";
import Statue from "./Statue";
import Bushes from "./Bushes";

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
    this.tree = new Tree();
    this.statue = new Statue();
    this.bushes = new Bushes();
  }

  update() {
    if (this.grass) {
      this.grass.update();
    }
  }

  resize() {}
}
