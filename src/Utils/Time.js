import EventEmitter from "./EventEmitter";

export default class Time extends EventEmitter {
  constructor() {
    super();

    this.start = Date.now();
    this.current = this.start;
    this.delta = 16;
    this.elapsed = 0;

    window.requestAnimationFrame(() => {
      this.tick();
    });
  }
  tick() {
    const current = Date.now();

    this.elapsed = current - this.start;
    this.delta = current - this.current;
    this.current = current;

    this.trigger("tick");

    window.requestAnimationFrame(() => {
      this.tick();
    });
  }
}
