inits['anaEkran'] = () => {
    let platform;
    let secici = {
        regex: null,
        kullaniciAdiSecici: null,
        sifreSecici: null
    };
    let hariciSifreListesi = [];

    let qrcode = new QRCode("qrcode", {
        width: 80,
        height: 80,
        colorDark : "#000000",
        colorLight : "#ff7f2a",
        correctLevel : QRCode.CorrectLevel.H
    });

    $('#qrcode').hide();

    let sifreGetir = () => {
        $('#qrcode').hide();
        post("/hariciSifre/getir", {
            kullaniciKimlik: depo.kullaniciKimlik
        })
        .then(data => {
            if (data.basarili) {
                $('#platformSelect').empty();
                hariciSifreListesi = data.sonuc
                    .map(x => {
                        x.icerik = icerikDesifreEt(x.icerik, depo.sifre);
                        return x;
                    });

                let platformlar = new Set();
                hariciSifreListesi.forEach(x => {
                    let alanAdi = alanAdiGetir(x.icerik.platform);
                    platformlar.add(alanAdi);
                });
                if (platformlar.length === 0) {
                    $('#platformSelect').prop('disabled', true);
                } else {
                    $('#platformSelect').prop('disabled', false);
                    $('#platformSelect').append(new Option("Platform seçiniz"));
                    sifreAlaniDoldur("");

                    let alanAdiPlatform = alanAdiGetir(platform);
                    for (let eleman of platformlar) {
                        let option = new Option(eleman);
                        let gecerliPlarformMu = secici.regex?.test(eleman) || alanAdiPlatform === eleman;
                        if (gecerliPlarformMu) {
                            option.selected = true;
                            $('#doldur').prop('disabled', false);
                            sifreAlaniDoldur(eleman);
                        }
                        
                        $('#platformSelect').append(option);
                    }
                }

                
            }
        });    
    };

    let sifreAlaniDoldur = platform => {
        $('#sifreSelect').empty();
        let platformSifreleri = hariciSifreListesi.filter(x => platform === alanAdiGetir(x.icerik.platform));
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

            secileninSifreyiDoldur();
        }
    };

    $('#platformSelect').on('change', () => {
        let secilen = $('#platformSelect').val();
        sifreAlaniDoldur(secilen);
    });

    let secileninSifreyiDoldur = () => {
        let secilen = $('#sifreSelect').find(":selected");
        $('#sifreSelectSifre').val(secilen.data('sifre'));
        qrcode.clear();
        qrcode.makeCode($('#sifreSelectSifre').val());
    }

    $('#sifreSelect').on('change', secileninSifreyiDoldur);

    let seciciDoldur = () => {
        let data = seciciGetir(platform);

        if (data) {
            secici.regex = data.platformRegex;
            secici.kullaniciAdiSecici = data.kullaniciAdiSecici;
            secici.sifreSecici = data.sifreSecici;
        } 

        sifreGetir();
    }

    mesajGonder({
        mesajTipi: "platform",
    }, response => {
        if (!response) {
            mesajYaz('Sayfa ile iletişim kurulamadı.');
            platform = "???";
        } else {
            platform = response.platform;
        }
        
		$('#hariciSifrePlatform').val(platform);
        seciciDoldur();
    });

    $('#sifreEkleDugme').on('click', () => {
        post("/hariciSifre/kaydet", {
            icerik: icerikSifrele({
                platform: $('#hariciSifrePlatform').val(),
                kullaniciAdi: $('#hariciSifreKullaniciAdi').val(),
                sifre: $('#hariciSifreSifre').val(),
            }, depo.sifre),
            kullaniciKimlik: depo.kullaniciKimlik
        })
        .then(data => {
            if (data.basarili) {
                $('#hariciSifreKullaniciAdi').val(null);
                $('#hariciSifreSifre').val(null);
                sifreGetir();
            }
        });
    });

    $('#hariciSifreGoster').change(function() {
        if(this.checked) {
            $('#hariciSifreSifre').prop("type", "text");
        } else {
            $('#hariciSifreSifre').prop("type", "password");
        }
    });

    $('#sifreSelectGoster').change(function() {
        if(this.checked) {
            $('#sifreSelectSifre').prop("type", "text");
            $('#qrcode').show();
        } else {
            $('#sifreSelectSifre').prop("type", "password");
            $('#qrcode').hide();
        }
    });

    $('#doldur').on('click', () => {
        let seciliDeger = $("#sifreSelect option:selected");
        let kullaniciAdi = seciliDeger.data('kullaniciAdi');
        let sifre = seciliDeger.data('sifre');
        
        mesajGonder({
            mesajTipi: 'doldur',
            kullaniciAdi: {
                secici: secici.kullaniciAdiSecici,
                deger: kullaniciAdi
            },
            sifre: {
                secici: secici.sifreSecici,
                deger: sifre
            }
        })
    });

    $('#sil').on('click', () => {
        let seciliDeger = $("#sifreSelect option:selected");
        let hariciSifreKimlik = seciliDeger.data('kimlik');

        post("/hariciSifre/sil", {
            kimlik: hariciSifreKimlik,
            kullaniciKimlik: depo.kullaniciKimlik,
        })
        .then(data => {
            if (data.basarili) {
                sifreGetir();
            }
        });
    
    });

    $('#sifreYenileDugme').on('click', () => {
        let yeniSifre = $('#yeniSifre').val();
        let yeniKullaniciKimlik = kimlikHesapla(depo.kullaniciAdi, yeniSifre);
        let yeniHariciSifreListesi = hariciSifreListesi
            .map(x => ({
                icerik: icerikSifrele(x.icerik, yeniSifre)
            }))
    
        post("/hariciSifre/yenile", {
            hariciSifreListesi: yeniHariciSifreListesi,
            kullaniciKimlik: depo.kullaniciKimlik,
            yeniKullaniciKimlik: yeniKullaniciKimlik
        })
        .then(data => {
            if (data.basarili) {
                depo.sifre = yeniSifre;
                depo.kullaniciKimlik = yeniKullaniciKimlik;

                chrome.runtime.sendMessage({
                    mesajTipi: "beniHatirla",
                    depo: depo,
                }, (response) => {
                    
                });

                $('#yeniSifre').val(null);
                sifreGetir();
            }
        });
    });

    $('#cikisYap').on('click', () => {
        chrome.runtime.sendMessage({
            mesajTipi: "beniHatirla",
            depo: null,
        }, (response) => {
            
        });

        depo = {
            sifre: null,
            kullaniciKimlik: null,
        };
        sayfaDegistir('oturumAc');
    });
};