import AygitYonetici from '/core/AygitYonetici.js';
import { getDepo } from '/core/util.js';
import { Clipboard } from '@capacitor/clipboard';
import { Device } from '@capacitor/device';
import { Toast } from '@capacitor/toast';
import PopupOnayPanel from '/popup/PopupOnayPanel.js';

export default class MobilAygitYonetici extends AygitYonetici {

    /**
     * 
     * @returns {Promise<string>}
     */
    async mevcutDil() {
        return (await Device.getLanguageCode()).value.substr(0, 2);
    }

    /**
     * 
     * @returns {Promise<string>}
     */
    sifreAl() {
        return new Promise((resolve, reject) => {
            resolve(getDepo().sifre);
        });
    }

    /**
     * 
     * @returns {'chrome'|'mobil'}
     */
    platformTipi() {
        return 'mobil';
    }

    /**
     * 
     * @param {BackgroundMesaj} mesaj 
     * @returns {Promise<any>}
     */
    backgroundMesajGonder(mesaj) {
        return new Promise((resolve, _reject) => {
            switch (mesaj.mesajTipi) {
                case "depoGetir": 
                    resolve(this.depoGetir());
                    break;
                case "beniHatirla":
                    localStorage['depo'] = JSON.stringify(mesaj.params.depo);
                    break;
                case "arayuzKontrolAyarla":
                    localStorage['arayuzKontrol'] = mesaj.params.arayuzKontrol;
                    break;
                case "arayuzKontrolGetir":
                    resolve(localStorage['arayuzKontrol']);
                    break;
                case "hariciSifreDTOListesiAyarla":
                    localStorage['hariciSifreDTOListesi'] = JSON.stringify(mesaj.params.hariciSifreDTOListesi);
                    break;
                case "hariciSifreDTOListesiGetir":
                    let str = localStorage['hariciSifreDTOListesi'];
                    if (str === undefined) {
                        resolve(null)
                    } else {
                        resolve(JSON.parse(str));
                    }
            }
        });
    } 

    depoGetir() {
        let depoStr = localStorage['depo'];
        let depo = null;
        if (depoStr) {
          depo = JSON.parse(depoStr);
        }
        return depo;
    }

    /**
     * 
     * @param {*} icerik 
     * @param {function} geriCagirma 
     */
    sekmeMesajGonder(icerik, geriCagirma = () => {}) {
        geriCagirma({
            "platform": "MOBIL.com"
        });
    }

    /**
     * 
     * @param {string} ifade
     * @returns {Promise<void>}
     */
    async panoyaKopyala(ifade) {
        await Clipboard.write({
            string: ifade
        });
    }

    /**
     * 
     * @param {string} ifade
     * @returns {Promise<void>}
     */
    async toastGoster(ifade) {
        await Toast.show({
            text: ifade
        });
    }

    /**
     * 
     * @param {string} baslik 
     * @param {string} mesaj
     * @returns {Promise<boolean>} 
     */
    onayDialog(baslik, mesaj) {
        return new PopupOnayPanel().onayDialog(baslik, mesaj);
    }
}