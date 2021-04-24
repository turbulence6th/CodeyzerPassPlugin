inits['anaEkran'] = () => {
    let platform;
    let secici = {
        regex: null,
        kullaniciAdiSecici: null,
        sifreSecici: null
    };
    let hariciSifreListesi = [];
    let sifreGetir = () => {
        post("/hariciSifre/getir", {
            kullaniciKimlik: depo.kullaniciKimlik
        })
        .then(data => {
            if (data.basarili) {
                $('#sifreSelect').empty();
                hariciSifreListesi = data.sonuc
                    .map(x => {
                        x.icerik = icerikDesifreEt(x.icerik, depo.sifre);
                        return x;
                    });

                let platformSifreleri = hariciSifreListesi.filter(x => secici.regex.test(x.icerik.platform));

                if (platformSifreleri.length === 0) {
                    $('#sifreSelect').prop('disabled', true);
                    $('#sifreSelect').append(new Option('Şifre bulunamadı', ''));

                    $('#doldur').prop('disabled', true);
                    $('#sil').prop('disabled', true);
                } else {
                    $('#sifreSelect').prop('disabled', false);
                    $('#doldur').prop('disabled', false);
                    $('#sil').prop('disabled', false);

                    for (let i = 0; i < platformSifreleri.length; i++) {
                        let eleman = platformSifreleri[i];
                        let option = new Option(eleman.icerik.kullaniciAdi);
                        let jOption = $(option);
                        jOption.data('kimlik', eleman.kimlik);
                        jOption.data('kullaniciAdi', eleman.icerik.kullaniciAdi);
                        jOption.data('sifre', eleman.icerik.sifre);

                        $('#sifreSelect').append(option);

                        $('#sifreSelectSifre').val(eleman.icerik.sifre);
                    }
                }
            }
        });    
    };

    let seciciDoldur = () => {
        post("/platform_secici/getir", {
            sorgu: platform
        })
        .then(data => {
            if (data.basarili) {
                let sonuc = data.sonuc;
                secici.regex = new RegExp(sonuc.platformRegex);
                secici.kullaniciAdiSecici = sonuc.kullaniciAdiSecici;
                secici.sifreSecici = sonuc.sifreSecici;
                sifreGetir();
            } else {
                $('#sifreSelect').prop('disabled', true);
                $('#sifreSelect').append(new Option('Şifre bulunamadı', ''));

                $('#doldur').prop('disabled', true);
                $('#sil').prop('disabled', true);

                $('#hariciSifreKullaniciAdi').prop('disabled', true);
                $('#hariciSifreSifre').prop('disabled', true);
                $('#sifreEkleDugme').prop('disabled', true);
            }
        });
    }

    mesajGonder({
        mesajTipi: "platform",
    }, response => {
        if (!response) {
            mesajYaz('Bir hata oluştu. Sayfayı yenileyiniz.');
            return;
        }

        platform = response.platform;
        seciciDoldur();
    });

    $('#sifreEkleDugme').on('click', () => {
        post("/hariciSifre/kaydet", {
            icerik: icerikSifrele({
                platform: platform,
                kullaniciAdi: $('#hariciSifreKullaniciAdi').val(),
                sifre: $('#hariciSifreSifre').val(),
            }, depo.sifre),
            kullaniciKimlik: depo.kullaniciKimlik
        })
        .then(data => {
            if (data.basarili) {
                $('#hariciSifrePlatform').val(null);
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
        } else {
            $('#sifreSelectSifre').prop("type", "password");
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