import AutoCompleteSifrePanel from "/iframe/autocomplete/AutoCompleteSifrePanel.js";
import { bilesenYukle } from "/core/util.js";

$(function() {
    $('#yukleme').hide();
    bilesenYukle($('#anaPanel'), AutoCompleteSifrePanel);
});