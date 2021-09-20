import { pluginSayfasiAc, pluginUrlGetir } from "/core/util.js";

let beniAcAcik = false;

// @ts-ignore
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.mesajTipi === "platform") {
        sendResponse({
            platform: platformGetir()
        });
    } else if (request.mesajTipi === "doldur") {
        doldur(request.kullaniciAdi.deger, request.sifre.deger);
    }
});

/**
 * 
 * @returns string
 */
function platformGetir() {
    let pathname = window.location.pathname;
    if (pathname !== "/" && pathname.endsWith("/")) {
        pathname = pathname.substring(0, pathname.length - 1);
    }
    return window.location.hostname + pathname;
}

/**
 * 
 * @returns {JQuery[]}
 */
function kutuGetir() {
    let sifreKutusu = sifreKutusuGetir();
    let kullaniciAdiKutusu = kullaniciAdiKutusuGetir(sifreKutusu);
    return [kullaniciAdiKutusu, sifreKutusu];
}

/**
 * 
 * @param {string} kullaniciAdi 
 * @param {string} sifre 
 */
function doldur(kullaniciAdi, sifre) {
    let kutular = kutuGetir();
    let kullaniciAdiKutusu = kutular[0];
    let sifreKutusu = kutular[1];

    kullaniciAdiKutusu.val(kullaniciAdi);
    sifreKutusu.val(sifre); 
}

/*backgroundMesajGonder({
    mesajTipi: "arayuzKontrolGetir",
})
.then(response => {
    if (response === 'true') {
        $(document).on("focusin", "input", function() {
            let that = $(this);
            let secici = seciciGetir(platformGetir());
            let kutular = kutuGetir(secici?.kullaniciAdiSecici, secici?.sifreSecici);
            if (!beniAcAcik && (that.is(kutular[0]) || that.is(kutular[1]))) {
                beniAciGoster();
                beniAcAcik = true;
            }
        })
    }
});*/

function beniAciGoster() {
    let div = $('<div>')
        .addClass('codeyzer-iframe')
        .addClass('codeyzer-beniac')
        .appendTo($('body'));

    let iframe = $('<iframe>', {
        src: pluginUrlGetir("/iframe/beniAc/beniAc.html"),
        frameborder: 0,
        scrolling: 'auto',
        allowTransparency: true,
        width: '100%',
        height: '100%',
    })
    .appendTo(div);
}

window.addEventListener('message', function(e) {
    let data = JSON.parse(e.data);
    if (data.mesajTipi === "codeyzerDoldur") {
        doldur(data.kullaniciAdi, data.sifre);
    } else if (data.mesajTipi === "codeyzerKapat") {
        $('.codeyzer-autocomplete').fadeOut(500);
        this.setTimeout(function() {
            $('.codeyzer-autocomplete').remove();
        }, 500);
    } else if (data.mesajTipi === "codeyzerAutocompleAc") {
        pluginSayfasiAc("/iframe/autocomplete/autocomplete.html");
    }
});

/**
 * 
 * @returns {JQuery}
 */
function sifreKutusuGetir() {
    return $('input[type="password"]');
}

/**
 * 
 * @param {JQuery} sifreKutusu 
 * @returns {JQuery}
 */
function kullaniciAdiKutusuGetir(sifreKutusu) {
    let kullaniciAdiKutusu;
    let temp = sifreKutusu;

    while (temp.length !== 0) {
        kullaniciAdiKutusu = temp.find('input[type="text"]:visible, input[type="email"]:visible');
        if (kullaniciAdiKutusu.length !== 0) {
            break;
        }

        temp = temp.parent();
    }

    if (!kullaniciAdiKutusu) {
        kullaniciAdiKutusu = $('input[type="email"]:visible');
    }

    return kullaniciAdiKutusu;
}