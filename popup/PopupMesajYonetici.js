import MesajYonetici from '/core/MesajYonetici.js';

export default class PopupMesajYonetici extends MesajYonetici {


    /**
     * 
     * @returns {'chrome'|'mobil'}
     */
    platformTipi() {
        return 'chrome';
    }

    /**
     * 
     * @param {BackgroundMesaj} mesaj 
     * @returns {Promise<any>}
     */
    backgroundMesajGonder(mesaj) {
        return new Promise((resolve, _reject) => {
            // @ts-ignore
            chrome.runtime.sendMessage(mesaj, response => resolve(response));
        });
    } 

    /**
     * 
     * @param {*} icerik 
     * @param {function} geriCagirma 
     */
    sekmeMesajGonder(icerik, geriCagirma = () => {}) {
        // @ts-ignore
        chrome.tabs.query({active: true, lastFocusedWindow: true}, function(tabs){
        // @ts-ignore
        chrome.tabs.sendMessage(tabs[0].id, icerik, geriCagirma);
        });
    };
}