import { mesajYaz, post, bilesenYukle } from '/core/util.js';
import AnaEkran from '/popup/anaEkran/AnaEkran.js';
import AnaEkranSifreEkle from '/popup/anaEkran/AnaEkranSifreEkle.js';
import AnaEkranSifreler from '/popup/anaEkran/AnaEkranSifreler.js';
import OturumAc from '/popup/oturumAc/OturumAc.js';

$(function() {
  customElements.define('oturum-ac', OturumAc);
  customElements.define('ana-ekran', AnaEkran);
  customElements.define('ana-ekran-sifreler', AnaEkranSifreler);
  customElements.define('ana-ekran-sifre-ekle', AnaEkranSifreEkle);

  mesajYaz("Hoş geldiniz. Hemen hesabınız yoksa kayıt olabilir veya hesabınızla giriş yapabilirsiniz.");
  $('#yukleme').hide();
  bilesenYukle($('#anaPanel'), new OturumAc());
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