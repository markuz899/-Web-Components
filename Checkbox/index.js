const template = document.createElement("template");

template.innerHTML = `
  <style>
    .form-check-square {
      font-size: 14px;
    }
    em{
      display: none;
      color: red;
      font-size: 80%;
    }
    .form-check-square input[type="checkbox"] {
      position: absolute;
      opacity: 0;
      cursor: pointer;
      z-index: -1;
    }
    .form-check-square input[type="checkbox"] + label .checkmark::after {
      content: "";
      display: inline-block;
      width: 24px;
      height: 24px;
      background-size: 24px 24px;
      background-image: url("https://www.the-hurry.com/img/checkbox_unselected.svg");
      background-repeat: no-repeat;
      background-position: center;
      vertical-align: middle;
    }
    .form-check-square input[type="checkbox"]:active + label .checkmark::after {
      opacity: 0.7;
    }
    .form-check-square input[type="checkbox"]:checked + label .checkmark::after {
      content: "";
      display: inline-block;
      width: 24px;
      height: 24px;
      background-size: 24px 24px;
      background-image: url("https://www.the-hurry.com/img/checkbox_selected.svg");
      background-repeat: no-repeat;
      background-position: center;
      vertical-align: middle;
    }
    .form-check-square span {
      vertical-align: middle;
    }
    .form-check-square .checkmark {
      margin-right: 5px;
    }

    .form-check-square--variantFull {
      margin-top: 20px;
      font-size: 14px;
    }
    .form-check-square--variantFull input[type="checkbox"] + label .checkmark::after {
      content: "";
      display: inline-block;
      width: 14px;
      height: 14px;
      background-color: #701F4A;
      background-image: none;
      vertical-align: middle;
    }
    .form-check-square--variantFull input[type="checkbox"]:checked + label .checkmark::after {
      content: "";
      display: inline-block;
      width: 14px;
      height: 14px;
      background-color: #701F4A;
      background-size: 10px 10px;
      background-image: url("../img/product-detail/checkbox_selected.svg");
      background-repeat: no-repeat;
      background-position: center;
      vertical-align: middle;
    }
    .placeholder.error {
      color: red
    }
  </style>
  <div class="form-check-square">
    <input class="select-value" name="name" type="checkbox" />
    <label for="check-id"><span class="checkmark"></span>
      <span class="placeholder"></span>
    </label>
  </div>
  <em class="is-invalid">Questo campo è obbligatorio</em>
`;

class Checkbox extends HTMLElement {
  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: "open" });
    this._shadowRoot.appendChild(template.content.cloneNode(true));
    this.$container = this._shadowRoot.querySelector(".form-check-square");
    this.$placeholder = this._shadowRoot.querySelector(".placeholder");
    this.$checkbox = this._shadowRoot.querySelector(".select-value");
    this.$label = this._shadowRoot.querySelector("label");
    this.$emError = this._shadowRoot.querySelector("em");
    this.attributess = this.getAttribute("attributess");
    this.placeholder = this.getAttribute("placeholder");
    this.disabled = this.getAttribute("disabled");
    this.required = this.getAttribute("required");
    this.$checked = this.getAttribute("checked");
    this.isError = this.getAttribute("iserror");
    this.name = this.getAttribute("name");
    this.checked = this.$checked === "true" ? true : false;
    if (this.attributess) {
      const attrParse = JSON.parse(this.attributess);
      for (let i = 0; i < attrParse.length; i++) {
        this.$checkbox.setAttribute(attrParse[i].type, attrParse[i].value);
        if (attrParse[i].type === "id") {
          this.$label.setAttribute("for", attrParse[i].value);
        }
      }
    }
  }

  onChange() {
    let checkVal = this.$checkbox.checked;
    this.checked = checkVal;
    if (this.required && !this.checked) {
      this.$placeholder.classList.add("error");
      this.$emError.style.display = "block";
    } else {
      this.$placeholder.classList.remove("error");
      this.$emError.style.display = "none";
    }
    console.log({ name: this.name, value: this.checked });
  }

  connectedCallback() {
    console.log(this.checked);
    this.$placeholder.innerHTML = this.placeholder;
    if (this.disabled) {
      this.$checkbox.setAttribute("disabled", true);
    }
    if (this.checked) {
      this.$checkbox.checked = true;
    }
    this.$checkbox.addEventListener("click", this.onChange.bind(this));
    if (this.isError) {
      this.$placeholder.classList.add("error");
    }
  }

  get id() {
    return this.getAttribute("id");
  }

  set id(value) {
    this.setAttribute("id", value);
  }

  get value() {
    return this._checked;
  }

  set value(checked) {
    this.setAttribute("checked", checked);
  }

  static get observedAttributes() {
    return ["id", "iserror"];
  }

  attributeChangedCallback(name, oldVal, newVal) {
    this.render();
  }

  render() {}
}

window.customElements.define("checkbox-component", Checkbox);
