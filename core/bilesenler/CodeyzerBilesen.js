export default class CodeyzerBilesen extends HTMLElement {
    
    $template

    /**
     * 
     * @param {string} template 
     */
    constructor(template) {
        super();
        this.$template = /** @type {JQuery<HTMLTemplateElement>} */ ($(template));;
    }

    connectedCallback() {
        this.innerHTML = this.$template[0].innerHTML;
    }
}