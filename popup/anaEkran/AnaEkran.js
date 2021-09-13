import AnaEkranSifreler from '/popup/anaEkran/AnaEkranSifreler.js';
import OturumAc from '/popup/oturumAc/OturumAc.js';
import { popupPost, setDepo, getDepo } from '/popup/popup.js';
import { icerikSifrele, kimlikHesapla, pluginSayfasiAc, backgroundMesajGonder, bilesenYukle, formDogrula } from '/core/util.js';
import CodeyzerBilesen from '/core/bilesenler/CodeyzerBilesen.js';

const template = /* html */ `
<template>
    <ul class="nav nav-tabs" role="tablist">
        <li class="nav-item">
            <a class="nav-link active" data-toggle="tab" href="#sifrePanel">Şifreler</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" data-toggle="tab" href="#sifreEkle">Şifre Ekle</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" data-toggle="tab" href="#ayarlar">Ayarlar</a>
        </li>
    </ul>

    <div class="tab-content">
        <div id="sifrePanel" class="container tab-pane active">
            
        </div>
        <div id="sifreEkle" class="container tab-pane fade">
            <form id="sifreEkleForm" autocomplete="off">
                <div class="form-group">
                    <input type="text" id="hariciSifrePlatform" placeholder="Platform(*)" dogrula="hariciSifrePlatformDogrula" disabled>
                    <dogrula id="hariciSifrePlatformDogrula">
                        <gerekli mesaj="Platform zorunludur"></gerekli>
                    </dogrula>
                </div>
                <div class="form-group">
                    <input type="text" id="hariciSifreKullaniciAdi" placeholder="Kullanıcı adı(*)" dogrula="hariciSifreKullaniciAdiDogrula">
                    <dogrula id="hariciSifreKullaniciAdiDogrula">
                        <gerekli mesaj="Kullanıcı adı zorunludur"></gerekli>
                    </dogrula>
                </div>
                <div class="form-group">
                    <input type="password" id="hariciSifreSifre" placeholder="Şifre(*)" dogrula="hariciSifreSifreDogrula">
                    <dogrula id="hariciSifreSifreDogrula">
                        <gerekli mesaj="Şifre zorunludur"></gerekli>
                    </dogrula>
                </div>
                <div class="form-group">
                    <input type="checkbox" id="hariciSifreGoster"/>
                    <label for="hariciSifreGoster">Şifreyi göster</label>
                </div>

                <button id="sifreEkleDugme" type="button">Şifre Ekle</button>
            </form>
        </div>
        <div id="ayarlar" class="container tab-pane fade">
            <div class="row">
                <form id="yeniSifreForm" autocomplete="off">
                    <div class="row">
                        <div class="col">
                            <div class="form-group">
                                <input type="password" id="yeniSifre" placeholder="Yeni şifre(*)" dogrula="yeniSifreDogrula"/>
                                <dogrula id="yeniSifreDogrula">
                                    <gerekli mesaj="Şifre zorunludur"></gerekli>
                                    <regex ifade="^(?=.*[A-Za-z])(?=.*\d).{8,}$" mesaj="Şifreniz en az 8 karakterden oluşmalıdır ayrıca küçük harf, büyük harf ve sayı içermelidir"></regex>
                                </dogrula>
                            </div>
                        </div>
                        <div class="col">
                            <button id="sifreYenileDugme" type="button">Şifre Yenile</button>
                        </div>
                    </div>
                    <div class="form-group">
                        <input type="checkbox" id="arayuzKontrolu"/>
                        <label for="arayuzKontrolu">Arayüz kontrolünü etkinleştir</label>
                    </div>
                    
                    <button class="mt-3" id="gelismisButton" type="button">Gelişmiş Ayarlar</button><br>
                    <button class="mt-3" id="cikisYap" type="button">Çıkış Yap</button>
                </form>
            </div>
        </div>
    </div>
</template>
`;

export default class AnaEkran extends CodeyzerBilesen {

    /** @type {AnaEkranSifreler} */ anaEkranSifreler

    /** @type {string} */ sifre
    /** @type {string} */ platform
    /** @type {HariciSifreDesifre[]} */ hariciSifreListesi = []

    /** @type {JQuery<HTMLDivElement>} */ $sifrePanel
    /** @type {JQuery<HTMLInputElement>} */ $hariciSifrePlatform
    /** @type {JQuery<HTMLInputElement>} */ $arayuzKontrolu
    /** @type {JQuery<HTMLFormElement>} */ $sifreEkleForm
    /** @type {JQuery<HTMLButtonElement>} */ $sifreEkleDugme
    /** @type {JQuery<HTMLInputElement>} */ $hariciSifreGoster
    /** @type {JQuery<HTMLButtonElement>} */ $sifreYenileDugme
    /** @type {JQuery<HTMLButtonElement>} */ $gelismisButton
    /** @type {JQuery<HTMLButtonElement>} */ $cikisYap
    /** @type {JQuery<HTMLInputElement>} */ $hariciSifreKullaniciAdi
    /** @type {JQuery<HTMLInputElement>} */ $hariciSifreSifre
    /** @type {JQuery<HTMLFormElement>} */ $yeniSifreForm
    /** @type {JQuery<HTMLInputElement>} */ $yeniSifre

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

        this.$sifrePanel = $('#sifrePanel');
        this.$hariciSifrePlatform = $('#hariciSifrePlatform')
        this.$arayuzKontrolu = $('#arayuzKontrolu')
        this.$sifreEkleForm = $('#sifreEkleForm');
        this.$sifreEkleDugme = $('#sifreEkleDugme')
        this.$hariciSifreGoster = $('#hariciSifreGoster')
        this.$sifreYenileDugme = $('#sifreYenileDugme')
        this.$gelismisButton = $('#gelismisButton')
        this.$cikisYap = $('#cikisYap')
        this.$hariciSifreKullaniciAdi = $('#hariciSifreKullaniciAdi')
        this.$hariciSifreSifre = $('#hariciSifreSifre')
        this.$yeniSifreForm = $('#yeniSifreForm')
        this.$yeniSifre = $('#yeniSifre')

        this.init();
    }

    init() {
        this.$hariciSifrePlatform.val(this.platform);

        backgroundMesajGonder({
            mesajTipi: "arayuzKontrolGetir"
        }).then(response => {
            this.$arayuzKontrolu.prop('checked', response === "true")
        })

        this.anaEkranSifreler = new AnaEkranSifreler(this.sifre, this.platform,this.hariciSifreListesi);
        bilesenYukle(this.$sifrePanel, this.anaEkranSifreler);
        
        this.$sifreEkleDugme.on('click', () => this.sifreEkleDugme());
        this.$hariciSifreGoster.on('change', () => this.hariciSifreGosterChanged());
        this.$sifreYenileDugme.on('click', () => this.sifreYenileDugme());
        this.$arayuzKontrolu.on('change', () => this.arayuzKontroluChange());
        this.$gelismisButton.on('click', () => this.gelismisButton());
        this.$cikisYap.on('click', () => this.cikisYap());
    }

    sifreEkleDugme() {
        if (formDogrula(this.$sifreEkleForm)) {
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

        bilesenYukle($('anaPanel'), new OturumAc());
    }
};