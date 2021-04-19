inits['anaEkran'] = () => {
    let platform;
    let sifreGetir = () => {
        post("/hariciSifre/getir", {
            kullaniciKimlik: depo.kullaniciKimlik
        })
        .then(data => {
            if (data.basarili) {
                $('#sifreSelect').empty();
                let sonuc = data.sonuc
                    .map(x => {
                        x.icerik = icerikDesifreEt(x.icerik, depo.sifre);
                        return x;
                    })
                    .filter(x => x.icerik.platform === platform);

                if (sonuc.length === 0) {
                    $('#sifreSelect').prop('disabled', true);
                    $('#sifreSelect').append(new Option('Şifre bulunamadı', ''));
                } else {
                    $('#sifreSelect').prop('disabled', false);
                    for (let i = 0; i < sonuc.length; i++) {
                        let eleman = sonuc[i];
                        let option = new Option(eleman.icerik.kullaniciAdi);
                        let jOption = $(option);
                        jOption.data('kimlik', eleman.kimlik);
                        jOption.data('kullaniciAdi', eleman.icerik.kullaniciAdi);
                        jOption.data('sifre', eleman.icerik.sifre);

                        $('#sifreSelect').append(option);
                    }
                }
            }
        });    
    };

    let seciciDoldur = () => {
        if (!secici[platform]) {
            mesajYaz('Seçici bulunamadı.');
            return;
        }

        $('#kullaniciAdiSecici').val(secici[platform].kullaniciAdi);
        $('#sifreSecici').val(secici[platform].sifre);
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
        sifreGetir();
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

    $('#doldur').on('click', () => {
        let seciliDeger = $("#sifreSelect option:selected");
        let kullaniciAdi = seciliDeger.data('kullaniciAdi');
        let sifre = seciliDeger.data('sifre');
        
        mesajGonder({
            mesajTipi: 'doldur',
            kullaniciAdi: {
                secici: secici[platform]['kullaniciAdi'],
                deger: kullaniciAdi
            },
            sifre: {
                secici: secici[platform]['sifre'],
                deger: sifre
            }
        })
    });
};