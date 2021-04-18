inits['oturumAc'] = () => {
    let kimlik;
    $('#oturumAc').on('click', () => {
        post("/kullanici/dogrula", {
            "kimlik": kimlik = kimlikGetir()
        })
        .then(data => {
            if (data.basarili) {
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
                depo.sifre =  $('#sifre').val();
                depo.kullaniciKimlik = data.sonuc;
                sayfaDegistir('anaEkran');
            }
        });
    });

    function kimlikGetir() {
        let kullaniciAdi = $('#kullaniciAdi').val();
        let sifre = $('#sifre').val();
        return hashle(kullaniciAdi + ":" + sifre);
    }
};