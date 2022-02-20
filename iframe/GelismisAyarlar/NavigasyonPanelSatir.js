import CodeyzerBilesen from '/core/bilesenler/CodeyzerBilesen.js';

const template = () => /* html*/ `
<template>
    <a ref="satir"></a>
    <slot ref="satirPanel" name="satirPanel"/>
</template>
`;

export default class NavigasyonPanelSatir extends CodeyzerBilesen {

    /** @type {HTMLAnchorElement} */ $satir;
    /** @type {HTMLSlotElement} */ $satirPanel

    constructor() {
        super(template);
    }

    init() {
        this.$satir = this.bilesen('satir');
        this.$satirPanel = this.bilesen('satirPanel');

        this.$satir.innerText = this.getAttribute('baslik');
        this.$satirPanel.remove();
    }

    seciliYap() {
        this.$satir.classList.add('secili');
    }

    seciliKaldir() {
        this.$satir.classList.remove('secili');
    }
}