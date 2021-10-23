import AnaEkranSifreler from '/popup/anaEkran/AnaEkranSifreler.js';
import CodeyzerBilesen from '/core/bilesenler/CodeyzerBilesen.js';
import AnaEkranSifreEkle from '/popup/anaEkran/AnaEkranSifreEkle.js';
import AnaEkranAyarlar from '/popup/anaEkran/AnaEkranAyarlar.js';
import { i18n } from '/core/util.js';
import mouseSuruklemeEvent from '/core/MouseSuruklemeEvent.js';

const template = () => /* html */ `
<template>
    <ul ref="baslikKonteyner" class="nav nav-tabs d-flex mt-3" role="tablist">
        <li class="nav-item flex-fill text-center">
            <a class="nav-link active" data-toggle="tab" href="[ref=sifrePanel]">
                <img src="/images/kasa_icon.png" style="height:2em;" title="${i18n('anaEkran.tab.sifreler')}"/>
            </a>
        </li>
        <li class="nav-item flex-fill text-center">
            <a class="nav-link" data-toggle="tab" href="[ref=sifreEkle]">
                <img src="/images/yeni_icon.png" style="height:2em;" title="${i18n('anaEkran.tab.sifreEkle')}"/>
            </a>
        </li>
        <li class="nav-item flex-fill text-center">
            <a class="nav-link" data-toggle="tab" href="[ref=ayarlar]">
                <img src="/images/ayarlar_icon.png" style="height:2em;" title="${i18n('anaEkran.tab.ayarlar')}"/>
            </a>
        </li>
    </ul>

    <div ref="panelKonteyner" class="tab-content mt-3">
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

    /** @type {HTMLUListElement} */ baslikKonteyner
    /** @type {HTMLDivElement} */ panelKonteyner

    /** @type {number} */ aktifPanelSira = 0

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

        this.baslikKonteyner = this.bilesen('baslikKonteyner');
        this.panelKonteyner = this.bilesen('panelKonteyner');

        this.anaEkranSifreler = this.bilesen('anaEkranSifreler');
        this.anaEkranSifreler.anaEkran = this;

        this.anaEkranSifreEkle = this.bilesen('anaEkranSifreEkle');
        this.anaEkranSifreEkle.anaEkran = this;

        this.anaEkranAyarlar = this.bilesen('anaEkranAyarlar');
        this.anaEkranAyarlar.anaEkran = this;
    }

    init() {
        this.anaEkranSifreler.init();
        this.anaEkranSifreEkle.init();
        this.anaEkranAyarlar.init();

        mouseSuruklemeEvent(document.body, yon => {
            let eskiBaslik = this.baslikKonteyner.querySelector('.active').parentElement;
            let eskiPanel = this.panelKonteyner.querySelector('.active');

            let yeniBaslik;
            let yeniPanel;

            if (yon == 'sol') {
                yeniBaslik = eskiBaslik.previousElementSibling;
                yeniPanel = eskiPanel.previousElementSibling;
            } else if (yon == 'sag') {
                yeniBaslik = eskiBaslik.nextElementSibling;
                yeniPanel = eskiPanel.nextElementSibling;
            }

            if (yeniBaslik && yeniPanel) {
                eskiBaslik.firstElementChild.classList.remove('active');
                eskiPanel.classList.remove('active');
                eskiPanel.classList.add('fade');

                yeniBaslik.firstElementChild.classList.add('active');
                yeniPanel.classList.remove('fade');
                yeniPanel.classList.add('active');
            }
        })
    }

    panelDegistir() {

    }
};