import DilYonetici from '/core/DilYonetici.js'

export default class PopupDilYonetici extends DilYonetici {

     /**
     * 
     * @returns {string}
     */
    mevcutDil() {
        // @ts-ignore
        return chrome.i18n.getUILanguage();
    }
}