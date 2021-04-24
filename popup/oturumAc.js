inits['oturumAc'] = () => {

    chrome.runtime.sendMessage({
        mesajTipi: "depoGetir"
    }, (response) => {
        if (response != null) {
            post("/kullanici/dogrula", {
                "kimlik": response.kullaniciKimlik
            })
            .then(data => {
                if (data.basarili) {
                    depo = response;
                    sayfaDegistir('anaEkran');
                }
            });
        }
    });

    $('#oturumAc').on('click', () => {
        post("/kullanici/dogrula", {
            "kimlik": kimlikGetir()
        })
        .then(data => {
            aksiyonAl(data);
        });
    });

    $('#kayitOl').on('click', () => {
        post("/kullanici/yeni", {
            "kimlik": kimlikGetir()
        })
        .then(data => {
            aksiyonAl(data);
        });
    });

    function kimlikGetir() {
        return kimlikHesapla($('#kullaniciAdi').val(), $('#sifre').val());
    }

    function aksiyonAl(data) {
        if (data.basarili) {
            depo.kullaniciAdi = $('#kullaniciAdi').val();
            depo.sifre =  $('#sifre').val();
            depo.kullaniciKimlik = data.sonuc;

            if ($('#beniHatirla').is(':checked')) {
                chrome.runtime.sendMessage({
                    mesajTipi: "beniHatirla",
                    depo: depo,
                }, (response) => {
                    
                });
            }

            sayfaDegistir('anaEkran');
        }
    }
};