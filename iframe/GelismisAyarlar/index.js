import CodeyzerCheckbox from '/core/bilesenler/CodeyzerCheckbox.js';
import CodeyzerDogrula from '/core/bilesenler/CodeyzerDogrula.js';
import CodeyzerGerekli from '/core/bilesenler/CodeyzerGerekli.js';
import CodeyzerImageButton from '/core/bilesenler/CodeyzerImageButton.js';
import CodeyzerRegex from '/core/bilesenler/CodeyzerRegex.js';
import {bilesenYukle, setAygitYonetici } from '/core/util.js';
import GelismisAyarlarAnaPanel from '/iframe/GelismisAyarlar/GelismisAyarlarAnaPanel.js';
import NavigasyonPanelSatir from '/iframe/GelismisAyarlar/NavigasyonPanelSatir.js';
import NavigasyonPanel from '/iframe/GelismisAyarlar/NavigasyonPanel.js';
import PopupAygitYonetici from '/popup/PopupAygitYonetici.js';
import PopupOnayPanel from '/popup/PopupOnayPanel.js';
import PopupSifreYoneticiPanel from '/popup/PopupSifreYoneticiPanel.js';
import KasaPanel from '/iframe/GelismisAyarlar/KasaPanel.js';
import SifreTablo from '/iframe/GelismisAyarlar/SifreTablo.js';
import SifreTabloSatir from '/iframe/GelismisAyarlar/SifreTabloSatir.js';

document.addEventListener("DOMContentLoaded", function() {
  setAygitYonetici(new PopupAygitYonetici())
  .then(() => {
    customElements.define('codeyzer-checkbox', CodeyzerCheckbox);
    customElements.define('codeyzer-image-button', CodeyzerImageButton);
    customElements.define('codeyzer-dogrula', CodeyzerDogrula);
    customElements.define('codeyzer-gerekli', CodeyzerGerekli);
    customElements.define('codeyzer-regex', CodeyzerRegex);

    customElements.define('popup-sifre-yonetici-panel', PopupSifreYoneticiPanel);
    customElements.define('popup-onay-panel', PopupOnayPanel);
    customElements.define('gelismis-ayarlar-ana-panel', GelismisAyarlarAnaPanel);
    customElements.define('navigasyon-panel', NavigasyonPanel);
    customElements.define('navigasyon-panel-satir', NavigasyonPanelSatir);
    customElements.define('kasa-panel', KasaPanel);
    customElements.define('sifre-tablo', SifreTablo);
    customElements.define('sifre-tablo-satir', SifreTabloSatir);

    (/** @type {HTMLDivElement} */ (document.querySelector('#yukleme'))).style.display = 'none';
    bilesenYukle(new GelismisAyarlarAnaPanel());
  });
});