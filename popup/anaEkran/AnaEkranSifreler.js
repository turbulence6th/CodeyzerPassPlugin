import { icerikDesifreEt, alanAdiGetir, popupPost, getDepo, i18n, getAygitYonetici, mesajYaz } from '/core/util.js';
import CodeyzerBilesen from '/core/bilesenler/CodeyzerBilesen.js';
import AnaEkran from '/popup/anaEkran/AnaEkran.js';
import CodeyzerImageButton from '/core/bilesenler/CodeyzerImageButton.js';
import mouseSuruklemeEvent from '/core/MouseSuruklemeEvent.js';

const template = () => /* html */ `
<template>
    <form autocomplete="off">

        <div class="form-group">
            <select ref="platformSelect">
            
            </select>  
        </div>
        <div class="form-group">
            <select ref="sifreSelect">
            
            </select>  
        </div>
        <div class="form-group">
            <input type="password" ref="sifreSelectSifre" disabled/>  
            <a title="${i18n('anaEkranSifreler.kopyala.title')}" style="margin-left:-100px">
                <codeyzer-image-button ref="sifreKopyala" img="/images/kopyala_icon.png"/>
            </a>
            <a title="${i18n('anaEkranSifreler.sifreSelectGoster.label')}">
                <codeyzer-image-button ref="sifreSelectGoster" img="/images/gizle_icon.png" data-durum="gizle"/>
            </a>
        </div>

        <div class="form-group d-flex flex-column mt-4">
            <button type="button" ref="doldur">${i18n('anaEkranSifreler.doldur.label')}</button>
        </div>
        <div class="form-group d-flex flex-column">
            <button type="button" ref="guncelle">Güncelle</button>
        </div>
        <div class="form-group d-flex flex-column">
            <button type="button" ref="sil">${i18n('anaEkranSifreler.sil.label')}</button>
        </div>
        <div class="form-group" style="float:right"> 
            <codeyzer-image-button ref="yenile" img="/images/yenile_icon.png"/>
        </div>
    </form>
</template>
`;

export default class AnaEkranSifreler extends CodeyzerBilesen {

    /** @type {AnaEkran} */ anaEkran

    /** @type {HTMLSelectElement} */ $platformSelect
    /** @type {HTMLSelectElement} */ $sifreSelect
    /** @type {HTMLInputElement} */ $sifreSelectSifre
    /** @type {CodeyzerImageButton} */ $sifreSelectGoster
    /** @type {CodeyzerImageButton} */ $sifreKopyala
    /** @type {CodeyzerImageButton} */ $yenile
    /** @type {HTMLButtonElement} */ $doldur
    /** @type {HTMLButtonElement} */ $guncelle
    /** @type {HTMLButtonElement} */ $sil

    constructor() {
        super(template);
    }

    connectedCallback() {
        super.connectedCallback();

        this.$platformSelect = this.bilesen('platformSelect');
        this.$sifreSelect = this.bilesen('sifreSelect');
        this.$sifreSelectSifre = this.bilesen('sifreSelectSifre');
        this.$sifreSelectGoster = this.bilesen('sifreSelectGoster');
        this.$sifreKopyala = this.bilesen('sifreKopyala');
        this.$yenile = this.bilesen('yenile');
        this.$guncelle = this.bilesen('guncelle');
        this.$doldur = this.bilesen('doldur');
        this.$sil = this.bilesen('sil');
    }

