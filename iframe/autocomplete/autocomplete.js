import AutoCompleteSifrePanel from "/iframe/autocomplete/AutoCompleteSifrePanel.js";
import { bilesenYukle, setSifreYonetici } from "/core/util.js";
import PopupSifreYoneticiPanel from '/popup/PopupSifreYoneticiPanel.js';
import PopupSifreYonetici from '/popup/PopupSifreYonetici.js';

$(function() {
    customElements.define('auto-complete-sifre-panel', AutoCompleteSifrePanel);
    customElements.define('popup-sifre-yonetici-panel', PopupSifreYoneticiPanel);

    setSifreYonetici(new PopupSifreYonetici());

    $('#yukleme').hide();
    bilesenYukle($('#anaPanel'), new AutoCompleteSifrePanel());
});