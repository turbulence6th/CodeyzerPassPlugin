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
        $(request.kullaniciAdi.secici).val(request.kullaniciAdi.deger);
        $(request.sifre.secici).val(request.sifre.deger);
    }
});
