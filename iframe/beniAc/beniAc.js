$(function() {
    efekUygula($('#ikon'), 3000);
});

/**
 * 
 * @param {JQuery} eleman 
 * @param {number} gecikme 
 */
function efekUygula(eleman, gecikme) {
    eleman.fadeOut(gecikme / 2).fadeIn(gecikme);
    setTimeout(function() {
        efekUygula(eleman, gecikme);  
    }, gecikme * 1.5);
}

$('#ikon').on('click', () => {
    const message = JSON.stringify({
        mesajTipi: 'codeyzerAutocompleAc',
    });
    window.parent.postMessage(message, '*');
});