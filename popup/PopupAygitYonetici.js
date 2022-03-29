import AygitYonetici from '/core/AygitYonetici.js';
import PopupOnayPanel from '/popup/PopupOnayPanel.js';
import PopupSifreYoneticiPanel from '/popup/PopupSifreYoneticiPanel.js';

export default class PopupAygitYonetici extends AygitYonetici {

     /**
     * 
     * @returns {Promise<string>}
     */
    mevcutDil() {
        return new Promise((resolve, _reject) => {
            // @ts-ignore
            resolve(chrome.i18n.getUILanguage());
        })
    }

    /**
     * 
     * @returns {Promise<'chrome'|'ios'|'android'|'web'>}
     */
    async platformTipi() {
        return 'chrome';
    }

    /**
     * 
     * @returns {Promise<Depo>}
     */
    depoGetir() {
        return new Promise((resolve, _reject) => {
            // @ts-ignore
            chrome.storage.local.get(['depo'], function(result) {
                resolve(result.depo);
            });
        });
    }

    /**
     * 
     * @param {Depo} depo
     * @returns {Promise<void>}
     */
    beniHatirla(depo) {
        return new Promise((resolve, _reject) => {
            // @ts-ignore
            chrome.storage.local.set({depo: depo}, function() {
                resolve();
            });
        });
    }

    /**
     * 
     * @param {boolean} arayuzKontrol
     * @returns {Promise<void>}
     */
    arayuzKontrolAyarla(arayuzKontrol) {
        return new Promise((resolve, _reject) => {
            // @ts-ignore
            chrome.storage.local.set({arayuzKontrol: arayuzKontrol}, function() {
                resolve();
            });
        });
    }

    /**
     * 
     * @returns {Promise<boolean>}
     */
    arayuzKontrolGetir() {
        return new Promise((resolve, _reject) => {
            // @ts-ignore
            chrome.storage.local.get(['arayuzKontrol'], function(result) {
                resolve(result.arayuzKontrol);
            });
        });
    }


    /**
     * 
     * @param {HariciSifreDTO[]} hariciSifreDTOListesi 
     * @returns {Promise<void>}
     */
    hariciSifreDTOListesiAyarla(hariciSifreDTOListesi) {
        return new Promise((resolve, _reject) => {
            // @ts-ignore
            chrome.storage.local.set({hariciSifreDTOListesi: hariciSifreDTOListesi}, function() {
                resolve();
            });
        });
    }

    /**
     * 
     * @returns {Promise<HariciSifreDTO[]>}
     */
    hariciSifreDTOListesiGetir() {
        return new Promise((resolve, _reject) => {
            // @ts-ignore
            chrome.storage.local.get(['hariciSifreDTOListesi'], function(result) {
                let hariciSifreDTOListesi = result.hariciSifreDTOListesi;
                if (hariciSifreDTOListesi === null || hariciSifreDTOListesi === undefined) {
                    resolve(null)
                } else {
                    resolve(hariciSifreDTOListesi);
                }
            });
        });
    } 

    /**
     * 
     * @param {string[]} hariciSifreListesi 
     * @returns {Promise<void>}
     */
    async mobilSifreListesiEkle(hariciSifreListesi) {
        
    }

    /**
     * 
     * @template T
     * @param {*} icerik 
     * @returns {Promise<T>}
     */
    sekmeMesajGonder(icerik) {
        return new Promise((resolve, reject) => {
            // @ts-ignore
            chrome.tabs.query({active: true, lastFocusedWindow: true}, function(tabs){
                // @ts-ignore
                chrome.tabs.sendMessage(tabs[0].id, icerik, (/** @type {T} */ cevap) => {
                    resolve(cevap);
                });
            });
        });
    }

    /**
     * 
     * @returns {Promise<{platform: string, kullaniciAdi: string, sifre: string}>}
     */
    sonLoginGetir() {
       return this.sekmeMesajGonder({mesajTipi: 'login'});
    }

    /**
     * 
     * @returns {Promise<{platform: string}>}
     */
    async platformGetir() {
        // @ts-ignore
        let [tab] = await chrome.tabs.query({active: true, currentWindow: true});
        return {
            platform: this.platformGetirHelper(tab.url)
        };
    }

    /**
     * 
     * @param url
     * @returns string
     */
    platformGetirHelper(url) {
        let obj = new URL(url);
        let pathname = obj.pathname;
        if (pathname !== "/" && pathname.endsWith("/")) {
            pathname = pathname.substring(0, pathname.length - 1);
        }
        return obj.hostname + pathname;
    }

    /**
     * 
     * @param {string} kullaniciAdi 
     * @param {string} sifre 
     * @returns {Promise<void>}
     */
    sifreDoldur(kullaniciAdi, sifre) {
        return this.sekmeMesajGonder({
            mesajTipi: 'doldur',
            kullaniciAdi: {
                deger: kullaniciAdi
            },
            sifre: {
                deger: sifre
            }
        })
    }

    /**
     * 
     * @param {string} ifade
     * @returns {Promise<void>}
     */
    async panoyaKopyala(ifade) {
        return await navigator.clipboard.writeText(ifade);
    }

    $toast = document.querySelector('#toast')

    /**
     * 
     * @param {string} ifade
     * @returns {Promise<void>}
     */
    async toastGoster(ifade) {
        this.$toast.classList.add('show');
        this.$toast.textContent = ifade;

        setTimeout(() => { 
            this.$toast.classList.remove('show');
        }, 3000);
    }

    /**
     * 
     * @param {string} baslik 
     * @param {string} mesaj
     * @returns {Promise<boolean>} 
     */
    onayDialog(baslik, mesaj) {
        return new PopupOnayPanel().onayDialog(baslik, mesaj);
    }

    /**
     * 
     * @returns {Promise<object>}
     */
    rehberGetir() {
        return new Promise((resolve, _reject) => {
            // @ts-ignore
            chrome.storage.local.get(['rehber'], function(result) {
                let rehber = result.rehber || {};
                resolve(rehber);
            });
        });
    }

    /**
     * 
     * @param {Object} rehber
     * @returns {Promise<void>}
     */
    rehberAyarla(rehber) {
        return new Promise((resolve, _reject) => {
            // @ts-ignore
            chrome.storage.local.set({rehber: rehber}, function() {
                resolve();
            });
        });
    }

    /**
     * 
     * @returns {Promise<{etkin: boolean, destek: boolean}>}
     */
    async otomatikDoldurBilgi() {
        return {
            etkin: true,
            destek: true
        }
    }

    /**
     * 
     * @returns {Promise<void>}
     */
    async otomatikDoldurEtkinlestir() {
       
    }
}

