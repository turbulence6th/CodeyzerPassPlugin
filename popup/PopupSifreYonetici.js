import SifreYonetici from  '/core/SifreYonetici.js';
import PopupSifreYoneticiPanel from '/popup/PopupSifreYoneticiPanel.js';

export default class PopupSifreYonetici extends SifreYonetici {

    popupSifreYoneticiPanel =  /** @type {PopupSifreYoneticiPanel} */ ($('#sifre-yonetici-panel')[0]);

    /**
     * 
     * @returns {Promise<string>}
     */
    sifreAl() {
        return this.popupSifreYoneticiPanel.sifreAl();
    }
}