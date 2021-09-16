import AnaEkran from '/popup/anaEkran/AnaEkran.js';
import { kimlikHesapla, pluginSayfasiAc, sekmeMesajGonder, sifreAl, backgroundMesajGonder, bilesenYukle, formDogrula, popupPost, getDepo, setDepo } from '/core/util.js';
import CodeyzerBilesen from '/core/bilesenler/CodeyzerBilesen.js';

const template = /* html */ `
<template>
    <form ref="oturumAcForm" autocomplete="off" class="mt-1" style="padding-left: 20px; padding-right: 20px;">
        <div class="baslik">
            Oturum Aç / Kayıt Ol
        </div>
        <div class="form-group mt-4">
            <input type="text" ref="kullaniciAdi" placeholder="Kullanıcı adı(*)" dogrula="kullaniciAdiDogrula"/>
            <dogrula ref="kullaniciAdiDogrula">
                <gerekli mesaj="Kullanıcı adı zorunludur"></gerekli>
                <regex ifade="^.{3,}$" mesaj="Kullanıcı adı en az 3 karakter olmalıdır"></regex>
            </dogrula>
        </div>
        <div class="form-group">
            <input type="password" ref="sifre" placeholder="Şifre(*)" dogrula="sifreDogrula"/>
            <dogrula ref="sifreDogrula">
                <gerekli mesaj="Şifre zorunludur"></gerekli>
                <regex ifade="^(?=.*[A-Za-z])(?=.*\\d).{8,}$" mesaj="Şifreniz en az 8 karakterden oluşmalıdır ayrıca küçük harf, büyük harf ve sayı içermelidir"></regex>
            </dogrula>
        </div>
        <div class="row d-flex justify-content-end">
            <button class="mr-3" ref="oturumAc" type="button">Oturum Aç</button>
            <button class="mr-3" ref="kayitOl" type="button">Kayıt Ol</button>
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
                popupPost("/kullanici/dogrula", {
                    "kimlik": response.kullaniciKimlik
                })
                .then(data => {
                    if (data.basarili) {
                        setDepo(response);
                        this.sayfaAksiyonu(null);
                    }
                });
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
                    depo: getDepo()
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
                if (!sifre) {
                    try {
                        sifre = await sifreAl();
                    } catch(error) {
                        
                    }
                }               
                
                bilesenYukle($('#anaPanel'), new AnaEkran(sifre, response.platform));
            }
        });
    }
};