// EXAMPLE
// <select-component placeholder="Seleziona" id="selectComponent" width="100%">
//     <option value="1">Option 1</option>
//     <option value="2">Option 2</option>
//     <option value="3">Option 3</option>
//     <option value="4">Option 4</option>
// </select-component>

const template = document.createElement("template");

template.innerHTML = `
  <style>
    .component-container{
      position: relative;
      margin-top: 30px;
    }
    .select-container * { box-sizing: border-box; }
    .select-container {
      display: inline-block;
      overflow: auto;
    }
    .select-container label{
      position: absolute;
      top: 8px;
      margin-left: 5px;
      color: #909090;
      font-size: 14px;
    }
    .select-value { 
      position: relative;
      display: flex;
      align-items: center;
      height: 40px;
      padding: 0 10px;
      padding-top: 15px;
      font-size: 14px;
      border-bottom: 1px solid #BBBBBB;
      outline: 0;
      overflow: hidden;
    }
    .select-value.error{
      border-bottom: 1px solid red;
    }
    .select-value::after { 
      content: "";
      display: inline-block;
      height: 14px;
      width: 20px;
      margin-right: 8px;
      background-size: 14px 14px;
      position: absolute;
      transform: rotate(180deg);
      right: 6px;
      bottom: 15px;
      background-image: url(/img/icon/dropdown_arrow_up.svg);
      background-repeat: no-repeat;
    }
    .select-container.open .select-value::after {
      transform: rotate(0deg);
      right: 0px;
    }
    .select-container.open .select-value, 
    .select-container:not(.open) .select-value:focus { 
      border-color: #701F4A;
    }
    .select-options {
      position: absolute;
      display: none; z-index: 1;
      /*width: inherit;*/
      width: auto;
      margin-top: 3px;
      overflow-y: auto;
      background: #FFF;
      border: 1px solid #BBBBBB;
      z-index: 2;
    }

    .select-container.open .select-options { display: inline-block; }
    ::slotted(option) {
      position: relative;
      line-height: 40px;
      padding: 0 20px;
    }
    ::slotted(option:hover),
    ::slotted(option.selected) {
      background: #EFEFEF;
      user-select: none;
    }
    ::slotted(option)::before {
      background: #FE5A66;
    }
    @media screen and (max-width: 991px) {
      .select-container{
        width: 100%!important;
      }
    }
  </style>
  <div class="component-container">
    <div class="select-container">
    <label></label>
    <div class="select-value"></div>
    <div class="select-options">
      <slot></slot>
    </div>
    </div>
  </div>
`;

class Select extends HTMLElement {
  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: "open" });
    this._shadowRoot.appendChild(template.content.cloneNode(true));
    this.placeholder = this.getAttribute("placeholder");
    this.isError = this.getAttribute("isError");
    this._open = false;
    this._value = "";
    this._currentOptionIndex = 1;
    this._currentHighlightedOption = this._currentOptionIndex;
    this.$container = this._shadowRoot.querySelector(".select-container");
    this.$select = this._shadowRoot.querySelector(".select-value");
    this.$options = this._shadowRoot.querySelector(".select-options");
    this.$placeholder = this._shadowRoot.querySelector("label");

    this.$select.addEventListener("click", (e) => {
      this.toggleDropdown();
    });
    this.$select.addEventListener("keydown", this.onKeyDown.bind(this));
  }

  connectedCallback() {
    if (!this.hasChildNodes()) return;
    // this.selectOption(0); // selezione default primo option
    this.$placeholder.innerHTML = this.placeholder;
    if (this.isError) {
      this.$select.classList.add("error");
    }
    for (let i = 0; i < this.children.length; i++) {
      this.children[i].addEventListener(
        "click",
        function (e) {
          this.selectOption(i);
          this.toggleDropdown();
        }.bind(this)
      );

      this.children[i].addEventListener(
        "mouseenter",
        function (e) {
          this.highlightOption(i);
        }.bind(this)
      );

      if (this.children[i].hasAttribute("selected")) {
        this.selectOption(i);
      }
      // else {
      //   this.$select.innerHTML = this.placeholder; // se non selezionato nulla
      // }
    }
  }

  onClickOutside(e) {
    if (!document.getElementById(this.id).contains(e.target)) {
      this.$container.classList.remove("open");
    }
  }

  toggleDropdown(e) {
    window.addEventListener("click", (e) => this.onClickOutside(e));
    this._open = !this._open;
    this._open
      ? this.$container.classList.add("open")
      : this.$container.classList.remove("open");

    if (this._open && this.hasChildNodes()) {
      this.$options.style.minWidth = this.$container.offsetWidth + "px";
    }
  }

  optionSelected(e) {
    this.$select.innerHTML = e.target.innerHTML;

    if (e.target.hasAttribute("value")) {
      this._value = e.target.getAttribute("value");
    } else {
      this._value = e.target.innerHTML;
    }

    this.toggleDropdown();
  }

  onKeyDown(e) {
    if (/^(Enter|SpaceBar|\s|ArrowDown|Down|ArrowUp|Up)$/.test(e.key)) {
      if (!this._open) {
        this.toggleDropdown();
        return;
      }
    }

    if (/^(Enter|Tab|Escape)$/.test(e.key)) {
      if (this._open) {
        this.selectOption(this._currentHighlightedOption);
        this.toggleDropdown();
      }
      return;
    }
    let nextOptionIndex = 0;
    if (/^(ArrowDown|Down)$/.test(e.key)) {
      nextOptionIndex = this._currentHighlightedOption + 1;
    } else if (/^(ArrowUp|Up)$/.test(e.key)) {
      nextOptionIndex = this._currentHighlightedOption - 1;
    } else if (/^(Home|End)$/.test(e.key)) {
      nextOptionIndex = e.key == "Home" ? 0 : this.children.length - 1;
    }
    if (nextOptionIndex < 0 || nextOptionIndex >= this.children.length) return;
    this.children[nextOptionIndex].scrollIntoView();
    this.selectOption(nextOptionIndex);
  }

  selectOption(index) {
    this.$placeholder.style.fontSize = "13px";
    this.$placeholder.style.top = "0px";
    this.$placeholder.style.transition = "all .3s";
    this.$placeholder.style.transform = "scale(0.8)";
    // this.$placeholder.style.color = "#701F4A";
    let selectedOption = this.children[index];

    if (!selectedOption) {
      return;
    }

    this.$select.innerHTML = selectedOption.innerHTML;
    this._currentOptionIndex = index;
    if (selectedOption.hasAttribute("value")) {
      this._value = selectedOption.getAttribute("value");
    } else {
      this._value = selectedOption.innerHTML;
    }
    this.highlightOption(index);
  }

  highlightOption(index) {
    for (let i = 0; i < this.children.length; i++) {
      this.children[i].classList.remove("selected");
    }
    this.children[index].classList.add("selected");
    this._currentHighlightedOption = index;
  }

  get id() {
    return this.getAttribute("id");
  }

  set id(value) {
    this.setAttribute("id", value);
  }

  get value() {
    return this._value;
  }

  set value(value) {
    this.setAttribute("value", value);
  }

  get width() {
    return this.getAttribute("width");
  }

  set width(value) {
    this.setAttribute("width", value);
  }

  static get observedAttributes() {
    return ["id", "width", "isError"];
  }

  attributeChangedCallback(name, oldVal, newVal) {
    this.render();
  }

  render() {
    this.$container.style.width = this.width;
  }
}

window.customElements.define("select-component", Select);
