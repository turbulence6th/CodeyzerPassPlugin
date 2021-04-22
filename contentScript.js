chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(request);
    if (request.mesajTipi === "platform") {
        sendResponse({
            platform: document.location.hostname + document.location.pathname
        });
    } else if (request.mesajTipi === "doldur") {
        $(request.kullaniciAdi.secici).val(request.kullaniciAdi.deger);
        $(request.sifre.secici).val(request.sifre.deger);
    }
});
