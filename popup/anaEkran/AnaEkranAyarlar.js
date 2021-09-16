import OturumAc from '/popup/oturumAc/OturumAc.js';
import { icerikSifrele, kimlikHesapla, pluginSayfasiAc, backgroundMesajGonder, bilesenYukle, formDogrula, popupPost, setDepo, getDepo } from '/core/util.js';
import CodeyzerBilesen from '/core/bilesenler/CodeyzerBilesen.js';
import AnaEkran from '/popup/anaEkran/AnaEkran.js';

const template = /* html */ `
<template>
    <div class="row">
        <form ref="yeniSifreForm" autocomplete="off">
            <div class="row">
                <div class="col">
                    <div class="form-group">
                        <input type="password" ref="yeniSifre" placeholder="Yeni şifre(*)" dogrula="yeniSifreDogrula"/>
                        <dogrula ref="yeniSifreDogrula">
                            <gerekli mesaj="Şifre zorunludur"></gerekli>
                            <regex ifade="^(?=.*[A-Za-z])(?=.*\\d).{8,}$" mesaj="Şifreniz en az 8 karakterden oluşmalıdır ayrıca küçük harf, büyük harf ve sayı içermelidir"></regex>
                        </dogrula>
                    </div>
                </div>
                <div class="col">
                    <button ref="sifreYenileDugme" type="button">Şifre Yenile</button>
                </div>
            </div>
            <div class="form-group">
                <label>
                    <input type="checkbox" ref="arayuzKontrolu"/>
                    Arayüz kontrolünü etkinleştir
                </label>
            </div>
            
            <button class="mt-3" ref="gelismisButton" type="button">Gelişmiş Ayarlar</button><br>
            <button class="mt-3" ref="cikisYap" type="button">Çıkış Yap</button>
        </form>
    </div>
</template>
`;

export default class AnaEkranAyarlar extends CodeyzerBilesen {

    /** @type {AnaEkran} */ anaEkran

    /** @type {JQuery<HTMLFormElement>} */ $yeniSifreForm
    /** @type {JQuery<HTMLInputElement>} */ $yeniSifre
    /** @type {JQuery<HTMLButtonElement>} */ $sifreYenileDugme
    /** @type {JQuery<HTMLInputElement>} */ $arayuzKontrolu
    /** @type {JQuery<HTMLButtonElement>} */ $gelismisButton
    /** @type {JQuery<HTMLButtonElement>} */ $cikisYap

    /**
     * 
     * @param {string} sifre 
     * @param {string} platform 
     */
    constructor(sifre, platform) {
        super(template);
        this.sifre = sifre;
        this.platform = platform;
    }

    connectedCallback() {
        super.connectedCallback();

        this.$yeniSifreForm = this.bilesen('yeniSifreForm')
        this.$yeniSifre = this.bilesen('yeniSifre')
        this.$sifreYenileDugme = this.bilesen('sifreYenileDugme')
        this.$arayuzKontrolu = this.bilesen('arayuzKontrolu')
        this.$gelismisButton = this.bilesen('gelismisButton')
        this.$cikisYap = this.bilesen('cikisYap')
    }

    init() {
        backgroundMesajGonder({
            mesajTipi: "arayuzKontrolGetir"
        }).then(response => {
            this.$arayuzKontrolu.prop('checked', response === "true")
        });
        
        this.$sifreYenileDugme.on('click', () => this.sifreYenileDugme());
        this.$arayuzKontrolu.on('change', () => this.arayuzKontroluChange());
        this.$gelismisButton.on('click', () => this.gelismisButton());
        this.$cikisYap.on('click', () => this.cikisYap());
    }

    sifreYenileDugme() {
        if (formDogrula(this.$yeniSifreForm)) {
            let yeniSifre = /** @type {string} */ (this.$yeniSifre.val());
            let yeniKullaniciKimlik = kimlikHesapla(getDepo().kullaniciAdi, yeniSifre);
            let yeniHariciSifreListesi = this.anaEkran.hariciSifreListesi
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
                    this.anaEkran.anaEkranSifreler.sifreGetir();
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

        bilesenYukle($('anaPanel'), new OturumAc());
    }
};