import OturumAc from '/popup/oturumAc/OturumAc.js';
import { icerikSifrele, kimlikHesapla, pluginSayfasiAc, backgroundMesajGonder, bilesenYukle, formDogrula, popupPost, setDepo, getDepo, i18n, platformTipi } from '/core/util.js';
import CodeyzerBilesen from '/core/bilesenler/CodeyzerBilesen.js';
import AnaEkran from '/popup/anaEkran/AnaEkran.js';

const template = () => /* html */ `
<template>
    <form ref="yeniSifreForm" autocomplete="off">
       
        <div class="form-group">
            <input type="password" ref="yeniSifre" placeholder="${i18n('anaEkranAyarlar.yeniSifre.label')}" dogrula="yeniSifreDogrula"/>
            <dogrula ref="yeniSifreDogrula">
                <gerekli mesaj="${i18n('anaEkranAyarlar.yeniSifre.hata.gerekli')}"></gerekli>
                <regex ifade="^(?=.*[A-Za-z])(?=.*\\d).{8,}$" mesaj="${i18n('anaEkranAyarlar.yeniSifre.hata.regex')}"></regex>
            </dogrula>
        </div>
            
        <div class="form-group d-flex flex-column">
            <button ref="sifreYenileDugme" type="button">${i18n('anaEkranAyarlar.sifreYenile.label')}</button>
        </div>
        
        <div class="form-group">
            <label ref="arayuzKontroluLabel">
                <input type="checkbox" ref="arayuzKontrolu"/>
                ${i18n('anaEkranAyarlar.arayuzKontrolu.label')}
            </label>
        </div>
        
        <div class="form-group d-flex flex-column">
            <button ref="gelismisButton" type="button">${i18n('anaEkranAyarlar.gelismisAyarlar.label')}</button>
        </div>
        <div class="form-group d-flex flex-column">
            <button ref="cikisYap" type="button">${i18n('anaEkranAyarlar.cikisYap.label')}</button>
        </div>
    </form>
</template>
`;

export default class AnaEkranAyarlar extends CodeyzerBilesen {

    /** @type {AnaEkran} */ anaEkran

    /** @type {JQuery<HTMLFormElement>} */ $yeniSifreForm
    /** @type {JQuery<HTMLInputElement>} */ $yeniSifre
    /** @type {JQuery<HTMLButtonElement>} */ $sifreYenileDugme
    /** @type {JQuery<HTMLLabelElement>} */ $arayuzKontroluLabel
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
        this.$arayuzKontroluLabel = this.bilesen('arayuzKontroluLabel');
        this.$arayuzKontrolu = this.bilesen('arayuzKontrolu')
        this.$gelismisButton = this.bilesen('gelismisButton')
        this.$cikisYap = this.bilesen('cikisYap')
    }

    init() {
        if (platformTipi() === 'mobil') {
            this.$yeniSifre.hide(); 
            this.$sifreYenileDugme.hide();
            this.$arayuzKontroluLabel.hide();
            this.$gelismisButton.hide();
        }

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
                    this.anaEkran.anaEkranSifreler.hariciSifreGetir();
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

        backgroundMesajGonder({
            mesajTipi: "hariciSifreDTOListesiAyarla",
            params: {
                hariciSifreDTOListesi: null
            }
        })

        setDepo({
            kullaniciAdi: null,
            kullaniciKimlik: null
        });

        bilesenYukle($('#anaPanel'), new OturumAc());
    }
};