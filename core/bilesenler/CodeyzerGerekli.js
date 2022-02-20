import CodeyzerDogrulaSatir from '/core/bilesenler/CodeyzerDogrulaSatir.js';

const template = () => /* html */`
<template>
</template>
`;

export default class CodeyzerGerekli extends CodeyzerDogrulaSatir {

    constructor() {
        super(template);
    }

    init() {
        this.mesaj = this.getAttribute("mesaj");
    }

    /**
     * 
     * @param {HTMLInputElement} input 
     * @returns {boolean}
     */
     dogrula(input) {
        return !!input.value
    }
}