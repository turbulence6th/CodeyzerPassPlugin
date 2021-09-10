import AnaEkranSifreler from '../anaEkran/AnaEkranSifreler.js';
import Ekran from '../Ekran.js';
import { popupPost, setDepo, getDepo, bilesenYukle, formDogrula, mesajGonder } from '../popup.js';

export default class AnaEkran extends Ekran {

    /** @type {AnaEkranSifreler} */ anaEkranSifreler

    /** @type {string} */ sifre
    /** @type {string} */ platform
    /** @type {[HariciSifreDesifre]} */ hariciSifreListesi = []

    /** @type {JQuery} */ $sifrePanel = $('#sifrePanel');
    /** @type {JQuery} */ $hariciSifrePlatform = $('#hariciSifrePlatform')
    /** @type {JQuery} */ $arayuzKontrolu = $('#arayuzKontrolu')
    /** @type {JQuery} */ $sifreEkleDugme = $('#sifreEkleDugme')
    /** @type {JQuery} */ $hariciSifreGoster = $('#hariciSifreGoster')
    /** @type {JQuery} */ $sifreYenileDugme = $('#sifreYenileDugme')
    /** @type {JQuery} */ $gelismisButton = $('#gelismisButton')
    /** @type {JQuery} */ $cikisYap = $('#cikisYap')
    /** @type {JQuery} */ $hariciSifreKullaniciAdi = $('#hariciSifreKullaniciAdi')
    /** @type {JQuery} */ $hariciSifreSifre = $('#hariciSifreSifre')
    /** @type {JQuery} */ $yeniSifre = $('#yeniSifre')

    static html() {
        return "/popup/anaEkran/AnaEkran.html";
    }

    init({sifre, platform}) {
        this.sifre = sifre;
        this.platform = platform;

        this.$hariciSifrePlatform.val(this.platform);

        mesajGonder({
            mesajTipi: "arayuzKontrolGetir"
        }).then(response => {
            this.$arayuzKontrolu.prop('checked', response === "true")
        })

        bilesenYukle(this.$sifrePanel, AnaEkranSifreler, {
            sifre: this.sifre, 
            platform: this.platform, 
            hariciSifreListesi: this.hariciSifreListesi
        }).then(x => this.anaEkranSifreler = x);
        
        this.$sifreEkleDugme.on('click', () => this.sifreEkleDugme());
        this.$hariciSifreGoster.on('change', () => this.hariciSifreGosterChanged());
        this.$sifreYenileDugme.on('click', () => this.sifreYenileDugme());
        this.$arayuzKontrolu.on('change', () => this.arayuzKontroluChange());
        this.$gelismisButton.on('click', () => this.gelismisButton());
        this.$cikisYap.on('click', () => this.cikisYap());
    }

    sifreEkleDugme() {
        if (formDogrula('#sifreEkleForm')) {
            popupPost("/hariciSifre/kaydet", {
                icerik: icerikSifrele({
                    platform: this.$hariciSifrePlatform.val(),
                    kullaniciAdi: this.$hariciSifreKullaniciAdi.val(),
                    sifre: this.$hariciSifreSifre.val(),
                }, this.sifre),
                kullaniciKimlik: getDepo().kullaniciKimlik
            })
            .then(data => {
                if (data.basarili) {
                    this.$hariciSifreKullaniciAdi.val(null);
                    this.$hariciSifreSifre.val(null);
                    this.anaEkranSifreler.sifreGetir();
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

    sifreYenileDugme() {
        if (formDogrula("#yeniSifreForm")) {
            let yeniSifre = this.$yeniSifre.val();
            let yeniKullaniciKimlik = kimlikHesapla(getDepo().kullaniciAdi, yeniSifre);
            let yeniHariciSifreListesi = this.hariciSifreListesi
                .map(x => ({
                    icerik: icerikSifrele(x.icerik, yeniSifre)
                }))
        
            popupPost("/hariciSifre/yenile", {
                hariciSifreListesi: yeniHariciSifreListesi,
                kullaniciKimlik: getDepo().kullaniciKimlik,
                yeniKullaniciKimlik: yeniKullaniciKimlik
            })
            .then(data => {
                if (data.basarili) {
                    this.sifre = yeniSifre;
                    this.anaEkranSifreler.sifre = yeniSifre;

                    let depo = { ...getDepo() };
                    depo.kullaniciKimlik = yeniKullaniciKimlik;
                    setDepo(depo);
    
                    chrome.runtime.sendMessage({
                        mesajTipi: "beniHatirla",
                        depo: getDepo(),
                    }, (response) => {
                        
                    });
    
                    this.$yeniSifre.val(null);
                    this.anaEkranSifreler.sifreGetir();
                }
            });
        }
    }

    arayuzKontroluChange() {
        chrome.runtime.sendMessage({
            mesajTipi: "arayuzKontrolAyarla",
            arayuzKontrol: this.checked
        });
    }

    gelismisButton() {
        window.open(chrome.runtime.getURL("/iframe/autocomplete.html"), '_blank');
    }

    cikisYap() {
        chrome.runtime.sendMessage({
            mesajTipi: "beniHatirla",
            depo: null,
        }, (response) => {
            
        });

        chrome.runtime.sendMessage({
            mesajTipi: "arayuzKontrolAyarla",
            arayuzKontrol: false
        });

        setDepo({
            sifre: null,
            kullaniciKimlik: null,
        });
        sayfaDegistir('oturumAc');
    }
};