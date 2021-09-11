import Ekran from '/core/Ekran.js';
import { popupPost, getDepo } from '/popup/popup.js';
import { icerikDesifreEt, alanAdiGetir, seciciGetir, sekmeMesajGonder } from '/core/util.js';

export default class AnaEkranSifreler extends Ekran {

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

    /** @type {JQuery<HTMLSelectElement>} */ $platformSelect = $('#platformSelect')
    /** @type {JQuery<HTMLSelectElement>} */ $sifreSelect = $('#sifreSelect')
    /** @type {JQuery<HTMLInputElement>} */ $sifreSelectSifre = $('#sifreSelectSifre')
    /** @type {JQuery<HTMLInputElement>} */ $sifreSelectGoster = $('#sifreSelectGoster')
    /** @type {JQuery<HTMLButtonElement>} */ $doldur = $('#doldur')
    /** @type {JQuery<HTMLButtonElement>} */ $sil = $('#sil')
    /** @type {JQuery<HTMLDivElement>} */ $qrcode = $('#qrcode')

    /**
     * 
     * @returns {string}
     */
    static html() {
        return "/popup/anaEkran/AnaEkranSifreler.html";
    }

    init({sifre, platform, hariciSifreListesi}) {
        this.sifre = sifre;
        this.platform = platform;
        this.hariciSifreListesi = hariciSifreListesi;

        this.qrcode = new QRCode("qrcode", {
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
        let seciliDeger = $("#sifreSelect option:selected");
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
        let seciliDeger = $("#sifreSelect option:selected");
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