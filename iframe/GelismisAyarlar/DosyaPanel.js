import CodeyzerBilesen from '/core/bilesenler/CodeyzerBilesen.js';
import { dosyaDesifreEt, dosyaSifrele, getAygitYonetici, getDepo, icerikSifrele, popupPost, post } from '/core/util.js';

const template = () => /* html*/ `
<template>
    <form ref="dosyaYukleForm" autocomplete="off" class="mt-1" style="height: 1000px">
        <div class="form-group">
            <label class="panel" style="cursor: pointer;">
                Dosya seç
                <input type="file" ref="dosya" dogrula="dosyaDogrula"/>
            </label>
            <codeyzer-dogrula ref="dosyaDogrula">
                <codeyzer-gerekli mesaj="Dosya giriniz"></codeyzer-gerekli>
            </codeyzer-dogrula>
        </div>
        <div class="form-group">
            Dosya adı: <a ref="dosyaAdi"></a><br/>
            Boyut: <a ref="boyut"></a><br/>
            Dosya tipi: <a ref="dosyaTipi"></a>
        </div>
        <div class="form-group d-flex flex-column mt-4">
            <button ref="yukle" type="button">Yükle</button>
        </div>

        <div class="form-group d-flex flex-column mt-4">
            <button ref="indir" type="button">İndir</button>
        </div>
    </form>
</template>
`;

export default class DosyaPanel extends CodeyzerBilesen {

    /** @type {HTMLInputElement} */ $dosya;
    /** @type {HTMLAnchorElement} */ $dosyaAdi;
    /** @type {HTMLAnchorElement} */ $boyut;
    /** @type {HTMLAnchorElement} */ $dosyaTipi;
    /** @type {HTMLButtonElement} */ $yukle;
    /** @type {HTMLButtonElement} */ $indir;

    constructor() {
        super(template);
    }

    init() {
        this.$dosya = this.bilesen('dosya');
        this.$dosyaAdi = this.bilesen('dosyaAdi');
        this.$boyut = this.bilesen('boyut');
        this.$dosyaTipi = this.bilesen('dosyaTipi');
        this.$yukle = this.bilesen('yukle');
        this.$indir = this.bilesen('indir');

        this.$dosya.addEventListener('change', () => this.dosyaSecildi());
        this.$yukle.addEventListener('click', () => this.yukleTiklandi());
        this.$indir.addEventListener('click', () => this.indirTiklandi());
    }

    dosyaSecildi() {
        let dosya = this.$dosya.files[0];
        this.$dosyaAdi.innerText = dosya.name;
        this.$boyut.innerText = this.dosyaBoyutuDaralt(dosya.size);
        this.$dosyaTipi.innerText = dosya.type;
    }

    async yukleTiklandi() {
        let sifre = await getAygitYonetici().sifreAl();
        let dosya = this.$dosya.files[0];
        let [sifreliDosya, salt] = await dosyaSifrele(dosya, sifre);
        console.log(salt);

        const formData = new FormData();
        formData.append('dosya', sifreliDosya);
        /** @type {Cevap<string>} */ let cevap = await popupPost("/hariciDosya/yukle", formData);
        if (!cevap.basarili) {
            return;
        }

        let mongoKimlik = cevap.sonuc;
        console.log(mongoKimlik);
        /** @type {HariciDosyaKaydetDTO} */ let istek = {
            mongoKimlik: mongoKimlik,
            metaVeri: icerikSifrele({
                ad: dosya.name,
                boyut: dosya.size,
                tip: dosya.type,
                salt: salt
            }, sifre),
            kullaniciKimlik: getDepo().kullaniciKimlik
        }
        popupPost("/hariciDosya/kaydet", istek);
    }

    async indirTiklandi() {
        let sifre = await getAygitYonetici().sifreAl();
        /** @type {HariciDosyaIndirDTO} */ let istek = {
            mongoKimlik: "624047072f3b1c6de47a25c6"
        }
        let response = await post("/hariciDosya/indir", istek);
        const sifreliDosya = await response.blob();
        let hamDosya = await dosyaDesifreEt(sifreliDosya, sifre, [4223490787, 1103845559])

        const fileURL = URL.createObjectURL(hamDosya);
        const link = document.createElement('a');
        link.href = fileURL;
        link.download = "FileName" + new Date() + ".txt";
        link.click();
    }

    /**
     * 
     * @param {number} boyut 
     * @returns {string}
     */
    dosyaBoyutuDaralt(boyut) {
        const virgulBasamak = 2;
        if (boyut < 1024) {
            return boyut.toFixed(virgulBasamak) + " B";
        }

        boyut /= 1024;
        if (boyut < 1024) {
            return boyut.toFixed(virgulBasamak) + " KB"; 
        }

        boyut /= 1024;
        if (boyut < 1024) {
            return boyut.toFixed(virgulBasamak) + " MB"; 
        }

        boyut /= 1024;
        if (boyut < 1024) {
            return boyut.toFixed(virgulBasamak) + " GB"; 
        }
    }
}