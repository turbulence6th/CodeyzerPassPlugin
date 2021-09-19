import MesajYonetici from '/core/MesajYonetici.js';

export default class MobilMesajYonetici extends MesajYonetici {

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
}