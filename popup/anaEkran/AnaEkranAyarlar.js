import OturumAc from '/popup/oturumAc/OturumAc.js';
import { icerikSifrele, kimlikHesapla, pluginSayfasiAc, bilesenYukle, formDogrula, popupPost, setDepo, getDepo, i18n, getAygitYonetici, oturumVerileriniSifirla } from '/core/util.js';
import CodeyzerBilesen from '/core/bilesenler/CodeyzerBilesen.js';
import AnaEkran from '/popup/anaEkran/AnaEkran.js';
import CodeyzerCheckbox from '/core/bilesenler/CodeyzerCheckbox.js';

const template = () => /* html */ `
<template>
    <form ref="yeniSifreForm" autocomplete="off">
       
        <div class="form-group">
            <input type="password" ref="yeniSifre" placeholder="${i18n('anaEkranAyarlar.yeniSifre.label')}" dogrula="yeniSifreDogrula"/>
            <codeyzer-dogrula ref="yeniSifreDogrula">
                <codeyzer-gerekli mesaj="${i18n('anaEkranAyarlar.yeniSifre.hata.gerekli')}"></codeyzer-gerekli>
                <codeyzer-regex ifade="${OturumAc.sifreRegex}" mesaj="${i18n('anaEkranAyarlar.yeniSifre.hata.regex')}"></codeyzer-regex>
            </codeyzer-dogrula>
        </div>
            
        <div class="form-group d-flex flex-column">
            <button ref="sifreYenileDugme" type="button">${i18n('anaEkranAyarlar.sifreYenile.label')}</button>
        </div>
        <div class="form-group">
            <codeyzer-checkbox ref="sifreSor" label="${i18n('anaEkranAyarlar.sifreSor.label')}" title="${i18n('anaEkranAyarlar.sifreSor.title')}"/>
        </div>
        <div class="form-group d-flex flex-column">
            <button ref="gelismisAyarlar" type="button">Gelişmiş ayarlar</button>
        </div>
        <div class="form-group d-flex flex-column">
            <button ref="otomatikDoldur" type="button"></button>
        </div>
        <div class="form-group d-flex flex-column">
            <button ref="cikisYap" type="button">${i18n('anaEkranAyarlar.cikisYap.label')}</button>
        </div>
    </form>
</template>
`;

export default class AnaEkranAyarlar extends CodeyzerBilesen {

    /** @type {AnaEkran} */ anaEkran

    /** @type {HTMLFormElement} */ $yeniSifreForm
    /** @type {HTMLInputElement} */ $yeniSifre
    /** @type {HTMLButtonElement} */ $sifreYenileDugme
    /** @type {CodeyzerCheckbox} */ $sifreSor
    /** @type {HTMLButtonElement} */ $gelismisAyarlar
    /** @type {HTMLButtonElement} */ $otomatikDoldur
    /** @type {HTMLButtonElement} */ $cikisYap

    constructor() {
        super(template);
    }

    init() {
        this.anaEkran = this.ebeveyn(AnaEkran);
        this.$yeniSifreForm = this.bilesen('yeniSifreForm');
        this.$yeniSifre = this.bilesen('yeniSifre');
        this.$sifreYenileDugme = this.bilesen('sifreYenileDugme');
        this.$sifreSor = this.bilesen('sifreSor');
        this.$gelismisAyarlar = this.bilesen('gelismisAyarlar');
        this.$otomatikDoldur = this.bilesen('otomatikDoldur');
        this.$cikisYap = this.bilesen('cikisYap');

        getAygitYonetici().platformTipi()
        .then(platform => {
            if (['android', 'ios', 'web'].includes(platform)) {
                this.$sifreSor.hidden = true;
                this.$gelismisAyarlar.hidden = true;
            }
        });

        this.otomatikDoldurBilgiGuncelle();

        this.$sifreSor.value = !getDepo().sifre;
        
        this.$sifreYenileDugme.addEventListener('click', () => this.sifreYenileDugme());
        this.$sifreSor.addEventListener('click', () => this.sifreSorChange());
        this.$gelismisAyarlar.addEventListener('click', () => this.gelismisAyarlarAc());
        this.$otomatikDoldur.addEventListener('click', () => this.otomatikDoldurEylem());
        this.$cikisYap.addEventListener('click', () => this.cikisYap());
    }

    sifreYenileDugme() {
        getAygitYonetici().onayDialog(i18n('codeyzer.genel.uyari'), i18n('anaEkranAyarlar.sifreYenile.click'))
        .then(onay => {
            if (onay) {
                if (formDogrula(this.$yeniSifreForm)) {
                    let yeniSifre = this.$yeniSifre.value;
                    let yeniKullaniciKimlik = kimlikHesapla(getDepo().kullaniciAdi, yeniSifre);
                    let yeniHariciSifreListesi = this.anaEkran.anaEkranSifreler.hariciSifreListesi
                        .map(x => ({
                            icerik: icerikSifrele(x.icerik, yeniSifre)
                        }))
                
                    popupPost("/hariciSifre/yenile", {
                        hariciSifreListesi: yeniHariciSifreListesi,
                        kullaniciKimlik: getDepo().kullaniciKimlik,
                        yeniKullaniciKimlik: yeniKullaniciKimlik
                    })
                    .then(data => {
                        if (data.basarili) {
                            let depo = { ...getDepo() };
                            depo.kullaniciKimlik = yeniKullaniciKimlik;

                            getAygitYonetici().platformTipi()
                            .then(platform => {
                                if (['android', 'ios', 'web'].includes(platform)) {
                                    depo.sifre = yeniSifre;
                                }
                            });

                            setDepo(depo);
            
                            getAygitYonetici().beniHatirla(getDepo());
            
                            this.$yeniSifre.value = null;
                            this.anaEkran.anaEkranSifreler.hariciSifreGetir(false);
                        }
                    });
                }
            }
        });
    }

    async sifreSorChange() {
       if (this.$sifreSor.value) {
            let depo = { ...getDepo() };
            depo.sifre = null;
            getAygitYonetici().beniHatirla(depo);
       } else {
            let depo = { ...getDepo() };
            depo.sifre = await getAygitYonetici().sifreAl();
            getAygitYonetici().beniHatirla(depo);
       }
    }

    gelismisAyarlarAc() {
        pluginSayfasiAc('/iframe/GelismisAyarlar/index.html');
    }

    otomatikDoldurBilgiGuncelle() {
        getAygitYonetici().otomatikDoldurBilgi()
        .then(sonuc => {
            if (sonuc.etkin) {
                this.$otomatikDoldur.disabled = true;
                this.$otomatikDoldur.innerHTML = /* html */ `<a style='color: #00FF7F'>${i18n('anaEkranAyarlar.otomatikDoldur.etkin')}</a>`;
            } else if (sonuc.destek) {
                this.$otomatikDoldur.innerHTML = /* html */ `<a>${i18n('anaEkranAyarlar.otomatikDoldur.etkinlestir')}</a>`;
            } else {
                this.$otomatikDoldur.disabled = true;
                this.$otomatikDoldur.innerHTML = /* html */ `<a style='color: #FF5F5F'>${i18n('anaEkranAyarlar.otomatikDoldur.desteklenmiyor')}</a>`;
            }
        });
    }

    otomatikDoldurEylem() {
        getAygitYonetici().otomatikDoldurEtkinlestir()
        .then(() => {
            this.otomatikDoldurBilgiGuncelle();
        });
    }

    cikisYap() {
        oturumVerileriniSifirla();
        bilesenYukle(new OturumAc());
    }
};