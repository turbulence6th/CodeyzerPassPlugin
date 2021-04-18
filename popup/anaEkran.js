inits['anaEkran'] = () => {
    let platform;
    let sifreGetir = () => {
        post("/hariciSifre/getir", {
            platform: hashle(platform + ":" + depo.sifre),
            kullaniciKimlik: depo.kullaniciKimlik
        })
        .then(data => {
            if (data.basarili) {
                $('#sifreSelect').empty();
                let sonuc = data.sonuc;
                for (let i = 0; i < sonuc.length; i++) {
                    let eleman = sonuc[i];
                    $('#sifreSelect').append(new Option(desifreEt(eleman.kullaniciAdi, depo.sifre), desifreEt(eleman.sifre, depo.sifre)));
                }
            }
        });    
    };

    let seciciDoldur = () => {
        $('#kullaniciAdiSecici').val(secici[platform].kullaniciAdi);
        $('#sifreSecici').val(secici[platform].sifre);
    }

    mesajGonder({
        mesajTipi: "platform",
    }, response => {
        platform = response.platform;
        seciciDoldur();
        sifreGetir();
    });

    $('#sifreEkleDugme').on('click', () => {
        post("/hariciSifre/kaydet", {
            kimlik: sifrele("deneme", depo.sifre),
            platform: hashle(platform + ":" + depo.sifre),
            kullaniciAdi: sifrele($('#hariciSifreKullaniciAdi').val(), depo.sifre),
            sifre: sifrele($('#hariciSifreSifre').val(), depo.sifre),
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
        let kullaniciAdi = seciliDeger.text();
        let sifre = seciliDeger.val();
        
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