export default class MesajYonetici {

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

}