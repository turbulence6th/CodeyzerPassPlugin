import CodeyzerBilesen from '/core/bilesenler/CodeyzerBilesen.js';
import CodeyzerDogrulaSatir from '/core/bilesenler/CodeyzerDogrulaSatir.js';

const template = () => /* html */`
<template>
    <slot ref="slot"/>
</template>
`;

export default class CodeyzerDogrula extends CodeyzerBilesen {

    /** @type {HTMLSlotElement} */ $slot;

    constructor() {
        super(template);
    }

    init() {
        this.$slot = this.bilesen('slot');
    }

    /**
     * @return {CodeyzerDogrulaSatir[]}
     */
    dogrulaSatirlari() {
        let satirlar = [];
        for (let child of this.$slot.children) {
            if (child instanceof CodeyzerDogrulaSatir) {
                satirlar.push(child);
            }
        }

        return satirlar;
    }
}