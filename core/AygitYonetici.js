export default class AygitYonetici {

    /**
     * 
     * @returns {Promise<string>}
     */
    mevcutDil() {
        throw "Aygıt yönetici bulunamadı";
    }

    /**
     * 
     * @returns {Promise<string>}
     */
    sifreAl() {
        throw "Aygıt yönetici bulunamadı";    }

    /**
     * 
     * @returns {'chrome'|'mobil'}
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
     * @returns {Promise<any>}
     */
    beniHatirla(depo) {
        throw "Aygıt yönetici bulunamadı";
    }

    /**
     * 
     * @param {boolean} arayuzKontrol
     * @returns {Promise<any>}
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
     * @returns {Promise<any>}
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
     * @returns {Promise<{platform: string, kullaniciAdi: string, sifre: string}>}
     */
    sonLoginGetir() {
        throw "Aygıt yönetici bulunamadı";
    }

    /**
     * 
     * @param {*} icerik 
     * @param {function} geriCagirma 
     */
    sekmeMesajGonder(icerik, geriCagirma = () => {}) {
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
}