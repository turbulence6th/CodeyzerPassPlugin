import AnaEkranSifreler from '/popup/anaEkran/AnaEkranSifreler.js';
import CodeyzerBilesen from '/core/bilesenler/CodeyzerBilesen.js';
import AnaEkranSifreEkle from '/popup/anaEkran/AnaEkranSifreEkle.js';
import AnaEkranAyarlar from '/popup/anaEkran/AnaEkranAyarlar.js';

const template = /* html */ `
<template>
    <ul class="nav nav-tabs" role="tablist">
        <li class="nav-item">
            <a class="nav-link active" data-toggle="tab" href="[ref=sifrePanel]">Şifreler</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" data-toggle="tab" href="[ref=sifreEkle]">Şifre Ekle</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" data-toggle="tab" href="[ref=ayarlar]">Ayarlar</a>
        </li>
    </ul>

    <div class="tab-content">
        <div ref="sifrePanel" class="container tab-pane active">
            <ana-ekran-sifreler ref="anaEkranSifreler"/>
        </div>
        <div ref="sifreEkle" class="container tab-pane fade">
            <ana-ekran-sifre-ekle ref="anaEkranSifreEkle"/>
        </div>
        <div ref="ayarlar" class="container tab-pane fade">
            <ana-ekran-ayarlar ref="anaEkranAyarlar"/>
        </div>
    </div>
</template>
`;

export default class AnaEkran extends CodeyzerBilesen {

    /** @type {string} */ sifre
    /** @type {string} */ platform
    /** @type {HariciSifreDesifre[]} */ hariciSifreListesi = []

    /** @type {AnaEkranSifreler} */ anaEkranSifreler
    /** @type {AnaEkranSifreEkle} */ anaEkranSifreEkle
    /** @type {AnaEkranAyarlar} */ anaEkranAyarlar

    /**
     * 
     * @param {string} sifre 
     * @param {string} platform 
     */
    constructor(sifre, platform) {
        super(template);
        this.sifre = sifre;
        this.platform = platform;
    }

    connectedCallback() {
        super.connectedCallback();

        this.anaEkranSifreler = /** @type {AnaEkranSifreler} */ (this.bilesen('anaEkranSifreler')[0]);
        this.anaEkranSifreler.anaEkran = this;

        this.anaEkranSifreEkle = /** @type {AnaEkranSifreEkle} */ (this.bilesen('anaEkranSifreEkle')[0]);
        this.anaEkranSifreEkle.anaEkran = this;

        this.anaEkranAyarlar = /** @type {AnaEkranAyarlar} */ (this.bilesen('anaEkranAyarlar')[0]);
        this.anaEkranAyarlar.anaEkran = this;
    }

    init() {
        this.anaEkranSifreler.init();
        this.anaEkranSifreEkle.init();
        this.anaEkranAyarlar.init();
    }
};