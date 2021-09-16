import CodeyzerBilesen from  '/core/bilesenler/CodeyzerBilesen.js'
import { hashle, mesajYaz, getDepo } from '/core/util.js';

const template = /* html */`
<template>
    <div class="panel sifreKontroluPanel">
        <form autocomplete="off" class="mt-3">
            <div class="baslik">
                Şifre kontrolü
            </div>
            <div class="form-group mt-4">
                <input type="password" ref="sifreDogrulaKutu" placeholder="Şifrenizi giriniz(*)"/>
            </div>
            <div class="row d-flex justify-content-end">
                <button class="mr-3" ref="sifreOnaylaButon" type="button">Onayla</button>
                <button class="mr-3" ref="sifreIptalButon" type="button">İptal</button>
            </div>
        </form>
    </div>
</template>
`;

export default class PopupSifreYoneticiPanel extends CodeyzerBilesen {

    /** @type {string} */ sifre

    /** @type {JQuery<HTMLInputElement>} */ $sifreDogrulaKutu
    /** @type {JQuery<HTMLButtonElement>} */ $sifreOnaylaButon
    /** @type {JQuery<HTMLButtonElement>} */ $sifreIptalButon

    constructor() {
        super(template);
    }

    connectedCallback() {
        super.connectedCallback();

        this.$sifreDogrulaKutu = this.bilesen('sifreDogrulaKutu');
        this.$sifreOnaylaButon = this.bilesen('sifreOnaylaButon');
        this.$sifreIptalButon = this.bilesen('sifreIptalButon');
    }

    /**
     * 
     * @returns {Promise<string>}
     */
     sifreAl() {
        if (this.sifre) {
            return new Promise((resolve, reject) => {
                resolve(this.sifre);
            });
        }

        return new Promise((resolve, reject) => {
            mesajYaz("Şifre girilmesi bekleniyor.");
            $('#anaPanel').addClass('engelli');
            $(this).show();
            let depo = getDepo();

            this.$sifreOnaylaButon.on("click", () => {
                let sifre = /** @type {string} */ (this.$sifreDogrulaKutu.val());
                if (hashle(depo.kullaniciAdi + ":" + sifre) === depo.kullaniciKimlik) {
                    this.sifre = sifre;
                    $('#anaPanel').removeClass('engelli');
                    mesajYaz("Şifre doğrulandı.")
                    $(this).hide();
                    resolve(sifre);
                } else {
                    mesajYaz("Hatalı şifre girdiniz.");
                }
            });

            this.$sifreIptalButon.on("click", () => {
                $('#anaPanel').removeClass('engelli');
                mesajYaz("Şifre doğrulama iptal edildi.");
                $(this).hide();
                reject();
            });
        });
    }
}