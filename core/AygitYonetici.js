import PopupSifreYoneticiPanel from '/popup/PopupSifreYoneticiPanel.js';

export default class AygitYonetici {

    /**
     * 
     * @returns {Promise<string>}
     */
    mevcutDil() {
        throw "Aygıt yönetici bulunamadı";
    }

    popupSifreYoneticiPanel = /** @type {PopupSifreYoneticiPanel} */ (document.querySelector('#sifre-yonetici-panel'));

    /**
     * 
     * @returns {Promise<string>}
     */
    sifreAl() {
        return this.popupSifreYoneticiPanel.sifreAl();
    }

    /**
     * 
     * @returns {Promise<'chrome'|'ios'|'android'|'web'>}
     */
    platformTipi() {
        throw "Aygıt yönetici bulunamadı";    }

    /**
     * 
     * @returns {Promise<Depo>}
     */
     depoGetir() {
        throw "Aygıt yönetici bulunamadı";
    }

    /**
     * 
     * @param {Depo} depo
     * @returns {Promise<void>}
     */
    beniHatirla(depo) {
        throw "Aygıt yönetici bulunamadı";
    }

    /**
     * 
     * @param {boolean} arayuzKontrol
     * @returns {Promise<void>}
     */
    arayuzKontrolAyarla(arayuzKontrol) {
        throw "Aygıt yönetici bulunamadı";
    }

    /**
     * 
     * @returns {Promise<boolean>}
     */
    arayuzKontrolGetir() {
        throw "Aygıt yönetici bulunamadı";
    }


    /**
     * 
     * @param {HariciSifreDTO[]} hariciSifreDTOListesi 
     * @returns {Promise<void>}
     */
    hariciSifreDTOListesiAyarla(hariciSifreDTOListesi) {
        throw "Aygıt yönetici bulunamadı";
    }
    
    /**
     * 
     * @returns {Promise<HariciSifreDTO[]>}
     */
    hariciSifreDTOListesiGetir() {
        throw "Aygıt yönetici bulunamadı";
    } 

    /**
     * 
     * @param {HariciSifreDesifre[]} hariciSifreListesi 
     * @returns {Promise<void>}
     */
    mobilSifreListesiEkle(hariciSifreListesi) {
        throw "Aygıt yönetici bulunamadı";
    }

    /**
     * 
     * @returns {Promise<{platform: string, kullaniciAdi: string, sifre: string}>}
     */
    sonLoginGetir() {
        throw "Aygıt yönetici bulunamadı";
    }

    /**
     * 
     * @returns {Promise<{platform: string}>}
     */
    platformGetir() {
        throw "Aygıt yönetici bulunamadı";
    }

    /**
     * 
     * @param {string} kullaniciAdi 
     * @param {string} sifre 
     * @returns {Promise<void>}
     */
    sifreDoldur(kullaniciAdi, sifre) {
        throw "Aygıt yönetici bulunamadı";
    }

    /**
     * 
     * @param {string} ifade
     * @returns {Promise<void>}
     */
    panoyaKopyala(ifade) {
        throw "Aygıt yönetici bulunamadı";
    }

    /**
     * 
     * @param {string} ifade
     * @returns {Promise<void>}
     */
    toastGoster(ifade) {
        throw "Aygıt yönetici bulunamadı";
    }

    /**
     * 
     * @param {string} baslik 
     * @param {string} mesaj
     * @returns {Promise<boolean>} 
     */
    onayDialog(baslik, mesaj) {
        throw "Aygıt yönetici bulunamadı";
    }

    /**
     * 
     * @return {Promise<PaketOption[]>}
     */
    androidPaketGetir() {
        throw "Aygıt yönetici bulunamadı";
    }

    /**
     * 
     * @returns {Promise<object>}
     */
     rehberGetir() {
        throw "Aygıt yönetici bulunamadı";
    }

    /**
     * 
     * @param {Object} rehber
     * @returns {Promise<void>}
     */
    rehberAyarla(rehber) {
        throw "Aygıt yönetici bulunamadı";
    }
}