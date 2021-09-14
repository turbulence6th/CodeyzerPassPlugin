import { popupPost, getDepo } from '/popup/popup.js';
import { icerikDesifreEt, alanAdiGetir, seciciGetir, sekmeMesajGonder } from '/core/util.js';
import CodeyzerBilesen from '/core/bilesenler/CodeyzerBilesen.js';

const template = /* html */ `
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
        </div>
        <div class="form-group">
            
        </div>

        <div class="form-group">
            <div class="row" style="height: 84px;">
                <div class="col-8">
                    <label>
                        <input type="checkbox" ref="sifreSelectGoster"/>
                        Şifreyi göster
                    </label>

                    <button type="button" ref="doldur">Doldur</button>
                    <button type="button" ref="sil">Sil</button>
                </div>
                <div class="col-4">
                    <div ref="qrcode" style="float: right">

                    </div>
                </div>
            </div>
            
        </div>

        <div class="form-group">
            
        </div>
    </form>
</template>
`;

export default class AnaEkranSifreler extends CodeyzerBilesen {

    /** @type {string} */ sifre
    /** @type {string} */ platform
    /** @type {HariciSifreDesifre[]} */ hariciSifreListesi

    /** @type {Secici} */ secici = {
        platform: null,
        regex: null,
        kullaniciAdiSecici: null,
        sifreSecici: null
    }
    /** @type {QRCode} */ qrcode

    /** @type {JQuery<HTMLSelectElement>} */ $platformSelect
    /** @type {JQuery<HTMLSelectElement>} */ $sifreSelect
    /** @type {JQuery<HTMLInputElement>} */ $sifreSelectSifre
    /** @type {JQuery<HTMLInputElement>} */ $sifreSelectGoster
    /** @type {JQuery<HTMLButtonElement>} */ $doldur
    /** @type {JQuery<HTMLButtonElement>} */ $sil
    /** @type {JQuery<HTMLDivElement>} */ $qrcode

    constructor() {
        super(template);
    }

    connectedCallback() {
        super.connectedCallback();

        this.$platformSelect = this.bilesenGetir('platformSelect')
        this.$sifreSelect = this.bilesenGetir('sifreSelect')
        this.$sifreSelectSifre = this.bilesenGetir('sifreSelectSifre')
        this.$sifreSelectGoster = this.bilesenGetir('sifreSelectGoster')
        this.$doldur = this.bilesenGetir('doldur')
        this.$sil = this.bilesenGetir('sil')
        this.$qrcode = this.bilesenGetir('qrcode')

        this.init();
    }

    init() {
        this.qrcode = new QRCode(this.$qrcode[0], {
            width: 80,
            height: 80,
            colorDark : "#000000",
            colorLight : "#ff7f2a",
            correctLevel : QRCode.CorrectLevel.H
        });

        this.$qrcode.hide();    
        this.seciciDoldur();

        this.$platformSelect.on('change', () => this.platformSelectChanged());  
        this.$sifreSelect.on('change', () => this.secileninSifreyiDoldur());
        this.$sifreSelectGoster.on('change', () => this.sifreSelectGosterChanged());
        this.$doldur.on('click', () => this.doldur());
        this.$sil.on('click', () => this.sil());
    }

    seciciDoldur() {
        let data = seciciGetir(this.platform);

        if (data) {
            this.secici.regex = data.regex;
            this.secici.kullaniciAdiSecici = data.kullaniciAdiSecici;
            this.secici.sifreSecici = data.sifreSecici;
        } 

        this.sifreGetir();
    }

    sifreGetir() {
        this.$qrcode.hide();
        popupPost("/hariciSifre/getir", {
            kullaniciKimlik: getDepo().kullaniciKimlik
        })
        .then((/** @type {Cevap<HariciSifreDTO[]>} */ data) => {
            if (data.basarili) {
                this.$platformSelect.empty();
                this.hariciSifreListesi.length = 0;
                data.sonuc
                    .map((/** @type {HariciSifreDTO} */ x) => {
                        /** @type {HariciSifreIcerik} */ let icerik = icerikDesifreEt(x.icerik, this.sifre);
                        return {
                            kimlik: x.kimlik,
                            icerik: icerik,
                            alanAdi: alanAdiGetir(icerik.platform)
                        };
                    })
                    .sort((x, y) => x.alanAdi.localeCompare(y.alanAdi))
                    .forEach(x => this.hariciSifreListesi.push(x));

                /** @type {Set<string>} */ let platformlar = new Set();
                this.hariciSifreListesi.forEach(x => {
                    let alanAdi = alanAdiGetir(x.icerik.platform);
                    platformlar.add(alanAdi);
                });
                if (platformlar.size === 0) {
                    this.$platformSelect.prop('disabled', true);
                } else {
                    this.$platformSelect.prop('disabled', false);
                    this.$platformSelect.append(new Option("Platform seçiniz"));
                    this.sifreAlaniDoldur("");

                    let alanAdiPlatform = alanAdiGetir(this.platform);
                    platformlar.forEach(eleman => {
                        let option = new Option(eleman);
                        let gecerliPlarformMu = this.secici.regex?.test(eleman) || alanAdiPlatform === eleman;
                        if (gecerliPlarformMu) {
                            option.selected = true;
                            this.$doldur.prop('disabled', false);
                            this.sifreAlaniDoldur(eleman);
                        }
                        
                        this.$platformSelect.append(option);
                    });
                }

                
            }
        });    
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
        let platformSifreleri = this.hariciSifreListesi.filter(x => platform === alanAdiGetir(x.icerik.platform));
        if (platformSifreleri.length === 0) {
            this.$sifreSelect.prop('disabled', true);
            this.$sifreSelect.append(new Option('Şifre bulunamadı', ''));
            this.$sifreSelectSifre.val('');

            this.$doldur.prop('disabled', true);
            this.$sil.prop('disabled', true);
            this.$sifreSelectGoster.prop('disabled', true);
        } else {
            this.$sifreSelect.prop('disabled', false);
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
        // @ts-ignore
        this.qrcode.clear();
        // @ts-ignore
        this.qrcode.makeCode(this.$sifreSelectSifre.val());
    }

    sifreSelectGosterChanged() {
        if(this.$sifreSelectGoster.prop('checked')) {
            this.$sifreSelectSifre.prop("type", "text");
            this.$qrcode.show();
        } else {
            this.$sifreSelectSifre.prop("type", "password");
            this.$qrcode.hide();
        }
    }

    doldur() {
        let seciliDeger = this.$sifreSelect.find('option:selected');
        let kullaniciAdi = seciliDeger.data('kullaniciAdi');
        let sifre = seciliDeger.data('sifre');
        
        sekmeMesajGonder({
            mesajTipi: 'doldur',
            kullaniciAdi: {
                secici: this.secici.kullaniciAdiSecici,
                deger: kullaniciAdi
            },
            sifre: {
                secici: this.secici.sifreSecici,
                deger: sifre
            }
        })
    }

    sil() {
        let seciliDeger = this.$sifreSelect.find('option:selected');
        let hariciSifreKimlik = seciliDeger.data('kimlik');

        popupPost("/hariciSifre/sil", {
            kimlik: hariciSifreKimlik,
            kullaniciKimlik: getDepo().kullaniciKimlik,
        })
        .then(data => {
            if (data.basarili) {
                this.sifreGetir();
            }
        });
    }
}