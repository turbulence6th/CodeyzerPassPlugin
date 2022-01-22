/**
 * @typedef HariciSifreDTO
 * @property {string} kimlik
 * @property {string} icerik
 */

/**
 * @typedef HariciSifreDesifre
 * @property {string} kimlik
 * @property {HariciSifreIcerik} icerik
 * @property {string} alanAdi
 */

/**
 * @typedef HariciSifreIcerik
 * @property {string} platform
 * @property {string} androidPaket
 * @property {string} kullaniciAdi
 * @property {string} sifre
 */

/**
 * @typedef HariciSifreGetirDTO
 * @property {string} kullaniciKimlik
 */

/**
 * @typedef HariciSifreGuncelleDTO
 * @property {string} kimlik
 * @property {string} icerik
 * @property {string} kullaniciKimlik
 */

/**
 * @typedef HariciSifreKaydetDTO
 * @property {string} kimlik
 * @property {string} icerik
 * @property {string} kullaniciKimlik
 */

/**
 * @typedef HariciSifreSilDTO
 * @property {string} kimlik
 * @property {string} kullaniciKimlik
 */

/**
 * @typedef HariciSifreYenileDTO
 * @property {HariciSifreYenileElemanDTO[]} hariciSifreListesi
 * @property {string} kullaniciKimlik
 * @property {string} yeniKullaniciKimlik
 */

/**
 * @typedef HariciSifreYenileElemanDTO
 * @property {string} icerik
 */