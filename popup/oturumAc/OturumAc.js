import Ekran from '/core/Ekran.js';
import { popupPost, setDepo, formDogrula, getDepo } from '/popup/popup.js';
import AnaEkran from '/popup/anaEkran/AnaEkran.js';
import { kimlikHesapla, pluginSayfasiAc, sekmeMesajGonder, sifreAl, backgroundMesajGonder, bilesenYukle } from '/core/util.js';

export default class OturumAc extends Ekran {

    static html() {
        return "/popup/oturumAc/OturumAc.html";
    }

    init(args) {
        backgroundMesajGonder({
            mesajTipi: "depoGetir"
        })
        .then((response) => {
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
        })
    
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
        return kimlikHesapla(
            /** @type {string} */ ($('#kullaniciAdi').val()),  
            /** @type {string} */ ($('#sifre').val())
        );
    }

    aksiyonAl(data) {
        if (data.basarili) {
            let depo = { ...getDepo() };

            depo.kullaniciAdi = /** @type {string} */ ($('#kullaniciAdi').val());
            depo.kullaniciKimlik = data.sonuc;

            setDepo(depo);

            backgroundMesajGonder({
                mesajTipi: "beniHatirla",
                params: {
                    depo: getDepo()
                },
            });
            
            this.sayfaAksiyonu(/** @type {string} */ ($('#sifre').val()));
        }
    }

    /**
     * 
     * @param {string} sifre 
     */
    sayfaAksiyonu(sifre) {
        sekmeMesajGonder({
            mesajTipi: "platform",
        }, async response => {
            if (!response) {
                pluginSayfasiAc('/iframe/autocomplete/autocomplete.html');
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