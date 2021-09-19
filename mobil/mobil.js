import { bilesenYukle, mesajYaz, setAygitYonetici } from '/core/util.js';
import MobilAygitYonetici from '/mobil/MobilAygitYonetici.js';
import AnaEkran from '/popup/anaEkran/AnaEkran.js';
import AnaEkranAyarlar from '/popup/anaEkran/AnaEkranAyarlar.js';
import AnaEkranSifreEkle from '/popup/anaEkran/AnaEkranSifreEkle.js';
import AnaEkranSifreler from '/popup/anaEkran/AnaEkranSifreler.js';
import OturumAc from '/popup/oturumAc/OturumAc.js';
import PopupSifreYoneticiPanel from '/popup/PopupSifreYoneticiPanel.js';

$(function() {
    setAygitYonetici(new MobilAygitYonetici())
    .then(() => {
      customElements.define('oturum-ac', OturumAc);
      customElements.define('ana-ekran', AnaEkran);
      customElements.define('ana-ekran-sifreler', AnaEkranSifreler);
      customElements.define('ana-ekran-sifre-ekle', AnaEkranSifreEkle);
      customElements.define('ana-ekran-ayarlar', AnaEkranAyarlar);
      customElements.define('popup-sifre-yonetici-panel', PopupSifreYoneticiPanel);

      mesajYaz("Hoş geldiniz.");
      $('#yukleme').hide();

      bilesenYukle($('#anaPanel'), new OturumAc());
    });
  });