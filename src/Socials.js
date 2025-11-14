const socials = [
  {
    url: "https://github.com/irvancolz",
    label: "github",
    icon: "./github.png",
  },
  {
    url: "https://x.com/IrvanSahar77574",
    label: "twitter",
    icon: "./twitter.png",
  },
  {
    url: "https://www.instagram.com/ipan_sahaludin2?igsh=M2VqZXF5dzRqZjNj",
    label: "instagram",
    icon: "./instagram.png",
  },
  {
    url: "https://www.linkedin.com/in/irvan-saharudin-a2289a23a/",
    label: "linkedin",
    icon: "./linkedin.png",
  },
];
export class SocialMedia {
  $container = document.createElement("div");
  $list = document.createElement("li");
  constructor() {
    this.$container.setAttribute("id", "socials");

    this.$container.innerHTML = `<button class="btn">
        <img src="./socials.svg" alt="social media" class="icon" />
      </button>`;

    for (let i = 0; i < socials.length; i++) {
      const $item = document.createElement("li");
      $item.className = "social";
      $item.style.setProperty("--delay", `${i * 0.05}s`);

      $item.innerHTML = `
            <a href="${socials[i].url}" target="_blank" class="link" >
                <img class="icon" alt='${socials[i].label}' src='${socials[i].icon}' title='${socials[i].label}' />
            </a>
            `;

      this.$list.append($item);
    }

    this.$list.className = "list";

    this.$container.append(this.$list);
    document.body.appendChild(this.$container);
  }
}
