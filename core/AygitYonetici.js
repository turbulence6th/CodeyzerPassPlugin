export default class AygitYonetici {

    /**
     * 
     * @returns {Promise<string>}
     */
    mevcutDil() {
        throw "Dil yönetici bulunamadı";
    }

    /**
     * 
     * @returns {Promise<string>}
     */
    sifreAl() {
        throw "Şifre yönetici bulunamadı";
    }

    /**
     * 
     * @returns {'chrome'|'mobil'}
     */
    platformTipi() {
        throw "Background Mesaj Yönetici bulunamadı.";
    }

    /**
     * 
     * @param {BackgroundMesaj} mesaj 
     * @returns {Promise<any>}
     */
    backgroundMesajGonder(mesaj) {
        throw "Background Mesaj Yönetici bulunamadı.";
    } 

    /**
     * 
     * @param {*} icerik 
     * @param {function} geriCagirma 
     */
    sekmeMesajGonder(icerik, geriCagirma = () => {}) {
        throw "Background Mesaj Yönetici bulunamadı."; 
    }

    /**
     * 
     * @param {string} ifade
     * @returns {Promise<void>}
     */
    panoyaKopyala(ifade) {
        throw "Şifre yönetici bulunamadı";
    }

    /**
     * 
     * @param {string} ifade
     * @returns {Promise<void>}
     */
    toastGoster(ifade) {
        throw "Şifre yönetici bulunamadı";
    }
}