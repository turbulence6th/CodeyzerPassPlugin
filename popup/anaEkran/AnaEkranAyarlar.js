import OturumAc from '/popup/oturumAc/OturumAc.js';
import { icerikSifrele, kimlikHesapla, pluginSayfasiAc, anaBilesenYukle, formDogrula, popupPost, setDepo, getDepo, i18n, getAygitYonetici, oturumVerileriniSifirla } from '/core/util.js';
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
            <codeyzer-checkbox ref="arayuzKontrolu" label="${i18n('anaEkranAyarlar.arayuzKontrolu.label')}"/>
        </div>
        <!--<div class="form-group d-flex flex-column">
            <button ref="gelismisButton" type="button">${i18n('anaEkranAyarlar.gelismisAyarlar.label')}</button>
        </div>-->
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
    /** @type {CodeyzerCheckbox} */ $arayuzKontrolu
    /** @type {HTMLButtonElement} */ $gelismisButton
    /** @type {HTMLButtonElement} */ $cikisYap

    constructor() {
        super(template);
    }

    connectedCallback() {
        super.connectedCallback();

        this.$yeniSifreForm = this.bilesen('yeniSifreForm')
        this.$yeniSifre = this.bilesen('yeniSifre')
        this.$sifreYenileDugme = this.bilesen('sifreYenileDugme')
        this.$arayuzKontrolu = this.bilesen('arayuzKontrolu')
        //this.$gelismisButton = this.bilesen('gelismisButton')
        this.$cikisYap = this.bilesen('cikisYap')
    }

    init() {
        getAygitYonetici().platformTipi()
        .then(platform => {
            if (['android', 'ios', 'web'].includes(platform)) {
                //this.$gelismisButton.hidden = true;
            }
        });

        getAygitYonetici().arayuzKontrolGetir()
        .then(response => {
            this.$arayuzKontrolu.value = response;
        });
        
        this.$sifreYenileDugme.addEventListener('click', () => this.sifreYenileDugme());
        this.$arayuzKontrolu.addEventListener('click', () => this.arayuzKontroluChange());
        //this.$gelismisButton.addEventListener('click', () => this.gelismisButton());
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
                            this.anaEkran.sifre = yeniSifre;
        
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

    arayuzKontroluChange() {
        getAygitYonetici().arayuzKontrolAyarla(this.$arayuzKontrolu.value);
    }

    gelismisButton() {
        pluginSayfasiAc("/iframe/autocomplete/autocomplete.html")
    }

    cikisYap() {
        oturumVerileriniSifirla();
        anaBilesenYukle(new OturumAc());
    }
};