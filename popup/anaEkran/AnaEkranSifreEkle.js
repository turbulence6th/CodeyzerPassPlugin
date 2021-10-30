import CodeyzerBilesen from '/core/bilesenler/CodeyzerBilesen.js';
import CodeyzerImageButton from '/core/bilesenler/CodeyzerImageButton.js';
import { formDogrula, icerikSifrele, getDepo, popupPost, i18n, getAygitYonetici } from '/core/util.js';
import AnaEkran from '/popup/anaEkran/AnaEkran.js';

const template = () => /* html */`
<template>
    <form ref="sifreEkleForm" autocomplete="off">
        <div class="form-group">
            <input type="text" ref="hariciSifrePlatform" placeholder="${i18n('anaEkranSifreEkle.platform.label')}" dogrula="hariciSifrePlatformDogrula" disabled>
            <codeyzer-dogrula ref="hariciSifrePlatformDogrula">
                <codeyzer-gerekli mesaj="${i18n('anaEkranSifreEkle.platform.hata.gerekli')}"></codeyzer-gerekli>
            </codeyzer-dogrula>
        </div>
        <div class="form-group">
            <input type="text" ref="hariciSifreKullaniciAdi" placeholder="${i18n('anaEkranSifreEkle.kullaniciAdi.label')}" dogrula="hariciSifreKullaniciAdiDogrula">
            <codeyzer-dogrula ref="hariciSifreKullaniciAdiDogrula">
                <codeyzer-gerekli mesaj="${i18n('anaEkranSifreEkle.kullaniciAdi.hata.gerekli')}"></codeyzer-gerekli>
            </codeyzer-dogrula>
        </div>
        <div class="form-group">
            <input type="password" ref="hariciSifreSifre" placeholder="${i18n('anaEkranSifreEkle.sifre.label')}" dogrula="hariciSifreSifreDogrula">
            <a title="${i18n('anaEkranSifreEkle.sifreGoster.title')}" style="margin-left:-53px">
                <codeyzer-image-button ref="hariciSifreGoster" img="/images/gizle_icon.png" data-durum="gizle"/>
            </a>
            <codeyzer-dogrula ref="hariciSifreSifreDogrula">
                <codeyzer-gerekli mesaj="${i18n('anaEkranSifreEkle.sifre.hata.gerekli')}"></codeyzer-gerekli>
            </codeyzer-dogrula>
        </div>

        <div class="form-group d-flex flex-column mt-4">
            <button ref="sifreEkleDugme" type="button">${i18n('anaEkranSifreEkle.sifreEkle.label')}</button>
        </div>
        <div class="form-group d-flex flex-column mt-4">
            <button ref="sifirlaDugme" type="button">${i18n('anaEkranSifreEkle.sifirla.label')}</button>
        </div>
    </form>
</template>
`;

export default class AnaEkranSifreEkle extends CodeyzerBilesen {
 
    /** @type {AnaEkran} */ anaEkran

    /** @type {HTMLFormElement} */ $sifreEkleForm
    /** @type {HTMLInputElement} */ $hariciSifrePlatform
    /** @type {HTMLInputElement} */ $hariciSifreKullaniciAdi
    /** @type {HTMLInputElement} */ $hariciSifreSifre
    /** @type {CodeyzerImageButton} */ $hariciSifreGoster
    /** @type {HTMLButtonElement} */ $sifreEkleDugme
    /** @type {HTMLButtonElement} */ $sifirlaDugme

    constructor() {
        super(template);
    }

    connectedCallback() {
        super.connectedCallback();

        this.$sifreEkleForm = this.bilesen('sifreEkleForm');
        this.$hariciSifrePlatform = this.bilesen('hariciSifrePlatform');
        this.$hariciSifreKullaniciAdi = this.bilesen('hariciSifreKullaniciAdi');
        this.$hariciSifreSifre = this.bilesen('hariciSifreSifre');
        this.$hariciSifreGoster = this.bilesen('hariciSifreGoster');
        this.$sifreEkleDugme = this.bilesen('sifreEkleDugme');
        this.$sifirlaDugme = this.bilesen('sifirlaDugme');
    }

    init() {
        if (getAygitYonetici().platformTipi() === 'mobil') {
            this.$sifreEkleForm.classList.add('engelli');
        }

        getAygitYonetici().sonLoginGetir()
        .then(login => {
            if (login) {
                this.$hariciSifrePlatform.value = login.platform;
                this.$hariciSifreKullaniciAdi.value = login.kullaniciAdi;
                this.$hariciSifreSifre.value = login.sifre;
            } else {
                this.$hariciSifrePlatform.value = this.anaEkran.platform;
            }
        });

        this.$sifreEkleDugme.addEventListener('click', () => this.sifreEkleDugme());
        this.$hariciSifreGoster.addEventListener('click', () => this.hariciSifreGosterChanged());
        this.$sifirlaDugme.addEventListener('click', () => this.sifirla());
    }

    sifreEkleDugme() {
        if (formDogrula(this.$sifreEkleForm)) {
            popupPost("/hariciSifre/kaydet", {
                icerik: icerikSifrele({
                    platform: this.$hariciSifrePlatform.value,
                    kullaniciAdi: this.$hariciSifreKullaniciAdi.value,
                    sifre: this.$hariciSifreSifre.value,
                }, this.anaEkran.sifre),
                kullaniciKimlik: getDepo().kullaniciKimlik
            })
            .then((/** @type {Cevap<void>} */ data) => {
                if (data.basarili) {
                    this.sifirla();
                    this.anaEkran.anaEkranSifreler.hariciSifreGetir(false);
                }
            });
        }
    }

    hariciSifreGosterChanged() {
        if(this.$hariciSifreGoster.getAttribute('data-durum') === 'gizle') {
            this.$hariciSifreGoster.setAttribute('data-durum', 'goster');
            this.$hariciSifreGoster.setAttribute('img', '/images/goster_icon.png');
            this.$hariciSifreSifre.type = "text";
        } else {
            this.$hariciSifreGoster.setAttribute('data-durum', 'gizle');
            this.$hariciSifreGoster.setAttribute('img', '/images/gizle_icon.png');
            this.$hariciSifreSifre.type = "password";
        }
    }

    sifirla() {
        this.$hariciSifrePlatform.value = this.anaEkran.platform;
        this.$hariciSifreKullaniciAdi.value = null;
        this.$hariciSifreSifre.value = null;
    }
}