$(document).ready(function() {
  mesajYaz("Hoş geldiniz. Hemen hesabınız yoksa kayıt olabilir veya hesabınızla giriş yapabilirsiniz.");
  sayfaDegistir("oturumAc");
});

var inits = {};
sayfaDegistir = (sayfa) => {
  $('#anaPanel').load(sayfa + ".html", () => inits[sayfa]?.());
};

mesajYaz = (mesaj, tip = 'bilgi') => {
  if (tip === 'hata') {
    $('#mesaj').html("<a style='color: ##FF3333'>" + mesaj + "</a>");
  } else if (tip === 'uyari') {
    $('#mesaj').html("<a style='color: ##FFFF33'>" + mesaj + "</a>");
  } else {
    $('#mesaj').html("<a style='color: #33FF33'>" + mesaj + "</a>");
  }
};

depo = {
  sifre: null,
  kullaniciKimlik: null,
};

mesajGonder = (icerik, geriCagirma) => {
  chrome.tabs.query({active: true, lastFocusedWindow: true}, function(tabs){
    chrome.tabs.sendMessage(tabs[0].id, icerik, geriCagirma);
  });
};