import * as THREE from "three";
import Experience from "../Experience";
import fragmentShader from "../Shaders/Sky/fragment.glsl";
import vertexShader from "../Shaders/Sky/vertex.glsl";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";

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
      sunColor: "#ecf7fd",
    };

    this.progress = 0;
    this.timeOfDay = 0;
    this.dayLength = 6000;

    this.init();
    this._registerDebugger();
  }

  _registerDebugger() {
    if (!this.debug.active) return;

    const f = this.debug.pane.addFolder({ title: "sky", expanded: false });
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
    f.addBinding(this.debugConfig, "sunColor").on("change", () => {
      this.uniforms.uSunColor.value.set(this.debugConfig.sunColor);
    });
  }

  init() {
    this._initSun();
    this._initSky();
  }

  _initSky() {
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
      uSunColor: new THREE.Uniform(new THREE.Color(this.debugConfig.sunColor)),
      uSunDirection: new THREE.Uniform(new THREE.Vector3()),
    };
    this.geometry = new THREE.SphereGeometry(200, 64, 64);

    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      side: THREE.DoubleSide,
      uniforms: this.uniforms,
      // baseMaterial: THREE.MeshBasicMaterial,
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }

  _initSun() {
    this.sun = {};
    this.sun.direction = new THREE.Vector3(0, 1, 0);
  }

  update() {
    this.timeOfDay += 1;
    this.progress = (this.timeOfDay % this.dayLength) / this.dayLength;

    const sunAngle = this.progress * Math.PI * 2;

    this.sun.direction.x = Math.cos(sunAngle);
    this.sun.direction.y = Math.sin(sunAngle);

    this.uniforms.uSunDirection.value.copy(this.sun.direction);
  }
}

export default Sky;
