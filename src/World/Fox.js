import { WORLD_DIAMETER } from "../const";
import Experience from "../Experience";
import * as THREE from "three";

class Fox {
  #STATE_SURVEY = "survey";
  #STATE_WALK = "walk";
  #STATE_RUN = "run";

  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources.resources;
    this.model = this.resources.fox_model;
    this.time = this.experience.time;
    this.debug = this.experience.debug;

    this.states = [
      { name: this.#STATE_RUN, speed: 0.005, frameSpeed: 0.002 },
      { name: this.#STATE_WALK, speed: 0.003, frameSpeed: 0.001 },
      { name: this.#STATE_SURVEY, speed: 0.001, frameSpeed: 0.001 },
    ];
    this.tracks = {};

    this.target = new THREE.Vector3(0, 0, 0);
    this.start = new THREE.Vector3(0, 0, 0);
    this.direction = new THREE.Vector3(0, 0, 0);
    this.state = this.#STATE_SURVEY;
    this.speed = 0.001;
    this.frameSpeed = 0.001;
    this.progress = 0;
    this.distance = 0;

    this.init();
  }

  init() {
    this._registerModelparts();
    this._registerAnimation();
    this._addFox();
    this._randomizeState();
    this._registerDebugger();
  }

  _registerDebugger() {
    if (!this.debug.active) return;

    const f = this.debug.pane.addFolder({ title: "fox", expanded: true });
    const surveyBtn = f.addButton({
      title: "survey",
    });
    surveyBtn.on("click", () => {
      this._setState(this.#STATE_SURVEY);
    });

    const walkBtn = f.addButton({
      title: "walk",
    });
    walkBtn.on("click", () => {
      this._setState(this.#STATE_WALK);
    });

    const runBtn = f.addButton({
      title: "run",
    });
    runBtn.on("click", () => {
      this._setState(this.#STATE_RUN);
    });
  }

  _randomizeState() {
    const tresshold = Math.floor(Math.random() * this.states.length);
    const newState = this.states[tresshold].name;
    this._setState(newState);
  }

  _setState(name) {
    const newState = this.states.find((el) => el.name == name);
    if (!newState) {
      console.error("fox state not found : ", name);
      return;
    }
    this.progress = 0;
    this.state = newState.name;
    this.speed = newState.speed;
    this.frameSpeed = newState.frameSpeed;

    this._calcNewTarget();
    this._updateAnimationTracks();
  }

  _calcNewTarget() {
    this.start.copy(this.fox.position);
    if (this.state == this.#STATE_SURVEY) {
      this.target.copy(this.fox.position);
      this.direction = new THREE.Vector3();
    } else {
      const angle = Math.random() * Math.PI * 2;

      const r = WORLD_DIAMETER * 0.75;
      const x = Math.sin(angle) * r;
      const z = Math.cos(angle) * r;

      this.target.set(x, 0, z);
      this.direction = this.target.clone().sub(this.fox.position).normalize();
      this.distance = this.fox.position.distanceTo(this.target);
      this.fox.lookAt(this.target);
    }
  }

  _updateAnimationTracks() {
    if (!this.tracks.current) {
      this.tracks.current = this.tracks[this.state];
    } else {
      const newAction = this.tracks[this.state];
      const oldAction = this.tracks.current;

      newAction.reset();
      newAction.play();
      newAction.crossFadeFrom(oldAction, 1);

      this.tracks.current = newAction;
    }

    this.tracks.current.play();
  }

  _registerModelparts() {
    this.fox = this.model.scene;
    this.fox.scale.setScalar(0.02);
    this.fox.traverse((el) => {
      if (el.isMesh) {
        el.castShadow = true;
        el.receiveShadow = true;
      }
    });

    this.fox.position.copy(this.target);
    this.fox.lookAt(this.target);
  }

  _registerAnimation() {
    this.mixer = new THREE.AnimationMixer(this.fox);

    for (let i = 0; i < this.states.length; i++) {
      const anim = this.model.animations.find(
        (e) => e.name.toLowerCase() == this.states[i].name
      );
      this.tracks[this.states[i].name] = this.mixer.clipAction(anim);
    }

    this._setState(this.#STATE_SURVEY);
  }

  _addFox() {
    this.scene.add(this.fox);
  }

  update() {
    if (this.state == this.#STATE_SURVEY) {
      this.progress += 0.005;
    }

    if (
      (this.progress >= 1 && this.state == this.#STATE_SURVEY) ||
      (this.fox.position.distanceTo(this.start) >=
        this.fox.position.distanceTo(this.target) &&
        this.state != this.#STATE_SURVEY)
    ) {
      this._randomizeState();
    }

    const step = this.direction
      .clone()
      .multiplyScalar(this.time.delta * this.speed);
    this.fox.position.add(step);

    this.mixer.update(this.time.delta * this.frameSpeed);
  }
}

export default Fox;
