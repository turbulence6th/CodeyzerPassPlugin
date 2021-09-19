import AygitYonetici from '/core/AygitYonetici.js';
import PopupSifreYoneticiPanel from '/popup/PopupSifreYoneticiPanel.js';

export default class PopupAygitYonetici extends AygitYonetici {

     /**
     * 
     * @returns {Promise<string>}
     */
    mevcutDil() {
        return new Promise((resolve, _reject) => {
            // @ts-ignore
            resolve(chrome.i18n.getUILanguage());
        })
    }

    popupSifreYoneticiPanel =  /** @type {PopupSifreYoneticiPanel} */ ($('#sifre-yonetici-panel')[0]);

    /**
     * 
     * @returns {Promise<string>}
     */
    sifreAl() {
        return this.popupSifreYoneticiPanel.sifreAl();
    }

    
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
    }

    /**
     * 
     * @param {string} ifade
     * @returns {Promise<void>}
     */
     async panoyaKopyala(ifade) {
        return await navigator.clipboard.writeText(ifade);
    }

    $toast = $('#toast')

    /**
     * 
     * @param {string} ifade
     * @returns {Promise<void>}
     */
    async toastGoster(ifade) {
        this.$toast.addClass('show');
        this.$toast.text(ifade);

        setTimeout(() => { 
            this.$toast.removeClass('show');
        }, 3000);
    }
}

