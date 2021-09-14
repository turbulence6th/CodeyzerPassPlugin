import AnaEkranSifreler from '/popup/anaEkran/AnaEkranSifreler.js';
import OturumAc from '/popup/oturumAc/OturumAc.js';
import { popupPost, setDepo, getDepo } from '/popup/popup.js';
import { icerikSifrele, kimlikHesapla, pluginSayfasiAc, backgroundMesajGonder, bilesenYukle, formDogrula } from '/core/util.js';
import CodeyzerBilesen from '/core/bilesenler/CodeyzerBilesen.js';
import AnaEkranSifreEkle from '/popup/anaEkran/AnaEkranSifreEkle.js';

const template = /* html */ `
<template>
    <ul class="nav nav-tabs" role="tablist">
        <li class="nav-item">
            <a class="nav-link active" data-toggle="tab" href="[ref=sifrePanel]">Şifreler</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" data-toggle="tab" href="[ref=sifreEkle]">Şifre Ekle</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" data-toggle="tab" href="[ref=ayarlar]">Ayarlar</a>
        </li>
    </ul>

    <div class="tab-content">
        <div ref="sifrePanel" class="container tab-pane active">
            <ana-ekran-sifreler ref="anaEkranSifreler"/>
        </div>
        <div ref="sifreEkle" class="container tab-pane fade">
            <ana-ekran-sifre-ekle ref="anaEkranSifreEkle"/>
        </div>
        <div ref="ayarlar" class="container tab-pane fade">
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
        </div>
    </div>
</template>
`;

export default class AnaEkran extends CodeyzerBilesen {

    /** @type {string} */ sifre
    /** @type {string} */ platform
    /** @type {HariciSifreDesifre[]} */ hariciSifreListesi = []

    /** @type {AnaEkranSifreler} */ anaEkranSifreler
    /** @type {AnaEkranSifreEkle} */ anaEkranSifreEkle

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

        this.anaEkranSifreler = /** @type {AnaEkranSifreler} */ (this.bilesen('anaEkranSifreler')[0]);
        this.anaEkranSifreler.anaEkran = this;

        this.anaEkranSifreEkle = /** @type {AnaEkranSifreEkle} */ (this.bilesen('anaEkranSifreEkle')[0]);
        this.anaEkranSifreEkle.anaEkran = this;

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

        this.anaEkranSifreler.init();
        this.anaEkranSifreEkle.init();
    }

    sifreYenileDugme() {
        if (formDogrula(this.$yeniSifreForm)) {
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

        bilesenYukle($('anaPanel'), new OturumAc());
    }
};