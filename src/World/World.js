import Experience from "../Experience";
import Floor from "./Floor";
import Sky from "./Sky";
import Tree from "./Tree";
import Statue from "./Statue";
import Bushes from "./Bushes";
import Flower from "./Flower";
import Grass from "./Grass";
import Fog from "./Fog";
import Butterflies from "./Butterflies";

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
    this.sky = new Sky();
    this.butterflies = new Butterflies();

    this.bushes = new Bushes();
    this.flower = new Flower();
    this.tree = new Tree();
    this.statue = new Statue();
    this.grass = new Grass();
  }

  update() {
    if (this.flower) this.flower.update();

    if (this.bushes) this.bushes.update();

    if (this.sky) this.sky.update();

    if (this.grass) this.grass.update();

    if (this.butterflies) this.butterflies.update();
  }

  resize() {}
}
