import { alanAdiGetir, popupPost, getDepo, i18n, getAygitYonetici, hariciSifreListeDesifreEt } from '/core/util.js';
import CodeyzerBilesen from '/core/bilesenler/CodeyzerBilesen.js';
import AnaEkran from '/popup/anaEkran/AnaEkran.js';
import CodeyzerImageButton from '/core/bilesenler/CodeyzerImageButton.js';

const template = () => /* html */ `
<template>
    <form autocomplete="off">
        <div class="form-group">
            <select ref="aygitSelect">
                <option value="web" >Web</option>
                <option value="android">Android</option>
            </select>  
        </div>
        <div class="form-group">
            <select ref="platformSelect">
            
            </select>  
        </div>
        <div class="form-group">
            <select ref="sifreSelect">
            
            </select>  
        </div>
        <div class="form-group">
            <input type="password" ref="sifreSelectSifre" class="input-button" placeholder="${i18n('anaEkranSifreler.sifreSelectSifre.bos')}" disabled/>  
            <a style="margin-left:-100px">
                <codeyzer-image-button ref="sifreKopyala" title="${i18n('anaEkranSifreler.kopyala.title')}" img="/images/kopyala_icon.png"/>
            </a>
            <a>
                <codeyzer-image-button ref="sifreSelectGoster" title="${i18n('anaEkranSifreler.sifreSelectGoster.title')}" img="/images/gizle_icon.png" data-durum="gizle"/>
            </a>
        </div>

        <div class="form-group d-flex flex-column mt-4">
            <button type="button" ref="doldur">${i18n('anaEkranSifreler.doldur.label')}</button>
        </div>
        <div class="form-group row">
            <div class="col-6 d-flex flex-column">
                <button type="button" ref="guncelle">${i18n('anaEkranSifreler.guncelle.label')}</button>
            </div>
            <div class="col-6 d-flex flex-column">
                <button type="button" ref="sil">${i18n('anaEkranSifreler.sil.label')}</button>
            </div>
        </div>
        <div class="form-group d-flex flex-column">
            
        </div>
        <div class="form-group" style="float:right"> 
            <a>
                <codeyzer-image-button title="${i18n('anaEkranSifreler.rehber.title')}" ref="rehber" img="/images/rehber_icon.png"/>
            </a>
            <a>
                <codeyzer-image-button title="${i18n('anaEkranSifreler.yenile.title')}" ref="yenile" img="/images/yenile_icon.png"/>
            </a>
        </div>
    </form>
</template>
`;

export default class AnaEkranSifreler extends CodeyzerBilesen {

    /** @type {AnaEkran} */ anaEkran

    /** @type {HTMLSelectElement} */ $aygitSelect
    /** @type {HTMLSelectElement} */ $platformSelect
    /** @type {HTMLSelectElement} */ $sifreSelect
    /** @type {HTMLInputElement} */ $sifreSelectSifre
    /** @type {CodeyzerImageButton} */ $sifreSelectGoster
    /** @type {CodeyzerImageButton} */ $sifreKopyala
    /** @type {HTMLButtonElement} */ $doldur
    /** @type {HTMLButtonElement} */ $guncelle
    /** @type {HTMLButtonElement} */ $sil
    /** @type {CodeyzerImageButton} */ $rehber
    /** @type {CodeyzerImageButton} */ $yenile

    /** @type {HariciSifreDesifre[]} */ hariciSifreListesi = []
    /** @type {Map<string, HariciSifreIcerik>} */ hariciSifreIcerikMap

    constructor() {
        super(template);
    }

    init() {
        this.anaEkran = this.ebeveyn(AnaEkran);
        this.$aygitSelect = this.bilesen('aygitSelect');
        this.$platformSelect = this.bilesen('platformSelect');
        this.$sifreSelect = this.bilesen('sifreSelect');
        this.$sifreSelectSifre = this.bilesen('sifreSelectSifre');
        this.$sifreSelectGoster = this.bilesen('sifreSelectGoster');
        this.$sifreKopyala = this.bilesen('sifreKopyala');
        this.$guncelle = this.bilesen('guncelle');
        this.$doldur = this.bilesen('doldur');
        this.$sil = this.bilesen('sil');
        this.$yenile = this.bilesen('yenile');
        this.$rehber = this.bilesen('rehber');

        getAygitYonetici().platformTipi()
        .then(platform => {
            if (['chrome', 'web'].includes(platform)) {
                this.$aygitSelect.value = 'web';
            } else if (['android'].includes(platform)) {
                this.$aygitSelect.value = 'android';
            }

            this.seciciDoldur();
        });
        
        this.$aygitSelect.addEventListener('change', () => this.aygitSelectChanged());
        this.$platformSelect.addEventListener('change', () => this.platformSelectChanged());  
        this.$sifreSelect.addEventListener('change', () => this.secileninSifreyiDoldur());
        this.$sifreSelectGoster.addEventListener('click', () => this.sifreSelectGosterChanged());
        this.$sifreKopyala.addEventListener('click', () => this.sifreKopyala());
        this.$doldur.addEventListener('click', () => this.doldur());
        this.$guncelle.addEventListener('click', () => this.guncelle());
        this.$sil.addEventListener('click', () => this.sil());
        this.$rehber.addEventListener('click', () => this.anaEkran.rehber(true));
        this.$yenile.addEventListener('click', () => this.yenileAksiyon());
    }

