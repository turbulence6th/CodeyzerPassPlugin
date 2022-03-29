import { registerPlugin } from '@capacitor/core';

/**
 * @typedef CodeyzerAutofillPlugin
 * @property {(param: {hariciSifreListesi: string[]}) => Promise<void>} sifreListesiEkle
 * @property {() => Promise<{paketList: PaketOption[]}>} androidPaketGetir
 * @property {() => Promise<{etkin: boolean, destek: boolean}>} otomatikDoldurBilgi
 * @property {() => Promise<void>} otomatikDoldurEtkinlestir
 */

export default /** @type {CodeyzerAutofillPlugin} */ (registerPlugin('CodeyzerAutofillPlugin'));
