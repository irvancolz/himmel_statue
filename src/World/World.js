import Experience from "../Experience";
import Floor from "./Floor";
import Grass from "./Grass";
import GrassBuffer from "./GrassBuffer";

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
    // this.grass = new GrassBuffer();
    this.floor = new Floor();
  }

  update() {
    if (this.grass) {
      this.grass.update();
    }
  }

  resize() {}
}
