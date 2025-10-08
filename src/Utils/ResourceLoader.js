import * as THREE from "three";
import EventEmitter from "./EventEmitter";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

export default class ResourcesLoader extends EventEmitter {
  constructor(src) {
    super();
    this.sources = src;
    this.loaded = 0;
    this.total = src.length;
    this.resources = {};

    this.init();
    this.load();
  }

  init() {
    this.loader = {};
    this.loader.modelLoader = new GLTFLoader();
    this.loader.textureLoader = new THREE.TextureLoader();
  }

  load() {
    for (const src of this.sources) {
      if (src.type == "texture") {
        this.loader.textureLoader.load(src.path, (texture) => {
          this._loadSource(src, texture);
        });
      } else if (src.type == "gltfModel") {
        this.loader.modelLoader.load(src.path, (texture) => {
          this._loadSource(src, texture);
        });
      } else {
        console.error(
          `invalid resources type : '${src.type}' at resources : '${src.name}`
        );
      }
    }
  }

  _loadSource(src, file) {
    this.resources[src.name] = file;
    this.loaded++;

    if (this.loaded == this.total) {
      this.trigger("finish:loaded");
    }
  }
}
