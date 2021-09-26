import { icerikDesifreEt, alanAdiGetir, popupPost, getDepo, i18n, getAygitYonetici, mesajYaz } from '/core/util.js';
import CodeyzerBilesen from '/core/bilesenler/CodeyzerBilesen.js';
import AnaEkran from '/popup/anaEkran/AnaEkran.js';

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
                <button type="button" ref="sifreKopyala">
                    <img src="/images/kopyala_icon.png"/>
                </button>
            </a>
            <a title="${i18n('anaEkranSifreler.sifreSelectGoster.label')}">
                <button type="button" ref="sifreSelectGoster" data-durum="gizle">
                    <img src="/images/gizle_icon.png"/>
                </button>
            </a>
        </div>

        <div class="form-group d-flex flex-column mt-4"> 
            <button type="button" ref="yenile">${i18n('anaEkranSifreler.yenile.label')}</button>
        </div>
        <div class="form-group d-flex flex-column">
            <button type="button" ref="doldur">${i18n('anaEkranSifreler.doldur.label')}</button>
        </div>
        <div class="form-group d-flex flex-column">
            <button type="button" ref="sil">${i18n('anaEkranSifreler.sil.label')}</button>
        </div>
    </form>
</template>
`;

export default class AnaEkranSifreler extends CodeyzerBilesen {

    /** @type {AnaEkran} */ anaEkran

    /** @type {QRCode} */ qrcode

    /** @type {JQuery<HTMLSelectElement>} */ $platformSelect
    /** @type {JQuery<HTMLSelectElement>} */ $sifreSelect
    /** @type {JQuery<HTMLInputElement>} */ $sifreSelectSifre
    /** @type {JQuery<HTMLElement>} */ $sifreSelectGoster
    /** @type {JQuery<HTMLButtonElement>} */ $sifreKopyala
    /** @type {JQuery<HTMLButtonElement>} */ $yenile
    /** @type {JQuery<HTMLButtonElement>} */ $doldur
    /** @type {JQuery<HTMLButtonElement>} */ $sil

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
        this.$doldur = this.bilesen('doldur');
        this.$sil = this.bilesen('sil');
    }

    init() {
        if (getAygitYonetici().platformTipi() === 'mobil') {
            this.$doldur.hide();
        }
        
        this.seciciDoldur();

        this.$platformSelect.on('change', () => this.platformSelectChanged());  
        this.$sifreSelect.on('change', () => this.secileninSifreyiDoldur());
        this.$sifreSelectGoster.on('click', () => this.sifreSelectGosterChanged());
        this.$sifreKopyala.on('click', () => this.sifreKopyala());
        this.$yenile.on('click', () => this.yenileAksiyon());
        this.$doldur.on('click', () => this.doldur());
        this.$sil.on('click', () => this.sil());
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
        this.$platformSelect.empty();
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

        /** @type {Set<string>} */ let platformlar = new Set();
        this.anaEkran.hariciSifreListesi.forEach(x => {
            let alanAdi = alanAdiGetir(x.icerik.platform);
            platformlar.add(alanAdi);
        });
        if (platformlar.size === 0) {
            this.$platformSelect.prop('disabled', true);
            this.$platformSelect.append(new Option(i18n('anaEkranSifreler.platformSelect.bos')));

            this.$sifreSelect.prop('disabled', true);
        } else {
            this.$platformSelect.prop('disabled', false);
            this.$platformSelect.append(new Option(i18n('anaEkranSifreler.platformSelect.seciniz')));
            this.sifreAlaniDoldur("");

            let alanAdiPlatform = alanAdiGetir(this.anaEkran.platform);
            platformlar.forEach(eleman => {
                let option = new Option(eleman);
                let gecerliPlarformMu = alanAdiPlatform === eleman;
                if (gecerliPlarformMu) {
                    option.selected = true;
                    this.$doldur.prop('disabled', false);
                    this.sifreAlaniDoldur(eleman);
                }
                
                this.$platformSelect.append(option);
            });
        }
    }

    platformSelectChanged() {
        let secilen = /** @type {string} */ (this.$platformSelect.val());
        this.sifreAlaniDoldur(secilen);
    }

    /**
     * 
     * @param {string} platform 
     */
    sifreAlaniDoldur(platform) {
        this.$sifreSelect.empty();
        let platformSifreleri = this.anaEkran.hariciSifreListesi.filter(x => platform === alanAdiGetir(x.icerik.platform));
        if (platformSifreleri.length === 0) {
            this.$sifreSelect.prop('disabled', true);
            this.$sifreSelect.append(new Option(i18n('anaEkranSifreler.sifreSelect.bos'), ''));
            this.$sifreSelectSifre.val('');

            this.$sifreKopyala.prop('disabled', true);
            this.$doldur.prop('disabled', true);
            this.$sil.prop('disabled', true);
            this.$sifreSelectGoster.prop('disabled', true);
        } else {
            this.$sifreSelect.prop('disabled', false);
            this.$sifreKopyala.prop('disabled', false);
            this.$doldur.prop('disabled', false);
            this.$sil.prop('disabled', false);
            this.$sifreSelectGoster.prop('disabled', false);

            for (let i = 0; i < platformSifreleri.length; i++) {
                let eleman = platformSifreleri[i];
                let option = new Option(eleman.icerik.kullaniciAdi);
                let jOption = $(option);
                jOption.data('kimlik', eleman.kimlik);
                jOption.data('kullaniciAdi', eleman.icerik.kullaniciAdi);
                jOption.data('sifre', eleman.icerik.sifre);

                this.$sifreSelect.append(option);
            }

            this.secileninSifreyiDoldur();
        }
    }

    secileninSifreyiDoldur() {
        let secilen = this.$sifreSelect.find(":selected");
        this.$sifreSelectSifre.val(secilen.data('sifre'));
    }

    sifreKopyala() {
        let sifre = /** @type {string} */ (this.$sifreSelectSifre.val());
        getAygitYonetici().panoyaKopyala(sifre);
        getAygitYonetici().toastGoster(i18n('anaEkranSifreler.kopyala.click'));
    }

    sifreSelectGosterChanged() {
        if(this.$sifreSelectGoster.data('durum') == 'gizle') {
            this.$sifreSelectGoster.data('durum', 'goster');
            this.$sifreSelectGoster.html(/* html */`<img src="/images/goster_icon.png"/>`);
            this.$sifreSelectSifre.prop("type", "text");
        } else {
            this.$sifreSelectGoster.data('durum', 'gizle');
            this.$sifreSelectGoster.html(/* html */`<img src="/images/gizle_icon.png"/>`);
            this.$sifreSelectSifre.prop("type", "password");
        }
    }

    yenileAksiyon() {
        this.hariciSifreGetir(false);
    }

    doldur() {
        let seciliDeger = this.$sifreSelect.find('option:selected');
        let kullaniciAdi = seciliDeger.data('kullaniciAdi');
        let sifre = seciliDeger.data('sifre');
        
        getAygitYonetici().sekmeMesajGonder({
            mesajTipi: 'doldur',
            kullaniciAdi: {
                deger: kullaniciAdi
            },
            sifre: {
                deger: sifre
            }
        })
    }

    sil() {
        getAygitYonetici().onayDialog(i18n('codeyzer.genel.uyari'), i18n('anaEkranSifreler.sil.click'))
        .then(onay => {
            if (onay) {
                let seciliDeger = this.$sifreSelect.find('option:selected');
                let hariciSifreKimlik = seciliDeger.data('kimlik');
        
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