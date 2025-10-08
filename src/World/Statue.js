import Experience from "../Experience";
import * as THREE from "three";

class Statue {
  constructor() {
    this.experience = new Experience();
    this.resources = this.experience.resources;

    this.init();
  }
  init() {
    this.statue = this.resources.resources.statue_model.scene;
    // this.statue.traverse((el) => {
    //   if (el.isMesh) {
    //     el.material = new THREE.MeshBasicMaterial();
    //   }
    // });
    this.statue.position.y = 2.25;
    this.statue.scale.setScalar(4);
    this.experience.scene.add(this.statue);
  }
}

export default Statue;
