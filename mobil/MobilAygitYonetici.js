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
     * @returns {Promise<Depo>}
     */
    depoGetir() {
        return new Promise((resolve, _reject) => {
            let depoStr = localStorage['depo'];
            let depo = null;
            if (depoStr) {
              depo = JSON.parse(depoStr);
            }
            resolve(depo);
        });
    }

    /**
     * 
     * @param {Depo} depo
     * @returns {Promise<any>}
     */
    beniHatirla(depo) {
        return new Promise((resolve, _reject) => {
            localStorage['depo'] = JSON.stringify(depo);
            resolve();
        });
    }

    /**
     * 
     * @param {boolean} arayuzKontrol
     * @returns {Promise<any>}
     */
    arayuzKontrolAyarla(arayuzKontrol) {
        return new Promise((resolve, _reject) => {
            localStorage['arayuzKontrol'] = arayuzKontrol;
            resolve();
        });
    }

    /**
     * 
     * @returns {Promise<boolean>}
     */
    arayuzKontrolGetir() {
        return new Promise((resolve, _reject) => {
            resolve(localStorage['arayuzKontrol'] === "true");
        });
    }


    /**
     * 
     * @param {HariciSifreDTO[]} hariciSifreDTOListesi 
     * @returns {Promise<any>}
     */
    hariciSifreDTOListesiAyarla(hariciSifreDTOListesi) {
        return new Promise((resolve, _reject) => {
            localStorage['hariciSifreDTOListesi'] = JSON.stringify(hariciSifreDTOListesi);
            resolve();
        });
    }
    
    /**
     * 
     * @returns {Promise<HariciSifreDTO[]>}
     */
    hariciSifreDTOListesiGetir() {
        return new Promise((resolve, _reject) => {
            let str = localStorage['hariciSifreDTOListesi'];
            if (str === undefined) {
                resolve(null)
            } else {
                resolve(JSON.parse(str));
            }
        });
    } 

    /**
     * 
     * @returns {Promise<{platform: string, kullaniciAdi: string, sifre: string}>}
     */
    sonLoginGetir() {
        return new Promise((resolve, _reject) => {
            resolve(null);
        });
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