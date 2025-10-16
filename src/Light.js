import * as THREE from "three";
import Experience from "./Experience";

class Light {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.debug = this.experience.debug;

    this.sunDirection = new THREE.Vector3(-0.3, 0.3, 0).normalize();
    this.sunDistance = 50;
    this.progress = 0;
    this.timeOfDay = 0;
    this.dayLength = 6000;

    this.debugConfig = {
      sunColor: "#ecf7fd",
      sunIntensity: 10.7,
      ambientColor: "#fff",
      ambientIntensity: 0.3,
    };

    this.init();
  }

  _registerDebugger() {
    if (!this.debug.active) return;
    const f = this.debug.pane.addFolder({ title: "light", expanded: false });

    const ambientF = f.addFolder({ title: "ambient" });
    ambientF.addBinding(this.debugConfig, "ambientColor").on("change", () => {
      this.ambient.color.set(this.debugConfig.ambientColor);
    });
    ambientF.addBinding(this.ambient, "intensity", {
      min: 0,
      max: 5,
      step: 0.1,
    });

    const sunF = f.addFolder({ title: "sun" });
    sunF.addBinding(this.debugConfig, "sunColor").on("change", () => {
      this.sun.color.set(this.debugConfig.sunColor);
    });
    sunF.addBinding(this.sun, "intensity", { min: 0, max: 20, step: 0.1 });
    sunF
      .addBinding(this.sunDirection, "x", { min: -1, max: 1, step: 0.1 })
      .on("change", () => this._moveSun());
    sunF
      .addBinding(this.sunDirection, "y", { min: -1, max: 1, step: 0.1 })
      .on("change", () => this._moveSun());
    sunF
      .addBinding(this.sunDirection, "z", { min: -1, max: 1, step: 0.1 })
      .on("change", () => this._moveSun());
  }

  _moveSun() {
    this.sun.position.copy(this.sunDirection);
  }

  init() {
    this._registerAmbientLight();
    this._registerSunLight();
    this._registerDebugger();
  }

  _registerSunLight() {
    this.sun = new THREE.DirectionalLight(
      this.debugConfig.sunColor,
      this.debugConfig.sunIntensity
    );

    this.sun.shadow.camera.top = 50;
    this.sun.shadow.camera.bottom = -50;
    this.sun.shadow.camera.right = 50;
    this.sun.shadow.camera.left = -50;
    this.sun.shadow.camera.far = 50;
    this.sun.shadow.camera.near = -50;
    this.sun.castShadow = true;

    this._moveSun();

    this.scene.add(this.sun);

    this.sunHelper = new THREE.DirectionalLightHelper(this.sun);
    // this.scene.add(this.sunHelper);

    this.shadowhelper = new THREE.CameraHelper(this.sun.shadow.camera);
    // this.scene.add(this.shadowhelper);
  }

  _registerAmbientLight() {
    this.ambient = new THREE.AmbientLight(
      this.debugConfig.ambientColor,
      this.debugConfig.ambientIntensity
    );
    this.scene.add(this.ambient);
  }

  update() {
    // this.timeOfDay += 1;
    // this.progress = (this.timeOfDay % this.dayLength) / this.dayLength;
    // const sunAngle = this.progress * Math.PI * 2;
    // this.sunDirection.x = Math.cos(sunAngle);
    // this.sunDirection.y = Math.sin(sunAngle);
    // this._moveSun();
  }
}

export default Light;
