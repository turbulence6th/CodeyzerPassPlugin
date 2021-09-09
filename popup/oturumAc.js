class OturumAc extends Ekran {

    init(args) {
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
                        this.sayfaAksiyonu(null);
                    }
                });
            }
        });
    
        $('#oturumAc').on('click', () => this.oturumAc());
        $('#kayitOl').on('click', () => this.kayitOl());
    }

    oturumAc() {
        if (formDogrula('#oturumAcForm')) {
            popupPost("/kullanici/dogrula", {
                "kimlik": this.kimlikGetir()
            })
            .then(data => {
                this.aksiyonAl(data);
            });
        }
    }

    kayitOl() {
        if (formDogrula('#oturumAcForm')) {
            popupPost("/kullanici/yeni", {
                "kimlik": this.kimlikGetir()
            })
            .then(data => {
                this.aksiyonAl(data);
            });
        }
    }

    kimlikGetir() {
        return kimlikHesapla($('#kullaniciAdi').val(), $('#sifre').val());
    }

    aksiyonAl(data) {
        if (data.basarili) {
            depo.kullaniciAdi = $('#kullaniciAdi').val();
            depo.kullaniciKimlik = data.sonuc;

            chrome.runtime.sendMessage({
                mesajTipi: "beniHatirla",
                depo: depo,
            }, (response) => {
                
            });
            
            this.sayfaAksiyonu($('#sifre').val());
        }
    }

    sayfaAksiyonu(sifre) {
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

inits['oturumAc'] = OturumAc;