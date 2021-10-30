import CodeyzerBilesen from '/core/bilesenler/CodeyzerBilesen.js';
import CodeyzerDogrulaSatir from '/core/bilesenler/CodeyzerDogrulaSatir.js';

const template = () => /* html */`
<template>
</template>
`;

export default class CodeyzerDogrula extends CodeyzerBilesen {

    constructor() {
        super(template);
    }

    /**
     * @return {CodeyzerDogrulaSatir[]}
     */
    dogrulaSatirlari() {
        let satirlar = [];
        for (let child of this.children) {
            if (child instanceof CodeyzerDogrulaSatir) {
                satirlar.push(child);
            }
        }

        return satirlar;
    }
}