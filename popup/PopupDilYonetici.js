import DilYonetici from '/core/DilYonetici.js'

export default class PopupDilYonetici extends DilYonetici {

     /**
     * 
     * @returns {string}
     */
    mevcutDil() {
        return "en";
        // @ts-ignore
        return chrome.i18n.getUILanguage();
    }
}
