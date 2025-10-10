import * as THREE from "three";
import Experience from "../Experience";
import fragmentShader from "../Shaders/Sky/fragment.glsl";
import vertexShader from "../Shaders/Sky/vertex.glsl";

class Sky {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.debug = this.experience.debug;

    this.debugConfig = {
      dayHighColor: "#aee3ff",
      dayLowColor: "#cad7e1",
      nightLowColor: "#babaf2",
      nightHighColor: "#234d98",
    };

    this.init();
    this._registerDebugger();
  }

  _registerDebugger() {
    if (!this.debug.active) return;

    const f = this.debug.pane.addFolder({ title: "sky", expanded: true });
    f.addBinding(this.debugConfig, "dayHighColor").on("change", () => {
      this.uniforms.uDayHighColor.value.set(this.debugConfig.dayHighColor);
    });
    f.addBinding(this.debugConfig, "dayLowColor").on("change", () => {
      this.uniforms.uDayLowColor.value.set(this.debugConfig.dayLowColor);
    });
    f.addBinding(this.debugConfig, "nightLowColor").on("change", () => {
      this.uniforms.uNightLowColor.value.set(this.debugConfig.nightLowColor);
    });
    f.addBinding(this.debugConfig, "nightHighColor").on("change", () => {
      this.uniforms.uNightHighColor.value.set(this.debugConfig.nightHighColor);
    });
  }

  init() {
    this.uniforms = {
      uDayHighColor: new THREE.Uniform(
        new THREE.Color(this.debugConfig.dayHighColor)
      ),
      uDayLowColor: new THREE.Uniform(
        new THREE.Color(this.debugConfig.dayLowColor)
      ),
      uNightLowColor: new THREE.Uniform(
        new THREE.Color(this.debugConfig.nightLowColor)
      ),
      uNightHighColor: new THREE.Uniform(
        new THREE.Color(this.debugConfig.nightHighColor)
      ),
    };
    this.geometry = new THREE.SphereGeometry(4);
    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      side: THREE.DoubleSide,
      uniforms: this.uniforms,
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }

  update() {}
}

export default Sky;
