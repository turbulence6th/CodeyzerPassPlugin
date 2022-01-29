import AnaEkranSifreler from '/popup/anaEkran/AnaEkranSifreler.js';
import CodeyzerBilesen from '/core/bilesenler/CodeyzerBilesen.js';
import AnaEkranSifreEkle from '/popup/anaEkran/AnaEkranSifreEkle.js';
import AnaEkranAyarlar from '/popup/anaEkran/AnaEkranAyarlar.js';
import { getAygitYonetici, i18n } from '/core/util.js';

const template = () => /* html */ `
<template>
    <ul ref="baslikKonteyner" class="nav nav-tabs d-flex mt-3" role="tablist">
        <li class="nav-item flex-fill text-center" title="${i18n('anaEkran.tab.sifreler')}">
            <a class="nav-link active" data-toggle="tab" href="[ref=sifrePanel]">
                <img src="/images/kasa_icon.png" style="height:2em;"/>
            </a>
        </li>
        <li class="nav-item flex-fill text-center" title="${i18n('anaEkran.tab.sifreEkle')}">
            <a class="nav-link" data-toggle="tab" href="[ref=sifreEkle]">
                <img src="/images/yeni_icon.png" style="height:2em;"/>
            </a>
        </li>
        <li class="nav-item flex-fill text-center" title="${i18n('anaEkran.tab.ayarlar')}">
            <a class="nav-link" data-toggle="tab" href="[ref=ayarlar]">
                <img src="/images/ayarlar_icon.png" style="height:2em;"/>
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

        getAygitYonetici().platformTipi()
        .then(platform => {
            /**if (['android', 'ios', 'web'].includes(platform)) {
                mouseSuruklemeEvent(document.body, yon => {
                    this.kaydir(yon);
                });
            }*/
        });

        this.rehber(false);
    }

    /**
     * 
     * @param {boolean} zorlaBaslat 
     */
    rehber(zorlaBaslat) {
        getAygitYonetici().rehberGetir()
        .then(rehber => {
            if (zorlaBaslat || !rehber['AnaEkran']) {
                this.rehberiBaslat()
                .oncomplete(() => {
                    this.rehberSonlandir('AnaEkran', rehber);
                    this.kaydir('sol');
                    this.kaydir('sol');
                })
                .onexit(() => this.rehberSonlandir('AnaEkran', rehber));
            }
        });
    }

    /**
     * 
     * @returns {import('intro.js').IntroJs}
     */
    rehberiBaslat() {
        // @ts-ignore
        /** @type {import('intro.js').IntroJs} */ let mIntroJs = introJs();

        /** @type {CodeyzerBilesen} */ let aktifTab = this.anaEkranSifreler;
        return mIntroJs.setOptions({
            nextLabel: i18n('anaEkran.rehber.ileri'),
            prevLabel: i18n('anaEkran.rehber.geri'),
            doneLabel: i18n('anaEkran.rehber.tamamla'),
            skipLabel: 'x',
            tooltipClass: 'panel',
            highlightClass: 'codeyzer-tooltip',
            hidePrev: true,
            disableInteraction: true,
            showBullets: true,
            steps: [
                // AnaEkranSifreler
                {
                    title: i18n('anaEkran.rehber.#1.baslik'),
                    element: this.anaEkranSifreler.$platformSelect,
                    intro: i18n('anaEkran.rehber.#1.aciklama')
                }, 
                {
                    title: i18n('anaEkran.rehber.#2.baslik'),
                    element: this.anaEkranSifreler.$sifreSelect,
                    intro: i18n('anaEkran.rehber.#2.aciklama')
                },
                {
                    title: i18n('anaEkran.rehber.#3.baslik'),
                    element: this.anaEkranSifreler.$sifreSelectSifre,
                    intro: i18n('anaEkran.rehber.#3.aciklama')
                }, 
                {
                    title: i18n('anaEkran.rehber.#4.baslik'),
                    element: this.anaEkranSifreler.$sifreKopyala,
                    intro: i18n('anaEkran.rehber.#4.aciklama'),
                    highlightClass: 'tooltip-dugme-panel'
                },
                {
                    title: i18n('anaEkran.rehber.#5.baslik'),
                    element: this.anaEkranSifreler.$sifreSelectGoster,
                    intro: i18n('anaEkran.rehber.#5.aciklama'),
                    highlightClass: 'tooltip-dugme-panel'
                },
                {
                    title: i18n('anaEkran.rehber.#6.baslik'),
                    element: this.anaEkranSifreler.$rehber,
                    intro: i18n('anaEkran.rehber.#6.aciklama'),
                    highlightClass: 'tooltip-dugme-panel'
                },
                {
                    title: i18n('anaEkran.rehber.#7.baslik'),
                    element: this.anaEkranSifreler.$yenile,
                    intro: i18n('anaEkran.rehber.#7.aciklama'),
                    highlightClass: 'tooltip-dugme-panel'
                },

                // AnaEkranSifreEkle
                {
                    title: i18n('anaEkran.rehber.#8.baslik'),
                    element: this.anaEkranSifreEkle.$hariciSifrePlatform,
                    intro: i18n('anaEkran.rehber.#8.aciklama')
                }, 
                {
                    title: i18n('anaEkran.rehber.#9.baslik'),
                    element: this.anaEkranSifreEkle.$hariciSifreAndroidPaket,
                    intro: i18n('anaEkran.rehber.#9.aciklama')
                },
                ... !this.anaEkranSifreEkle.$hariciSifreAndroidPaketSelectDiv.classList.contains('gizle') ? [{
                    title: i18n('anaEkran.rehber.#10.baslik'),
                    element: this.anaEkranSifreEkle.$hariciSifreAndroidPaketSelect,
                    intro: i18n('anaEkran.rehber.#10.aciklama')
                }] : [],
                {
                    title: i18n('anaEkran.rehber.#11.baslik'),
                    element: this.anaEkranSifreEkle.$hariciSifreKullaniciAdi,
                    intro: i18n('anaEkran.rehber.#11.aciklama')
                },
                {
                    title: i18n('anaEkran.rehber.#12.baslik'),
                    element: this.anaEkranSifreEkle.$hariciSifreSifre,
                    intro: i18n('anaEkran.rehber.#12.aciklama')
                },
                {
                    title: i18n('anaEkran.rehber.#13.baslik'),
                    element: this.anaEkranSifreEkle.$sifreEkleDugme,
                    intro: i18n('anaEkran.rehber.#13.aciklama')
                },
                {
                    title: i18n('anaEkran.rehber.#14.baslik'),
                    element: this.anaEkranSifreEkle.$sifirlaDugme,
                    intro: i18n('anaEkran.rehber.#14.aciklama')
                },

                // AnaEkranAyarlar
                {
                    title: i18n('anaEkran.rehber.#15.baslik'),
                    element: this.anaEkranAyarlar.$yeniSifre,
                    intro: i18n('anaEkran.rehber.#15.aciklama')
                },
                {
                    title: i18n('anaEkran.rehber.#16.baslik'),
                    element: this.anaEkranAyarlar.$sifreYenileDugme,
                    intro: i18n('anaEkran.rehber.#16.aciklama')
                },
                {
                    title: i18n('anaEkran.rehber.#17.baslik'),
                    element: this.anaEkranAyarlar.$cikisYap,
                    intro: i18n('anaEkran.rehber.#17.aciklama')
                },
            ],
        })
        .start()
        .onchange(eleman => {
            if (aktifTab != this.anaEkranSifreler && this.anaEkranSifreler.contains(eleman)) {
                if (aktifTab == this.anaEkranSifreEkle) {
                    this.kaydir('sol');
                } else if (aktifTab == this.anaEkranAyarlar) {
                    this.kaydir('sol');
                    this.kaydir('sol');
                }
                aktifTab = this.anaEkranSifreler;
            } else if (aktifTab != this.anaEkranSifreEkle && this.anaEkranSifreEkle.contains(eleman)) {
                if (aktifTab == this.anaEkranSifreler) {
                    this.kaydir('sag');
                } else if (aktifTab == this.anaEkranAyarlar) {
                    this.kaydir('sol');
                }

                aktifTab = this.anaEkranSifreEkle;
            } else if (aktifTab != this.anaEkranAyarlar && this.anaEkranAyarlar.contains(eleman)) {
                if (aktifTab == this.anaEkranSifreler) {
                    this.kaydir('sag');
                    this.kaydir('sag');
                } else if (aktifTab == this.anaEkranSifreEkle) {
                    this.kaydir('sag');
                }
                aktifTab = this.anaEkranAyarlar;
            }
        });
    }

    /**
     * 
     * @param {string} sayfa
     * @param {object} rehber
     */
    rehberSonlandir(sayfa, rehber) {
        rehber[sayfa] = true;
        getAygitYonetici().rehberAyarla(rehber);
    }

    /**
     * 
     * @param {'yukari'|'asagi'|'sol'|'sag'} yon 
     */
    kaydir(yon) {
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
    }
};