$(document).ready(function() {
  mesajYaz("Hoş geldiniz. Hemen hesabınız yoksa kayıt olabilir veya hesabınızla giriş yapabilirsiniz.");
  $('#yukleme').hide();
  sayfaDegistir("oturumAc");
});

var inits = {};
sayfaDegistir = (sayfa, ...args) => {
  $('#anaPanel').load(sayfa + ".html", () => (new inits[sayfa]).init(args));
};

depo = {
  sifre: null,
  kullaniciKimlik: null,
};

formDogrula = formSecici => {
  let gecerli = true;
  $(formSecici + ' input[dogrula]').each(function() {

      let input = $(this);
      input.parent().closest('div').removeAttr('uyari-mesaji');

      let dogrulaId = input.attr('dogrula');
      let dogrula = $('#' + dogrulaId);

      let inputGecerli = true;

      dogrula.children().each(function() {
          dogrulaSatiri = $(this);
          if (inputGecerli) {
            if (dogrulaSatiri.is('gerekli')) {
              if (!input.val()) {
                  gecerli = inputGecerli = false;
                  let mesaj = dogrulaSatiri.attr('mesaj');
                  input.parent().closest('div').attr('uyari-mesaji', mesaj);
              }
            } else if (dogrulaSatiri.is('regex')) {
              let regex = new RegExp(dogrulaSatiri.attr('ifade'));
              if (!regex.test(input.val())) {
                  gecerli = inputGecerli = false;
                  let mesaj = dogrulaSatiri.attr('mesaj');
                  input.parent().closest('div').attr('uyari-mesaji', mesaj);
              }
            }
          }
      });
  });

  if (!gecerli) {
      mesajYaz('Form geçerli değildir', 'hata');
  }

  return gecerli;
}

popupPost = (patika, istek) => {
	$('#yukleme').show();
	$('#anaPanel').addClass('engelli');
  mesajYaz("Lütfen bekleyiniz.", 'uyarı');
  return post(patika, istek)
    .then(data => {
      $('#yukleme').hide();
      $('#anaPanel').removeClass('engelli');
          if (data.basarili) {
              mesajYaz(data.mesaj, 'bilgi');
          } else {
              mesajYaz(data.mesaj, 'hata');
          }
          
          return data;
      })
    .catch((error) => {
      $('#yukleme').hide();
      $('#anaPanel').removeClass('engelli');
      mesajYaz('Sunucuda beklenmedik bir hata oluştu.', 'hata')
    });
};