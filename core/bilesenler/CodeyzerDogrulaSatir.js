import CodeyzerBilesen from '/core/bilesenler/CodeyzerBilesen.js';

export default class CodeyzerDogrulaSatir extends CodeyzerBilesen {

    /** @type {string} */ mesaj

    /**
     * 
     * @param {() => string} template 
     */
    constructor(template) {
        super(template);
    }

    /**
     * 
     * @param {HTMLInputElement} input 
     * @returns {boolean}
     */
    dogrula(input) {
        throw "Implementation required";
    }
}