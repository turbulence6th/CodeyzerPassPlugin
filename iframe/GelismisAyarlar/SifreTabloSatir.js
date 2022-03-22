import CodeyzerBilesen from '/core/bilesenler/CodeyzerBilesen.js';
import CodeyzerImageButton from '/core/bilesenler/CodeyzerImageButton.js';
import { getAygitYonetici, i18n } from '/core/util.js';

const template = () => /* html*/ `
<template>
    <div class="row" style="border-top: 1px groove var(--anaRenk); padding-top: 5px; padding-bottom: 5px;">
        <div ref="platform" class="col-4 metin-sigdir justify-content-center align-self-center"></div>
        <div ref="kullaniciAdi" class="col-3 metin-sigdir justify-content-center align-self-center"></div>
        <div ref="sifre" class="col-3 metin-sigdir justify-content-center align-self-center">**********</div>
        <div class="col-2">
            <codeyzer-image-button ref="sifreKopyala" title="${i18n('sifreTabloSatir.kopyala.title')}" img="/images/kopyala_icon.png"></codeyzer-image-button>
            <codeyzer-image-button ref="sifreSelectGoster" title="${i18n('sifreTabloSatir.goster.title')}" img="/images/gizle_icon.png" data-durum="gizle"></codeyzer-image-button>
        </div>
    </div>
</template>
`;

export default class SifreTabloSatir extends CodeyzerBilesen {

    /** @type {HTMLDivElement} */ $platform;
    /** @type {HTMLDivElement} */ $kullaniciAdi;
    /** @type {HTMLDivElement} */ $sifre;
    /** @type {CodeyzerImageButton} */ $sifreKopyala;
    /** @type {CodeyzerImageButton} */ $sifreSelectGoster

    /** @type {string} */ sifre;

    constructor() {
        super(template);
    }

    init() {
        this.$platform = this.bilesen('platform');
        this.$kullaniciAdi = this.bilesen('kullaniciAdi');
        this.$sifre = this.bilesen('sifre');
        this.$sifreKopyala = this.bilesen('sifreKopyala');
        this.$sifreSelectGoster = this.bilesen('sifreSelectGoster');

        this.$platform.innerHTML = this.$platform.title = this.getAttribute('platform');
        this.$kullaniciAdi.innerHTML = this.$kullaniciAdi.title = this.getAttribute('kullaniciAdi');

        this.sifre = this.getAttribute('sifre');

        this.$sifreKopyala.addEventListener('click', () => this.sifreKopyalaAksiyon());
        this.$sifreSelectGoster.addEventListener('click', () => this.sifreSelectGosterChanged());
    }

    sifreKopyalaAksiyon() {
        getAygitYonetici().panoyaKopyala(this.sifre);
        getAygitYonetici().toastGoster(i18n('sifreTabloSatir.toast.sifre'));
    }

    sifreSelectGosterChanged() {
        if(this.$sifreSelectGoster.getAttribute('data-durum') == 'gizle') {
            this.$sifreSelectGoster.setAttribute('data-durum', 'goster');
            this.$sifreSelectGoster.setAttribute('img', '/images/goster_icon.png');
            this.$sifre.innerHTML = this.sifre;
        } else {
            this.$sifreSelectGoster.setAttribute('data-durum', 'gizle');
            this.$sifreSelectGoster.setAttribute('img', '/images/gizle_icon.png');
            this.$sifre.innerHTML = '**********';
        }
    }
}