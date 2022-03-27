import { registerPlugin } from '@capacitor/core';

/**
 * @typedef CodeyzerAutofillPlugin
 * @property {(param: {hariciSifreListesi: string[]}) => Promise<void>} sifreListesiEkle
 * @property {() => Promise<{paketList: PaketOption[]}>} androidPaketGetir
 */

export default /** @type {CodeyzerAutofillPlugin} */ (registerPlugin('CodeyzerAutofillPlugin'));
