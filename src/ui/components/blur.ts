export class UIBlur extends HTMLElement {
  constructor() {
    super();

    this.addEventListener("click", e => {
      e.preventDefault();
      e.stopPropagation();

      if ("unblur" in this.dataset) delete this.dataset.unblur;
      else this.dataset.unblur = "";
    });
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "rainbow-blur": UIBlur;
  }
}
customElements.define("rainbow-blur", UIBlur);
