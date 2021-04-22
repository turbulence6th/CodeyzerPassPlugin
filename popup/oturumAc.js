inits['oturumAc'] = () => {
    let kimlik;
    $('#oturumAc').on('click', () => {
        post("/kullanici/dogrula", {
            "kimlik": kimlik = kimlikGetir()
        })
        .then(data => {
            if (data.basarili) {
                depo.kullaniciAdi = $('#kullaniciAdi').val();
                depo.sifre =  $('#sifre').val();
                depo.kullaniciKimlik = data.sonuc;
                sayfaDegistir('anaEkran');
            }
        });
    });

    $('#kayitOl').on('click', () => {
        post("/kullanici/yeni", {
            "kimlik": kimlikGetir()
        })
        .then(data => {
            if (data.basarili) {
                depo.kullaniciAdi = $('#kullaniciAdi').val();
                depo.sifre =  $('#sifre').val();
                depo.kullaniciKimlik = data.sonuc;
                sayfaDegistir('anaEkran');
            }
        });
    });

    function kimlikGetir() {
        return kimlikHesapla($('#kullaniciAdi').val(), $('#sifre').val());
    }
};