export default class CodeyzerBilesen extends HTMLElement {
    
    /** @type {HTMLTemplateElement} */ $template
    /** @type {boolean} */ yuklendi = false

    /**
     * 
     * @param {() => string} template 
     */
    constructor(template) {
        super();
        this.$template = /** @type {HTMLTemplateElement} */ ($(template())[0]);
    }

    connectedCallback() {
        if (!this.calisti) {
            /** @type {Map<string, Element>} */ let map = new Map();
            this.querySelectorAll('[slot]').forEach(element => {
                map.set(element.slot, element);
            });

            this.$template.content.querySelectorAll('slot').forEach(element => {
                if (!element.name) {
                    element.innerHTML = this.innerHTML;
                }

                let selectedElement = map.get(element.name);
                if (selectedElement) {
                    element.innerHTML = '';
                    element.appendChild(selectedElement);
                }
            });

            this.innerHTML = '';
            this.append(this.$template.content);

            this.init();

            this.calisti = true;
        }
        
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

    /**
     *
     * @template {CodeyzerBilesen} T
     * @param {typeof CodeyzerBilesen} sinif 
     * @return {T}
     */
    ebeveyn(sinif) {
        let ust = this.parentElement;
        while (ust != null) {
            if (ust instanceof sinif) {
                return (/** @type {T} */ (ust));
            }
            ust = ust.parentElement;
        }

        return null;
    }
}