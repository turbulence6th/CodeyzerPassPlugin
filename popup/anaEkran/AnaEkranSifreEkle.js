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
        <div ref="hariciSifreAndroidPaketDiv">
            <div class="form-group">
                <input type="text" ref="hariciSifreAndroidPaket" placeholder="${i18n('anaEkranSifreEkle.androidPaket.placeholder')}" disabled>
                <a title="" style="margin-left:-53px;">
                    <codeyzer-image-button ref="hariciSifreAndroidPaketKaldir" img="/images/sil_icon.png"/>
                </a>
            </div>
            <div class="form-group">
                <select ref="hariciSifreAndroidPaketSelect">
                </select>  
            </div>
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
            <button ref="sifreEkleDugme" type="button">${i18n('anaEkranSifreEkle.sifreEkle.ekle.label')}</button>
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
    /** @type {HTMLDivElement} */ $hariciSifreAndroidPaketDiv
    /** @type {HTMLInputElement} */ $hariciSifreAndroidPaket
    /** @type {HTMLInputElement} */ $hariciSifreAndroidPaketKaldir
    /** @type {HTMLSelectElement} */ $hariciSifreAndroidPaketSelect
    /** @type {HTMLInputElement} */ $hariciSifreKullaniciAdi
    /** @type {HTMLInputElement} */ $hariciSifreSifre
    /** @type {CodeyzerImageButton} */ $hariciSifreGoster
    /** @type {HTMLButtonElement} */ $sifreEkleDugme
    /** @type {HTMLButtonElement} */ $sifirlaDugme

    /** @type {string} */ #hariciSifreKimlik;

    constructor() {
        super(template);
    }

    connectedCallback() {
        super.connectedCallback();

        this.$sifreEkleForm = this.bilesen('sifreEkleForm');
        this.$hariciSifrePlatform = this.bilesen('hariciSifrePlatform');
        this.$hariciSifreAndroidPaketDiv = this.bilesen('hariciSifreAndroidPaketDiv');
        this.$hariciSifreAndroidPaket = this.bilesen('hariciSifreAndroidPaket');
        this.$hariciSifreAndroidPaketKaldir = this.bilesen('hariciSifreAndroidPaketKaldir');
        this.$hariciSifreAndroidPaketSelect = this.bilesen('hariciSifreAndroidPaketSelect');
        this.$hariciSifreKullaniciAdi = this.bilesen('hariciSifreKullaniciAdi');
        this.$hariciSifreSifre = this.bilesen('hariciSifreSifre');
        this.$hariciSifreGoster = this.bilesen('hariciSifreGoster');
        this.$sifreEkleDugme = this.bilesen('sifreEkleDugme');
        this.$sifirlaDugme = this.bilesen('sifirlaDugme');
    }

    init() {
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

        this.$hariciSifreAndroidPaketKaldir.addEventListener('click', () => this.androidPaketKaldir());
        this.$hariciSifreAndroidPaketSelect.addEventListener('change', () => this.androidPaketChanged());
        this.$sifreEkleDugme.addEventListener('click', () => this.sifreEkleDugme());
        this.$hariciSifreGoster.addEventListener('click', () => this.hariciSifreGosterChanged());
        this.$sifirlaDugme.addEventListener('click', () => this.sifirla());

        this.$hariciSifreAndroidPaket.disabled = true;

        getAygitYonetici().platformTipi()
        .then(platform => {
            if (platform === "chrome") {
                this.$hariciSifreAndroidPaketDiv.classList.add('gizle');
            } else {
                this.androidPaketDoldur();
            }
        });

        this.sifirla();
    }

    androidPaketKaldir() {
        this.$hariciSifreAndroidPaket.value = null;
        this.$hariciSifreAndroidPaketSelect.selectedIndex = 0;
    }

    androidPaketChanged() {
        this.$hariciSifreAndroidPaket.value = this.$hariciSifreAndroidPaketSelect.value;
    }

    hariciSifrePlatformChanged() {
        if (this.$hariciSifrePlatform.value.length === 0) {
            this.$sifreEkleForm.classList.add('engelli');
        } else {
            this.$sifreEkleForm.classList.remove('engelli');
        }
    }

    sifreEkleDugme() {
        if (formDogrula(this.$sifreEkleForm)) {
            /** @type {PatikaEnum} */ let patika;
            if (!this.hariciSifreKimlik) {
                patika = "/hariciSifre/kaydet";
            } else {
                patika = "/hariciSifre/guncelle";
            }

            getAygitYonetici().onayDialog(i18n('codeyzer.genel.uyari'), i18n('anaEkranSifreEkle.sifreEkle.onay'))
            .then(onay => {
                if (onay) {
                    popupPost(patika, {
                        kimlik: this.hariciSifreKimlik,
                        icerik: icerikSifrele({
                            platform: this.$hariciSifrePlatform.value,
                            androidPaket: this.$hariciSifreAndroidPaket.value,
                            kullaniciAdi: this.$hariciSifreKullaniciAdi.value,
                            sifre: this.$hariciSifreSifre.value,
                        }, this.anaEkran.sifre),
                        kullaniciKimlik: getDepo().kullaniciKimlik
                    })
                    .then((/** @type {Cevap<void>} */ data) => {
                        if (data.basarili) {
                            this.sifirla();
                            this.anaEkran.anaEkranSifreler.hariciSifreGetir(false);
                            this.anaEkran.kaydir('sol');
                        }
                    });
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
        this.hariciSifreKimlik = undefined;
        this.$hariciSifrePlatform.value = this.anaEkran.platform;
        this.$hariciSifreAndroidPaket.value = null;
        this.$hariciSifreAndroidPaketSelect.selectedIndex = 0;
        this.$hariciSifreKullaniciAdi.value = null;
        this.$hariciSifreSifre.value = null;
        this.hariciSifrePlatformChanged();
    }

    androidPaketDoldur() {
        getAygitYonetici().androidPaketGetir()
        .then(paketList => {
            let ilkOption = new Option();
            ilkOption.label = i18n('anaEkranSifreEkle.androidPaketSelect.seciniz');
            this.$hariciSifreAndroidPaketSelect.append(ilkOption);
            for (let paket of paketList) {
                let option = new Option(paket.text, paket.value);
                this.$hariciSifreAndroidPaketSelect.append(option);
            }
        });
    }

    /**
     * 
     * @param {string} val
     */ 
    set hariciSifreKimlik(val) {
        this.#hariciSifreKimlik = val;
        if (val === undefined || val === null) {
            this.$sifreEkleDugme.textContent = i18n('anaEkranSifreEkle.sifreEkle.ekle.label');
        } else {
            this.$sifreEkleDugme.textContent = i18n('anaEkranSifreEkle.sifreEkle.guncelle.label');
        }
    }

    get hariciSifreKimlik() {
        return this.#hariciSifreKimlik;
    }
}