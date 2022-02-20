import CodeyzerBilesen from '/core/bilesenler/CodeyzerBilesen.js';
import { getAygitYonetici, hariciSifreListeDesifreEt } from '/core/util.js';
import SifreTablo from '/iframe/GelismisAyarlar/SifreTablo.js';

const template = () => /* html*/ `
<template>
   <sifre-tablo ref="sifreTablo"></sifre-tablo>
</template>
`;

export default class KasaPanel extends CodeyzerBilesen {

    /** @type {SifreTablo} */ $sifreTablo;

    constructor() {
        super(template);
    }

    async init() {
        this.$sifreTablo = this.bilesen('sifreTablo');

        let hariciSifreListesi = await getAygitYonetici().hariciSifreDTOListesiGetir();
        let hariciSifreDesifreListesi = await hariciSifreListeDesifreEt(hariciSifreListesi);
        this.$sifreTablo.yukle(hariciSifreDesifreListesi);
    }
}