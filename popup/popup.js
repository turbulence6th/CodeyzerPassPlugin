$(document).ready(function() {
  mesajYaz("Hoş geldiniz. Hemen hesabınız yoksa kayıt olabilir veya hesabınızla giriş yapabilirsiniz.");
  sayfaDegistir("oturumAc");
});

var inits = {}
sayfaDegistir = (sayfa) => {
  $('#anaPanel').load(sayfa + ".html", () => inits[sayfa]?.());
}

mesajYaz = mesaj => $('#mesaj').text(mesaj);

depo = {
  sifre: null,
  kullaniciKimlik: null,
}

mesajGonder = (icerik, geriCagirma) => {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
    chrome.tabs.sendMessage(tabs[0].id, icerik, geriCagirma);
  });
}