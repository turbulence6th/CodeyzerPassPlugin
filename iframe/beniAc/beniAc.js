import { anaBilesenYukle, setAygitYonetici } from '/core/util.js';
import SifreEkle from '/iframe/beniAc/SifreEkle.js';
import PopupAygitYonetici from '/popup/PopupAygitYonetici.js';
import PopupSifreYoneticiPanel from '/popup/PopupSifreYoneticiPanel.js';

$(function() {
    setAygitYonetici(new PopupAygitYonetici())
    .then(() => {
        customElements.define('popup-sifre-yonetici-panel', PopupSifreYoneticiPanel);
        customElements.define('sifre-ekle', SifreEkle);
        anaBilesenYukle(new SifreEkle());
    });
});