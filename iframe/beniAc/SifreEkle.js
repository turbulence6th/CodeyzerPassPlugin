import CodeyzerBilesen from '/core/bilesenler/CodeyzerBilesen.js';

const template = () => /* html */`
<template>
    <div class="panel">
        <img ref="kapat" style="float: right; cursor: pointer;" src="/images/kapat_icon.png"/>
        <div class="row">
            <div class="col-2">
                <img src="/images/icon_48.png"/>
            </div>
            <div class="col-10">
                Yeni şifre bulundu.<br>
                Eklemek için plugin ikonuna basınız.
            </div>
        </div>
    </div>
</template>
`;

export default class SifreEkle extends CodeyzerBilesen {

    /** @type {HTMLImageElement} */ $kapat

    constructor() {
        super(template);
    }

    connectedCallback() {
        super.connectedCallback();

        this.$kapat = this.bilesen('kapat');
    }

    init() {
       this.$kapat.addEventListener('click', () => this.kapatAksiyon());
    }

    kapatAksiyon() {
        window.parent.postMessage(JSON.stringify({
            mesajTipi: 'sifreEkleKapat'
        }), '*');
    }
}