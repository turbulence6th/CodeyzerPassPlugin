chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(request);
    if (request.mesajTipi === "platform") {
        let pathname = window.location.pathname;
        if (pathname !== "/" && pathname.endsWith("/")) {
            pathname = pathname.substring(0, pathname.length - 1);
        }

        sendResponse({
            platform: window.location.hostname + pathname
        });
    } else if (request.mesajTipi === "doldur") {
        doldur(request.kullaniciAdi.deger, request.kullaniciAdi.secici, request.sifre.deger, request.sifre.secici);
    }
});

function doldur(kullaniciAdi, kullaniciAdiSecici, sifre, sifreSecici) {
    let sifreKutusu = sifreKutusuGetir(sifreSecici);
    let kullaniciAdiKutusu = kullaniciAdiKutusuGetir(kullaniciAdiSecici, sifreKutusu);

    kullaniciAdiKutusu.val(kullaniciAdi);
    sifreKutusu.val(sifre);
}

function sifreKutusuGetir(sifreSecici) {
    if (sifreSecici) {
        return $(sifreSecici);
    }

    return $('input[type="password"]');
}

function kullaniciAdiKutusuGetir(kullaniciAdiSecici, sifreKutusu) {
    if (kullaniciAdiSecici) {
        return $(kullaniciAdiSecici);
    }

    let kullaniciAdiKutusu;
    let temp = sifreKutusu;

    while (temp.length !== 0) {
        kullaniciAdiKutusu = temp.find('input[type="text"]:visible, input[type="email"]:visible');
        if (kullaniciAdiKutusu.length !== 0) {
            break;
        }

        temp = temp.parent();
    }

    return kullaniciAdiKutusu;
}