class AnaEkran extends Ekran {

    sifre
    platform
    hariciSifreListesi = []
    secici = {
        regex: null,
        kullaniciAdiSecici: null,
        sifreSecici: null
    }
    qrcode

    $qrcode = $('#qrcode')
    $hariciSifrePlatform = $('#hariciSifrePlatform')
    $arayuzKontrolu = $('#arayuzKontrolu')
    $platformSelect = $('#platformSelect')
    $sifreSelect = $('#sifreSelect')
    $sifreEkleDugme = $('#sifreEkleDugme')
    $hariciSifreGoster = $('#hariciSifreGoster')
    $sifreSelectGoster = $('#sifreSelectGoster')
    $doldur = $('#doldur')
    $sil = $('#sil')
    $sifreYenileDugme = $('#sifreYenileDugme')
    $gelismisButton = $('#gelismisButton')
    $cikisYap = $('#cikisYap')
    $sifreSelectSifre = $('#sifreSelectSifre')
    $hariciSifreKullaniciAdi = $('#hariciSifreKullaniciAdi')
    $hariciSifreSifre = $('#hariciSifreSifre')
    $yeniSifre = $('#yeniSifre')

    static html() {
        return "/popup/anaEkran.html";
    }

    init(args) {
        this.sifre = args[0];
        this.platform = args[1];
        this.qrcode = new QRCode("qrcode", {
            width: 80,
            height: 80,
            colorDark : "#000000",
            colorLight : "#ff7f2a",
            correctLevel : QRCode.CorrectLevel.H
        });

        this.$qrcode.hide();    
        this.$hariciSifrePlatform.val(this.platform);
        this.seciciDoldur();

        chrome.runtime.sendMessage({
            mesajTipi: "arayuzKontrolGetir"
        }, response => {
            this.$arayuzKontrolu.prop('checked', response === "true");
        });

        this.$platformSelect.on('change', () => this.platformSelectChanged());  
        this.$sifreSelect.on('change', () => this.secileninSifreyiDoldur());
        this.$sifreEkleDugme.on('click', () => this.sifreEkleDugme());
        this.$hariciSifreGoster.change(() => this.hariciSifreGosterChanged());
        this.$sifreSelectGoster.change(() => this.sifreSelectGosterChanged());
        this.$doldur.on('click', () => this.doldur());
        this.$sil.on('click', () => this.sil());
        this.$sifreYenileDugme.on('click', () => this.sifreYenileDugme());
        this.$arayuzKontrolu.change(() => this.arayuzKontroluChange());
        this.$gelismisButton.on('click', () => this.gelismisButton());
        this.$cikisYap.on('click', () => this.cikisYap());
    }

    sifreGetir() {
        this.$qrcode.hide();
        popupPost("/hariciSifre/getir", {
            kullaniciKimlik: depo.kullaniciKimlik
        })
        .then(data => {
            if (data.basarili) {
                this.$platformSelect.empty();
                this.hariciSifreListesi = data.sonuc
                    .map(x => {
                        x.icerik = icerikDesifreEt(x.icerik, this.sifre);
                        x.alanAdi = alanAdiGetir(x.icerik.platform);
                        return x;
                    })
                    .sort((x, y) => x.alanAdi.localeCompare(y.alanAdi));

                let platformlar = new Set();
                this.hariciSifreListesi.forEach(x => {
                    let alanAdi = alanAdiGetir(x.icerik.platform);
                    platformlar.add(alanAdi);
                });
                if (platformlar.length === 0) {
                    this.$platformSelect.prop('disabled', true);
                } else {
                    this.$platformSelect.prop('disabled', false);
                    this.$platformSelect.append(new Option("Platform seçiniz"));
                    this.sifreAlaniDoldur("");

                    let alanAdiPlatform = alanAdiGetir(this.platform);
                    for (let eleman of platformlar) {
                        let option = new Option(eleman);
                        let gecerliPlarformMu = this.secici.regex?.test(eleman) || alanAdiPlatform === eleman;
                        if (gecerliPlarformMu) {
                            option.selected = true;
                            this.$doldur.prop('disabled', false);
                            this.sifreAlaniDoldur(eleman);
                        }
                        
                        this.$platformSelect.append(option);
                    }
                }

                
            }
        });    
    }

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

    platformSelectChanged() {
        let secilen = this.$platformSelect.val();
        this.sifreAlaniDoldur(secilen);
    }
    
    secileninSifreyiDoldur() {
        let secilen = this.$sifreSelect.find(":selected");
        this.$sifreSelectSifre.val(secilen.data('sifre'));
        this.qrcode.clear();
        this.qrcode.makeCode(this.$sifreSelectSifre.val());
    }

    seciciDoldur() {
        let data = seciciGetir(this.platform);

        if (data) {
            this.secici.regex = data.platformRegex;
            this.secici.kullaniciAdiSecici = data.kullaniciAdiSecici;
            this.secici.sifreSecici = data.sifreSecici;
        } 

        this.sifreGetir();
    }

    sifreEkleDugme() {
        if (formDogrula('#sifreEkleForm')) {
            popupPost("/hariciSifre/kaydet", {
                icerik: icerikSifrele({
                    platform: this.$hariciSifrePlatform.val(),
                    kullaniciAdi: this.$hariciSifreKullaniciAdi.val(),
                    sifre: this.$hariciSifreSifre.val(),
                }, this.sifre),
                kullaniciKimlik: depo.kullaniciKimlik
            })
            .then(data => {
                if (data.basarili) {
                    this.$hariciSifreKullaniciAdi.val(null);
                    this.$hariciSifreSifre.val(null);
                    this.sifreGetir();
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
        
        mesajGonder({
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
            kullaniciKimlik: depo.kullaniciKimlik,
        })
        .then(data => {
            if (data.basarili) {
                this.sifreGetir();
            }
        });
    }

    sifreYenileDugme() {
        if (formDogrula("#yeniSifreForm")) {
            let yeniSifre = this.$yeniSifre.val();
            let yeniKullaniciKimlik = kimlikHesapla(depo.kullaniciAdi, yeniSifre);
            let yeniHariciSifreListesi = this.hariciSifreListesi
                .map(x => ({
                    icerik: icerikSifrele(x.icerik, yeniSifre)
                }))
        
            popupPost("/hariciSifre/yenile", {
                hariciSifreListesi: yeniHariciSifreListesi,
                kullaniciKimlik: depo.kullaniciKimlik,
                yeniKullaniciKimlik: yeniKullaniciKimlik
            })
            .then(data => {
                if (data.basarili) {
                    this.sifre = yeniSifre;
                    depo.kullaniciKimlik = yeniKullaniciKimlik;
    
                    chrome.runtime.sendMessage({
                        mesajTipi: "beniHatirla",
                        depo: depo,
                    }, (response) => {
                        
                    });
    
                    this.$yeniSifre.val(null);
                    this.sifreGetir();
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

        depo = {
            sifre: null,
            kullaniciKimlik: null,
        };
        sayfaDegistir('oturumAc');
    }
};