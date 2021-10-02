import AutoCompleteSifrePanel from "/iframe/autocomplete/AutoCompleteSifrePanel.js";
import { anaBilesenYukle, setAygitYonetici } from "/core/util.js";
import PopupSifreYoneticiPanel from '/popup/PopupSifreYoneticiPanel.js';
import PopupAygitYonetici from '/popup/PopupAygitYonetici.js';

$(function() {
    setAygitYonetici(new PopupAygitYonetici())
    .then(() => {
        customElements.define('auto-complete-sifre-panel', AutoCompleteSifrePanel);
        customElements.define('popup-sifre-yonetici-panel', PopupSifreYoneticiPanel);

        $('#yukleme').hide();
        anaBilesenYukle(new AutoCompleteSifrePanel());
    });
});