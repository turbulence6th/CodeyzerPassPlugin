import AutoCompleteSifrePanel from "/iframe/autocomplete/AutoCompleteSifrePanel.js";
import { bilesenYukle } from "/core/util.js";

$(function() {
    customElements.define('auto-complete-sifre-panel', AutoCompleteSifrePanel);

    $('#yukleme').hide();
    bilesenYukle($('#anaPanel'), new AutoCompleteSifrePanel());
});