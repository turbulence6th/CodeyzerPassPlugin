import { mesajYaz, post, bilesenYukle } from '../core/util.js';
import OturumAc from '/popup/oturumAc/OturumAc.js';

$(function() {
  mesajYaz("Hoş geldiniz. Hemen hesabınız yoksa kayıt olabilir veya hesabınızla giriş yapabilirsiniz.");
  $('#yukleme').hide();
  bilesenYukle($('#anaPanel'), OturumAc);
});

/** @type {Depo} */ var depo = {
  kullaniciAdi: null,
  kullaniciKimlik: null,
};

/**
 * 
 * @param {Depo} pDepo 
 */
export function setDepo(pDepo) {
  depo = pDepo;
}

/**
 * 
 * @returns {Depo}
 */
export function getDepo() {
  return depo;
}

/**
 * @param {string} formSecici
 * @returns {boolean}
 */
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
              if (!regex.test(/** @type {string} */ (input.val()))) {
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
 * @param {PatikaEnum} patika 
 * @param {*} istek 
 * @returns {Promise<Cevap<T>>}
 */
export async function popupPost(patika, istek) {
	$('#yukleme').show();
	$('#anaPanel').addClass('engelli');
  mesajYaz("Lütfen bekleyiniz.", 'uyari');
  try {
    const data = await post(patika, istek);
    $('#yukleme').hide();
    $('#anaPanel').removeClass('engelli');
    if (data.basarili) {
      mesajYaz(data.mesaj, 'bilgi');
    } else {
      mesajYaz(data.mesaj, 'hata');
    }
    return data;
  } catch (e) {
    $('#yukleme').hide();
    $('#anaPanel').removeClass('engelli');
    mesajYaz('Sunucuda beklenmedik bir hata oluştu.', 'hata');
    throw 'Sunucuda beklenmedik bir hata oluştu';
  }
};