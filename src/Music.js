class Music {
  #MAX_VOLUME = 10;
  #MIN_VOLUME = 0;
  constructor() {
    this.muted = true;
    this.volume = 5;

    this.src = "./himmel_statue_ambient.mp3";
    this.audio = new Audio(this.src);
    this.audio.loop = true;
    this.audio.volume = this.volume / this.#MAX_VOLUME;

    this.$img = document.querySelector("#music .img");
    this.$btn = document.querySelector("#music .btn");
    this.$input = document.getElementById("music_volume_input");

    this.$btn.addEventListener("click", () => {
      this.toggle();
    });

    this.$input.addEventListener("input", (e) => {
      const v = parseInt(e.target.value) / this.#MAX_VOLUME;
      this.volume = v;
      this.audio.volume = v;

      if (v <= this.#MIN_VOLUME) {
        this.mute();
      } else if (this.muted && v > this.#MIN_VOLUME) {
        this.play();
      }
    });
  }

  play() {
    this.audio.play();
    this.$img.src = "./music_on.svg";
  }

  mute() {
    this.audio.pause();
    this.$img.src = "./music_off.svg";
  }

  toggle() {
    this.muted = !this.muted;

    if (this.muted) {
      this.mute();
    } else {
      this.play();
    }
  }
}

export default Music;