    init() {
        getAygitYonetici().platformTipi()
        .then(platform => {
            if (['android', 'ios', 'web'].includes(platform)) {
                this.$doldur.hidden = true;
                mouseSuruklemeEvent(document.body, yon => {
                    if (yon === 'asagi') {
                        this.yenileAksiyon();
                    }
                }, 150);
            }
        });
        
        this.seciciDoldur();

        this.$platformSelect.addEventListener('change', () => this.platformSelectChanged());  
        this.$sifreSelect.addEventListener('change', () => this.secileninSifreyiDoldur());
        this.$sifreSelectGoster.addEventListener('click', () => this.sifreSelectGosterChanged());
        this.$sifreKopyala.addEventListener('click', () => this.sifreKopyala());
        this.$yenile.addEventListener('click', () => this.yenileAksiyon());
        this.$doldur.addEventListener('click', () => this.doldur());
        this.$guncelle.addEventListener('click', () => this.guncelle());
        this.$sil.addEventListener('click', () => this.sil());
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
    sifreDropdownDoldur(hariciSifreDTOListesi) {
        this.$platformSelect.length = 0;
        this.anaEkran.hariciSifreListesi.length = 0;
        hariciSifreDTOListesi
            .map((/** @type {HariciSifreDTO} */ x) => {
                /** @type {HariciSifreIcerik} */ let icerik = icerikDesifreEt(x.icerik, this.anaEkran.sifre);
                return {
                    kimlik: x.kimlik,
                    icerik: icerik,
                    alanAdi: alanAdiGetir(icerik.platform)
                };
            })
            .sort((x, y) => x.alanAdi.localeCompare(y.alanAdi))
            .forEach(x => this.anaEkran.hariciSifreListesi.push(x));

        getAygitYonetici().mobilSifreListesiEkle(this.anaEkran.hariciSifreListesi);

        /** @type {Set<string>} */ let platformlar = new Set();
        this.anaEkran.hariciSifreListesi.forEach(x => {
            let alanAdi = alanAdiGetir(x.icerik.platform);
            platformlar.add(alanAdi);
        });
        if (platformlar.size === 0) {
            this.$platformSelect.disabled = true;
            this.$platformSelect.append(new Option(i18n('anaEkranSifreler.platformSelect.bos')));

            this.$sifreSelect.disabled = true;
        } else {
            this.$platformSelect.disabled = false;
            this.$platformSelect.append(new Option(i18n('anaEkranSifreler.platformSelect.seciniz')));
            this.sifreAlaniDoldur("");

            let alanAdiPlatform = alanAdiGetir(this.anaEkran.platform);
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
        let platformSifreleri = this.anaEkran.hariciSifreListesi.filter(x => platform === alanAdiGetir(x.icerik.platform));
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
                option.setAttribute('data-platform', eleman.icerik.platform);
                if (eleman.icerik.androidPaket) {
                    option.setAttribute('data-androidPaket', eleman.icerik.androidPaket);
                }
                option.setAttribute('data-kullaniciAdi', eleman.icerik.kullaniciAdi);
                option.setAttribute('data-sifre', eleman.icerik.sifre);

                this.$sifreSelect.append(option);
            }

            this.secileninSifreyiDoldur();
        }
    }

    secileninSifreyiDoldur() {
        let secilen = this.$sifreSelect.selectedOptions[0];
        this.$sifreSelectSifre.value = secilen.getAttribute('data-sifre');
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
        let kullaniciAdi = seciliDeger.getAttribute('data-kullaniciAdi');
        let sifre = seciliDeger.getAttribute('data-sifre');
        
        getAygitYonetici().sifreDoldur(kullaniciAdi, sifre);
    }

    guncelle() {
        let seciliDeger = this.$sifreSelect.selectedOptions[0];

        let anaEkranSifreEkle = this.anaEkran.anaEkranSifreEkle;

        anaEkranSifreEkle.hariciSifreKimlik = seciliDeger.getAttribute('data-kimlik');
        anaEkranSifreEkle.$hariciSifrePlatform.value = seciliDeger.getAttribute('data-platform');
        anaEkranSifreEkle.$hariciSifreAndroidPaket.value = seciliDeger.getAttribute('data-androidPaket');
        anaEkranSifreEkle.$hariciSifreKullaniciAdi.value = seciliDeger.getAttribute('data-kullaniciAdi');
        anaEkranSifreEkle.$hariciSifreSifre.value = seciliDeger.getAttribute('data-sifre');
        anaEkranSifreEkle.hariciSifrePlatformChanged();
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