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
    /** @type {HTMLButtonElement} */ $gelismisButton
    /** @type {HTMLButtonElement} */ $cikisYap

    constructor() {
        super(template);
    }

    connectedCallback() {
        super.connectedCallback();

        this.$yeniSifreForm = this.bilesen('yeniSifreForm');
        this.$yeniSifre = this.bilesen('yeniSifre');
        this.$sifreYenileDugme = this.bilesen('sifreYenileDugme');
        this.$sifreSor = this.bilesen('sifreSor');
        this.$cikisYap = this.bilesen('cikisYap');
    }

    init() {
        getAygitYonetici().platformTipi()
        .then(platform => {
            if (['android', 'ios', 'web'].includes(platform)) {
                this.$sifreSor.hidden = true;
            }
        });

        this.$sifreSor.value = !getDepo().sifre;
        
        this.$sifreYenileDugme.addEventListener('click', () => this.sifreYenileDugme());
        this.$sifreSor.addEventListener('click', () => this.sifreSorChange());
        this.$cikisYap.addEventListener('click', () => this.cikisYap());
    }

    sifreYenileDugme() {
        getAygitYonetici().onayDialog(i18n('codeyzer.genel.uyari'), i18n('anaEkranAyarlar.sifreYenile.click'))
        .then(onay => {
            if (onay) {
                if (formDogrula(this.$yeniSifreForm)) {
                    let yeniSifre = this.$yeniSifre.value;
                    let yeniKullaniciKimlik = kimlikHesapla(getDepo().kullaniciAdi, yeniSifre);
                    let yeniHariciSifreListesi = this.anaEkran.hariciSifreListesi
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

    cikisYap() {
        oturumVerileriniSifirla();
        bilesenYukle(new OturumAc());
    }
};