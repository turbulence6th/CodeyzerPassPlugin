import Ekran from './Ekran.js';
import OturumAc from './oturumAc/OturumAc.js';

$(document).ready(function() {
  mesajYaz("Hoş geldiniz. Hemen hesabınız yoksa kayıt olabilir veya hesabınızla giriş yapabilirsiniz.");
  $('#yukleme').hide();
  bilesenYukle($('#anaPanel'), OturumAc);
});

/**
 * @param {JQuery} panel 
 * @param {*} bilesen 
 * @param {object} params 
 * @returns {Promise}
 */
export function bilesenYukle(panel, bilesen, params) {
  return new Promise((resolve, reject) => {
    panel.load(bilesen.html(), () => {
      let nesne = new bilesen();
      nesne.init(params);
      resolve(nesne);
    });
  });
}

var depo = {
  kullaniciAdi: null,
  sifre: null,
  kullaniciKimlik: null,
};

export function setDepo(pDepo) {
  depo = pDepo;
}

export function getDepo() {
  return depo;
}

export function formDogrula(formSecici) {
  let gecerli = true;
  $(formSecici + ' input[dogrula]').each(function() {

      let input = $(this);
      input.parent().closest('div').removeAttr('uyari-mesaji');

      let dogrulaId = input.attr('dogrula');
      let dogrula = $('#' + dogrulaId);

      let inputGecerli = true;

      dogrula.children().each(function() {
          let dogrulaSatiri = $(this);
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

/**
 * 
 * @template T
 * @param {string} patika 
 * @param {*} istek 
 * @returns {Promise<Cevap<T>>}
 */
export function popupPost(patika, istek) {
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

export function mesajGonder(mesaj) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(mesaj, response => resolve(response));
  });
}