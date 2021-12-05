import { registerPlugin } from '@capacitor/core';

/**
 * @typedef CodeyzerAutofillPlugin
 * @property {(param: {hariciSifreListesi: HariciSifreDesifre[]}) => Promise<void>} sifreListesiEkle
 * @property {() => Promise<{paketList: PaketOption[]}>} androidPaketGetir
 */

export default /** @type {CodeyzerAutofillPlugin} */ (registerPlugin('CodeyzerAutofillPlugin'));