    seciciDoldur() {
        this.hariciSifreGetir(true);
    }

    /**
     * 
     * @param {boolean} cache 
     */
    hariciSifreGetir(cache) {
        getAygitYonetici().hariciSifreDTOListesiGetir()
        .then((/** @type {HariciSifreDTO[]} */ response) => {
            if (!cache || response === null) {
                popupPost("/hariciSifre/getir", {
                    kullaniciKimlik: getDepo().kullaniciKimlik
                })
                .then((/** @type {Cevap<HariciSifreDTO[]>} */ data) => {
                    if (data.basarili) {
                        getAygitYonetici().hariciSifreDTOListesiAyarla(data.sonuc);
                        this.sifreDropdownDoldur(data.sonuc);
                    }
                });    
            } else {
                this.sifreDropdownDoldur(response);
            }
        });
    }

    /**
     *
     * @param {HariciSifreDTO[]} hariciSifreDTOListesi 
     */
    async sifreDropdownDoldur(hariciSifreDTOListesi) {
        this.$platformSelect.length = 0;
        this.hariciSifreListesi = await hariciSifreListeDesifreEt(hariciSifreDTOListesi);

        getAygitYonetici().mobilSifreListesiEkle(hariciSifreDTOListesi.map(x => x.icerik));

        await this.aygitSelectChanged();
    }

    async aygitSelectChanged() {
        /** @type {Set<string>} */ let platformlar = new Set();
        this.$platformSelect.length = 0;

        if (this.$aygitSelect.selectedOptions[0].value === 'web') {
            this.hariciSifreListesi
            .map(x => alanAdiGetir(x.icerik.platform))
            .filter(x => x)
            .forEach(x => platformlar.add(x));
        } else if (this.$aygitSelect.selectedOptions[0].value === 'android') {
            this.hariciSifreListesi
            .map(x => x.icerik.androidPaket)
            .filter(x => x)
            .forEach(x => platformlar.add(x));
        }

        if (platformlar.size === 0) {
            this.$platformSelect.disabled = true;
            this.$platformSelect.append(new Option(i18n('anaEkranSifreler.platformSelect.bos')));

            this.$sifreSelect.disabled = true;
        } else {
            this.$platformSelect.disabled = false;
            this.$platformSelect.append(new Option(i18n('anaEkranSifreler.platformSelect.seciniz')));
            this.sifreAlaniDoldur("");

            let alanAdiPlatform = alanAdiGetir((await getAygitYonetici().platformGetir()).platform);
            platformlar.forEach(eleman => {
                let option = new Option(eleman);
                let gecerliPlarformMu = alanAdiPlatform === eleman;
                if (gecerliPlarformMu) {
                    option.selected = true;
                    this.$doldur.disabled = false;
                    this.sifreAlaniDoldur(eleman);
                }
                
                this.$platformSelect.append(option);
            });
        }
    }

    platformSelectChanged() {
        let secilen = /** @type {string} */ (this.$platformSelect.value);
        this.sifreAlaniDoldur(secilen);
    }

    /**
     * 
     * @param {string} platform 
     */
    sifreAlaniDoldur(platform) {
        this.$sifreSelect.length = 0;
        /** @type {HariciSifreDesifre[]} */ let platformSifreleri;

        let selectedOption = this.$aygitSelect.selectedOptions[0];
        if (selectedOption.value === 'web') {
            platformSifreleri = this.hariciSifreListesi.filter(x => alanAdiGetir(x.icerik.platform) && platform === alanAdiGetir(x.icerik.platform));
        } else if (selectedOption.value === 'android') {
            platformSifreleri = this.hariciSifreListesi.filter(x => x.icerik.androidPaket && platform === x.icerik.androidPaket);
        }

        if (platformSifreleri.length === 0) {
            this.$sifreSelect.disabled = true;
            this.$sifreSelect.append(new Option(i18n('anaEkranSifreler.sifreSelect.bos'), ''));
            this.$sifreSelectSifre.value = '';

            this.$sifreKopyala.$button.disabled = true;
            this.$doldur.disabled = true;
            this.$guncelle.disabled = true;
            this.$sil.disabled = true;
            this.$sifreSelectGoster.$button.disabled = true;
        } else {
            this.$sifreSelect.disabled = false;
            this.$sifreKopyala.$button.disabled = false;
            this.$doldur.disabled = false;
            this.$guncelle.disabled = false;
            this.$sil.disabled = false;
            this.$sifreSelectGoster.$button.disabled = false;

            for (let i = 0; i < platformSifreleri.length; i++) {
                let eleman = platformSifreleri[i];
                let option = new Option(eleman.icerik.kullaniciAdi);
                option.setAttribute('data-kimlik', eleman.kimlik);
                this.$sifreSelect.append(option);
            }

            this.hariciSifreIcerikMap = new Map(this.hariciSifreListesi.map(x => [x.kimlik, x.icerik]));
            this.secileninSifreyiDoldur();
        }
    }

