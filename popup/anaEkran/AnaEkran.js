import AnaEkranSifreler from '/popup/anaEkran/AnaEkranSifreler.js';
import Ekran from '/core/Ekran.js';
import OturumAc from '/popup/oturumAc/OturumAc.js';
import { popupPost, setDepo, getDepo } from '/popup/popup.js';
import { icerikSifrele, kimlikHesapla, pluginSayfasiAc, backgroundMesajGonder, bilesenYukle, formDogrula } from '/core/util.js';

export default class AnaEkran extends Ekran {

    /** @type {AnaEkranSifreler} */ anaEkranSifreler

    /** @type {string} */ sifre
    /** @type {string} */ platform
    /** @type {HariciSifreDesifre[]} */ hariciSifreListesi = []

    /** @type {JQuery<HTMLDivElement>} */ $sifrePanel = $('#sifrePanel');
    /** @type {JQuery<HTMLInputElement>} */ $hariciSifrePlatform = $('#hariciSifrePlatform')
    /** @type {JQuery<HTMLInputElement>} */ $arayuzKontrolu = $('#arayuzKontrolu')
    /** @type {JQuery<HTMLButtonElement>} */ $sifreEkleDugme = $('#sifreEkleDugme')
    /** @type {JQuery<HTMLInputElement>} */ $hariciSifreGoster = $('#hariciSifreGoster')
    /** @type {JQuery<HTMLButtonElement>} */ $sifreYenileDugme = $('#sifreYenileDugme')
    /** @type {JQuery<HTMLButtonElement>} */ $gelismisButton = $('#gelismisButton')
    /** @type {JQuery<HTMLButtonElement>} */ $cikisYap = $('#cikisYap')
    /** @type {JQuery<HTMLInputElement>} */ $hariciSifreKullaniciAdi = $('#hariciSifreKullaniciAdi')
    /** @type {JQuery<HTMLInputElement>} */ $hariciSifreSifre = $('#hariciSifreSifre')
    /** @type {JQuery<HTMLInputElement>} */ $yeniSifre = $('#yeniSifre')

    static html() {
        return "/popup/anaEkran/AnaEkran.html";
    }

    init({sifre, platform}) {
        this.sifre = sifre;
        this.platform = platform;

        this.$hariciSifrePlatform.val(this.platform);

        backgroundMesajGonder({
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
                    platform: /** @type {string} */ (this.$hariciSifrePlatform.val()),
                    kullaniciAdi: /** @type {string} */ (this.$hariciSifreKullaniciAdi.val()),
                    sifre: /** @type {string} */ (this.$hariciSifreSifre.val()),
                }, this.sifre),
                kullaniciKimlik: getDepo().kullaniciKimlik
            })
            .then(data => {
                data
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
            let yeniSifre = /** @type {string} */ (this.$yeniSifre.val());
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
    
                    backgroundMesajGonder({
                        mesajTipi: "beniHatirla",
                        params: {
                            depo: getDepo()
                        },
                    });
    
                    this.$yeniSifre.val(null);
                    this.anaEkranSifreler.sifreGetir();
                }
            });
        }
    }

    arayuzKontroluChange() {
        backgroundMesajGonder({
            mesajTipi: "arayuzKontrolAyarla",
            params: {
                arayuzKontrol: this.$arayuzKontrolu[0].checked
            }
        });
    }

    gelismisButton() {
        pluginSayfasiAc("/iframe/autocomplete/autocomplete.html")
    }

    cikisYap() {
        backgroundMesajGonder({
            mesajTipi: "beniHatirla",
            params: {
                depo: null
            },
        });

        backgroundMesajGonder({
            mesajTipi: "arayuzKontrolAyarla",
            params: {
                arayuzKontrol: false
            }
        });

        setDepo({
            kullaniciAdi: null,
            kullaniciKimlik: null
        });

        bilesenYukle(this.$anaPanel, OturumAc);
    }
};