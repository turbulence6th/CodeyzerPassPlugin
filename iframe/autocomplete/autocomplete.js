import AutoCompleteSifrePanel from "/iframe/autocomplete/AutoCompleteSifrePanel.js";
import { bilesenYukle, setDilYonetici, setSifreYonetici } from "/core/util.js";
import PopupSifreYoneticiPanel from '/popup/PopupSifreYoneticiPanel.js';
import PopupSifreYonetici from '/popup/PopupSifreYonetici.js';
import PopupDilYonetici from '/popup/PopupDilYonetici.js';

$(function() {
    setSifreYonetici(new PopupSifreYonetici());
    setDilYonetici(new PopupDilYonetici());
    
    customElements.define('auto-complete-sifre-panel', AutoCompleteSifrePanel);
    customElements.define('popup-sifre-yonetici-panel', PopupSifreYoneticiPanel);

    $('#yukleme').hide();
    bilesenYukle($('#anaPanel'), new AutoCompleteSifrePanel());
});