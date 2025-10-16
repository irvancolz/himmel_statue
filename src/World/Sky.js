import * as THREE from "three";
import Experience from "../Experience";
import fragmentShader from "../Shaders/Sky/fragment.glsl";
import vertexShader from "../Shaders/Sky/vertex.glsl";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";
import { WORLD_DIAMETER } from "../const";

class Sky {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.debug = this.experience.debug;

    this.debugConfig = {
      skyDayColor: "#05a8ff",
      horizonColor: "#dde1c8",
    };

    this.progress = 0;
    this.timeOfDay = 0;
    this.dayLength = 2000;

    this.init();
    this._registerDebugger();
  }

  _registerDebugger() {
    if (!this.debug.active) return;

    const f = this.debug.pane.addFolder({ title: "sky", expanded: false });
    f.addBinding(this.debugConfig, "skyDayColor").on("change", () => {
      this.uniforms.uSkyDayColor.value.set(this.debugConfig.skyDayColor);
    });
    f.addBinding(this.debugConfig, "horizonColor").on("change", () => {
      this.uniforms.uHorizonColor.value.set(this.debugConfig.horizonColor);
    });
  }

  init() {
    this._initSun();
    this._initSky();
  }

  _initSky() {
    this.uniforms = {
      uSkyDayColor: new THREE.Uniform(
        new THREE.Color(this.debugConfig.skyDayColor)
      ),
      uHorizonColor: new THREE.Uniform(
        new THREE.Color(this.debugConfig.horizonColor)
      ),
      uSunDirection: new THREE.Uniform(new THREE.Vector3(0, 1, 0)),
    };
    const w = WORLD_DIAMETER * 0.75;
    // const w = 4;
    this.geometry = new THREE.SphereGeometry(w, 64, 64);

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
