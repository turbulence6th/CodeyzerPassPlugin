import AutoCompleteSifrePanel from "/iframe/AutoCompleteSifrePanel.js";
import { bilesenYukle } from "/util.js";

$(function() {
    $('#yukleme').hide();
    bilesenYukle($('#anaPanel'), AutoCompleteSifrePanel);
});