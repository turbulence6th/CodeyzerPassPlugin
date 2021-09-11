$(document).ready(function() {
    efekUygula($('#ikon'), 3000);
});

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