import CodeyzerDogrulaSatir from '/core/bilesenler/CodeyzerDogrulaSatir.js';

const template = () => /* html */`
<template>
</template>
`;

export default class CodeyzerRegex extends CodeyzerDogrulaSatir {

    /** @type {RegExp} */ ifade

    constructor() {
        super(template);
    }

    connectedCallback() {
        super.connectedCallback();

        this.mesaj = this.getAttribute("mesaj");
        this.ifade = new RegExp(this.getAttribute("ifade"));
    }

    /**
     * 
     * @param {HTMLInputElement} input 
     * @returns {boolean}
     */
     dogrula(input) {
        return this.ifade.test(input.value);
    }
}