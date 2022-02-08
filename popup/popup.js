import CodeyzerCheckbox from '/core/bilesenler/CodeyzerCheckbox.js';
import CodeyzerDogrula from '/core/bilesenler/CodeyzerDogrula.js';
import CodeyzerGerekli from '/core/bilesenler/CodeyzerGerekli.js';
import CodeyzerImageButton from '/core/bilesenler/CodeyzerImageButton.js';
import CodeyzerRegex from '/core/bilesenler/CodeyzerRegex.js';
import {bilesenYukle, setAygitYonetici } from '/core/util.js';
import AnaEkran from '/popup/anaEkran/AnaEkran.js';
import AnaEkranAyarlar from '/popup/anaEkran/AnaEkranAyarlar.js';
import AnaEkranSifreEkle from '/popup/anaEkran/AnaEkranSifreEkle.js';
import AnaEkranSifreler from '/popup/anaEkran/AnaEkranSifreler.js';
import OturumAc from '/popup/oturumAc/OturumAc.js';
import PopupAygitYonetici from '/popup/PopupAygitYonetici.js';
import PopupOnayPanel from '/popup/PopupOnayPanel.js';
import PopupSifreYoneticiPanel from '/popup/PopupSifreYoneticiPanel.js';

document.addEventListener("DOMContentLoaded", function() {
  setAygitYonetici(new PopupAygitYonetici())
  .then(() => {
    customElements.define('codeyzer-checkbox', CodeyzerCheckbox);
    customElements.define('codeyzer-image-button', CodeyzerImageButton);
    customElements.define('codeyzer-dogrula', CodeyzerDogrula);
    customElements.define('codeyzer-gerekli', CodeyzerGerekli);
    customElements.define('codeyzer-regex', CodeyzerRegex);

    customElements.define('oturum-ac', OturumAc);
    customElements.define('ana-ekran', AnaEkran);
    customElements.define('ana-ekran-sifreler', AnaEkranSifreler);
    customElements.define('ana-ekran-sifre-ekle', AnaEkranSifreEkle);
    customElements.define('ana-ekran-ayarlar', AnaEkranAyarlar);
    customElements.define('popup-sifre-yonetici-panel', PopupSifreYoneticiPanel);
    customElements.define('popup-onay-panel', PopupOnayPanel);

    (/** @type {HTMLDivElement} */ (document.querySelector('#yukleme'))).style.display = 'none';
    bilesenYukle(new OturumAc());
  });
});