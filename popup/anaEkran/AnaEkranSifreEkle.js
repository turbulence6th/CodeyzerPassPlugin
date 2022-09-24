import CodeyzerBilesen from '/core/bilesenler/CodeyzerBilesen.js';
import CodeyzerImageButton from '/core/bilesenler/CodeyzerImageButton.js';
import { formDogrula, icerikSifrele, getDepo, popupPost, i18n, getAygitYonetici } from '/core/util.js';
import AnaEkran from '/popup/anaEkran/AnaEkran.js';

const template = () => /* html */`
<template>
    <form ref="sifreEkleForm" autocomplete="off">
        <div class="form-group">
            <input type="text" inputmode="url" ref="hariciSifrePlatform" placeholder="${i18n('anaEkranSifreEkle.platform.label')}" dogrula="hariciSifrePlatformDogrula" spellcheck="false">
            <codeyzer-dogrula ref="hariciSifrePlatformDogrula">
                <!--
                <codeyzer-gerekli mesaj="${i18n('anaEkranSifreEkle.platform.hata.gerekli')}"></codeyzer-gerekli>
                 -->
                <codeyzer-regex ifade="^(\\w+\\.)*(\\w+\\.\\w+)\\/.*$" mesaj="Platform formatı ornek.com/ veya ornek.com/patika formatında olmalıdır"></codeyzer-regex>
            </codeyzer-dogrula>
        </div>
        <div class="form-group">
            <input type="text" ref="hariciSifreAndroidPaket" placeholder="${i18n('anaEkranSifreEkle.androidPaket.placeholder')}" dogrula="hariciSifreAndroidPaketDogrula" spellcheck="false">
            <codeyzer-dogrula ref="hariciSifreAndroidPaketDogrula">
                <codeyzer-regex ifade="^(\\w+\\.)*\\w+$" mesaj="Android paket formatı android.paket.adi formatında olmalıdır"></codeyzer-regex>
            </codeyzer-dogrula>
        </div>
        <div ref="hariciSifreAndroidPaketSelectDiv" class="form-group">
            <select ref="hariciSifreAndroidPaketSelect">
            </select>  
        </div>
        <div class="form-group">
            <input type="text" inputmode="email" ref="hariciSifreKullaniciAdi" placeholder="${i18n('anaEkranSifreEkle.kullaniciAdi.label')}" dogrula="hariciSifreKullaniciAdiDogrula">
            <codeyzer-dogrula ref="hariciSifreKullaniciAdiDogrula">
                <codeyzer-gerekli mesaj="${i18n('anaEkranSifreEkle.kullaniciAdi.hata.gerekli')}"></codeyzer-gerekli>
            </codeyzer-dogrula>
        </div>
        <div class="form-group">
            <input type="password" ref="hariciSifreSifre" placeholder="${i18n('anaEkranSifreEkle.sifre.label')}" dogrula="hariciSifreSifreDogrula" class="input-button">
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
    /** @type {HTMLInputElement} */ $hariciSifreAndroidPaket
    /** @type {HTMLDivElement} */ $hariciSifreAndroidPaketSelectDiv
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

    async init() {
        this.anaEkran = this.ebeveyn(AnaEkran);
        this.$sifreEkleForm = this.bilesen('sifreEkleForm');
        this.$hariciSifrePlatform = this.bilesen('hariciSifrePlatform');
        this.$hariciSifreAndroidPaket = this.bilesen('hariciSifreAndroidPaket');
        this.$hariciSifreAndroidPaketSelectDiv = this.bilesen('hariciSifreAndroidPaketSelectDiv');
        this.$hariciSifreAndroidPaketSelect = this.bilesen('hariciSifreAndroidPaketSelect');
        this.$hariciSifreKullaniciAdi = this.bilesen('hariciSifreKullaniciAdi');
        this.$hariciSifreSifre = this.bilesen('hariciSifreSifre');
        this.$hariciSifreGoster = this.bilesen('hariciSifreGoster');
        this.$sifreEkleDugme = this.bilesen('sifreEkleDugme');
        this.$sifirlaDugme = this.bilesen('sifirlaDugme');

        this.sifirla();

        let login = await getAygitYonetici().sonLoginGetir();
        if (login) {
            this.$hariciSifrePlatform.value = login.platform;
            this.$hariciSifreKullaniciAdi.value = login.kullaniciAdi;
            this.$hariciSifreSifre.value = login.sifre;
            this.anaEkran.kaydir('sag');
        } else {
            this.$hariciSifrePlatform.value = (await getAygitYonetici().platformGetir()).platform;
        }

        this.$hariciSifreAndroidPaketSelect.addEventListener('change', () => this.androidPaketChanged());
        this.$sifreEkleDugme.addEventListener('click', () => this.sifreEkleDugme());
        this.$hariciSifreGoster.addEventListener('click', () => this.hariciSifreGosterChanged());
        this.$sifirlaDugme.addEventListener('click', () => this.sifirla());

        getAygitYonetici().platformTipi()
        .then(platform => {
            if (platform === "chrome") {
                this.$hariciSifreAndroidPaketSelectDiv.classList.add('gizle');
            } else {
                this.androidPaketDoldur();
            }
        });
    }

    androidPaketChanged() {
        this.$hariciSifreAndroidPaket.value = this.$hariciSifreAndroidPaketSelect.value;
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
            .then(async onay => {
                if (onay) {
                    let sifre = await getAygitYonetici().sifreAl();
                    popupPost(patika, {
                        kimlik: this.hariciSifreKimlik,
                        icerik: icerikSifrele({
                            platform: this.$hariciSifrePlatform.value,
                            androidPaket: this.$hariciSifreAndroidPaket.value,
                            kullaniciAdi: this.$hariciSifreKullaniciAdi.value,
                            sifre: this.$hariciSifreSifre.value,
                        }, sifre),
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

    async sifirla() {
        this.hariciSifreKimlik = undefined;
        this.$hariciSifrePlatform.value = (await getAygitYonetici().platformGetir()).platform;
        this.$hariciSifreAndroidPaket.value = null;
        this.$hariciSifreAndroidPaketSelect.selectedIndex = 0;
        this.$hariciSifreKullaniciAdi.value = null;
        this.$hariciSifreSifre.value = null;
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