$(document).ready(function() {
    efekUygula($('#ikon'), 2000);
});

function efekUygula(eleman, gecikme) {
    eleman.fadeOut(gecikme).fadeIn(gecikme);
    setTimeout(function() {
        efekUygula(eleman, gecikme);  
    }, gecikme);
}

$('#ikon').on('click', () => {
    const message = JSON.stringify({
        mesajTipi: 'codeyzerAutocompleAc',
    });
    window.parent.postMessage(message, '*');
});