    secileninSifreyiDoldur() {
        let secilen = this.$sifreSelect.selectedOptions[0];
        let kimlik = secilen.getAttribute('data-kimlik');
        let hariciSifreIcerik = this.hariciSifreIcerikMap.get(kimlik);
        this.$sifreSelectSifre.value = hariciSifreIcerik.sifre;
    }

    sifreKopyala() {
        let sifre = this.$sifreSelectSifre.value;
        getAygitYonetici().panoyaKopyala(sifre);
        getAygitYonetici().toastGoster(i18n('anaEkranSifreler.kopyala.click'));
    }

    sifreSelectGosterChanged() {
        if(this.$sifreSelectGoster.getAttribute('data-durum') == 'gizle') {
            this.$sifreSelectGoster.setAttribute('data-durum', 'goster');
            this.$sifreSelectGoster.setAttribute('img', '/images/goster_icon.png');
            this.$sifreSelectSifre.type = 'text';
        } else {
            this.$sifreSelectGoster.setAttribute('data-durum', 'gizle');
            this.$sifreSelectGoster.setAttribute('img', '/images/gizle_icon.png');
            this.$sifreSelectSifre.type = "password";
        }
    }

    yenileAksiyon() {
        this.hariciSifreGetir(false);
    }

    doldur() {
        let seciliDeger = this.$sifreSelect.selectedOptions[0];
        let kimlik = seciliDeger.getAttribute('data-kimlik');
        let hariciSifreIcerik = this.hariciSifreIcerikMap.get(kimlik);

        let kullaniciAdi = hariciSifreIcerik.kullaniciAdi;
        let sifre = hariciSifreIcerik.sifre;
        
        getAygitYonetici().sifreDoldur(kullaniciAdi, sifre);
    }

    guncelle() {
        let seciliDeger = this.$sifreSelect.selectedOptions[0];

        let anaEkranSifreEkle = this.anaEkran.anaEkranSifreEkle;

        let kimlik = seciliDeger.getAttribute('data-kimlik');
        anaEkranSifreEkle.hariciSifreKimlik = kimlik;
        let hariciSifreIcerik = this.hariciSifreIcerikMap.get(kimlik);

        anaEkranSifreEkle.$hariciSifrePlatform.value = hariciSifreIcerik.platform;
        if (hariciSifreIcerik.androidPaket) {
            anaEkranSifreEkle.$hariciSifreAndroidPaket.value = hariciSifreIcerik.androidPaket;
            anaEkranSifreEkle.$hariciSifreAndroidPaketSelect.value = hariciSifreIcerik.androidPaket;
        } else {
            anaEkranSifreEkle.$hariciSifreAndroidPaket.value = null;
            anaEkranSifreEkle.$hariciSifreAndroidPaketSelect.value = null;
        }
        
        anaEkranSifreEkle.$hariciSifreKullaniciAdi.value = hariciSifreIcerik.kullaniciAdi;
        anaEkranSifreEkle.$hariciSifreSifre.value = hariciSifreIcerik.sifre;
        this.anaEkran.kaydir('sag');
    }

    sil() {
        getAygitYonetici().onayDialog(i18n('codeyzer.genel.uyari'), i18n('anaEkranSifreler.sil.click'))
        .then(onay => {
            if (onay) {
                let seciliDeger = this.$sifreSelect.selectedOptions[0];
                let hariciSifreKimlik = seciliDeger.getAttribute('data-kimlik');
        
                popupPost("/hariciSifre/sil", {
                    kimlik: hariciSifreKimlik,
                    kullaniciKimlik: getDepo().kullaniciKimlik,
                })
                .then(data => {
                    if (data.basarili) {
                        this.hariciSifreGetir(false);
                    }
                });
            }
        });
    }
}