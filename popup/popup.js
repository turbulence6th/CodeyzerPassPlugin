$(document).ready(function() {
  mesajYaz("Hoş geldiniz. Hemen hesabınız yoksa kayıt olabilir veya hesabınızla giriş yapabilirsiniz.");
  $('#yukleme').hide();
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

formDogrula = formSecici => {
  let gecerli = true;
  $(formSecici + ' input[dogrula]').each(function() {

      let input = $(this);
      input.parent().closest('div').removeAttr('uyari-mesaji');

      let dogrulaId = input.attr('dogrula');
      let dogrula = $('#' + dogrulaId);

      dogrula.children().each(function() {
          dogrulaSatiri = $(this);
          if (dogrulaSatiri.is('gerekli')) {
              if (!input.val()) {
                  gecerli = false;
                  let mesaj = dogrulaSatiri.attr('mesaj');
                  input.parent().closest('div').attr('uyari-mesaji', mesaj);
              }
          }
      });
  });

  if (!gecerli) {
      mesajYaz('Form geçerli değildir', 'hata');
  }

  return gecerli;
}