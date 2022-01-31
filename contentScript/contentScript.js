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

    window.addEventListener('beforeunload', () => {
        let kutular = kutuGetir();
        let kullaniciAdiKutusu = kutular[0];
        let sifreKutusu = kutular[1];

        let kullaniciAdi = kullaniciAdiKutusu?.value;
        let sifre = sifreKutusu?.value;

        if (kullaniciAdi && sifre && (kullaniciAdi !== doldurAlanlar[0] || sifre !== doldurAlanlar[1])) {
            // @ts-ignore
            chrome.storage.local.set({
                login: {
                    platform: platformGetir(),
                    kullaniciAdi: kullaniciAdi,
                    sifre: sifre
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
     * @returns {HTMLInputElement[]}
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
        if (kullaniciAdiKutusu) {
            kutuDoldur(kullaniciAdiKutusu, kullaniciAdi);
        }

        let sifreKutusu = kutular[1];
        if (sifreKutusu) {
            kutuDoldur(sifreKutusu, sifre);
        }
    }

    /**
     * 
     * @param {HTMLInputElement} input 
     * @param {string} icerik 
     */
    function kutuDoldur(input, icerik) {
        let event = new Event("input", {
            bubbles: true,
            cancelable: true
        })
        input.value = icerik;
        input.dispatchEvent(event);
    }

    function beniAciGoster() {

        let div = document.createElement('div');
        div.classList.add('codeyzer-beniac');

        let sifreEklePanel = /* html */`
            <style>
                :host {
                    all: initial;
                }
                .codeyzer-body {
                    color: #ff7f2a;
                    background-color: #080808;
                    font-family: Monospace;
                    font-size: 15px;
                }

                .panel {
                    border: 1px solid #ff7f2a;
                    border-radius: 4px;
                    background-color: #0f0f0f;
                    padding: 15px 15px 15px 15px;
                }
            </style>
            <link rel="stylesheet" href="${pluginUrlGetir('/node_modules/bootstrap/dist/css/bootstrap.css')}">
            <div class="codeyzer-body panel">
                <img id="codeyzer-kapat" style="float: right; cursor: pointer;" src="${pluginUrlGetir('/images/kapat_icon.png')}"/>
                <div class="row">
                    <div class="col-2">
                        <img src="${pluginUrlGetir('/images/icon_48.png')}"/>
                    </div>
                    <div class="col-10 justify-content-center align-self-center">
                        Yeni şifre bulundu.<br>
                        Eklemek için plugin ikonuna basınız.
                    </div>
                </div>
            </div>
        `;
        let shadow = div.attachShadow({mode: 'open'});
        shadow.innerHTML = sifreEklePanel;

        document.body.append(div);

        shadow.getElementById('codeyzer-kapat').addEventListener('click', () => {
            div.remove();
            // @ts-ignore
            chrome.storage.local.set({login: null}, function() {

            });
        });
    }

    /**
     * 
     * @returns {HTMLInputElement}
     */
    function sifreKutusuGetir() {
        return document.querySelector('input[type="password"]');
    }

    /**
     * 
     * @param {HTMLInputElement} sifreKutusu 
     * @returns {HTMLInputElement}
     */
    function kullaniciAdiKutusuGetir(sifreKutusu) {
        /** @type {HTMLInputElement} */ let kullaniciAdiKutusu;
        /** @type {HTMLElement} */ let temp = sifreKutusu;

        while (temp) {
            kullaniciAdiKutusu = /** @type {HTMLInputElement} */ (gorunurElementGetir(temp.querySelectorAll('input[type="text"], input[type="email"]')));
            if (kullaniciAdiKutusu) {
                break;
            }

            temp = temp.parentElement;
        }

        if (!kullaniciAdiKutusu) {
            kullaniciAdiKutusu = /** @type {HTMLInputElement} */ (gorunurElementGetir(document.querySelectorAll('input[type="email"]')));
        }

        return kullaniciAdiKutusu;
    }

    /**
     * 
     * @param {NodeListOf<HTMLElement>} elements 
     * @returns {Element}
     */
    function gorunurElementGetir(elements) {
        for (let element of elements) {
            if (element.offsetHeight !== 0 && element.offsetWidth !== 0) {
                return element;
            }
        }
    }

    /**
     * 
     * @param {string} url 
     * @returns {string}
     */
    function pluginUrlGetir(url) {
        // @ts-ignore
        return chrome.runtime.getURL(url);
    }

})();