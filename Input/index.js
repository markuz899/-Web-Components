class InputBox extends HTMLElement {
  constructor() {
    super();
    this.required = this.getAttribute("required");
    this.name = this.getAttribute("name");
    this.placeholder = this.getAttribute("placeholder");
    this.value = this.getAttribute("value");
    this.attributess = this.getAttribute("attributess");
    this.shadow = this.attachShadow({ mode: "open" });

    this.div = document.createElement("div");
    this.input = document.createElement("input");
    this.label = document.createElement("label");

    this.div.classList.add("container");
    this.input.setAttribute("name", this.name);
    this.input.setAttribute("value", this.value || "");
    this.label.innerHTML = this.placeholder;
    if (this.attributess) {
      const attrParse = JSON.parse(this.attributess);
      for (let i = 0; i < attrParse.length; i++) {
        this.input.setAttribute(attrParse[i].type, attrParse[i].value);
      }
    }
    this.shadow.innerHTML = `
      <style>
				.container {
					transition: 0.3s;
					position: relative;
				}
        input {
            transition: 0.3s;
						display: inline-block;
						padding: 22px 5px 5px 5px;
						font-size: 14px;
						background: white;
						color: black;
						outline: none;
						border: none;
						border-bottom: 1px solid grey;
						border-radius: 0;
						font-family: 13px;
        }
				input:focus {
						outline: none;
        		border-bottom: 2px solid blue;
				}
				label{
						position: absolute;
						top: 22px;
            left: 5px;
            font-size: 14px;
            color: black;
            transition: 0.3s;
            transform-origin: top left;
            z-index: 1;
            -webkit-touch-callout: none;
            user-select: none;
            pointer-events: none;
				}
				input:focus+label, input:not([value=""])+ label {
						top: 3px;
            left: 5px;
            transform: scale(0.8);
				}
      </style>
		`;
  }

  validate(event) {
    const { name, value } = event.target;
    this.input.setAttribute("value", value);
    if (value === "") {
      event.target.style.borderBottom = "1px solid red";
      event.target.nextElementSibling.style.color = "red";
    } else {
      event.target.style.borderBottom = "1px solid";
      event.target.nextElementSibling.style.color = "black";
    }
    console.log({ name, value });
    this.connectedCallback();
  }

  connectedCallback() {
    this.render();
    this.input.addEventListener("change", this.validate.bind(this));
  }

  render() {
    this.shadow.appendChild(this.div);
    this.div.appendChild(this.input);
    this.div.appendChild(this.label);
  }
}
customElements.define("input-box", InputBox);
