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

    init() {
        
    }

    /**
     * 
     * @template {HTMLElement} T
     * @param {string} ref
     * @returns {JQuery<T>} 
     */
    bilesen(ref) {
        return /** @type {JQuery<T>} */ ($(this).find(`[ref='${ref}']`));
    }
}