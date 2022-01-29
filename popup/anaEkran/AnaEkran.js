import AnaEkranSifreler from '/popup/anaEkran/AnaEkranSifreler.js';
import CodeyzerBilesen from '/core/bilesenler/CodeyzerBilesen.js';
import AnaEkranSifreEkle from '/popup/anaEkran/AnaEkranSifreEkle.js';
import AnaEkranAyarlar from '/popup/anaEkran/AnaEkranAyarlar.js';
import { getAygitYonetici, i18n } from '/core/util.js';

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

        this.rehber();
    }

    rehber() {
        getAygitYonetici().rehberGetir()
        .then(rehber => {
            if (!rehber['AnaEkran']) {
                // @ts-ignore
                /** @type {import('intro.js').IntroJs} */ let mIntroJs = introJs();
    
                /** @type {CodeyzerBilesen} */ let aktifTab = this.anaEkranSifreler;
                mIntroJs.setOptions({
                    nextLabel: 'İleri',
                    prevLabel: 'Geri',
                    doneLabel: 'Tamamla',
                    skipLabel: 'x',
                    tooltipClass: 'panel',
                    highlightClass: 'codeyzer-tooltip',
                    hidePrev: true,
                    disableInteraction: true,
                    showBullets: false,
                    steps: [
                        // AnaEkranSifreler
                        {
                            title: 'Platform seçici',
                            element: this.anaEkranSifreler.$platformSelect,
                            intro: 'Şifrelerinize ulaşmak için önce platform seçersiniz.'
                        }, 
                        {
                            title: "Kullanıcı adı seçici",
                            element: this.anaEkranSifreler.$sifreSelect,
                            intro: 'Daha sonra kullanıcı adınızı seçersiniz.'
                        },
                        {
                            title: "Şifre kutusu",
                            element: this.anaEkranSifreler.$sifreSelectSifre,
                            intro: 'Buraya şifreniz getirilir.'
                        }, 
                        {
                            title: "Şifre kopyalama",
                            element: this.anaEkranSifreler.$sifreKopyala,
                            intro: 'İster şifrenizi kopyalabilirsiniz.',
                            highlightClass: 'tooltip-dugme-panel'
                        },
                        {
                            title: "Şifre göster",
                            element: this.anaEkranSifreler.$sifreSelectGoster,
                            intro: 'İsterseniz de şifrenizi bu düğme ile görünür hale getirirsiniz.',
                            highlightClass: 'tooltip-dugme-panel'
                        },
                        {
                            title: "Yenile",
                            element: this.anaEkranSifreler.$yenile,
                            intro: 'Eğer başka bir ortamdan şifre değişikliği yaptıysanız bu düğme ile yenileme işlemi yapabilirsiniz.',
                            highlightClass: 'tooltip-dugme-panel'
                        },

                        // AnaEkranSifreEkle
                        {
                            title: 'Platform adı',
                            element: this.anaEkranSifreEkle.$hariciSifrePlatform,
                            intro: 'Yeni şifre eklerken mevcut sayfa buraya gelir.'
                        }, 
                        {
                            title: "Android uygulaması",
                            element: this.anaEkranSifreEkle.$hariciSifreAndroidPaket,
                            intro: 'Şifrenizi eşlediğiniz android uygulaması burada gösterilir.',
                        },
                        ... !this.anaEkranSifreEkle.$hariciSifreAndroidPaketSelectDiv.classList.contains('gizle') ? [{
                            title: "Android paket seçici",
                            element: this.anaEkranSifreEkle.$hariciSifreAndroidPaketSelect,
                            intro: 'Buradan mevcut şifrenizi android uygulaması ile eşlersiniz.'
                        }] : [],
                        {
                            title: "Kullanıcı kutusu",
                            element: this.anaEkranSifreEkle.$hariciSifreKullaniciAdi,
                            intro: 'İlgili hesabın kullanıcı adını girersiniz.'
                        },
                        {
                            title: "Şifre kutusu",
                            element: this.anaEkranSifreEkle.$hariciSifreSifre,
                            intro: 'İlgili hesabın şifrenisini girersiniz.'
                        },
                        {
                            title: "Şifre ekle düğmesi",
                            element: this.anaEkranSifreEkle.$sifreEkleDugme,
                            intro: 'Şifre ekleye tıkayarak şifrenizi kaydedersiniz.'
                        },
                        {
                            title: "Form sıfırlama",
                            element: this.anaEkranSifreEkle.$sifirlaDugme,
                            intro: 'Sıfırlama düğmesi ile tüm kutularını boşaltabilirsiniz. Kayıtlı şifreniz silinmez sadece ekrandaki kutular boşaltılır.'
                        },

                        // AnaEkranAyarlar
                        {
                            title: "Ana şifre değiştirme kutusu",
                            element: this.anaEkranAyarlar.$yeniSifre,
                            intro: 'Ana şifrenizi değiştirmek için yeni şifrenizi girersiniz.'
                        },
                        {
                            title: "Şifre yenile düğmesi",
                            element: this.anaEkranAyarlar.$sifreYenileDugme,
                            intro: 'Şifre yenile düğmesine bastığınızda ana şifreniz güncellenir.'
                        },
                        {
                            title: "Çıkış yap düğmesi",
                            element: this.anaEkranAyarlar.$cikisYap,
                            intro: 'Çıkış yap ile oturmunuzu kapatırsınız.'
                        },
                    ],
                })
                .start()
                .onchange(eleman => {
                    if (eleman == this.anaEkranSifreler.$yenile && aktifTab == this.anaEkranSifreEkle) {
                        this.kaydir('sol');
                        aktifTab = this.anaEkranSifreler;
                    } else if (eleman == this.anaEkranSifreEkle.$hariciSifrePlatform && aktifTab == this.anaEkranSifreler) {
                        this.kaydir('sag');
                        aktifTab = this.anaEkranSifreEkle;
                    } else if (eleman == this.anaEkranSifreEkle.$sifirlaDugme && aktifTab == this.anaEkranAyarlar) {
                        this.kaydir('sol');
                        aktifTab = this.anaEkranSifreEkle;
                    } else if (eleman == this.anaEkranAyarlar.$yeniSifre && aktifTab == this.anaEkranSifreEkle) {
                        this.kaydir('sag');
                        aktifTab = this.anaEkranAyarlar;
                    }
                })
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