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
import { WORLD_DIAMETER } from "../const";
import Fox from "./Fox";

export default class World {
  constructor() {
    this.experience = new Experience();
    this.resources = this.experience.resources;
    this.debug = this.experience.debug;

    this.debugConfig = {
      bushesColor: "#5e8e2e",
      tree_1: "#858425",
      tree_2: "#855e25",
    };

    this.resources.on("finish:loaded", () => {
      this.init();
    });
  }

  init() {
    this.floor = new Floor();
    this.sky = new Sky();
    this.fog = new Fog();

    this.grass = new Grass();
    this.flower = new Flower();

    this.fox = new Fox();

    this.bushes = new Bushes(200, this.debugConfig.bushesColor);
    this.bushes.randomize(WORLD_DIAMETER * 0.5, WORLD_DIAMETER * 0.15);

    this.tree1 = new Tree(50, this.debugConfig.tree_1);
    this.tree2 = new Tree(75, this.debugConfig.tree_2);
    this.statue = new Statue();
    this.butterflies = new Butterflies();

    this._registerDebugger();
  }

  _registerDebugger() {
    if (!this.debug.active) return;

    const f = this.debug.pane.addFolder({ title: "world", expanded: false });
    f.addBinding(this.debugConfig, "bushesColor").on("change", () => {
      this.bushes.updateColor(this.debugConfig.bushesColor);
    });
    f.addBinding(this.debugConfig, "tree_1").on("change", () => {
      this.tree1.updateColor(this.debugConfig.tree_1);
    });
    f.addBinding(this.debugConfig, "tree_2").on("change", () => {
      this.tree2.updateColor(this.debugConfig.tree_2);
    });
  }

  update() {
    if (this.flower) this.flower.update();

    // if (this.sky) this.sky.update();

    if (this.grass) this.grass.update();

    if (this.butterflies) this.butterflies.update();

    if (this.bushes) this.bushes.update();

    if (this.tree1) this.tree1.update();
    if (this.tree2) this.tree2.update();

    if (this.fox) this.fox.update();
  }

  resize() {}
}
