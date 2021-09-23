import { pluginUrlGetir } from "/core/util.js";

(() => {

    let doldurAlanlar = [null, null];
    let sonLogin = null;

    // @ts-ignore
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.mesajTipi === "platform") {
            sendResponse({
                platform: platformGetir()
            });
        } else if (request.mesajTipi === "doldur") {
            doldur(request.kullaniciAdi.deger, request.sifre.deger);
            doldurAlanlar = [request.kullaniciAdi.deger, request.sifre.deger];
        } else if (request.mesajTipi === "login") {
            sendResponse(sonLogin);
            // @ts-ignore
            chrome.storage.local.set({login: null}, function() {

            });
        }
    });

    // @ts-ignore
    chrome.storage.local.get(['login'], function(result) {
        if (result.login) {
            beniAciGoster();
            sonLogin = result.login;
        }
    });

    $(window).on('beforeunload', () => {
        let kutular = kutuGetir();
        let kullaniciAdiKutusu = kutular[0];
        let sifreKutusu = kutular[1];

        let kullaniciAdi = kullaniciAdiKutusu.val();
        let sifre = sifreKutusu.val();

        if (kullaniciAdi && sifre && (kullaniciAdi !== doldurAlanlar[0] || sifre !== doldurAlanlar[1])) {
            // @ts-ignore
            chrome.storage.local.set({
                login: {
                    platform: platformGetir(),
                    kullaniciAdi: kullaniciAdiKutusu.val(),
                    sifre: sifreKutusu.val()
                }, function() {

                }
            })
        }
    })

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

        kutuDoldur(kullaniciAdiKutusu, kullaniciAdi);
        kutuDoldur(sifreKutusu, sifre);
    }

    /**
     * 
     * @param {JQuery} input 
     * @param {string} icerik 
     */
    function kutuDoldur(input, icerik) {
        var target = input[0];
        var event = document.createEvent("HTMLEvents");  
        input.val(icerik);
        event.initEvent("input", true, true);
        target.dispatchEvent(event);
    }

    function beniAciGoster() {
        let div = $('<div>')
            .appendTo($('body'));

        let iframe = $('<iframe>', {
            id: "codeyzer-iframe",
            src: pluginUrlGetir("/iframe/beniAc/beniAc.html"),
            frameborder: 0,
            scrolling: 'auto',
            allowTransparency: true
        })
        .addClass('codeyzer-iframe')
        .addClass('codeyzer-beniac')
        .appendTo(div);
    }

    window.addEventListener('message', function(e) {
        if (e.origin + "/" === pluginUrlGetir('')) {
            let data = JSON.parse(e.data);
            if (data.mesajTipi === "sifreEkleKapat") {
                $('#codeyzer-iframe').remove();
                // @ts-ignore
                chrome.storage.local.set({login: null}, function() {

                });
            } 
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

})();