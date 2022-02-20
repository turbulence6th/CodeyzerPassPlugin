import CodeyzerBilesen from '/core/bilesenler/CodeyzerBilesen.js';

const template = () => /* html */ `
<template>
    <button type="button" ref="button">
        <img ref="img" src="" style="height:1.1em;"/>
    </button>
</template>
`;

export default class CodeyzerImageButton extends CodeyzerBilesen {

    /** @type {HTMLButtonElement} */ $button
    /** @type {HTMLImageElement} */ $img

    constructor() {
        super(template);
    }

    init() {
        this.$button = this.bilesen('button');
        this.$img = this.bilesen('img');
        this.$img.src = this.getAttribute('img');
    }

    static get observedAttributes() {
        return ['img'];
    }

    /**
     * 
     * @param {string} name 
     * @param {string} oldValue 
     * @param {string} newValue 
     */
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'img' && this.$img) {
            this.$img.src = newValue;
        }
    }
}