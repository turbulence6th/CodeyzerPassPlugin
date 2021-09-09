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

        $('#qrcode').hide();    
        $('#hariciSifrePlatform').val(this.platform);
        this.seciciDoldur();

        chrome.runtime.sendMessage({
            mesajTipi: "arayuzKontrolGetir"
        }, response => {
            $('#arayuzKontrolu').prop('checked', response === "true");
        });

        $('#platformSelect').on('change', () => this.platformSelectChanged());  
        $('#sifreSelect').on('change', () => this.secileninSifreyiDoldur());
        $('#sifreEkleDugme').on('click', () => this.sifreEkleDugme());
        $('#hariciSifreGoster').change(() => this.hariciSifreGosterChanged());
        $('#sifreSelectGoster').change(() => this.sifreSelectGosterChanged());
        $('#doldur').on('click', () => this.doldur());
        $('#sil').on('click', () => this.sil());
        $('#sifreYenileDugme').on('click', () => this.sifreYenileDugme());
        $('#arayuzKontrolu').change(() => this.arayuzKontroluChange());
        $('#gelismisButton').on('click', () => this.gelismisButton());
        $('#cikisYap').on('click', () => this.cikisYap());
    }

    sifreGetir() {
        $('#qrcode').hide();
        popupPost("/hariciSifre/getir", {
            kullaniciKimlik: depo.kullaniciKimlik
        })
        .then(data => {
            if (data.basarili) {
                $('#platformSelect').empty();
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
                    $('#platformSelect').prop('disabled', true);
                } else {
                    $('#platformSelect').prop('disabled', false);
                    $('#platformSelect').append(new Option("Platform seçiniz"));
                    this.sifreAlaniDoldur("");

                    let alanAdiPlatform = alanAdiGetir(this.platform);
                    for (let eleman of platformlar) {
                        let option = new Option(eleman);
                        let gecerliPlarformMu = this.secici.regex?.test(eleman) || alanAdiPlatform === eleman;
                        if (gecerliPlarformMu) {
                            option.selected = true;
                            $('#doldur').prop('disabled', false);
                            this.sifreAlaniDoldur(eleman);
                        }
                        
                        $('#platformSelect').append(option);
                    }
                }

                
            }
        });    
    }

    sifreAlaniDoldur(platform) {
        $('#sifreSelect').empty();
        let platformSifreleri = this.hariciSifreListesi.filter(x => platform === alanAdiGetir(x.icerik.platform));
        if (platformSifreleri.length === 0) {
            $('#sifreSelect').prop('disabled', true);
            $('#sifreSelect').append(new Option('Şifre bulunamadı', ''));
            $('#sifreSelectSifre').val('');

            $('#doldur').prop('disabled', true);
            $('#sil').prop('disabled', true);
            $('#sifreSelectGoster').prop('disabled', true);
        } else {
            $('#sifreSelect').prop('disabled', false);
            $('#doldur').prop('disabled', false);
            $('#sil').prop('disabled', false);
            $('#sifreSelectGoster').prop('disabled', false);

            for (let i = 0; i < platformSifreleri.length; i++) {
                let eleman = platformSifreleri[i];
                let option = new Option(eleman.icerik.kullaniciAdi);
                let jOption = $(option);
                jOption.data('kimlik', eleman.kimlik);
                jOption.data('kullaniciAdi', eleman.icerik.kullaniciAdi);
                jOption.data('sifre', eleman.icerik.sifre);

                $('#sifreSelect').append(option);
            }

            this.secileninSifreyiDoldur();
        }
    }

    platformSelectChanged() {
        let secilen = $('#platformSelect').val();
        this.sifreAlaniDoldur(secilen);
    }
    
    secileninSifreyiDoldur() {
        let secilen = $('#sifreSelect').find(":selected");
        $('#sifreSelectSifre').val(secilen.data('sifre'));
        this.qrcode.clear();
        this.qrcode.makeCode($('#sifreSelectSifre').val());
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
                    platform: $('#hariciSifrePlatform').val(),
                    kullaniciAdi: $('#hariciSifreKullaniciAdi').val(),
                    sifre: $('#hariciSifreSifre').val(),
                }, this.sifre),
                kullaniciKimlik: depo.kullaniciKimlik
            })
            .then(data => {
                if (data.basarili) {
                    $('#hariciSifreKullaniciAdi').val(null);
                    $('#hariciSifreSifre').val(null);
                    this.sifreGetir();
                }
            });
        }
    }

    hariciSifreGosterChanged() {
        if($('#hariciSifreGoster').prop('checked')) {
            $('#hariciSifreSifre').prop("type", "text");
        } else {
            $('#hariciSifreSifre').prop("type", "password");
        }
    }

    sifreSelectGosterChanged() {
        if($('#sifreSelectGoster').prop('checked')) {
            $('#sifreSelectSifre').prop("type", "text");
            $('#qrcode').show();
        } else {
            $('#sifreSelectSifre').prop("type", "password");
            $('#qrcode').hide();
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
            let yeniSifre = $('#yeniSifre').val();
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
    
                    $('#yeniSifre').val(null);
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

inits['anaEkran'] = AnaEkran;