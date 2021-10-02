export default class CodeyzerBilesen extends HTMLElement {
    
    /** @type {HTMLTemplateElement} */ $template

    /**
     * 
     * @param {() => string} template 
     */
    constructor(template) {
        super();
        this.$template = /** @type {HTMLTemplateElement} */ ($(template())[0]);
    }

    connectedCallback() {
        this.append(this.$template.content);
    }

    init() {
        
    }

    /**
     * 
     * @template {HTMLElement} T
     * @param {string} ref
     * @returns {T} 
     */
    bilesen(ref) {
        return /** @type {T} */ (this.querySelector(`[ref='${ref}']`));
    }
}