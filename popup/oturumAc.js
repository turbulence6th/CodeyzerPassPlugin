inits['oturumAc'] = () => {

    chrome.runtime.sendMessage({
        mesajTipi: "depoGetir"
    }, (response) => {
        if (response != null) {
            popupPost("/kullanici/dogrula", {
                "kimlik": response.kullaniciKimlik
            })
            .then(data => {
                if (data.basarili) {
                    depo = response;
                    sayfaAksiyonu(null);
                }
            });
        }
    });

    $('#oturumAc').on('click', () => {
        if (formDogrula('#oturumAcForm')) {
            popupPost("/kullanici/dogrula", {
                "kimlik": kimlikGetir()
            })
            .then(data => {
                aksiyonAl(data);
            });
        }
    });

    $('#kayitOl').on('click', () => {
        if (formDogrula('#oturumAcForm')) {
            popupPost("/kullanici/yeni", {
                "kimlik": kimlikGetir()
            })
            .then(data => {
                aksiyonAl(data);
            });
        }
    });

    function kimlikGetir() {
        return kimlikHesapla($('#kullaniciAdi').val(), $('#sifre').val());
    }

    function aksiyonAl(data) {
        if (data.basarili) {
            depo.kullaniciAdi = $('#kullaniciAdi').val();
            depo.kullaniciKimlik = data.sonuc;

            chrome.runtime.sendMessage({
                mesajTipi: "beniHatirla",
                depo: depo,
            }, (response) => {
                
            });
            
            sayfaAksiyonu($('#sifre').val());
        }
    }

    function sayfaAksiyonu(sifre) {
        mesajGonder({
            mesajTipi: "platform",
        }, async response => {
            if (!response) {
                window.open(chrome.runtime.getURL("/iframe/autocomplete.html"), '_blank');
            } else {
                if (!sifre) {
                    try {
                        sifre = await sifreAl();
                    } catch(error) {
                        
                    }
                }               
                
                sayfaDegistir('anaEkran', sifre, response.platform);
            }
        });
    }
};