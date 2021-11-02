import { anaBilesenYukle, setAygitYonetici } from '/core/util.js';
import SifreEkle from '/iframe/beniAc/SifreEkle.js';
import PopupAygitYonetici from '/popup/PopupAygitYonetici.js';

document.addEventListener("DOMContentLoaded", function() {
    setAygitYonetici(new PopupAygitYonetici())
    .then(() => {
        customElements.define('sifre-ekle', SifreEkle);
        anaBilesenYukle(new SifreEkle());
    });
});