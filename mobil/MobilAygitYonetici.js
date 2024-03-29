import AygitYonetici from '/core/AygitYonetici.js';
import { getDepo } from '/core/util.js';
import { Clipboard } from '@capacitor/clipboard';
import { Device } from '@capacitor/device';
import { Storage } from '@capacitor/storage';
import { Toast } from '@capacitor/toast';
import PopupOnayPanel from '/popup/PopupOnayPanel.js';
import CodeyzerAutofillPlugin from '/mobil/CodeyzerAutofillPlugin.js';

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
     * @returns {Promise<'chrome'|'ios'|'android'|'web'>}
     */
    async platformTipi() {
        let info = await Device.getInfo();
        return info.platform;
    }

    /**
     * 
     * @returns {Promise<Depo>}
     */
    async depoGetir() {
        let depoStr = (await Storage.get({ key: 'depo' })).value;

        let depo = null;
        if (depoStr) {
          depo = JSON.parse(depoStr);
        }

        return depo;
    }

    /**
     * 
     * @param {Depo} depo
     * @returns {Promise<void>}
     */
    beniHatirla(depo) {
        return Storage.set({
            key: 'depo',
            value: JSON.stringify(depo),
        });
    }

    /**
     * 
     * @param {boolean} arayuzKontrol
     * @returns {Promise<any>}
     */
    arayuzKontrolAyarla(arayuzKontrol) {
        return Storage.set({
            key: 'arayuzKontrol',
            value: JSON.stringify(arayuzKontrol),
        });
    }

    /**
     * 
     * @returns {Promise<boolean>}
     */
    async arayuzKontrolGetir() {
        return (await Storage.get({ key: 'depo' })).value === 'true';
    }

    /**
     * 
     * @param {HariciSifreDTO[]} hariciSifreDTOListesi 
     * @returns {Promise<any>}
     */
    hariciSifreDTOListesiAyarla(hariciSifreDTOListesi) {
        return Storage.set({
            key: 'hariciSifreDTOListesi',
            value: JSON.stringify(hariciSifreDTOListesi),
        });
    }
    
    /**
     * 
     * @returns {Promise<HariciSifreDTO[]>}
     */
    async hariciSifreDTOListesiGetir() {
        let str = (await Storage.get({ key: 'hariciSifreDTOListesi' })).value;
        if (str === undefined) {
            return null;
        } else {
            return JSON.parse(str);
        }
    } 

    /**
     * 
     * @param {HariciSifreDesifre[]} hariciSifreListesi 
     * @returns {Promise<void>}
     */
    mobilSifreListesiEkle(hariciSifreListesi) {
        return CodeyzerAutofillPlugin.sifreListesiEkle({hariciSifreListesi: hariciSifreListesi});
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
     * @returns {Promise<{platform: string}>}
     */
    platformGetir() {
        return new Promise((resolve, reject) => {
            resolve({
                platform: ""
            });
        });
    }

    /**
     * 
     * @param {string} kullaniciAdi 
     * @param {string} sifre 
     * @returns {Promise<void>}
     */
    sifreDoldur(kullaniciAdi, sifre) {
        throw "Metod bulunamadı";
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

    /**
     * 
     * @return {Promise<PaketOption[]>}
     */
    async androidPaketGetir() {
        let platform = await this.platformTipi();
        if (platform === 'android') {
            return (await CodeyzerAutofillPlugin.androidPaketGetir()).paketList;
        }

        return [];
    }

    /**
     * 
     * @returns {Promise<object>}
     */
    async rehberGetir() {
        let str = (await Storage.get({ key: 'rehber' })).value;
        if (str === undefined) {
            return null;
        } else {
            return JSON.parse(str) || {};
        }
    }

    /**
     * 
     * @param {Object} rehber
     * @returns {Promise<void>}
     */
    rehberAyarla(rehber) {
        return Storage.set({
            key: 'rehber',
            value: JSON.stringify(rehber),
        });
    }
}