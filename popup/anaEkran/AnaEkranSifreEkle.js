import CodeyzerBilesen from '/core/bilesenler/CodeyzerBilesen.js';
import { formDogrula, icerikSifrele } from '/core/util.js';
import AnaEkran from '/popup/anaEkran/AnaEkran.js';
import { getDepo, popupPost } from '/popup/popup.js';

const template = /* html */`
<template>
    <form ref="sifreEkleForm" autocomplete="off">
        <div class="form-group">
            <input type="text" ref="hariciSifrePlatform" placeholder="Platform(*)" dogrula="hariciSifrePlatformDogrula" disabled>
            <dogrula ref="hariciSifrePlatformDogrula">
                <gerekli mesaj="Platform zorunludur"></gerekli>
            </dogrula>
        </div>
        <div class="form-group">
            <input type="text" ref="hariciSifreKullaniciAdi" placeholder="Kullanıcı adı(*)" dogrula="hariciSifreKullaniciAdiDogrula">
            <dogrula ref="hariciSifreKullaniciAdiDogrula">
                <gerekli mesaj="Kullanıcı adı zorunludur"></gerekli>
            </dogrula>
        </div>
        <div class="form-group">
            <input type="password" ref="hariciSifreSifre" placeholder="Şifre(*)" dogrula="hariciSifreSifreDogrula">
            <dogrula ref="hariciSifreSifreDogrula">
                <gerekli mesaj="Şifre zorunludur"></gerekli>
            </dogrula>
        </div>
        <div class="form-group">
            <label>
                <input type="checkbox" ref="hariciSifreGoster"/>
                Şifreyi göster
            </label>
        </div>

        <button ref="sifreEkleDugme" type="button">Şifre Ekle</button>
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
                    this.anaEkran.anaEkranSifreler.sifreGetir();
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