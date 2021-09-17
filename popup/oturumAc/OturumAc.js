import AnaEkran from '/popup/anaEkran/AnaEkran.js';
import { kimlikHesapla, pluginSayfasiAc, sekmeMesajGonder, sifreAl, backgroundMesajGonder, bilesenYukle, formDogrula, popupPost, getDepo, setDepo, i18n } from '/core/util.js';
import CodeyzerBilesen from '/core/bilesenler/CodeyzerBilesen.js';

const template = () => /* html */ `
<template>
    <form ref="oturumAcForm" autocomplete="off" class="mt-1" style="padding-left: 20px; padding-right: 20px;">
        <div class="baslik">
            ${i18n('oturumAc.baslik')}
        </div>
        <div class="form-group mt-4">
            <input type="text" ref="kullaniciAdi" placeholder="${i18n('oturumAc.kullaniciAdi.label')}" dogrula="kullaniciAdiDogrula"/>
            <dogrula ref="kullaniciAdiDogrula">
                <gerekli mesaj="${i18n('oturumAc.kullaniciAdi.hata.gerekli')}"></gerekli>
                <regex ifade="^.{3,}$" mesaj="${i18n('oturumAc.kullaniciAdi.hata.regex')}"></regex>
            </dogrula>
        </div>
        <div class="form-group">
            <input type="password" ref="sifre" placeholder="${i18n('oturumAc.sifre.label')}" dogrula="sifreDogrula"/>
            <dogrula ref="sifreDogrula">
                <gerekli mesaj="${i18n('oturumAc.sifre.hata.gerekli')}"></gerekli>
                <regex ifade="^(?=.*[A-Za-z])(?=.*\\d).{8,}$" mesaj="${i18n('oturumAc.sifre.hata.regex')}"></regex>
            </dogrula>
        </div>
        <div class="row d-flex justify-content-end">
            <button class="mr-3" ref="oturumAc" type="button">${i18n('oturumAc.oturumAc.label')}</button>
            <button class="mr-3" ref="kayitOl" type="button">${i18n('oturumAc.kayitOl.label')}</button>
        </div>
    </form>
</template>
`;

export default class OturumAc extends CodeyzerBilesen {

    /** @type {JQuery<HTMLFormElement>} */ $oturumAcForm
    /** @type {JQuery<HTMLInputElement>} */ $kullaniciAdiInput
    /** @type {JQuery<HTMLInputElement>} */ $sifreInput
    /** @type {JQuery<HTMLButtonElement>} */ $oturumAcButton
    /** @type {JQuery<HTMLButtonElement>} */ $kayitOlButton

    constructor() {
        super(template);
    }

    connectedCallback() {
        super.connectedCallback();

        this.$oturumAcForm = this.bilesen('oturumAcForm');
        this.$kullaniciAdiInput =  this.bilesen('kullaniciAdi');
        this.$sifreInput =  this.bilesen('sifre');
        this.$oturumAcButton = this.bilesen('oturumAc');
        this.$kayitOlButton = this.bilesen('kayitOl');
    }

    init() {
        backgroundMesajGonder({
            mesajTipi: "depoGetir"
        })
        .then((response) => {
            if (response != null) {
                setDepo(response);
                this.sayfaAksiyonu(null);                
            }
        })
    
        this.$oturumAcButton.on('click', () => this.oturumAc());
        this.$kayitOlButton.on('click', () => this.kayitOl());
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
            /** @type {string} */ (this.$kullaniciAdiInput.val()),  
            /** @type {string} */ (this.$sifreInput.val())
        );
    }

    /**
     * 
     * @param {Cevap<string>} data 
     */
    aksiyonAl(data) {
        if (data.basarili) {
            let depo = { ...getDepo() };

            depo.kullaniciAdi = /** @type {string} */ (this.$kullaniciAdiInput.val());
            depo.kullaniciKimlik = data.sonuc;

            setDepo(depo);

            backgroundMesajGonder({
                mesajTipi: "beniHatirla",
                params: {
                    depo: depo
                },
            });
            
            this.sayfaAksiyonu(/** @type {string} */ (this.$sifreInput.val()));
        }
    }

    /**
     * 
     * @param {string} sifre 
     */
    sayfaAksiyonu(sifre) {
        sekmeMesajGonder({
            mesajTipi: "platform",
        }, async response => {
            if (!response) {
                pluginSayfasiAc('/iframe/autocomplete/autocomplete.html');
            } else {
                try {
                    if (!sifre) {
                        sifre = await sifreAl();
                    }               
                
                    bilesenYukle($('#anaPanel'), new AnaEkran(sifre, response.platform));
                } catch(error) {
                        
                }
            }
        });
    }
};