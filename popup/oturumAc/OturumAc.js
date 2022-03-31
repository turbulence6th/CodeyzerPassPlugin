import AnaEkran from '/popup/anaEkran/AnaEkran.js';
import { kimlikHesapla, bilesenYukle, formDogrula, popupPost, getDepo, setDepo, i18n, getAygitYonetici, oturumVerileriniSifirla } from '/core/util.js';
import CodeyzerBilesen from '/core/bilesenler/CodeyzerBilesen.js';

const template = () => /* html */`
<template>
    <div class="row h-100">
        <div class="col-12 my-auto">
            <form ref="oturumAcForm" autocomplete="off" class="mt-1" style="padding-left: 20px; padding-right: 20px;">
                <div class="baslik text-center">
                    <h4>${i18n('oturumAc.baslik')}</h4>
                </div>
                <div class="form-group mt-5">
                    <input type="text" ref="kullaniciAdi" placeholder="${i18n('oturumAc.kullaniciAdi.label')}" dogrula="kullaniciAdiDogrula"/>
                    <codeyzer-dogrula ref="kullaniciAdiDogrula">
                        <codeyzer-gerekli mesaj="${i18n('oturumAc.kullaniciAdi.hata.gerekli')}"></codeyzer-gerekli>
                        <codeyzer-regex ifade="^.{3,}$" mesaj="${i18n('oturumAc.kullaniciAdi.hata.regex')}"></codeyzer-regex>
                    </codeyzer-dogrula>
                </div>
                <div class="form-group mt-2">
                    <input type="password" ref="sifre" placeholder="${i18n('oturumAc.sifre.label')}" dogrula="sifreDogrula"/>
                    <codeyzer-dogrula ref="sifreDogrula">
                        <codeyzer-gerekli mesaj="${i18n('oturumAc.sifre.hata.gerekli')}"></codeyzer-gerekli>
                        <codeyzer-regex ifade="${OturumAc.sifreRegex}" mesaj="${i18n('oturumAc.sifre.hata.regex')}"></codeyzer-regex>
                    </codeyzer-dogrula>
                </div>
                <div class="form-group d-flex flex-column mt-4">
                    <button ref="oturumAc" type="button">${i18n('oturumAc.oturumAc.label')}</button>
                </div>
                <hr/>
                <div class="form-group d-flex flex-column mt-2">
                    <button ref="kayitOl" type="button">${i18n('oturumAc.kayitOl.label')}</button>
                </div>
            </form>
        </div>
    </div>
</template>
`;

export default class OturumAc extends CodeyzerBilesen {

    static sifreRegex = '^(?=.*[A-Za-z])(?=.*\\d).{8,}$'

    /** @type {HTMLFormElement} */ $oturumAcForm
    /** @type {HTMLInputElement} */ $kullaniciAdiInput
    /** @type {HTMLInputElement} */ $sifreInput
    /** @type {HTMLButtonElement} */ $oturumAcButton
    /** @type {HTMLButtonElement} */ $kayitOlButton

    constructor() {
        super(template);
    }

    init() {
        this.$oturumAcForm = this.bilesen('oturumAcForm');
        this.$kullaniciAdiInput =  this.bilesen('kullaniciAdi');
        this.$sifreInput =  this.bilesen('sifre');
        this.$oturumAcButton = this.bilesen('oturumAc');
        this.$kayitOlButton = this.bilesen('kayitOl');

        getAygitYonetici().depoGetir()
        .then((response) => {
            if (response != null) {
                setDepo(response);
                this.sayfaAksiyonu();                
            }
        })
    
        this.$oturumAcButton.addEventListener('click', () => this.oturumAc());
        this.$kayitOlButton.addEventListener('click', () => this.kayitOl());
    }

    oturumAc() {
        if (formDogrula(this.$oturumAcForm)) {
            popupPost("/kullanici/dogrula", {
                "kimlik": this.kimlikGetir()
            })
            .then(data => {
                this.aksiyonAl(data);
            });
        }
    }

    kayitOl() {
        if (formDogrula(this.$oturumAcForm)) {
            popupPost("/kullanici/yeni", {
                "kimlik": this.kimlikGetir()
            })
            .then((/** @type {Cevap<string>} */ data) => {
                this.aksiyonAl(data);
            });
        }
    }

    kimlikGetir() {
        return kimlikHesapla(
            this.$kullaniciAdiInput.value,  
            this.$sifreInput.value
        );
    }

    /**
     * 
     * @param {Cevap<string>} data 
     */
    async aksiyonAl(data) {
        if (data.basarili) {
            oturumVerileriniSifirla();

            let depo = { ...getDepo() };
            let sifre = this.$sifreInput.value;

            depo.kullaniciAdi = this.$kullaniciAdiInput.value;
            depo.kullaniciKimlik = data.sonuc;

            let platform = await getAygitYonetici().platformTipi()
            
                if (['chrome', 'android', 'ios', 'web'].includes(platform)) {
                    depo.sifre = sifre;
                }

            await getAygitYonetici().beniHatirla(depo);
           
            setDepo(depo);
            await getAygitYonetici().hariciSifreDTOListesiAyarla(null);
            
            this.sayfaAksiyonu();
        }
    }

    sayfaAksiyonu() {
        // TODO - OturumAc'dan başka sayfada iptal edilirse bug oluyor.
        getAygitYonetici().sifreAl().then(x => bilesenYukle(new AnaEkran()));
    }
};