import Ekran from '../Ekran.js';
import { popupPost, setDepo, bilesenYukle, formDogrula, getDepo } from '../popup.js';
import AnaEkran from '../anaEkran/AnaEkran.js';

export default class OturumAc extends Ekran {

    static html() {
        return "/popup/oturumAc/OturumAc.html";
    }

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
                        setDepo(response);
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
            getDepo().kullaniciAdi = $('#kullaniciAdi').val();
            getDepo().kullaniciKimlik = data.sonuc;

            chrome.runtime.sendMessage({
                mesajTipi: "beniHatirla",
                depo: getDepo(),
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
                
                bilesenYukle(this.$anaPanel, AnaEkran, {
                    sifre: sifre, 
                    platform: response.platform
                });
            }
        });
    }
};