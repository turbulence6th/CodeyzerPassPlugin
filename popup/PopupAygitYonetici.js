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

    popupSifreYoneticiPanel =  /** @type {PopupSifreYoneticiPanel} */ (document.querySelector('#sifre-yonetici-panel'));

    /**
     * 
     * @returns {Promise<string>}
     */
    sifreAl() {
        return this.popupSifreYoneticiPanel.sifreAl();
    }

    /**
     * 
     * @returns {'chrome'|'mobil'}
     */
    platformTipi() {
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
     * @returns {Promise<{platform: string, kullaniciAdi: string, sifre: string}>}
     */
    sonLoginGetir() {
        return new Promise((resolve, _reject) => {
            this.sekmeMesajGonder({mesajTipi: 'login'}, (login) => {
                resolve(login);
            });
        });
    }

    /**
     * 
     * @param {*} icerik 
     * @param {function} geriCagirma 
     */
    sekmeMesajGonder(icerik, geriCagirma = () => {}) {
        // @ts-ignore
        chrome.tabs.query({active: true, lastFocusedWindow: true}, function(tabs){
            // @ts-ignore
            chrome.tabs.sendMessage(tabs[0].id, icerik, geriCagirma);
        });
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
}

