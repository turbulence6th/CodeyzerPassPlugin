import CodeyzerBilesen from '/core/bilesenler/CodeyzerBilesen.js';
import { formDogrula, icerikSifrele, getDepo, popupPost, i18n } from '/core/util.js';
import AnaEkran from '/popup/anaEkran/AnaEkran.js';

const template = () => /* html */`
<template>
    <form ref="sifreEkleForm" autocomplete="off">
        <div class="form-group">
            <input type="text" ref="hariciSifrePlatform" placeholder="${i18n('anaEkranSifreEkle.platform.label')}" dogrula="hariciSifrePlatformDogrula" disabled>
            <dogrula ref="hariciSifrePlatformDogrula">
                <gerekli mesaj="${i18n('anaEkranSifreEkle.platform.hata.gerekli')}"></gerekli>
            </dogrula>
        </div>
        <div class="form-group">
            <input type="text" ref="hariciSifreKullaniciAdi" placeholder="${i18n('anaEkranSifreEkle.kullaniciAdi.label')}" dogrula="hariciSifreKullaniciAdiDogrula">
            <dogrula ref="hariciSifreKullaniciAdiDogrula">
                <gerekli mesaj="${i18n('anaEkranSifreEkle.kullaniciAdi.hata.gerekli')}"></gerekli>
            </dogrula>
        </div>
        <div class="form-group">
            <input type="password" ref="hariciSifreSifre" placeholder="${i18n('anaEkranSifreEkle.sifre.label')}" dogrula="hariciSifreSifreDogrula">
            <dogrula ref="hariciSifreSifreDogrula">
                <gerekli mesaj="${i18n('anaEkranSifreEkle.sifre.hata.gerekli')}"></gerekli>
            </dogrula>
        </div>
        <div class="form-group">
            <label>
                <input type="checkbox" ref="hariciSifreGoster"/>
                ${i18n('anaEkranSifreEkle.sifreGoster.label')}
            </label>
        </div>

        <button ref="sifreEkleDugme" type="button">${i18n('anaEkranSifreEkle.sifreEkle.label')}</button>
    </form>
</template>
`;

export default class AnaEkranSifreEkle extends CodeyzerBilesen {
 
    /** @type {AnaEkran} */ anaEkran

    /** @type {JQuery<HTMLFormElement>} */ $sifreEkleForm
    /** @type {JQuery<HTMLInputElement>} */ $hariciSifrePlatform
    /** @type {JQuery<HTMLInputElement>} */ $hariciSifreKullaniciAdi
    /** @type {JQuery<HTMLInputElement>} */ $hariciSifreSifre
    /** @type {JQuery<HTMLInputElement>} */ $hariciSifreGoster
    /** @type {JQuery<HTMLButtonElement>} */ $sifreEkleDugme

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
    }

    init() {
        this.$hariciSifrePlatform.val(this.anaEkran.platform);

        this.$sifreEkleDugme.on('click', () => this.sifreEkleDugme());
        this.$hariciSifreGoster.on('change', () => this.hariciSifreGosterChanged());
    }

    sifreEkleDugme() {
        if (formDogrula(this.$sifreEkleForm)) {
            popupPost("/hariciSifre/kaydet", {
                icerik: icerikSifrele({
                    platform: /** @type {string} */ (this.$hariciSifrePlatform.val()),
                    kullaniciAdi: /** @type {string} */ (this.$hariciSifreKullaniciAdi.val()),
                    sifre: /** @type {string} */ (this.$hariciSifreSifre.val()),
                }, this.anaEkran.sifre),
                kullaniciKimlik: getDepo().kullaniciKimlik
            })
            .then(data => {
                data
                if (data.basarili) {
                    this.$hariciSifreKullaniciAdi.val(null);
                    this.$hariciSifreSifre.val(null);
                    this.anaEkran.anaEkranSifreler.hariciSifreGetir();
                }
            });
        }
    }

    hariciSifreGosterChanged() {
        if(this.$hariciSifreGoster.prop('checked')) {
            this.$hariciSifreSifre.prop("type", "text");
        } else {
            this.$hariciSifreSifre.prop("type", "password");
        }
    }
}