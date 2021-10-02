import CodeyzerBilesen from  '/core/bilesenler/CodeyzerBilesen.js'
import { hashle, mesajYaz, getDepo, i18n } from '/core/util.js';

const template = () => /* html */`
<template>
    <div class="panel sifreKontroluPanel" style="height: 220px">
        <form autocomplete="off" class="mt-3">
            <div class="baslik text-center">
                <h5>${i18n('popupSifreYoneticiPanel.baslik')}</h5>
            </div>
            <div class="form-group mt-4">
                <input type="password" ref="sifreDogrulaKutu" placeholder="${i18n('popupSifreYoneticiPanel.sifre.label')}"/>
            </div>
            <div class="row d-flex justify-content-end">
                <button class="mr-3" ref="sifreOnaylaButon" type="button">${i18n('popupSifreYoneticiPanel.onayla.label')}</button>
                <button class="mr-3" ref="sifreIptalButon" type="button">${i18n('popupSifreYoneticiPanel.iptal.label')}</button>
            </div>
        </form>
    </div>
</template>
`;

export default class PopupSifreYoneticiPanel extends CodeyzerBilesen {

    /** @type {string} */ sifre

    /** @type {HTMLInputElement} */ $sifreDogrulaKutu
    /** @type {HTMLButtonElement} */ $sifreOnaylaButon
    /** @type {HTMLButtonElement} */ $sifreIptalButon

    constructor() {
        super(template);
    }

    connectedCallback() {
        super.connectedCallback();

        this.$sifreDogrulaKutu = this.bilesen('sifreDogrulaKutu');
        this.$sifreOnaylaButon = this.bilesen('sifreOnaylaButon');
        this.$sifreIptalButon = this.bilesen('sifreIptalButon');

        this.hidden = true;
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
            let $anaPanel = document.querySelector('#anaPanel');
            $anaPanel.classList.add('engelli');
            this.hidden = false;
            let depo = getDepo();

            this.$sifreOnaylaButon.addEventListener("click", () => {
                let sifre = this.$sifreDogrulaKutu.value;
                if (hashle(depo.kullaniciAdi + ":" + sifre) === depo.kullaniciKimlik) {
                    this.sifre = sifre;
                    $anaPanel.classList.remove('engelli');
                    mesajYaz(i18n('popupSifreYoneticiPanel.mesaj.sifreDogrulandi'))
                    this.hidden = true;
                    resolve(sifre);
                } else {
                    mesajYaz(i18n('popupSifreYoneticiPanel.mesaj.hataliSifre'));
                }
            });

            this.$sifreIptalButon.addEventListener("click", () => {
                $anaPanel.classList.remove('engelli');
                mesajYaz(i18n('popupSifreYoneticiPanel.mesaj.iptal'));
                this.hidden = true;
                reject();
            });
        });
    }
}